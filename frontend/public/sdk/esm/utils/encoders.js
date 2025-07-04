/**
 * Utility method for base64url encoding
 */
/**
 * Utility function for base64url decoding
 */
function base64UrlDecode(base64Url) {
    const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') + padding;
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
const bufferEncode = (value) => {
    return btoa(String.fromCharCode(...new Uint8Array(value)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
};
// The bufferDecode utility function is specifically designed to handle base64url decoding in browser environments
// It returns an ArrayBuffer which we convert to Uint8Array for WebAuthn API compatibility
// This is equivalent to Buffer.from(..., 'base64url') in Node.js
const bufferDecode = (value) => {
    // 1. Sanitize the input string to remove any characters not part of Base64URL alphabet
    // This will keep A-Z, a-z, 0-9, -, _ and discard anything else.
    const sanitizedValue = value.replace(/[^A-Za-z0-9\-_]/g, '');
    // 2. Convert Base64URL to Base64
    let base64 = sanitizedValue.replace(/-/g, "+").replace(/_/g, "/");
    // 3. Add padding
    while (base64.length % 4) {
        base64 += "=";
    }
    // 4. Decode
    try {
        const decodedString = atob(base64);
        const buffer = new Uint8Array(decodedString.length);
        for (let i = 0; i < decodedString.length; i++) {
            buffer[i] = decodedString.charCodeAt(i);
        }
        return buffer.buffer;
    }
    catch (e) {
        // Enhanced logging
        console.error("bufferDecode: atob decoding failed.", {
            originalValue: value,
            sanitizedValue: sanitizedValue,
            stringPassedToAtob: base64,
            error: e
        });
        throw e; // Re-throw the error after logging
    }
};

export { base64UrlDecode, bufferDecode, bufferEncode };
//# sourceMappingURL=encoders.js.map
