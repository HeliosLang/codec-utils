import { padBytes } from "../bytes/ops.js"
import { encodeIntBE, decodeIntBE } from "./be.js"

/**
 * Little Endian bytes to bigint (doesnt need to be 32 bytes long)
 * @param {number[] | Uint8Array} bytes
 * @returns {bigint}
 */
export function decodeIntLE(bytes) {
    return decodeIntBE(Array.from(bytes).reverse())
}

/**
 * Little Endian 32 bytes
 * @param {number | bigint} x
 * @returns {number[]}
 */
export function encodeIntLE32(x) {
    if (typeof x == "number") {
        return encodeIntLE32(BigInt(x))
    } else {
        return padBytes(encodeIntBE(x).reverse(), 32)
    }
}
