import { hexToBytes } from "./base16.js"
import { ByteStream } from "./ByteStream.js"

/**
 * @typedef {string | number[] | {bytes: number[]} | ByteStream} ByteArrayLike
 */

/**
 * Permissive conversion to bytes
 * @param {ByteArrayLike} b
 * @returns {number[]}
 */
export function toBytes(b) {
    if (Array.isArray(b)) {
        return b
    } else if (typeof b == "string") {
        return hexToBytes(b)
    } else if (typeof b == "object" && "bytes" in b) {
        return b.bytes
    } else if (b instanceof ByteStream) {
        return b.peekRemaining()
    } else {
        throw new Error("not ByteArrayLike")
    }
}
