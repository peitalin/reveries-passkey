mod error;
use error::KdfError;

use wasm_bindgen::prelude::*;
use aes_gcm::Aes256Gcm;
use aes_gcm::aead::{Aead, KeyInit};
use aes_gcm::aead::generic_array::GenericArray;
use hkdf::Hkdf;
use sha2::{Sha256, Digest};
use base64ct::{Base64UrlUnpadded, Encoding};
use ed25519_dalek::{SigningKey};
use getrandom::getrandom;
use bs58;
// Add CBOR parsing for WebAuthn attestationObject
use ciborium::Value as CborValue;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console, js_name = warn)]
    fn warn(s: &str);
    #[wasm_bindgen(js_namespace = console, js_name = error)]
    fn error(s: &str);
}

#[cfg(target_arch = "wasm32")]
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[cfg(not(target_arch = "wasm32"))]
macro_rules! console_log {
    ($($t:tt)*) => (eprintln!("[LOG] {}", format_args!($($t)*)))
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// Helper function for base64url decoding
fn base64_url_decode(input: &str) -> Result<Vec<u8>, KdfError> {
    Base64UrlUnpadded::decode_vec(input)
        .map_err(|e| KdfError::Base64DecodeError(format!("{:?}", e)))
}

#[wasm_bindgen]
pub fn encrypt_data_aes_gcm(plain_text_data_str: &str, key_bytes: &[u8]) -> Result<String, JsValue> {
    if key_bytes.len() != 32 {
        return Err(JsValue::from_str("Encryption key must be 32 bytes for AES-256-GCM."));
    }
    let key_ga = GenericArray::from_slice(key_bytes);
    let cipher = Aes256Gcm::new(key_ga);

    let mut iv_bytes = [0u8; 12];
    getrandom::getrandom(&mut iv_bytes).map_err(|e| JsValue::from_str(&format!("Failed to generate IV: {}", e)))?;
    let nonce = GenericArray::from_slice(&iv_bytes);

    let ciphertext = cipher.encrypt(nonce, plain_text_data_str.as_bytes())
        .map_err(|e| JsValue::from_str(&format!("Encryption error: {}", e)))?;

    let result = format!(
        r#"{{"encrypted_data_b64u": "{}", "iv_b64u": "{}"}}"#,
        Base64UrlUnpadded::encode_string(&ciphertext),
        Base64UrlUnpadded::encode_string(&iv_bytes)
    );
    Ok(result)
}

#[wasm_bindgen]
pub fn decrypt_data_aes_gcm(encrypted_data_b64u: &str, iv_b64u: &str, key_bytes: &[u8]) -> Result<String, JsValue> {
    if key_bytes.len() != 32 {
        return Err(JsValue::from_str("Decryption key must be 32 bytes for AES-256-GCM."));
    }
    let key_ga = GenericArray::from_slice(key_bytes);
    let cipher = Aes256Gcm::new(key_ga);

    let iv_bytes = Base64UrlUnpadded::decode_vec(iv_b64u)
        .map_err(|e| JsValue::from_str(&format!("Base64UrlUnpadded decode error for IV: {}", e)))?;
    if iv_bytes.len() != 12 {
        return Err(JsValue::from_str("Decryption IV must be 12 bytes."));
    }
    let nonce = GenericArray::from_slice(&iv_bytes);

    let encrypted_data = Base64UrlUnpadded::decode_vec(encrypted_data_b64u)
        .map_err(|e| JsValue::from_str(&format!("Base64UrlUnpadded decode error for encrypted data: {}", e)))?;

    let decrypted_bytes = cipher.decrypt(nonce, encrypted_data.as_slice())
        .map_err(|e| JsValue::from_str(&format!("Decryption error: {}", e)))?;

    String::from_utf8(decrypted_bytes).map_err(|e| JsValue::from_str(&format!("UTF-8 decoding error: {}", e)))
}

// Generate a new NEAR key pair
#[wasm_bindgen]
pub fn generate_near_keypair() -> Result<String, JsValue> {
    console_log!("RUST: Generating new NEAR key pair");

    // Generate random bytes for the private key
    let mut private_key_bytes = [0u8; 32];
    getrandom(&mut private_key_bytes)
        .map_err(|e| JsValue::from_str(&format!("Failed to generate random bytes: {}", e)))?;

    // Create signing key from random bytes
    let signing_key = SigningKey::from_bytes(&private_key_bytes);

    // Encode private key in NEAR format: "ed25519:BASE58_PRIVATE_KEY"
    let private_key_b58 = bs58::encode(&private_key_bytes).into_string();
    let private_key_near_format = format!("ed25519:{}", private_key_b58);

    // Encode public key in NEAR format: "ed25519:BASE58_PUBLIC_KEY"
    let verifying_key = signing_key.verifying_key();
    let public_key_bytes = verifying_key.to_bytes();
    let public_key_b58 = bs58::encode(&public_key_bytes).into_string();
    let public_key_near_format = format!("ed25519:{}", public_key_b58);

    // Return as JSON
    let result = format!(
        r#"{{"privateKey": "{}", "publicKey": "{}"}}"#,
        private_key_near_format,
        public_key_near_format
    );

    console_log!("RUST: Generated NEAR key pair with public key: {}", public_key_near_format);
    Ok(result)
}

// Function for deriving encryption key from PRF output
pub fn derive_encryption_key_from_prf_core(
    prf_output_base64: &str,  // Base64-encoded PRF output from WebAuthn
    info: &str,               // Fixed info string (e.g., "near-key-encryption")
    hkdf_salt: &str,          // Fixed salt (can be empty string)
) -> Result<Vec<u8>, KdfError> {
    console_log!("RUST: Deriving encryption key from PRF output");

    // Decode PRF output from base64
    let prf_output = base64_url_decode(prf_output_base64)?;

    // Use PRF output directly as IKM
    let ikm = prf_output;

    // Convert info and salt to bytes
    let info_bytes = info.as_bytes();
    let salt_bytes = hkdf_salt.as_bytes();

    // Perform HKDF
    let hk = Hkdf::<Sha256>::new(Some(salt_bytes), &ikm);
    let mut okm = vec![0u8; 32]; // 32 bytes for AES-256
    hk.expand(info_bytes, &mut okm)
        .map_err(|_| KdfError::HkdfError)?;

    console_log!("RUST: Successfully derived 32-byte encryption key from PRF");
    Ok(okm)
}

// WASM binding
#[wasm_bindgen]
pub fn derive_encryption_key_from_prf(
    prf_output_base64: &str,
    info: &str,
    hkdf_salt: &str,
) -> Result<Vec<u8>, JsValue> {
    derive_encryption_key_from_prf_core(prf_output_base64, info, hkdf_salt)
        .map_err(|e| JsValue::from(e))
}

// Combined function for generating and encrypting with PRF
#[wasm_bindgen]
pub fn generate_and_encrypt_near_keypair_with_prf(
    prf_output_base64: &str,
) -> Result<String, JsValue> {
    console_log!("RUST: Generating and encrypting NEAR key pair with PRF-derived key");

    // Fixed parameters for consistency
    const INFO: &str = "near-key-encryption";
    const HKDF_SALT: &str = "";

    // Generate the key pair
    let keypair_json = generate_near_keypair()?;
    let keypair_data: serde_json::Value = serde_json::from_str(&keypair_json)
        .map_err(|e| JsValue::from_str(&format!("Failed to parse keypair: {}", e)))?;

    let private_key = keypair_data["privateKey"].as_str()
        .ok_or_else(|| JsValue::from_str("Failed to extract private key"))?;
    let public_key = keypair_data["publicKey"].as_str()
        .ok_or_else(|| JsValue::from_str("Failed to extract public key"))?;

    // Derive encryption key from PRF output
    let encryption_key = derive_encryption_key_from_prf_core(prf_output_base64, INFO, HKDF_SALT)
        .map_err(|e| JsValue::from(e))?;

    // Encrypt the private key
    let encrypted_result = encrypt_data_aes_gcm(private_key, &encryption_key)?;

    // Return combined result
    let result = format!(
        r#"{{"publicKey": "{}", "encryptedPrivateKey": {}}}"#,
        public_key,
        encrypted_result
    );

    console_log!("RUST: Successfully generated and encrypted NEAR key pair with PRF");
    Ok(result)
}

// Derive NEAR Ed25519 key from WebAuthn COSE P-256 public key
#[wasm_bindgen]
pub fn derive_near_keypair_from_cose_p256(
    x_coordinate_bytes: &[u8],
    y_coordinate_bytes: &[u8],
) -> Result<String, JsValue> {
    console_log!("RUST: Deriving NEAR key pair from P-256 COSE coordinates (matching contract)");

    if x_coordinate_bytes.len() != 32 || y_coordinate_bytes.len() != 32 {
        return Err(JsValue::from_str("P-256 coordinates must be 32 bytes each"));
    }

    // Concatenate x and y coordinates (same as contract)
    let mut p256_material = Vec::new();
    p256_material.extend_from_slice(x_coordinate_bytes);
    p256_material.extend_from_slice(y_coordinate_bytes);

    // SHA-256 hash (same as contract)
    let mut hasher = Sha256::new();
    hasher.update(&p256_material);
    let hash_bytes = hasher.finalize();

    // Use hash as Ed25519 seed (same as contract)
    let signing_key = SigningKey::from_bytes(&hash_bytes.into());

    // Encode in NEAR format
    let private_key_b58 = bs58::encode(&hash_bytes).into_string();
    let private_key_near_format = format!("ed25519:{}", private_key_b58);

    let verifying_key = signing_key.verifying_key();
    let public_key_bytes = verifying_key.to_bytes();
    let public_key_b58 = bs58::encode(&public_key_bytes).into_string();
    let public_key_near_format = format!("ed25519:{}", public_key_b58);

    let result = format!(
        r#"{{"privateKey": "{}", "publicKey": "{}"}}"#,
        private_key_near_format,
        public_key_near_format
    );

    console_log!("RUST: Derived deterministic NEAR key with public key: {}", public_key_near_format);
    Ok(result)
}

// COSE parsing functions for WebAuthn attestationObject
fn parse_attestation_object(attestation_object_bytes: &[u8]) -> Result<Vec<u8>, String> {
    let cbor_value: CborValue = ciborium::from_reader(attestation_object_bytes)
        .map_err(|e| format!("Failed to parse CBOR: {}", e))?;

    if let CborValue::Map(map) = cbor_value {
        // Extract authData (required)
        for (key, value) in map.iter() {
            if let CborValue::Text(key_str) = key {
                if key_str == "authData" {
                    if let CborValue::Bytes(auth_data_bytes) = value {
                        return Ok(auth_data_bytes.clone());
                    }
                }
            }
        }
        Err("authData not found in attestation object".to_string())
    } else {
        Err("Attestation object is not a CBOR map".to_string())
    }
}

fn parse_authenticator_data(auth_data_bytes: &[u8]) -> Result<Vec<u8>, String> {
    if auth_data_bytes.len() < 37 {
        return Err("Authenticator data too short".to_string());
    }

    let flags = auth_data_bytes[32];

    // Check if attested credential data is present (AT flag = bit 6)
    if (flags & 0x40) == 0 {
        return Err("No attested credential data present".to_string());
    }

    let mut offset = 37; // Skip rpIdHash(32) + flags(1) + counter(4)

    // Skip AAGUID (16 bytes)
    if auth_data_bytes.len() < offset + 16 {
        return Err("Authenticator data too short for AAGUID".to_string());
    }
    offset += 16;

    // Get credential ID length (2 bytes, big-endian)
    if auth_data_bytes.len() < offset + 2 {
        return Err("Authenticator data too short for credential ID length".to_string());
    }
    let cred_id_length = u16::from_be_bytes([
        auth_data_bytes[offset],
        auth_data_bytes[offset + 1]
    ]) as usize;
    offset += 2;

    // Skip credential ID
    if auth_data_bytes.len() < offset + cred_id_length {
        return Err("Authenticator data too short for credential ID".to_string());
    }
    offset += cred_id_length;

    // The rest is the credential public key (COSE format)
    let credential_public_key = auth_data_bytes[offset..].to_vec();
    Ok(credential_public_key)
}

fn extract_p256_coordinates_from_cose(cose_key_bytes: &[u8]) -> Result<(Vec<u8>, Vec<u8>), String> {
    let cbor_value: CborValue = ciborium::from_reader(cose_key_bytes)
        .map_err(|e| format!("Failed to parse COSE key CBOR: {}", e))?;

    if let CborValue::Map(map) = cbor_value {
        let mut kty: Option<i128> = None;
        let mut alg: Option<i128> = None;
        let mut crv: Option<i128> = None;
        let mut x_coord = None;
        let mut y_coord = None;

        // Parse COSE key parameters
        for (key, value) in map.iter() {
            if let CborValue::Integer(key_int) = key {
                let key_val: i128 = (*key_int).into(); // Convert Integer to i128
                match key_val {
                    1 => { // kty (Key Type)
                        if let CborValue::Integer(val) = value {
                            kty = Some((*val).into());
                        }
                    }
                    3 => { // alg (Algorithm)
                        if let CborValue::Integer(val) = value {
                            alg = Some((*val).into());
                        }
                    }
                    -1 => { // crv (Curve) for EC2
                        if let CborValue::Integer(val) = value {
                            crv = Some((*val).into());
                        }
                    }
                    -2 => { // x coordinate for EC2
                        if let CborValue::Bytes(bytes) = value {
                            x_coord = Some(bytes.clone());
                        }
                    }
                    -3 => { // y coordinate for EC2
                        if let CborValue::Bytes(bytes) = value {
                            y_coord = Some(bytes.clone());
                        }
                    }
                    _ => {}
                }
            }
        }

        // Validate this is a P-256 key
        if kty != Some(2) {
            return Err(format!("Unsupported key type: {:?} (expected 2 for EC2)", kty));
        }
        if alg != Some(-7) {
            return Err(format!("Unsupported algorithm: {:?} (expected -7 for ES256)", alg));
        }
        if crv != Some(1) {
            return Err(format!("Unsupported curve: {:?} (expected 1 for P-256)", crv));
        }

        match (x_coord, y_coord) {
            (Some(x), Some(y)) => {
                if x.len() != 32 || y.len() != 32 {
                    return Err(format!("Invalid coordinate length: x={}, y={} (expected 32 each)", x.len(), y.len()));
                }
                Ok((x, y))
            }
            _ => Err("Missing x or y coordinate in COSE key".to_string())
        }
    } else {
        Err("COSE key is not a CBOR map".to_string())
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_prf_kdf() {
        // Test PRF-based key derivation
        let prf_output_b64 = "dGVzdC1wcmYtb3V0cHV0LWZyb20td2ViYXV0aG4"; // "test-prf-output-from-webauthn"
        let key = derive_encryption_key_from_prf_core(prf_output_b64, "near-key-encryption", "").unwrap();
        assert_eq!(key.len(), 32);

        // Should be deterministic
        let key2 = derive_encryption_key_from_prf_core(prf_output_b64, "near-key-encryption", "").unwrap();
        assert_eq!(key, key2);
    }

    #[test]
    fn test_encryption_decryption_roundtrip() {
        let key = vec![0u8; 32]; // Test key
        let plaintext = "Hello, WebAuthn PRF!";

        let encrypted = encrypt_data_aes_gcm(plaintext, &key).unwrap();

        // Parse the JSON result
        let encrypted_obj: serde_json::Value = serde_json::from_str(&encrypted).unwrap();
        let encrypted_data = encrypted_obj["encrypted_data_b64u"].as_str().unwrap();
        let iv = encrypted_obj["iv_b64u"].as_str().unwrap();

        let decrypted = decrypt_data_aes_gcm(encrypted_data, iv, &key).unwrap();
        assert_eq!(decrypted, plaintext);
    }

    #[test]
    fn test_deterministic_near_key_derivation() {
        // Test P-256 coordinates (example values)
        let x_coord = vec![
            0x22, 0xc6, 0xb5, 0xbe, 0x9a, 0xa8, 0x08, 0x35,
            0x8c, 0xa9, 0x33, 0x52, 0xf9, 0x5a, 0x55, 0x09,
            0x25, 0xf3, 0xaf, 0xc2, 0xf9, 0xa6, 0x03, 0x65,
            0x85, 0xb1, 0x18, 0x73, 0x1c, 0x23, 0x0b, 0x75,
        ];
        let y_coord = vec![
            0x33, 0x1b, 0x60, 0x66, 0xae, 0xa9, 0x34, 0x5d,
            0x7a, 0x30, 0x31, 0x5e, 0x26, 0x6e, 0x53, 0x63,
            0x69, 0xbc, 0x8d, 0xa7, 0xe1, 0x80, 0x78, 0x1a,
            0xe8, 0x9f, 0x71, 0x74, 0xfb, 0x0d, 0xde, 0xc0,
        ];

        let result = derive_near_keypair_from_cose_p256(&x_coord, &y_coord).unwrap();

        // Parse the result
        let keypair: serde_json::Value = serde_json::from_str(&result).unwrap();
        let public_key = keypair["publicKey"].as_str().unwrap();
        let private_key = keypair["privateKey"].as_str().unwrap();

        // Should be deterministic
        let result2 = derive_near_keypair_from_cose_p256(&x_coord, &y_coord).unwrap();
        assert_eq!(result, result2);

        println!("Generated keypair from P-256 coordinates:");
        println!("X: {}", Base64UrlUnpadded::encode_string(&x_coord));
        println!("Y: {}", Base64UrlUnpadded::encode_string(&y_coord));

        // Keys should start with ed25519:
        assert!(public_key.starts_with("ed25519:"));
        assert!(private_key.starts_with("ed25519:"));

        // Should match the expected key from server logs
        // Contract derived: ed25519:Dax81obDiyu9eDMfP9vtSCdpX3skSRjopKYUKPGeucmV
        assert_eq!(public_key, "ed25519:Dax81obDiyu9eDMfP9vtSCdpX3skSRjopKYUKPGeucmV");

        println!("Deterministic public key: {}", public_key);
        println!("Deterministic private key: {}", private_key);
    }

    #[test]
    fn test_p256_coordinate_extraction() {
        // Test with known good P-256 coordinates
        let x_coord = vec![1u8; 32];
        let y_coord = vec![2u8; 32];

        let keypair1 = derive_near_keypair_from_cose_p256(&x_coord, &y_coord).unwrap();
        let keypair2 = derive_near_keypair_from_cose_p256(&x_coord, &y_coord).unwrap();

        // Should be identical (deterministic)
        assert_eq!(keypair1, keypair2);
    }
}
