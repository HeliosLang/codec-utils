import { hexToBytes } from "./base16.js"

/**
 * @import { BytesLike } from "../index.js"
 */

/**
 * Permissive conversion to bytes
 * @param {BytesLike} b
 * @returns {number[]}
 */
export function toBytes(b) {
    if (Array.isArray(b)) {
        return b
    } else if (typeof b == "string") {
        return hexToBytes(b)
    } else if (typeof b == "object" && "value" in b) {
        return b.value
    } else if ("peekRemaining" in b) {
        return b.peekRemaining()
    } else if (typeof b == "object" && "bytes" in b) {
        return b.bytes
    } else if (b instanceof Uint8Array) {
        return Array.from(b)
    } else {
        throw new Error("not BytesLike")
    }
}
