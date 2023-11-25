/**
 * Encodes a string into a list of uint8 bytes using UTF-8 encoding.
 * @example
 * utf8ToBytes("hello world") == [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
 * @param {string} str
 * @returns {number[]}
 */
export function utf8ToBytes(str) {
    return Array.from(new TextEncoder().encode(str))
}

/**
 * Decodes a list of uint8 bytes into a string using UTF-8 encoding.
 * @example
 * bytesToUtf8([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]) == "hello world"
 * @param {number[]} bytes
 * @returns {string}
 */
export function bytesToUtf8(bytes) {
    return new TextDecoder("utf-8", { fatal: true }).decode(
        new Uint8Array(bytes).buffer
    )
}
