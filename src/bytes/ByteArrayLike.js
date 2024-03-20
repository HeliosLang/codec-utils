import { hexToBytes } from "./base16.js"
import { ByteStream } from "./ByteStream.js"

/**
 * @typedef {import("./ByteStream.js").ByteStreamLike} ByteStreamLike
 */
/**
 * @typedef {ByteStreamLike | ByteStream} ByteArrayLike
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
    } else if (b instanceof Uint8Array) {
        return Array.from(b)
    } else {
        throw new Error("not ByteArrayLike")
    }
}
