function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); }
let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b);
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function init_panic_hook() {
    wasm.init_panic_hook();
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * @param {string} attestation_object_b64u
 * @param {string} prf_output_base64
 * @returns {string}
 */
function derive_near_keypair_from_cose_and_encrypt_with_prf$1(attestation_object_b64u, prf_output_base64) {
    let deferred4_0;
    let deferred4_1;
    try {
        const ptr0 = passStringToWasm0(attestation_object_b64u, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(prf_output_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.derive_near_keypair_from_cose_and_encrypt_with_prf(ptr0, len0, ptr1, len1);
        var ptr3 = ret[0];
        var len3 = ret[1];
        if (ret[3]) {
            ptr3 = 0; len3 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred4_0 = ptr3;
        deferred4_1 = len3;
        return getStringFromWasm0(ptr3, len3);
    } finally {
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

/**
 * @param {string} prf_output_base64
 * @param {string} encrypted_private_key_data
 * @param {string} encrypted_private_key_iv
 * @returns {string}
 */
function decrypt_private_key_with_prf_as_string$1(prf_output_base64, encrypted_private_key_data, encrypted_private_key_iv) {
    let deferred5_0;
    let deferred5_1;
    try {
        const ptr0 = passStringToWasm0(prf_output_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(encrypted_private_key_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(encrypted_private_key_iv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.decrypt_private_key_with_prf_as_string(ptr0, len0, ptr1, len1, ptr2, len2);
        var ptr4 = ret[0];
        var len4 = ret[1];
        if (ret[3]) {
            ptr4 = 0; len4 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred5_0 = ptr4;
        deferred5_1 = len4;
        return getStringFromWasm0(ptr4, len4);
    } finally {
        wasm.__wbindgen_free(deferred5_0, deferred5_1, 1);
    }
}

/**
 * @param {string} attestation_object_b64u
 * @returns {Uint8Array}
 */
function extract_cose_public_key_from_attestation$1(attestation_object_b64u) {
    const ptr0 = passStringToWasm0(attestation_object_b64u, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.extract_cose_public_key_from_attestation(ptr0, len0);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v2;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @param {Uint8Array} cose_key_bytes
 * @returns {string}
 */
function validate_cose_key_format$1(cose_key_bytes) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passArray8ToWasm0(cose_key_bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.validate_cose_key_format(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

/**
 * @param {string} prf_output_base64
 * @param {string} encrypted_private_key_data
 * @param {string} encrypted_private_key_iv
 * @param {string} signer_account_id
 * @param {string} receiver_account_id
 * @param {bigint} nonce
 * @param {Uint8Array} block_hash_bytes
 * @param {string} actions_json
 * @param {string} contract_id
 * @param {string} vrf_challenge_data_json
 * @param {string} webauthn_credential_json
 * @param {string} near_rpc_url
 * @returns {Promise<Uint8Array>}
 */
function verify_and_sign_near_transaction_with_actions$1(prf_output_base64, encrypted_private_key_data, encrypted_private_key_iv, signer_account_id, receiver_account_id, nonce, block_hash_bytes, actions_json, contract_id, vrf_challenge_data_json, webauthn_credential_json, near_rpc_url) {
    const ptr0 = passStringToWasm0(prf_output_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(encrypted_private_key_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(encrypted_private_key_iv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(signer_account_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len3 = WASM_VECTOR_LEN;
    const ptr4 = passStringToWasm0(receiver_account_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len4 = WASM_VECTOR_LEN;
    const ptr5 = passArray8ToWasm0(block_hash_bytes, wasm.__wbindgen_malloc);
    const len5 = WASM_VECTOR_LEN;
    const ptr6 = passStringToWasm0(actions_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len6 = WASM_VECTOR_LEN;
    const ptr7 = passStringToWasm0(contract_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len7 = WASM_VECTOR_LEN;
    const ptr8 = passStringToWasm0(vrf_challenge_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len8 = WASM_VECTOR_LEN;
    const ptr9 = passStringToWasm0(webauthn_credential_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len9 = WASM_VECTOR_LEN;
    const ptr10 = passStringToWasm0(near_rpc_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len10 = WASM_VECTOR_LEN;
    const ret = wasm.verify_and_sign_near_transaction_with_actions(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, nonce, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10);
    return ret;
}

/**
 * @param {string} prf_output_base64
 * @param {string} encrypted_private_key_data
 * @param {string} encrypted_private_key_iv
 * @param {string} signer_account_id
 * @param {string} receiver_account_id
 * @param {string} deposit_amount
 * @param {bigint} nonce
 * @param {Uint8Array} block_hash_bytes
 * @param {string} contract_id
 * @param {string} vrf_challenge_data_json
 * @param {string} webauthn_credential_json
 * @param {string} near_rpc_url
 * @returns {Promise<Uint8Array>}
 */
function verify_and_sign_near_transfer_transaction$1(prf_output_base64, encrypted_private_key_data, encrypted_private_key_iv, signer_account_id, receiver_account_id, deposit_amount, nonce, block_hash_bytes, contract_id, vrf_challenge_data_json, webauthn_credential_json, near_rpc_url) {
    const ptr0 = passStringToWasm0(prf_output_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(encrypted_private_key_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(encrypted_private_key_iv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(signer_account_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len3 = WASM_VECTOR_LEN;
    const ptr4 = passStringToWasm0(receiver_account_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len4 = WASM_VECTOR_LEN;
    const ptr5 = passStringToWasm0(deposit_amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len5 = WASM_VECTOR_LEN;
    const ptr6 = passArray8ToWasm0(block_hash_bytes, wasm.__wbindgen_malloc);
    const len6 = WASM_VECTOR_LEN;
    const ptr7 = passStringToWasm0(contract_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len7 = WASM_VECTOR_LEN;
    const ptr8 = passStringToWasm0(vrf_challenge_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len8 = WASM_VECTOR_LEN;
    const ptr9 = passStringToWasm0(webauthn_credential_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len9 = WASM_VECTOR_LEN;
    const ptr10 = passStringToWasm0(near_rpc_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len10 = WASM_VECTOR_LEN;
    const ret = wasm.verify_and_sign_near_transfer_transaction(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, nonce, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10);
    return ret;
}

/**
 * Check if user can register (VIEW FUNCTION - uses query RPC)
 * @param {string} contract_id
 * @param {string} vrf_challenge_data_json
 * @param {string} webauthn_registration_json
 * @param {string} near_rpc_url
 * @returns {Promise<string>}
 */
function check_can_register_user$1(contract_id, vrf_challenge_data_json, webauthn_registration_json, near_rpc_url) {
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(vrf_challenge_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(webauthn_registration_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(near_rpc_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len3 = WASM_VECTOR_LEN;
    const ret = wasm.check_can_register_user(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
    return ret;
}

/**
 * Actually register user (STATE-CHANGING FUNCTION - uses send_tx RPC)
 * @param {string} contract_id
 * @param {string} vrf_challenge_data_json
 * @param {string} webauthn_registration_json
 * @param {string} signer_account_id
 * @param {string} encrypted_private_key_data
 * @param {string} encrypted_private_key_iv
 * @param {string} prf_output_base64
 * @param {bigint} nonce
 * @param {Uint8Array} block_hash_bytes
 * @returns {Promise<string>}
 */
function sign_verify_and_register_user$1(contract_id, vrf_challenge_data_json, webauthn_registration_json, signer_account_id, encrypted_private_key_data, encrypted_private_key_iv, prf_output_base64, nonce, block_hash_bytes) {
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(vrf_challenge_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(webauthn_registration_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(signer_account_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len3 = WASM_VECTOR_LEN;
    const ptr4 = passStringToWasm0(encrypted_private_key_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len4 = WASM_VECTOR_LEN;
    const ptr5 = passStringToWasm0(encrypted_private_key_iv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len5 = WASM_VECTOR_LEN;
    const ptr6 = passStringToWasm0(prf_output_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len6 = WASM_VECTOR_LEN;
    const ptr7 = passArray8ToWasm0(block_hash_bytes, wasm.__wbindgen_malloc);
    const len7 = WASM_VECTOR_LEN;
    const ret = wasm.sign_verify_and_register_user(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, nonce, ptr7, len7);
    return ret;
}

/**
 * Special function for rolling back failed registration by deleting the account
 * This is the ONLY way to use DeleteAccount - it's context-restricted to registration rollback
 * @param {string} prf_output_base64
 * @param {string} encrypted_private_key_data
 * @param {string} encrypted_private_key_iv
 * @param {string} signer_account_id
 * @param {string} beneficiary_account_id
 * @param {bigint} nonce
 * @param {Uint8Array} block_hash_bytes
 * @param {string} contract_id
 * @param {string} vrf_challenge_data_json
 * @param {string} webauthn_credential_json
 * @param {string} near_rpc_url
 * @param {string} caller_function
 * @returns {Promise<Uint8Array>}
 */
function rollback_failed_registration_with_prf$1(prf_output_base64, encrypted_private_key_data, encrypted_private_key_iv, signer_account_id, beneficiary_account_id, nonce, block_hash_bytes, contract_id, vrf_challenge_data_json, webauthn_credential_json, near_rpc_url, caller_function) {
    const ptr0 = passStringToWasm0(prf_output_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(encrypted_private_key_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(encrypted_private_key_iv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(signer_account_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len3 = WASM_VECTOR_LEN;
    const ptr4 = passStringToWasm0(beneficiary_account_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len4 = WASM_VECTOR_LEN;
    const ptr5 = passArray8ToWasm0(block_hash_bytes, wasm.__wbindgen_malloc);
    const len5 = WASM_VECTOR_LEN;
    const ptr6 = passStringToWasm0(contract_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len6 = WASM_VECTOR_LEN;
    const ptr7 = passStringToWasm0(vrf_challenge_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len7 = WASM_VECTOR_LEN;
    const ptr8 = passStringToWasm0(webauthn_credential_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len8 = WASM_VECTOR_LEN;
    const ptr9 = passStringToWasm0(near_rpc_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len9 = WASM_VECTOR_LEN;
    const ptr10 = passStringToWasm0(caller_function, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len10 = WASM_VECTOR_LEN;
    const ret = wasm.rollback_failed_registration_with_prf(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, nonce, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10);
    return ret;
}

/**
 * Convenience function for adding keys with PRF authentication
 * @param {string} prf_output_base64
 * @param {string} encrypted_private_key_data
 * @param {string} encrypted_private_key_iv
 * @param {string} signer_account_id
 * @param {string} new_public_key
 * @param {string} access_key_json
 * @param {bigint} nonce
 * @param {Uint8Array} block_hash_bytes
 * @param {string} contract_id
 * @param {string} vrf_challenge_data_json
 * @param {string} webauthn_credential_json
 * @param {string} near_rpc_url
 * @returns {Promise<Uint8Array>}
 */
function add_key_with_prf$1(prf_output_base64, encrypted_private_key_data, encrypted_private_key_iv, signer_account_id, new_public_key, access_key_json, nonce, block_hash_bytes, contract_id, vrf_challenge_data_json, webauthn_credential_json, near_rpc_url) {
    const ptr0 = passStringToWasm0(prf_output_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(encrypted_private_key_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(encrypted_private_key_iv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(signer_account_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len3 = WASM_VECTOR_LEN;
    const ptr4 = passStringToWasm0(new_public_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len4 = WASM_VECTOR_LEN;
    const ptr5 = passStringToWasm0(access_key_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len5 = WASM_VECTOR_LEN;
    const ptr6 = passArray8ToWasm0(block_hash_bytes, wasm.__wbindgen_malloc);
    const len6 = WASM_VECTOR_LEN;
    const ptr7 = passStringToWasm0(contract_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len7 = WASM_VECTOR_LEN;
    const ptr8 = passStringToWasm0(vrf_challenge_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len8 = WASM_VECTOR_LEN;
    const ptr9 = passStringToWasm0(webauthn_credential_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len9 = WASM_VECTOR_LEN;
    const ptr10 = passStringToWasm0(near_rpc_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len10 = WASM_VECTOR_LEN;
    const ret = wasm.add_key_with_prf(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, nonce, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10);
    return ret;
}

/**
 * Convenience function for deleting keys with PRF authentication
 * @param {string} prf_output_base64
 * @param {string} encrypted_private_key_data
 * @param {string} encrypted_private_key_iv
 * @param {string} signer_account_id
 * @param {string} public_key_to_delete
 * @param {bigint} nonce
 * @param {Uint8Array} block_hash_bytes
 * @param {string} contract_id
 * @param {string} vrf_challenge_data_json
 * @param {string} webauthn_credential_json
 * @param {string} near_rpc_url
 * @returns {Promise<Uint8Array>}
 */
function delete_key_with_prf$1(prf_output_base64, encrypted_private_key_data, encrypted_private_key_iv, signer_account_id, public_key_to_delete, nonce, block_hash_bytes, contract_id, vrf_challenge_data_json, webauthn_credential_json, near_rpc_url) {
    const ptr0 = passStringToWasm0(prf_output_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(encrypted_private_key_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(encrypted_private_key_iv, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(signer_account_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len3 = WASM_VECTOR_LEN;
    const ptr4 = passStringToWasm0(public_key_to_delete, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len4 = WASM_VECTOR_LEN;
    const ptr5 = passArray8ToWasm0(block_hash_bytes, wasm.__wbindgen_malloc);
    const len5 = WASM_VECTOR_LEN;
    const ptr6 = passStringToWasm0(contract_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len6 = WASM_VECTOR_LEN;
    const ptr7 = passStringToWasm0(vrf_challenge_data_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len7 = WASM_VECTOR_LEN;
    const ptr8 = passStringToWasm0(webauthn_credential_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len8 = WASM_VECTOR_LEN;
    const ptr9 = passStringToWasm0(near_rpc_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len9 = WASM_VECTOR_LEN;
    const ret = wasm.delete_key_with_prf(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, nonce, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9);
    return ret;
}

function __wbg_adapter_50(arg0, arg1, arg2) {
    wasm.closure172_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_153(arg0, arg1, arg2, arg3) {
    wasm.closure200_externref_shim(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_crypto_574e78ad8b13b65f = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_done_769e5ede4b31c67b = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_entries_3265d4158b33e5dc = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_getRandomValues_b8f5dbd5f3995a9e = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Map_f3469ce2244d2430 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Map;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Promise_935168b8f4b49db3 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Promise;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Response_f2cc20d9f7dfd644 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_343e2beeeece1bb0 = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbg_iterator_9a24c88df860dc65 = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_json_1671bfa3e3625686 = function() { return handleError(function (arg0) {
        const ret = arg0.json();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_log_4aa07facca81ff45 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_msCrypto_a61aeb35a24c1329 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_new_018dcc2d6c8c2f6a = function() { return handleError(function () {
        const ret = new Headers();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_153(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithstrandinit_06c535e0a867c635 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_25feadfc0913fea9 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_node_905d3e251edff8a2 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_ok_3aaf32d069979723 = function(arg0) {
        const ret = arg0.ok;
        return ret;
    };
    imports.wbg.__wbg_process_dc0fbacc7c1c06f7 = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_ac0988aba3254290 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_require_60cc747a6bc5215a = function() { return handleError(function () {
        const ret = commonjsRequire;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_sendProgressMessage_758ffc89ae14005a = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        sendProgressMessage(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
    };
    imports.wbg.__wbg_set_11cd83f45504cedf = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_setbody_5923b78a95eedf29 = function(arg0, arg1) {
        arg0.body = arg1;
    };
    imports.wbg.__wbg_setheaders_834c0bdb6a8949ad = function(arg0, arg1) {
        arg0.headers = arg1;
    };
    imports.wbg.__wbg_setmethod_3c5280fe5d890842 = function(arg0, arg1, arg2) {
        arg0.method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmode_5dc300b865044b65 = function(arg0, arg1) {
        arg0.mode = __wbindgen_enum_RequestMode[arg1];
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_statusText_207754230b39e67c = function(arg0, arg1) {
        const ret = arg1.statusText;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_status_f6360336ca686bf0 = function(arg0) {
        const ret = arg0.status;
        return ret;
    };
    imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_text_7805bea50de2af49 = function() { return handleError(function (arg0) {
        const ret = arg0.text();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_versions_c01dfd4722a88165 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper657 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 173, __wbg_adapter_50);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_uint8_array_new = function(arg0, arg1) {
        var v0 = getArrayU8FromWasm0(arg0, arg1).slice();
        wasm.__wbindgen_free(arg0, arg1 * 1, 1);
        const ret = v0;
        return ret;
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module);
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead');
        }
    }

    const imports = __wbg_get_imports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path);
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead');
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('wasm_signer_worker_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

var wasmModule = /*#__PURE__*/Object.freeze({
	__proto__: null,
	add_key_with_prf: add_key_with_prf$1,
	check_can_register_user: check_can_register_user$1,
	decrypt_private_key_with_prf_as_string: decrypt_private_key_with_prf_as_string$1,
	default: __wbg_init,
	delete_key_with_prf: delete_key_with_prf$1,
	derive_near_keypair_from_cose_and_encrypt_with_prf: derive_near_keypair_from_cose_and_encrypt_with_prf$1,
	extract_cose_public_key_from_attestation: extract_cose_public_key_from_attestation$1,
	initSync: initSync,
	init_panic_hook: init_panic_hook,
	rollback_failed_registration_with_prf: rollback_failed_registration_with_prf$1,
	sign_verify_and_register_user: sign_verify_and_register_user$1,
	validate_cose_key_format: validate_cose_key_format$1,
	verify_and_sign_near_transaction_with_actions: verify_and_sign_near_transaction_with_actions$1,
	verify_and_sign_near_transfer_transaction: verify_and_sign_near_transfer_transaction$1
});

/**
 * Enum for all supported NEAR action types
 * Provides type safety and better developer experience
 */
var ActionType;
(function (ActionType) {
    ActionType["CreateAccount"] = "CreateAccount";
    ActionType["DeployContract"] = "DeployContract";
    ActionType["FunctionCall"] = "FunctionCall";
    ActionType["Transfer"] = "Transfer";
    ActionType["Stake"] = "Stake";
    ActionType["AddKey"] = "AddKey";
    ActionType["DeleteKey"] = "DeleteKey";
    ActionType["DeleteAccount"] = "DeleteAccount";
})(ActionType || (ActionType = {}));

// === WORKER MESSAGE TYPE ENUMS ===
var WorkerRequestType;
(function (WorkerRequestType) {
    WorkerRequestType["DERIVE_NEAR_KEYPAIR_AND_ENCRYPT"] = "DERIVE_NEAR_KEYPAIR_AND_ENCRYPT";
    WorkerRequestType["CHECK_CAN_REGISTER_USER"] = "CHECK_CAN_REGISTER_USER";
    WorkerRequestType["SIGN_VERIFY_AND_REGISTER_USER"] = "SIGN_VERIFY_AND_REGISTER_USER";
    WorkerRequestType["DECRYPT_PRIVATE_KEY_WITH_PRF"] = "DECRYPT_PRIVATE_KEY_WITH_PRF";
    // COSE operations
    WorkerRequestType["EXTRACT_COSE_PUBLIC_KEY"] = "EXTRACT_COSE_PUBLIC_KEY";
    WorkerRequestType["VALIDATE_COSE_KEY"] = "VALIDATE_COSE_KEY";
    WorkerRequestType["GENERATE_VRF_KEYPAIR_WITH_PRF"] = "GENERATE_VRF_KEYPAIR_WITH_PRF";
    WorkerRequestType["GENERATE_VRF_CHALLENGE_WITH_PRF"] = "GENERATE_VRF_CHALLENGE_WITH_PRF";
    WorkerRequestType["SIGN_TRANSACTION_WITH_ACTIONS"] = "SIGN_TRANSACTION_WITH_ACTIONS";
    WorkerRequestType["SIGN_TRANSFER_TRANSACTION"] = "SIGN_TRANSFER_TRANSACTION";
    // New action-specific functions
    WorkerRequestType["ADD_KEY_WITH_PRF"] = "ADD_KEY_WITH_PRF";
    WorkerRequestType["DELETE_KEY_WITH_PRF"] = "DELETE_KEY_WITH_PRF";
    WorkerRequestType["ROLLBACK_FAILED_REGISTRATION_WITH_PRF"] = "ROLLBACK_FAILED_REGISTRATION_WITH_PRF";
})(WorkerRequestType || (WorkerRequestType = {}));
var WorkerResponseType;
(function (WorkerResponseType) {
    WorkerResponseType["ENCRYPTION_SUCCESS"] = "ENCRYPTION_SUCCESS";
    WorkerResponseType["DERIVE_NEAR_KEY_FAILURE"] = "DERIVE_NEAR_KEY_FAILURE";
    WorkerResponseType["REGISTRATION_SUCCESS"] = "REGISTRATION_SUCCESS";
    WorkerResponseType["REGISTRATION_FAILURE"] = "REGISTRATION_FAILURE";
    WorkerResponseType["SIGNATURE_SUCCESS"] = "SIGNATURE_SUCCESS";
    WorkerResponseType["SIGNATURE_FAILURE"] = "SIGNATURE_FAILURE";
    WorkerResponseType["DECRYPTION_SUCCESS"] = "DECRYPTION_SUCCESS";
    WorkerResponseType["DECRYPTION_FAILURE"] = "DECRYPTION_FAILURE";
    WorkerResponseType["COSE_KEY_SUCCESS"] = "COSE_KEY_SUCCESS";
    WorkerResponseType["COSE_KEY_FAILURE"] = "COSE_KEY_FAILURE";
    WorkerResponseType["COSE_VALIDATION_SUCCESS"] = "COSE_VALIDATION_SUCCESS";
    WorkerResponseType["COSE_VALIDATION_FAILURE"] = "COSE_VALIDATION_FAILURE";
    WorkerResponseType["VRF_KEYPAIR_SUCCESS"] = "VRF_KEYPAIR_SUCCESS";
    WorkerResponseType["VRF_KEYPAIR_FAILURE"] = "VRF_KEYPAIR_FAILURE";
    WorkerResponseType["VRF_CHALLENGE_SUCCESS"] = "VRF_CHALLENGE_SUCCESS";
    WorkerResponseType["VRF_CHALLENGE_FAILURE"] = "VRF_CHALLENGE_FAILURE";
    WorkerResponseType["ERROR"] = "ERROR";
    WorkerResponseType["VERIFICATION_PROGRESS"] = "VERIFICATION_PROGRESS";
    WorkerResponseType["VERIFICATION_COMPLETE"] = "VERIFICATION_COMPLETE";
    WorkerResponseType["REGISTRATION_PROGRESS"] = "REGISTRATION_PROGRESS";
    WorkerResponseType["REGISTRATION_COMPLETE"] = "REGISTRATION_COMPLETE";
    WorkerResponseType["SIGNING_PROGRESS"] = "SIGNING_PROGRESS";
    WorkerResponseType["SIGNING_COMPLETE"] = "SIGNING_COMPLETE";
})(WorkerResponseType || (WorkerResponseType = {}));
var WorkerErrorCode;
(function (WorkerErrorCode) {
    WorkerErrorCode["WASM_INIT_FAILED"] = "WASM_INIT_FAILED";
    WorkerErrorCode["INVALID_REQUEST"] = "INVALID_REQUEST";
    WorkerErrorCode["TIMEOUT"] = "TIMEOUT";
    WorkerErrorCode["ENCRYPTION_FAILED"] = "ENCRYPTION_FAILED";
    WorkerErrorCode["DECRYPTION_FAILED"] = "DECRYPTION_FAILED";
    WorkerErrorCode["SIGNING_FAILED"] = "SIGNING_FAILED";
    WorkerErrorCode["COSE_EXTRACTION_FAILED"] = "COSE_EXTRACTION_FAILED";
    WorkerErrorCode["STORAGE_FAILED"] = "STORAGE_FAILED";
    WorkerErrorCode["VRF_KEYPAIR_GENERATION_FAILED"] = "VRF_KEYPAIR_GENERATION_FAILED";
    WorkerErrorCode["VRF_CHALLENGE_GENERATION_FAILED"] = "VRF_CHALLENGE_GENERATION_FAILED";
    WorkerErrorCode["VRF_ENCRYPTION_FAILED"] = "VRF_ENCRYPTION_FAILED";
    WorkerErrorCode["VRF_DECRYPTION_FAILED"] = "VRF_DECRYPTION_FAILED";
    WorkerErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
})(WorkerErrorCode || (WorkerErrorCode = {}));
// Removes the PRF output from the credential and returns the PRF output separately
function takePrfOutputFromCredential(credential) {
    // Access PRF through the getter (which reads from Symbol property)
    const prfOutput = credential.clientExtensionResults?.prf?.results?.first;
    if (!prfOutput) {
        throw new Error('PRF output missing from credential.clientExtensionResults: required for secure key decryption');
    }
    // Create credential without PRF by removing the Symbol property
    const credentialWithoutPrf = {
        ...credential,
        clientExtensionResults: {
            ...credential.clientExtensionResults,
            prf: {
                ...credential.clientExtensionResults?.prf,
                results: {
                    // Return undefined for first since Symbol is removed
                    first: undefined
                }
            }
        }
    };
    return { credentialWithoutPrf, prfOutput };
}
// === PROGRESS MESSAGE TYPES ===
/**
 * Progress message types that can be sent from WASM to the main thread
 */
var ProgressMessageType;
(function (ProgressMessageType) {
    ProgressMessageType["VERIFICATION_PROGRESS"] = "VERIFICATION_PROGRESS";
    ProgressMessageType["VERIFICATION_COMPLETE"] = "VERIFICATION_COMPLETE";
    ProgressMessageType["SIGNING_PROGRESS"] = "SIGNING_PROGRESS";
    ProgressMessageType["SIGNING_COMPLETE"] = "SIGNING_COMPLETE";
    ProgressMessageType["REGISTRATION_PROGRESS"] = "REGISTRATION_PROGRESS";
    ProgressMessageType["REGISTRATION_COMPLETE"] = "REGISTRATION_COMPLETE";
})(ProgressMessageType || (ProgressMessageType = {}));
/**
 * Step identifiers for progress tracking
 */
var ProgressStep;
(function (ProgressStep) {
    ProgressStep["PREPARATION"] = "preparation";
    ProgressStep["AUTHENTICATION"] = "authentication";
    ProgressStep["CONTRACT_VERIFICATION"] = "contract_verification";
    ProgressStep["TRANSACTION_SIGNING"] = "transaction_signing";
    ProgressStep["BROADCASTING"] = "broadcasting";
    ProgressStep["VERIFICATION_COMPLETE"] = "verification_complete";
    ProgressStep["SIGNING_COMPLETE"] = "signing_complete";
})(ProgressStep || (ProgressStep = {}));

// === CONSTANTS ===
const DB_CONFIG = {
    dbName: 'PasskeyNearKeys',
    dbVersion: 1,
    storeName: 'encryptedKeys',
    keyPath: 'nearAccountId'
};
class PasskeyNearKeysDBManager {
    constructor(config = DB_CONFIG) {
        this.config = config;
    }
    /**
     * Open IndexedDB connection
     */
    async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, this.config.dbVersion);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.config.storeName)) {
                    db.createObjectStore(this.config.storeName, { keyPath: this.config.keyPath });
                }
            };
        });
    }
    /**
     * Store encrypted key data
     */
    async storeEncryptedKey(data) {
        const db = await this.openDB();
        const transaction = db.transaction([this.config.storeName], 'readwrite');
        const store = transaction.objectStore(this.config.storeName);
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => {
                db.close();
                resolve();
            };
            request.onerror = () => {
                db.close();
                reject(request.error);
            };
        });
    }
    /**
     * Retrieve encrypted key data
     */
    async getEncryptedKey(nearAccountId) {
        console.log('PasskeyNearKeysDB: getEncryptedKey - Retrieving for account:', nearAccountId);
        const db = await this.openDB();
        const transaction = db.transaction([this.config.storeName], 'readonly');
        const store = transaction.objectStore(this.config.storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(nearAccountId);
            request.onsuccess = () => {
                const result = request.result;
                if (!result?.encryptedData) {
                    console.warn('PasskeyNearKeysDB: getEncryptedKey - No result found');
                }
                db.close();
                resolve(result);
            };
            request.onerror = () => {
                console.error('PasskeyNearKeysDB: getEncryptedKey - Error:', request.error);
                db.close();
                reject(request.error);
            };
        });
    }
    /**
     * Verify key storage by attempting retrieval
     */
    async verifyKeyStorage(nearAccountId) {
        try {
            const retrievedKey = await this.getEncryptedKey(nearAccountId);
            return !!retrievedKey;
        }
        catch (error) {
            console.error('PasskeyNearKeysDB: verifyKeyStorage - Error:', error);
            return false;
        }
    }
    /**
     * Delete encrypted key data for a specific account
     */
    async deleteEncryptedKey(nearAccountId) {
        console.log('PasskeyNearKeysDB: deleteEncryptedKey - Deleting for account:', nearAccountId);
        const db = await this.openDB();
        const transaction = db.transaction([this.config.storeName], 'readwrite');
        const store = transaction.objectStore(this.config.storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(nearAccountId);
            request.onsuccess = () => {
                console.log('PasskeyNearKeysDB: deleteEncryptedKey - Successfully deleted');
                db.close();
                resolve();
            };
            request.onerror = () => {
                console.error('PasskeyNearKeysDB: deleteEncryptedKey - Error:', request.error);
                db.close();
                reject(request.error);
            };
        });
    }
    /**
     * Get all encrypted keys (for migration or debugging purposes)
     */
    async getAllEncryptedKeys() {
        const db = await this.openDB();
        const transaction = db.transaction([this.config.storeName], 'readonly');
        const store = transaction.objectStore(this.config.storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                db.close();
                resolve(request.result || []);
            };
            request.onerror = () => {
                console.error('PasskeyNearKeysDB: getAllEncryptedKeys - Error:', request.error);
                db.close();
                reject(request.error);
            };
        });
    }
    /**
     * Clear all encrypted keys (for testing or reset purposes)
     */
    async clearAllEncryptedKeys() {
        console.log('PasskeyNearKeysDB: clearAllEncryptedKeys - Clearing all keys');
        const db = await this.openDB();
        const transaction = db.transaction([this.config.storeName], 'readwrite');
        const store = transaction.objectStore(this.config.storeName);
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => {
                console.log('PasskeyNearKeysDB: clearAllEncryptedKeys - Successfully cleared');
                db.close();
                resolve();
            };
            request.onerror = () => {
                console.error('PasskeyNearKeysDB: clearAllEncryptedKeys - Error:', request.error);
                db.close();
                reject(request.error);
            };
        });
    }
    /**
     * Check if a key exists for the given account
     */
    async hasEncryptedKey(nearAccountId) {
        try {
            const keyData = await this.getEncryptedKey(nearAccountId);
            return !!keyData;
        }
        catch (error) {
            console.error('PasskeyNearKeysDB: hasEncryptedKey - Error:', error);
            return false;
        }
    }
    /**
     * Update timestamp for an existing encrypted key (for tracking last access)
     */
    async updateKeyTimestamp(nearAccountId) {
        const existingKey = await this.getEncryptedKey(nearAccountId);
        if (existingKey) {
            const updatedKey = {
                ...existingKey,
                timestamp: Date.now()
            };
            await this.storeEncryptedKey(updatedKey);
        }
    }
}

var buffer = {};

var base64Js = {};

base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens (b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4);

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

  var curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen;

  var i;
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = (tmp >> 16) & 0xFF;
    arr[curByte++] = (tmp >> 8) & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[curByte++] = (tmp >> 8) & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    );
  }

  return parts.join('')
}

var ieee754 = {};

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = (nBytes * 8) - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
};

ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = (nBytes * 8) - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

(function (exports) {

	const base64 = base64Js;
	const ieee754$1 = ieee754;
	const customInspectSymbol =
	  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
	    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
	    : null;

	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;

	const K_MAX_LENGTH = 0x7fffffff;
	exports.kMaxLength = K_MAX_LENGTH;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
	 *               implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * We report that the browser does not support typed arrays if the are not subclassable
	 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
	 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
	 * for __proto__ and has a buggy typed array implementation.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

	if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
	    typeof console.error === 'function') {
	  console.error(
	    'This browser lacks typed array (Uint8Array) support which is required by ' +
	    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
	  );
	}

	function typedArraySupport () {
	  // Can typed array instances can be augmented?
	  try {
	    const arr = new Uint8Array(1);
	    const proto = { foo: function () { return 42 } };
	    Object.setPrototypeOf(proto, Uint8Array.prototype);
	    Object.setPrototypeOf(arr, proto);
	    return arr.foo() === 42
	  } catch (e) {
	    return false
	  }
	}

	Object.defineProperty(Buffer.prototype, 'parent', {
	  enumerable: true,
	  get: function () {
	    if (!Buffer.isBuffer(this)) return undefined
	    return this.buffer
	  }
	});

	Object.defineProperty(Buffer.prototype, 'offset', {
	  enumerable: true,
	  get: function () {
	    if (!Buffer.isBuffer(this)) return undefined
	    return this.byteOffset
	  }
	});

	function createBuffer (length) {
	  if (length > K_MAX_LENGTH) {
	    throw new RangeError('The value "' + length + '" is invalid for option "size"')
	  }
	  // Return an augmented `Uint8Array` instance
	  const buf = new Uint8Array(length);
	  Object.setPrototypeOf(buf, Buffer.prototype);
	  return buf
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new TypeError(
	        'The "string" argument must be of type string. Received type number'
	      )
	    }
	    return allocUnsafe(arg)
	  }
	  return from(arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192; // not used by this implementation

	function from (value, encodingOrOffset, length) {
	  if (typeof value === 'string') {
	    return fromString(value, encodingOrOffset)
	  }

	  if (ArrayBuffer.isView(value)) {
	    return fromArrayView(value)
	  }

	  if (value == null) {
	    throw new TypeError(
	      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
	      'or Array-like Object. Received type ' + (typeof value)
	    )
	  }

	  if (isInstance(value, ArrayBuffer) ||
	      (value && isInstance(value.buffer, ArrayBuffer))) {
	    return fromArrayBuffer(value, encodingOrOffset, length)
	  }

	  if (typeof SharedArrayBuffer !== 'undefined' &&
	      (isInstance(value, SharedArrayBuffer) ||
	      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
	    return fromArrayBuffer(value, encodingOrOffset, length)
	  }

	  if (typeof value === 'number') {
	    throw new TypeError(
	      'The "value" argument must not be of type number. Received type number'
	    )
	  }

	  const valueOf = value.valueOf && value.valueOf();
	  if (valueOf != null && valueOf !== value) {
	    return Buffer.from(valueOf, encodingOrOffset, length)
	  }

	  const b = fromObject(value);
	  if (b) return b

	  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
	      typeof value[Symbol.toPrimitive] === 'function') {
	    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
	  }

	  throw new TypeError(
	    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
	    'or Array-like Object. Received type ' + (typeof value)
	  )
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(value, encodingOrOffset, length)
	};

	// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
	// https://github.com/feross/buffer/pull/148
	Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
	Object.setPrototypeOf(Buffer, Uint8Array);

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be of type number')
	  } else if (size < 0) {
	    throw new RangeError('The value "' + size + '" is invalid for option "size"')
	  }
	}

	function alloc (size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpreted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(size).fill(fill, encoding)
	      : createBuffer(size).fill(fill)
	  }
	  return createBuffer(size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(size, fill, encoding)
	};

	function allocUnsafe (size) {
	  assertSize(size);
	  return createBuffer(size < 0 ? 0 : checked(size) | 0)
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(size)
	};

	function fromString (string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('Unknown encoding: ' + encoding)
	  }

	  const length = byteLength(string, encoding) | 0;
	  let buf = createBuffer(length);

	  const actual = buf.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    buf = buf.slice(0, actual);
	  }

	  return buf
	}

	function fromArrayLike (array) {
	  const length = array.length < 0 ? 0 : checked(array.length) | 0;
	  const buf = createBuffer(length);
	  for (let i = 0; i < length; i += 1) {
	    buf[i] = array[i] & 255;
	  }
	  return buf
	}

	function fromArrayView (arrayView) {
	  if (isInstance(arrayView, Uint8Array)) {
	    const copy = new Uint8Array(arrayView);
	    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
	  }
	  return fromArrayLike(arrayView)
	}

	function fromArrayBuffer (array, byteOffset, length) {
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('"offset" is outside of buffer bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('"length" is outside of buffer bounds')
	  }

	  let buf;
	  if (byteOffset === undefined && length === undefined) {
	    buf = new Uint8Array(array);
	  } else if (length === undefined) {
	    buf = new Uint8Array(array, byteOffset);
	  } else {
	    buf = new Uint8Array(array, byteOffset, length);
	  }

	  // Return an augmented `Uint8Array` instance
	  Object.setPrototypeOf(buf, Buffer.prototype);

	  return buf
	}

	function fromObject (obj) {
	  if (Buffer.isBuffer(obj)) {
	    const len = checked(obj.length) | 0;
	    const buf = createBuffer(len);

	    if (buf.length === 0) {
	      return buf
	    }

	    obj.copy(buf, 0, 0, len);
	    return buf
	  }

	  if (obj.length !== undefined) {
	    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
	      return createBuffer(0)
	    }
	    return fromArrayLike(obj)
	  }

	  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
	    return fromArrayLike(obj.data)
	  }
	}

	function checked (length) {
	  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= K_MAX_LENGTH) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0;
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return b != null && b._isBuffer === true &&
	    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
	};

	Buffer.compare = function compare (a, b) {
	  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
	  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError(
	      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
	    )
	  }

	  if (a === b) return 0

	  let x = a.length;
	  let y = b.length;

	  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!Array.isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  let i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  const buffer = Buffer.allocUnsafe(length);
	  let pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    let buf = list[i];
	    if (isInstance(buf, Uint8Array)) {
	      if (pos + buf.length > buffer.length) {
	        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
	        buf.copy(buffer, pos);
	      } else {
	        Uint8Array.prototype.set.call(
	          buffer,
	          buf,
	          pos
	        );
	      }
	    } else if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    } else {
	      buf.copy(buffer, pos);
	    }
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    throw new TypeError(
	      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
	      'Received type ' + typeof string
	    )
	  }

	  const len = string.length;
	  const mustMatch = (arguments.length > 2 && arguments[2] === true);
	  if (!mustMatch && len === 0) return 0

	  // Use a for loop to avoid recursion
	  let loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) {
	          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
	        }
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  let loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
	// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
	// reliably in a browserify context because there could be multiple different
	// copies of the 'buffer' package in use. This method works even for Buffer
	// instances that were created from another copy of the `buffer` package.
	// See: https://github.com/feross/buffer/issues/154
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  const i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  const len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (let i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  const len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (let i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  const len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (let i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  const length = this.length;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.toLocaleString = Buffer.prototype.toString;

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  let str = '';
	  const max = exports.INSPECT_MAX_BYTES;
	  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
	  if (this.length > max) str += ' ... ';
	  return '<Buffer ' + str + '>'
	};
	if (customInspectSymbol) {
	  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (isInstance(target, Uint8Array)) {
	    target = Buffer.from(target, target.offset, target.byteLength);
	  }
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError(
	      'The "target" argument must be one of type Buffer or Uint8Array. ' +
	      'Received type ' + (typeof target)
	    )
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  let x = thisEnd - thisStart;
	  let y = end - start;
	  const len = Math.min(x, y);

	  const thisCopy = this.slice(thisStart, thisEnd);
	  const targetCopy = target.slice(start, end);

	  for (let i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -2147483648) {
	    byteOffset = -2147483648;
	  }
	  byteOffset = +byteOffset; // Coerce to Number.
	  if (numberIsNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  let indexSize = 1;
	  let arrLength = arr.length;
	  let valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  let i;
	  if (dir) {
	    let foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      let found = true;
	      for (let j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  const remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  const strLen = string.length;

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  let i;
	  for (i = 0; i < length; ++i) {
	    const parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (numberIsNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset >>> 0;
	    if (isFinite(length)) {
	      length = length >>> 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  const remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  let loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return asciiWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  const res = [];

	  let i = start;
	  while (i < end) {
	    const firstByte = buf[i];
	    let codePoint = null;
	    let bytesPerSequence = (firstByte > 0xEF)
	      ? 4
	      : (firstByte > 0xDF)
	          ? 3
	          : (firstByte > 0xBF)
	              ? 2
	              : 1;

	    if (i + bytesPerSequence <= end) {
	      let secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	const MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  const len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  let res = '';
	  let i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  let ret = '';
	  end = Math.min(buf.length, end);

	  for (let i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  let ret = '';
	  end = Math.min(buf.length, end);

	  for (let i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  const len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  let out = '';
	  for (let i = start; i < end; ++i) {
	    out += hexSliceLookupTable[buf[i]];
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  const bytes = buf.slice(start, end);
	  let res = '';
	  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
	  for (let i = 0; i < bytes.length - 1; i += 2) {
	    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256));
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  const len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  const newBuf = this.subarray(start, end);
	  // Return an augmented `Uint8Array` instance
	  Object.setPrototypeOf(newBuf, Buffer.prototype);

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUintLE =
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  let val = this[offset];
	  let mul = 1;
	  let i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUintBE =
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  let val = this[offset + --byteLength];
	  let mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUint8 =
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUint16LE =
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUint16BE =
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUint32LE =
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUint32BE =
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
	  offset = offset >>> 0;
	  validateNumber(offset, 'offset');
	  const first = this[offset];
	  const last = this[offset + 7];
	  if (first === undefined || last === undefined) {
	    boundsError(offset, this.length - 8);
	  }

	  const lo = first +
	    this[++offset] * 2 ** 8 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 24;

	  const hi = this[++offset] +
	    this[++offset] * 2 ** 8 +
	    this[++offset] * 2 ** 16 +
	    last * 2 ** 24;

	  return BigInt(lo) + (BigInt(hi) << BigInt(32))
	});

	Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
	  offset = offset >>> 0;
	  validateNumber(offset, 'offset');
	  const first = this[offset];
	  const last = this[offset + 7];
	  if (first === undefined || last === undefined) {
	    boundsError(offset, this.length - 8);
	  }

	  const hi = first * 2 ** 24 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 8 +
	    this[++offset];

	  const lo = this[++offset] * 2 ** 24 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 8 +
	    last;

	  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
	});

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  let val = this[offset];
	  let mul = 1;
	  let i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  let i = byteLength;
	  let mul = 1;
	  let val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  const val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  const val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
	  offset = offset >>> 0;
	  validateNumber(offset, 'offset');
	  const first = this[offset];
	  const last = this[offset + 7];
	  if (first === undefined || last === undefined) {
	    boundsError(offset, this.length - 8);
	  }

	  const val = this[offset + 4] +
	    this[offset + 5] * 2 ** 8 +
	    this[offset + 6] * 2 ** 16 +
	    (last << 24); // Overflow

	  return (BigInt(val) << BigInt(32)) +
	    BigInt(first +
	    this[++offset] * 2 ** 8 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 24)
	});

	Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
	  offset = offset >>> 0;
	  validateNumber(offset, 'offset');
	  const first = this[offset];
	  const last = this[offset + 7];
	  if (first === undefined || last === undefined) {
	    boundsError(offset, this.length - 8);
	  }

	  const val = (first << 24) + // Overflow
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 8 +
	    this[++offset];

	  return (BigInt(val) << BigInt(32)) +
	    BigInt(this[++offset] * 2 ** 24 +
	    this[++offset] * 2 ** 16 +
	    this[++offset] * 2 ** 8 +
	    last)
	});

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754$1.read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754$1.read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754$1.read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754$1.read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUintLE =
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) {
	    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  let mul = 1;
	  let i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUintBE =
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) {
	    const maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  let i = byteLength - 1;
	  let mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUint8 =
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeUint16LE =
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  this[offset] = (value & 0xff);
	  this[offset + 1] = (value >>> 8);
	  return offset + 2
	};

	Buffer.prototype.writeUint16BE =
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  this[offset] = (value >>> 8);
	  this[offset + 1] = (value & 0xff);
	  return offset + 2
	};

	Buffer.prototype.writeUint32LE =
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  this[offset + 3] = (value >>> 24);
	  this[offset + 2] = (value >>> 16);
	  this[offset + 1] = (value >>> 8);
	  this[offset] = (value & 0xff);
	  return offset + 4
	};

	Buffer.prototype.writeUint32BE =
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  this[offset] = (value >>> 24);
	  this[offset + 1] = (value >>> 16);
	  this[offset + 2] = (value >>> 8);
	  this[offset + 3] = (value & 0xff);
	  return offset + 4
	};

	function wrtBigUInt64LE (buf, value, offset, min, max) {
	  checkIntBI(value, min, max, buf, offset, 7);

	  let lo = Number(value & BigInt(0xffffffff));
	  buf[offset++] = lo;
	  lo = lo >> 8;
	  buf[offset++] = lo;
	  lo = lo >> 8;
	  buf[offset++] = lo;
	  lo = lo >> 8;
	  buf[offset++] = lo;
	  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
	  buf[offset++] = hi;
	  hi = hi >> 8;
	  buf[offset++] = hi;
	  hi = hi >> 8;
	  buf[offset++] = hi;
	  hi = hi >> 8;
	  buf[offset++] = hi;
	  return offset
	}

	function wrtBigUInt64BE (buf, value, offset, min, max) {
	  checkIntBI(value, min, max, buf, offset, 7);

	  let lo = Number(value & BigInt(0xffffffff));
	  buf[offset + 7] = lo;
	  lo = lo >> 8;
	  buf[offset + 6] = lo;
	  lo = lo >> 8;
	  buf[offset + 5] = lo;
	  lo = lo >> 8;
	  buf[offset + 4] = lo;
	  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
	  buf[offset + 3] = hi;
	  hi = hi >> 8;
	  buf[offset + 2] = hi;
	  hi = hi >> 8;
	  buf[offset + 1] = hi;
	  hi = hi >> 8;
	  buf[offset] = hi;
	  return offset + 8
	}

	Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
	  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
	});

	Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
	  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
	});

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    const limit = Math.pow(2, (8 * byteLength) - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  let i = 0;
	  let mul = 1;
	  let sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    const limit = Math.pow(2, (8 * byteLength) - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  let i = byteLength - 1;
	  let mul = 1;
	  let sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -128);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
	  this[offset] = (value & 0xff);
	  this[offset + 1] = (value >>> 8);
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -32768);
	  this[offset] = (value >>> 8);
	  this[offset + 1] = (value & 0xff);
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
	  this[offset] = (value & 0xff);
	  this[offset + 1] = (value >>> 8);
	  this[offset + 2] = (value >>> 16);
	  this[offset + 3] = (value >>> 24);
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -2147483648);
	  if (value < 0) value = 0xffffffff + value + 1;
	  this[offset] = (value >>> 24);
	  this[offset + 1] = (value >>> 16);
	  this[offset + 2] = (value >>> 8);
	  this[offset + 3] = (value & 0xff);
	  return offset + 4
	};

	Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
	  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
	});

	Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
	  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
	});

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4);
	  }
	  ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8);
	  }
	  ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  const len = end - start;

	  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
	    // Use built-in when available, missing from IE11
	    this.copyWithin(targetStart, start, end);
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, end),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	    if (val.length === 1) {
	      const code = val.charCodeAt(0);
	      if ((encoding === 'utf8' && code < 128) ||
	          encoding === 'latin1') {
	        // Fast path: If `val` fits into a single byte, use that numeric value.
	        val = code;
	      }
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  } else if (typeof val === 'boolean') {
	    val = Number(val);
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  let i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    const bytes = Buffer.isBuffer(val)
	      ? val
	      : Buffer.from(val, encoding);
	    const len = bytes.length;
	    if (len === 0) {
	      throw new TypeError('The value "' + val +
	        '" is invalid for argument "value"')
	    }
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// CUSTOM ERRORS
	// =============

	// Simplified versions from Node, changed for Buffer-only usage
	const errors = {};
	function E (sym, getMessage, Base) {
	  errors[sym] = class NodeError extends Base {
	    constructor () {
	      super();

	      Object.defineProperty(this, 'message', {
	        value: getMessage.apply(this, arguments),
	        writable: true,
	        configurable: true
	      });

	      // Add the error code to the name to include it in the stack trace.
	      this.name = `${this.name} [${sym}]`;
	      // Access the stack to generate the error message including the error code
	      // from the name.
	      this.stack; // eslint-disable-line no-unused-expressions
	      // Reset the name to the actual name.
	      delete this.name;
	    }

	    get code () {
	      return sym
	    }

	    set code (value) {
	      Object.defineProperty(this, 'code', {
	        configurable: true,
	        enumerable: true,
	        value,
	        writable: true
	      });
	    }

	    toString () {
	      return `${this.name} [${sym}]: ${this.message}`
	    }
	  };
	}

	E('ERR_BUFFER_OUT_OF_BOUNDS',
	  function (name) {
	    if (name) {
	      return `${name} is outside of buffer bounds`
	    }

	    return 'Attempt to access memory outside buffer bounds'
	  }, RangeError);
	E('ERR_INVALID_ARG_TYPE',
	  function (name, actual) {
	    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
	  }, TypeError);
	E('ERR_OUT_OF_RANGE',
	  function (str, range, input) {
	    let msg = `The value of "${str}" is out of range.`;
	    let received = input;
	    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
	      received = addNumericalSeparator(String(input));
	    } else if (typeof input === 'bigint') {
	      received = String(input);
	      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
	        received = addNumericalSeparator(received);
	      }
	      received += 'n';
	    }
	    msg += ` It must be ${range}. Received ${received}`;
	    return msg
	  }, RangeError);

	function addNumericalSeparator (val) {
	  let res = '';
	  let i = val.length;
	  const start = val[0] === '-' ? 1 : 0;
	  for (; i >= start + 4; i -= 3) {
	    res = `_${val.slice(i - 3, i)}${res}`;
	  }
	  return `${val.slice(0, i)}${res}`
	}

	// CHECK FUNCTIONS
	// ===============

	function checkBounds (buf, offset, byteLength) {
	  validateNumber(offset, 'offset');
	  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
	    boundsError(offset, buf.length - (byteLength + 1));
	  }
	}

	function checkIntBI (value, min, max, buf, offset, byteLength) {
	  if (value > max || value < min) {
	    const n = typeof min === 'bigint' ? 'n' : '';
	    let range;
	    {
	      if (min === 0 || min === BigInt(0)) {
	        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`;
	      } else {
	        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
	                `${(byteLength + 1) * 8 - 1}${n}`;
	      }
	    }
	    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
	  }
	  checkBounds(buf, offset, byteLength);
	}

	function validateNumber (value, name) {
	  if (typeof value !== 'number') {
	    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
	  }
	}

	function boundsError (value, length, type) {
	  if (Math.floor(value) !== value) {
	    validateNumber(value, type);
	    throw new errors.ERR_OUT_OF_RANGE('offset', 'an integer', value)
	  }

	  if (length < 0) {
	    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
	  }

	  throw new errors.ERR_OUT_OF_RANGE('offset',
	                                    `>= ${0} and <= ${length}`,
	                                    value)
	}

	// HELPER FUNCTIONS
	// ================

	const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node takes equal signs as end of the Base64 encoding
	  str = str.split('=')[0];
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = str.trim().replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  let codePoint;
	  const length = string.length;
	  let leadSurrogate = null;
	  const bytes = [];

	  for (let i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  const byteArray = [];
	  for (let i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  let c, hi, lo;
	  const byteArray = [];
	  for (let i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  let i;
	  for (i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
	// the `instanceof` check but they should be treated as of that type.
	// See: https://github.com/feross/buffer/issues/166
	function isInstance (obj, type) {
	  return obj instanceof type ||
	    (obj != null && obj.constructor != null && obj.constructor.name != null &&
	      obj.constructor.name === type.name)
	}
	function numberIsNaN (obj) {
	  // For IE11 support
	  return obj !== obj // eslint-disable-line no-self-compare
	}

	// Create lookup table for `toString('hex')`
	// See: https://github.com/feross/buffer/issues/219
	const hexSliceLookupTable = (function () {
	  const alphabet = '0123456789abcdef';
	  const table = new Array(256);
	  for (let i = 0; i < 16; ++i) {
	    const i16 = i * 16;
	    for (let j = 0; j < 16; ++j) {
	      table[i16 + j] = alphabet[i] + alphabet[j];
	    }
	  }
	  return table
	})();

	// Return not function with Error if BigInt not supported
	function defineBigIntMethod (fn) {
	  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
	}

	function BufferBigIntNotDefined () {
	  throw new Error('BigInt not supported')
	} 
} (buffer));

// WASM-only transaction signing worker
// This worker handles all NEAR transaction operations using WASM functions
// Import WASM binary directly
globalThis.Buffer = buffer.Buffer;
// Use a relative URL to the WASM file that will be copied by rollup to the same directory as the worker
const wasmUrl = new URL('./wasm_signer_worker_bg.wasm', import.meta.url);
const WASM_CACHE_NAME = 'web3authn-signer-worker-v1';
// Create database manager instance
const nearKeysDB = new PasskeyNearKeysDBManager();
/////////////////////////////////////
// === WASM MODULE FUNCTIONS ===
/////////////////////////////////////
const { 
// Registration
derive_near_keypair_from_cose_and_encrypt_with_prf, check_can_register_user, sign_verify_and_register_user, 
// Key exports/decryption
decrypt_private_key_with_prf_as_string, 
// Transaction signing: combined verification + signing
verify_and_sign_near_transaction_with_actions, verify_and_sign_near_transfer_transaction, 
// New action-specific functions (will be available after WASM rebuild)
add_key_with_prf, delete_key_with_prf, rollback_failed_registration_with_prf, 
// COSE keys
extract_cose_public_key_from_attestation, validate_cose_key_format, } = wasmModule;
/**
 * Initialize WASM module with caching support
 */
async function initializeWasmWithCache() {
    try {
        console.debug('[signer-worker]: Starting WASM initialization...', {
            wasmUrl: wasmUrl.href,
            userAgent: navigator.userAgent,
            currentUrl: self.location.href
        });
        const cache = await caches.open(WASM_CACHE_NAME);
        const cachedResponse = await cache.match(wasmUrl.href);
        if (cachedResponse) {
            const wasmModule = await WebAssembly.compileStreaming(cachedResponse.clone());
            await __wbg_init({ module: wasmModule });
            console.debug('[signer-worker]: WASM initialized successfully from cache');
            return;
        }
        console.debug('[signer-worker]: Fetching fresh WASM module from:', wasmUrl.href);
        const response = await fetch(wasmUrl.href);
        if (!response.ok) {
            throw new Error(`Failed to fetch WASM: ${response.status} ${response.statusText}`);
        }
        // console.log('[signer-worker]: WASM fetch successful, content-type:', response.headers.get('content-type'));
        const responseToCache = response.clone();
        const wasmModule = await WebAssembly.compileStreaming(response);
        await cache.put(wasmUrl.href, responseToCache);
        await __wbg_init({ module: wasmModule });
    }
    catch (error) {
        console.error('[signer-worker]: WASM initialization failed, using fallback:', error);
        console.error('[signer-worker]: Error details:', {
            name: error?.name,
            message: error?.message,
            stack: error?.stack
        });
        try {
            console.debug('[signer-worker]: Attempting fallback WASM initialization...');
            await __wbg_init();
        }
        catch (fallbackError) {
            console.error('[signer-worker]: Fallback WASM initialization also failed:', fallbackError);
            throw new Error(`WASM initialization failed: ${error?.message || 'Unknown error'}. Fallback also failed: ${fallbackError?.message || 'Unknown fallback error'}`);
        }
    }
}
/////////////////////////////////////
// === MAIN MESSAGE HANDLER ===
/////////////////////////////////////
let messageProcessed = false;
self.onmessage = async (event) => {
    if (messageProcessed) {
        sendResponseAndTerminate(createErrorResponse('Worker has already processed a message'));
        return;
    }
    messageProcessed = true;
    const { type, payload } = event.data;
    console.log('[signer-worker]: Received message:', { type, payload: { ...payload, prfOutput: '[REDACTED]' } });
    try {
        console.log('[signer-worker]: Starting WASM initialization...');
        await initializeWasmWithCache();
        console.log('[signer-worker]: WASM initialization completed, processing message...');
        switch (type) {
            case WorkerRequestType.DERIVE_NEAR_KEYPAIR_AND_ENCRYPT:
                await handleDeriveNearKeypairAndEncrypt(payload);
                break;
            case WorkerRequestType.CHECK_CAN_REGISTER_USER:
                await handleCheckCanRegisterUser(payload);
                break;
            case WorkerRequestType.SIGN_VERIFY_AND_REGISTER_USER:
                await handleSignVerifyAndRegisterUser(payload);
                break;
            case WorkerRequestType.DECRYPT_PRIVATE_KEY_WITH_PRF:
                await handleDecryptPrivateKeyWithPrf(payload);
                break;
            case WorkerRequestType.SIGN_TRANSACTION_WITH_ACTIONS:
                await handleVerifyAndSignNearTransactionWithActions(payload);
                break;
            case WorkerRequestType.SIGN_TRANSFER_TRANSACTION:
                await handleSignTransferTransaction(payload);
                break;
            case WorkerRequestType.EXTRACT_COSE_PUBLIC_KEY:
                await handleExtractCosePublicKey(payload);
                break;
            case WorkerRequestType.VALIDATE_COSE_KEY:
                await handleValidateCoseKey(payload);
                break;
            case WorkerRequestType.ADD_KEY_WITH_PRF:
                await handleAddKeyWithPrf(payload);
                break;
            case WorkerRequestType.DELETE_KEY_WITH_PRF:
                await handleDeleteKeyWithPrf(payload);
                break;
            case WorkerRequestType.ROLLBACK_FAILED_REGISTRATION_WITH_PRF:
                await handleRollbackFailedRegistrationWithPrf(payload);
                break;
            default:
                sendResponseAndTerminate(createErrorResponse(`Unknown message type: ${type}`));
        }
    }
    catch (error) {
        console.error('[signer-worker]: Message processing failed:', {
            error: error?.message || 'Unknown error',
            stack: error?.stack,
            name: error?.name,
            type,
            workerLocation: self.location.href
        });
        sendResponseAndTerminate(createErrorResponse(error?.message || 'Unknown error occurred'));
    }
};
// === NEAR KEY DERIVATION AND ENCRYPTION HANDLER ===
/**
 * Derives NEAR ed25519 keypairs from the WebAuthn P-256 COSE keys,
 * then derives an AES-256-GCM symmetric key from the WebAuthn PRF output,
 * then encrypts the NEAR private key with the AES-256-GCM symmetric key.
 *
 * @param payload - The request payload containing:
 *   @param {string} payload.prfOutput - Base64-encoded PRF output from WebAuthn assertion
 *   @param {string} payload.nearAccountId - NEAR account ID to associate with the keypair
 *   @param {string} payload.attestationObjectBase64url - Base64URL-encoded WebAuthn attestation object (includes COSE P-256 keys)
 */
async function handleDeriveNearKeypairAndEncrypt(payload) {
    try {
        const { prfOutput, nearAccountId, attestationObjectBase64url } = payload;
        console.log('[signer-worker]: Using deterministic key derivation from COSE P-256 credential');
        const resultJson = derive_near_keypair_from_cose_and_encrypt_with_prf(attestationObjectBase64url, prfOutput);
        const { publicKey, encryptedPrivateKey } = parseWasmResult(resultJson);
        console.log('[signer-worker]: Deterministic parseWasmResult output:');
        console.log('  - publicKey value:', publicKey);
        console.log('  - encryptedPrivateKey type:', typeof encryptedPrivateKey);
        const keyData = {
            nearAccountId: nearAccountId,
            encryptedData: encryptedPrivateKey.encrypted_near_key_data_b64u,
            iv: encryptedPrivateKey.aes_gcm_nonce_b64u,
            timestamp: Date.now()
        };
        console.log('[signer-worker]: Deterministic key derivation successful - NEAR keypair bound to WebAuthn credential');
        await nearKeysDB.storeEncryptedKey(keyData);
        const verified = await nearKeysDB.verifyKeyStorage(nearAccountId);
        if (!verified) {
            throw new Error('Key storage verification failed');
        }
        sendResponseAndTerminate({
            type: WorkerResponseType.ENCRYPTION_SUCCESS,
            payload: {
                nearAccountId,
                publicKey,
                stored: true,
            }
        });
    }
    catch (error) {
        console.error('[signer-worker]: Encryption failed:', error.message);
        sendResponseAndTerminate({
            type: WorkerResponseType.DERIVE_NEAR_KEY_FAILURE,
            payload: { error: error.message || 'PRF encryption failed' }
        });
    }
}
/////////////////////////////////////
// === KEY EXPORT AND DECRYPTION HANDLER ===
/////////////////////////////////////
/**
 * Handle private key decryption with PRF
 * @param payload - The decryption request payload
 * @param payload.nearAccountId - NEAR account ID associated with the key
 * @param payload.prfOutput - Base64-encoded PRF output from WebAuthn assertion
 * @returns Promise that resolves when decryption is complete
 */
async function handleDecryptPrivateKeyWithPrf(payload) {
    try {
        const { nearAccountId, prfOutput } = payload;
        const encryptedKeyData = await nearKeysDB.getEncryptedKey(nearAccountId);
        if (!encryptedKeyData) {
            throw new Error(`No encrypted key found for account: ${nearAccountId}`);
        }
        // Encrypted data is already raw base64, no prefix stripping needed
        const decryptedPrivateKey = decrypt_private_key_with_prf_as_string(prfOutput, encryptedKeyData.encryptedData, encryptedKeyData.iv);
        sendResponseAndTerminate({
            type: WorkerResponseType.DECRYPTION_SUCCESS,
            payload: {
                decryptedPrivateKey,
                nearAccountId
            }
        });
    }
    catch (error) {
        console.error('[signer-worker]: Decryption failed:', error.message);
        sendResponseAndTerminate({
            type: WorkerResponseType.DECRYPTION_FAILURE,
            payload: { error: error.message || 'PRF decryption failed' }
        });
    }
}
/**
 * Handle checking if user can register (view function)
 * Calls check_can_register_user on the contract to check eligibility
 */
async function handleCheckCanRegisterUser(payload) {
    try {
        const { vrfChallenge, webauthnCredential, contractId, nearRpcUrl } = payload;
        console.log('[signer-worker]: Starting check if user can register (view function)');
        // Validate required parameters
        if (!vrfChallenge || !webauthnCredential || !contractId || !nearRpcUrl) {
            throw new Error('Missing required parameters for registration check: vrfChallenge, webauthnCredential, contractId, nearRpcUrl');
        }
        const { credentialWithoutPrf } = takePrfOutputFromCredential(webauthnCredential);
        console.log('[signer-worker]: Calling check_can_register_user function');
        // Call the WASM function that handles registration eligibility check
        const checkResultJson = await check_can_register_user(contractId, JSON.stringify(vrfChallenge), JSON.stringify(credentialWithoutPrf), nearRpcUrl);
        // Parse the result
        const checkResult = JSON.parse(checkResultJson);
        console.log('[signer-worker]: Registration check result:', {
            verified: checkResult.verified,
            hasRegistrationInfo: !!checkResult.registration_info,
            signedTransactionBorsh: checkResult.signed_transaction_borsh
        });
        sendResponseAndTerminate({
            type: WorkerResponseType.REGISTRATION_SUCCESS,
            payload: {
                verified: checkResult.verified,
                registrationInfo: checkResult.registration_info,
                logs: checkResult.logs,
                signedTransactionBorsh: checkResult.signed_transaction_borsh
            }
        });
    }
    catch (error) {
        console.error('[signer-worker]: Check registration eligibility failed:', error);
        sendResponseAndTerminate({
            type: WorkerResponseType.REGISTRATION_FAILURE,
            payload: { error: error.message || 'Check registration eligibility failed' }
        });
    }
}
/**
 * Handle actual user registration (state-changing function)
 * Calls sign_verify_and_register_user on the contract via send_tx to actually register
 */
async function handleSignVerifyAndRegisterUser(payload) {
    try {
        const { vrfChallenge, webauthnCredential, contractId, signerAccountId, nearAccountId, nonce, blockHashBytes } = payload;
        console.log('[signer-worker]: Starting actual user registration (state-changing function)');
        // Validate required parameters
        if (!vrfChallenge || !webauthnCredential || !contractId || !signerAccountId || !nearAccountId || !nonce || !blockHashBytes) {
            throw new Error('Missing required parameters for actual registration: vrfChallenge, webauthnCredential, contractId, nearRpcUrl, signerAccountId, nearAccountId, nonce, blockHashBytes');
        }
        // Get encrypted key data for the account
        const encryptedKeyData = await nearKeysDB.getEncryptedKey(nearAccountId);
        if (!encryptedKeyData) {
            throw new Error(`No encrypted key found for account: ${nearAccountId}`);
        }
        // Extract PRF output from credential
        const prfOutput = webauthnCredential.clientExtensionResults?.prf?.results?.first;
        if (!prfOutput) {
            throw new Error('PRF output missing from credential.extensionResults: required for secure registration');
        }
        console.log('[signer-worker]: Calling sign_verify_and_register_user function with transaction metadata');
        const { credentialWithoutPrf } = takePrfOutputFromCredential(webauthnCredential);
        // Call the WASM function that handles actual registration (send_tx)
        const registrationResultJson = await sign_verify_and_register_user(contractId, JSON.stringify(vrfChallenge), JSON.stringify(credentialWithoutPrf), signerAccountId, encryptedKeyData.encryptedData, encryptedKeyData.iv, prfOutput, BigInt(nonce), new Uint8Array(blockHashBytes));
        // Parse the result
        const registrationResult = JSON.parse(registrationResultJson);
        console.log('[signer-worker]: Actual registration result:', {
            verified: registrationResult.verified,
            hasRegistrationInfo: !!registrationResult.registration_info,
            signedTransactionBorsh: registrationResult.signed_transaction_borsh
        });
        if (!registrationResult.verified) {
            throw new Error('Actual registration verification failed');
        }
        sendResponseAndTerminate({
            type: WorkerResponseType.REGISTRATION_SUCCESS,
            payload: {
                verified: registrationResult.verified,
                registrationInfo: registrationResult.registration_info,
                logs: registrationResult.logs,
                signedTransactionBorsh: registrationResult.signed_transaction_borsh
            }
        });
    }
    catch (error) {
        console.error('[signer-worker]: Actual user registration failed:', error);
        sendResponseAndTerminate({
            type: WorkerResponseType.REGISTRATION_FAILURE,
            payload: { error: error.message || 'Actual user registration failed' }
        });
    }
}
// === NEW ACTION-BASED TRANSACTION SIGNING HANDLERS ===
/**
 * Enhanced transaction signing with RPC verification and progress updates
 * NOTE: PRF output is extracted from credential in worker for security
 * Sends multiple messages: verification progress, verification complete, signing progress, signing complete
 */
async function handleVerifyAndSignNearTransactionWithActions(payload) {
    try {
        const { nearAccountId, receiverId, actions, nonce, blockHashBytes, contractId, vrfChallenge, webauthnCredential, nearRpcUrl } = payload;
        console.log('[signer-worker]: Starting enhanced verify and sign with pure WASM implementation');
        // Validate required parameters
        if (!nearAccountId || !receiverId || !actions || !nonce || !blockHashBytes) {
            throw new Error('Missing required transaction parameters');
        }
        if (!contractId || !vrfChallenge || !webauthnCredential || !nearRpcUrl) {
            throw new Error('Missing required verification parameters');
        }
        // Get encrypted key data for the account
        const encryptedKeyData = await nearKeysDB.getEncryptedKey(nearAccountId);
        if (!encryptedKeyData) {
            throw new Error(`No encrypted key found for account: ${nearAccountId}`);
        }
        // Extract PRF output using the method you wanted
        if (!webauthnCredential.clientExtensionResults?.prf?.results?.first) {
            throw new Error('PRF output missing from credential.extensionResults: required for secure key decryption');
        }
        console.log('[signer-worker]: PRF output extracted via getClientExtensionResults()');
        let { credentialWithoutPrf, prfOutput } = takePrfOutputFromCredential(webauthnCredential);
        // Call the pure WASM function that handles verification + signing with progress messages
        const _signedTransactionBorsh = await verify_and_sign_near_transaction_with_actions(
        // Authentication
        prfOutput, // Keep as base64 string - will be converted by WASM internally
        encryptedKeyData.encryptedData, encryptedKeyData.iv, 
        // Transaction details
        nearAccountId, receiverId, BigInt(nonce), new Uint8Array(blockHashBytes), actions, // JSON string from signerWorkerManager
        // Verification parameters
        contractId, JSON.stringify(vrfChallenge), JSON.stringify(credentialWithoutPrf), nearRpcUrl);
        console.log('[signer-worker]: Pure WASM verify and sign completed successfully');
        // WASM handles ALL messaging including the final SIGNING_COMPLETE message
        // The function sends::
        // - VERIFICATION_PROGRESS,
        // - VERIFICATION_COMPLETE,
        // - SIGNING_PROGRESS, and
        // - SIGNING_COMPLETE with the final result: _signedTransactionBorsh
        //
        // Do not send any additional messages to avoid duplication
        // The worker will be terminated by the caller after receiving SIGNING_COMPLETE
    }
    catch (error) {
        console.error('[signer-worker]: Enhanced verify and sign failed:', error);
        sendResponseAndTerminate(createErrorResponse(`Enhanced verify and sign failed: ${error.message}`));
    }
}
/**
 * Handle Transfer transaction signing with PRF extracted from credential in worker
 * Enhanced mode with contract verification (PRF extracted in worker for security)
 */
async function handleSignTransferTransaction(payload) {
    try {
        const { nearAccountId, receiverId, depositAmount, nonce, blockHashBytes, 
        // Verification parameters for enhanced mode (all required)
        contractId, vrfChallenge, webauthnCredential, nearRpcUrl } = payload;
        console.log('[signer-worker]: Starting Transfer transaction signing');
        // Validate all required parameters
        const requiredFields = ['nearAccountId', 'receiverId', 'depositAmount', 'nonce'];
        const missingFields = requiredFields.filter(field => !payload[field]);
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields for transfer transaction signing: ${missingFields.join(', ')}`);
        }
        if (!blockHashBytes || blockHashBytes.length === 0) {
            throw new Error('blockHashBytes is required and cannot be empty');
        }
        // All verification parameters are required
        if (!contractId || !vrfChallenge || !webauthnCredential || !nearRpcUrl) {
            throw new Error('All verification parameters are required: contractId, vrfChallenge, webauthnCredential, nearRpcUrl');
        }
        // Get PRF output from serialized credential (extracted in main thread with minimal exposure)
        console.log('[signer-worker]: Getting PRF output from serialized credential');
        const prfOutput = webauthnCredential.clientExtensionResults?.prf?.results?.first;
        if (!prfOutput) {
            throw new Error('PRF output missing from credential.extensionResults: required for secure key decryption');
        }
        console.log('[signer-worker]: PRF output available for secure signing');
        const encryptedKeyData = await nearKeysDB.getEncryptedKey(nearAccountId);
        if (!encryptedKeyData) {
            throw new Error(`No encrypted key found for account: ${nearAccountId}`);
        }
        console.log('[signer-worker]: Using enhanced mode with contract verification');
        // Use the transfer-specific verify+sign WASM function
        const _signedTransactionBorsh = await verify_and_sign_near_transfer_transaction(
        // Authentication
        prfOutput, // Keep as base64 string - WASM function expects string
        encryptedKeyData.encryptedData, encryptedKeyData.iv, 
        // Transaction details
        nearAccountId, receiverId, depositAmount, BigInt(nonce), new Uint8Array(blockHashBytes), 
        // Verification parameters
        contractId, JSON.stringify(vrfChallenge), JSON.stringify(webauthnCredential), nearRpcUrl);
        console.log('[signer-worker]: Enhanced Transfer transaction signing completed successfully');
        // WASM handles ALL messaging including the final SIGNING_COMPLETE message
        // which contains the `signedTransactionBorsh` result
        // We should not send any additional messages to avoid duplication
    }
    catch (error) {
        console.error('[signer-worker]: Transfer transaction signing failed:', error);
        sendResponseAndTerminate({
            type: WorkerResponseType.SIGNATURE_FAILURE,
            payload: { error: error.message || 'Transfer transaction signing failed' }
        });
    }
}
// === COSE KEY EXTRACTION WORKFLOW ===
/**
 * Handle COSE public key extraction from attestation object
 * @param payload - The request payload
 * @param payload.attestationObjectBase64url - Base64URL-encoded WebAuthn attestation object containing the COSE key
 */
async function handleExtractCosePublicKey(payload) {
    try {
        const { attestationObjectBase64url } = payload;
        console.log('[signer-worker]: Extracting COSE public key from attestation object');
        // Call the WASM function to extract COSE public key
        const cosePublicKeyBytes = extract_cose_public_key_from_attestation(attestationObjectBase64url);
        console.log('[signer-worker]: Successfully extracted COSE public key:', cosePublicKeyBytes.length, 'bytes');
        sendResponseAndTerminate({
            type: WorkerResponseType.COSE_KEY_SUCCESS,
            payload: {
                cosePublicKeyBytes: Array.from(cosePublicKeyBytes)
            }
        });
    }
    catch (error) {
        console.error('[signer-worker]: COSE key extraction failed:', error.message);
        sendResponseAndTerminate({
            type: WorkerResponseType.COSE_KEY_FAILURE,
            payload: { error: error.message || 'COSE key extraction failed' }
        });
    }
}
/**
 * Handle COSE key format validation
 * @param payload - The validation request payload
 * @param payload.coseKeyBytes - Array of bytes containing the COSE key to validate
 */
async function handleValidateCoseKey(payload) {
    try {
        const { coseKeyBytes } = payload;
        // Call the WASM function to validate COSE key format
        const validationResult = validate_cose_key_format(new Uint8Array(coseKeyBytes));
        const validationInfo = JSON.parse(validationResult);
        console.log('[signer-worker]: COSE key validation result:', validationInfo);
        sendResponseAndTerminate({
            type: WorkerResponseType.COSE_VALIDATION_SUCCESS,
            payload: {
                valid: validationInfo.valid,
                info: validationInfo
            }
        });
    }
    catch (error) {
        console.error('[signer-worker]: COSE key validation failed:', error.message);
        sendResponseAndTerminate({
            type: WorkerResponseType.COSE_VALIDATION_FAILURE,
            payload: { error: error.message || 'COSE key validation failed' }
        });
    }
}
/////////////////////////////////////
// === PROGRESS MESSAGING ===
/////////////////////////////////////
/**
 * Function called by WASM to send progress messages
 * This is imported into the WASM module as sendProgressMessage
 *
 * Enhanced version that supports logs and creates consistent onProgressEvents output
 *
 * @param messageType - Type of message (e.g., 'VERIFICATION_PROGRESS', 'SIGNING_COMPLETE')
 * @param step - Step identifier (e.g., 'contract_verification', 'transaction_signing')
 * @param message - Human-readable progress message
 * @param data - JSON string containing structured data
 * @param logs - Optional JSON string containing array of log messages
 */
function sendProgressMessage$1(messageType, step, message, data, logs) {
    console.log(`[wasm-progress]: ${messageType} - ${step}: ${message}`);
    // Parse data if provided
    let parsedData = undefined;
    let parsedLogs = [];
    try {
        if (data) {
            parsedData = JSON.parse(data);
            // Extract logs from data if present (for backward compatibility)
            if (parsedData && Array.isArray(parsedData.logs)) {
                parsedLogs = parsedData.logs;
            }
        }
    }
    catch (e) {
        console.warn('[wasm-progress]: Failed to parse data as JSON:', data);
        parsedData = data; // Fallback to raw string
    }
    // Parse logs parameter if provided (takes precedence over logs in data)
    if (logs) {
        try {
            const logsArray = JSON.parse(logs);
            if (Array.isArray(logsArray)) {
                parsedLogs = logsArray;
            }
            else {
                parsedLogs = [logs]; // Single log message
            }
        }
        catch (e) {
            parsedLogs = [logs]; // Fallback to single string
        }
    }
    // Map step strings to numbers for consistency with BaseSSEActionEvent
    const stepMap = {
        [ProgressStep.PREPARATION]: 1,
        [ProgressStep.AUTHENTICATION]: 2,
        [ProgressStep.CONTRACT_VERIFICATION]: 3,
        [ProgressStep.TRANSACTION_SIGNING]: 4,
        [ProgressStep.BROADCASTING]: 5,
        [ProgressStep.VERIFICATION_COMPLETE]: 3,
        [ProgressStep.SIGNING_COMPLETE]: 6,
    };
    // Map step strings to phase names
    const phaseMap = {
        [ProgressStep.PREPARATION]: 'preparation',
        [ProgressStep.AUTHENTICATION]: 'authentication',
        [ProgressStep.CONTRACT_VERIFICATION]: 'contract-verification',
        [ProgressStep.TRANSACTION_SIGNING]: 'transaction-signing',
        [ProgressStep.BROADCASTING]: 'broadcasting',
        [ProgressStep.VERIFICATION_COMPLETE]: 'contract-verification',
        [ProgressStep.SIGNING_COMPLETE]: 'action-complete',
    };
    // Determine status from messageType
    let status = 'progress';
    if (messageType.includes('COMPLETE')) {
        status = parsedData?.success === false ? 'error' : 'success';
    }
    else if (messageType.includes('ERROR') || messageType.includes('FAILURE')) {
        status = 'error';
    }
    // Create consolidated payload that works for both new and legacy callers
    const payload = {
        // New onProgressEvents-compatible fields
        step: stepMap[step] || 1,
        phase: phaseMap[step] || 'preparation',
        status,
        message: message,
        data: parsedData,
        logs: parsedLogs.length > 0 ? parsedLogs : undefined
    };
    // Add legacy fields for backward compatibility
    if (messageType === 'VERIFICATION_COMPLETE' && parsedData) {
        // Legacy callers expect: payload.success, payload.error
        payload.success = parsedData.success;
        payload.error = parsedData.error;
    }
    else if (messageType === 'SIGNING_COMPLETE') {
        // Legacy callers expect: payload.success = true
        payload.success = true;
    }
    // Send single consolidated message
    self.postMessage({
        type: messageType,
        payload: payload
    });
}
//////////////////////////////////////////////////////////////
// Make sendProgressMessage available globally for WASM imports
globalThis.sendProgressMessage = sendProgressMessage$1;
//////////////////////////////////////////////////////////////
// Send response message and terminate worker
function sendResponseAndTerminate(response) {
    self.postMessage(response);
    self.close();
}
function parseWasmResult(resultJson) {
    const result = typeof resultJson === 'string' ? JSON.parse(resultJson) : resultJson;
    const encryptedPrivateKey = typeof result.encryptedPrivateKey === 'string'
        ? JSON.parse(result.encryptedPrivateKey)
        : result.encryptedPrivateKey;
    const finalResult = {
        publicKey: result.publicKey,
        encryptedPrivateKey
    };
    // console.log('[signer-worker]: parseWasmResult - Final result:', finalResult);
    return finalResult;
}
/////////////////////////////////////
// === ERROR HANDLING ===
/////////////////////////////////////
function createErrorResponse(error) {
    return {
        type: WorkerResponseType.ERROR,
        payload: { error }
    };
}
self.onerror = (message, filename, lineno, colno, error) => {
    console.error('[signer-worker]: Global error:', {
        message: typeof message === 'string' ? message : 'Unknown error',
        filename: filename || 'unknown',
        lineno: lineno || 0,
        colno: colno || 0,
        error: error
    });
    console.error('[signer-worker]: Error stack:', error?.stack);
};
self.onunhandledrejection = (event) => {
    console.error('[signer-worker]: Unhandled promise rejection:', event.reason);
    event.preventDefault();
};
/**
 * Handle AddKey transaction with PRF authentication
 */
async function handleAddKeyWithPrf(payload // TODO: Type properly once AddKeyWithPrfRequest is imported
) {
    try {
        console.log('[signer-worker]: AddKey with PRF - WASM function not yet available');
        const result = await add_key_with_prf(payload.prfOutput, payload.encryptedPrivateKeyData, payload.encryptedPrivateKeyIv, payload.signerAccountId, payload.newPublicKey, payload.accessKeyJson, BigInt(payload.nonce), new Uint8Array(payload.blockHashBytes), payload.contractId, JSON.stringify(payload.vrfChallenge), JSON.stringify(payload.webauthnCredential), payload.nearRpcUrl);
        // For now, use the general action-based function as a fallback
        const actions = JSON.stringify([{
                actionType: 'AddKey',
                public_key: payload.newPublicKey,
                access_key: payload.accessKeyJson
            }]);
        await verify_and_sign_near_transaction_with_actions(payload.prfOutput, payload.encryptedPrivateKeyData, payload.encryptedPrivateKeyIv, payload.signerAccountId, payload.signerAccountId, // receiver same as signer for AddKey
        BigInt(payload.nonce), new Uint8Array(payload.blockHashBytes), actions, payload.contractId, JSON.stringify(payload.vrfChallenge), JSON.stringify(payload.webauthnCredential), payload.nearRpcUrl);
    }
    catch (error) {
        console.error('[signer-worker]: AddKey with PRF failed:', error);
        sendResponseAndTerminate({
            type: WorkerResponseType.SIGNATURE_FAILURE,
            payload: { error: error.message || 'AddKey transaction failed' }
        });
    }
}
/**
 * Handle DeleteKey transaction with PRF authentication
 */
async function handleDeleteKeyWithPrf(payload) {
    try {
        console.log('[signer-worker]: DeleteKey with PRF - WASM function not yet available');
        const result = await delete_key_with_prf(payload.prfOutput, payload.encryptedPrivateKeyData, payload.encryptedPrivateKeyIv, payload.signerAccountId, payload.publicKeyToDelete, BigInt(payload.nonce), new Uint8Array(payload.blockHashBytes), payload.contractId, JSON.stringify(payload.vrfChallenge), JSON.stringify(payload.webauthnCredential), payload.nearRpcUrl);
        // For now, use the general action-based function as a fallback
        const actions = JSON.stringify([{
                actionType: 'DeleteKey',
                public_key: payload.publicKeyToDelete
            }]);
        await verify_and_sign_near_transaction_with_actions(payload.prfOutput, payload.encryptedPrivateKeyData, payload.encryptedPrivateKeyIv, payload.signerAccountId, payload.signerAccountId, // receiver same as signer for DeleteKey
        BigInt(payload.nonce), new Uint8Array(payload.blockHashBytes), actions, payload.contractId, JSON.stringify(payload.vrfChallenge), JSON.stringify(payload.webauthnCredential), payload.nearRpcUrl);
    }
    catch (error) {
        console.error('[signer-worker]: DeleteKey with PRF failed:', error);
        sendResponseAndTerminate({
            type: WorkerResponseType.SIGNATURE_FAILURE,
            payload: { error: error.message || 'DeleteKey transaction failed' }
        });
    }
}
/**
 * Handle registration rollback with DeleteAccount (context-restricted)
 */
async function handleRollbackFailedRegistrationWithPrf(payload) {
    try {
        console.log('[signer-worker]: Registration rollback with DeleteAccount - validating caller');
        // SECURITY: Use the caller function name passed from main thread
        // This prevents arbitrary calls to DeleteAccount
        const callerFunction = payload.callerFunction;
        if (!callerFunction || callerFunction === 'unknown') {
            throw new Error('SECURITY: Invalid or missing caller function for DeleteAccount operation');
        }
        console.log(`[signer-worker]: DeleteAccount requested by caller: ${callerFunction}`);
        const result = await rollback_failed_registration_with_prf(payload.prfOutput, payload.encryptedPrivateKeyData, payload.encryptedPrivateKeyIv, payload.signerAccountId, payload.beneficiaryAccountId, BigInt(payload.nonce), new Uint8Array(payload.blockHashBytes), payload.contractId, JSON.stringify(payload.vrfChallenge), JSON.stringify(payload.webauthnCredential), payload.nearRpcUrl, callerFunction // Pass actual caller function for security validation
        );
        // The WASM function handles all messaging including SIGNING_COMPLETE
        console.log('[signer-worker]: Registration rollback completed successfully');
    }
    catch (error) {
        console.error('[signer-worker]: Registration rollback failed:', error);
        // Log security violations with more detail
        if (error.message?.includes('SECURITY VIOLATION')) {
            console.error('[signer-worker]: Unauthorized DeleteAccount attempt:', {
                callerFunction: payload.callerFunction,
                signerAccountId: payload.signerAccountId,
                error: error.message
            });
        }
        sendResponseAndTerminate({
            type: WorkerResponseType.SIGNATURE_FAILURE,
            payload: { error: error.message || 'Registration rollback failed' }
        });
    }
}
//# sourceMappingURL=web3authn-signer.worker.js.map
