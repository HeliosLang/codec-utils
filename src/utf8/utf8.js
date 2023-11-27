/**
 * Tests if a uint8 array is valid utf8 encoding.
 * @param {number[]} bytes
 * @returns {boolean}
 */
export function isValidUtf8(bytes) {
    if (bytes.some((b) => b < 0 || b > 255)) {
        return false
    }

    try {
        decodeUtf8(bytes)

        return true
    } catch (e) {
        return false
    }
}

/**
 * Encodes a string into a list of uint8 bytes using UTF-8 encoding.
 * @example
 * utf8ToBytes("hello world") == [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
 * @param {string} str
 * @returns {number[]}
 */
export function encodeUtf8(str) {
    return Array.from(new TextEncoder().encode(str))
}

/**
 * Decodes a list of uint8 bytes into a string using UTF-8 encoding.
 * @example
 * bytesToUtf8([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]) == "hello world"
 * @param {number[]} bytes
 * @returns {string}
 */
export function decodeUtf8(bytes) {
    return new TextDecoder("utf-8", { fatal: true }).decode(
        new Uint8Array(bytes).buffer
    )
}
