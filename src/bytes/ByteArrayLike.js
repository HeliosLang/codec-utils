import { hexToBytes } from "./base16.js"

/**
 * @typedef {string | number[] | {value: number[]} | {bytes: number[]} | Uint8Array} ByteArrayLike
 */

/**
 * @param {ByteArrayLike} bytes
 * @returns {Uint8Array}
 */
export function toUint8Array(bytes) {
    if (bytes instanceof Uint8Array) {
        return bytes
    } else if (typeof bytes == "string") {
        return Uint8Array.from(hexToBytes(bytes))
    } else if (typeof bytes == "object" && "value" in bytes) {
        return Uint8Array.from(bytes.value)
    } else if (typeof bytes == "object" && "bytes" in bytes) {
        return Uint8Array.from(bytes.bytes)
    } else {
        return Uint8Array.from(bytes)
    }
}
