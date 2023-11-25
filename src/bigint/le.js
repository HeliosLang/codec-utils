import { intToBytesBE, bytesToIntBE } from "./be.js"

/**
 * Little Endian bytes to bigint (doesnt need to be 32 bytes long)
 * @param {number[]} b
 * @returns {bigint}
 */
export function bytesToIntLE(b) {
    return bytesToIntBE(b.slice().reverse())
}

/**
 * Little Endian 32 bytes
 * @param {bigint} x
 * @returns {number[]}
 */
export function intToBytesLE32(x) {
    const bytes = intToBytesBE(x).reverse()

    while (bytes.length < 32) {
        bytes.push(0)
    }

    return bytes
}
