import { encodeIntBE } from "../int/be.js"

/**
 * @param {number[] | Uint8Array} a
 * @param {number[] | Uint8Array} b
 * @param {boolean} shortestFirst defaults to false (strictly lexicographic comparison)
 * @returns {-1 | 0 | 1} -1 if a < b, 0 if a == b, 1 if a > b
 */
export function compareBytes(a, b, shortestFirst = false) {
    const na = a.length
    const nb = b.length

    if (shortestFirst && na != nb) {
        return na < nb ? -1 : 1
    }

    for (let i = 0; i < Math.min(na, nb); i++) {
        if (a[i] < b[i]) {
            return -1
        } else if (a[i] > b[i]) {
            return 1
        }
    }

    if (na != nb) {
        return na < nb ? -1 : 1
    } else {
        return 0
    }
}

/**
 * Used to create dummy hashes for testing
 * @param {number} n
 * @param {number} seed
 * @returns {number[]}
 */
export function dummyBytes(n, seed = 0) {
    return padBytes(encodeIntBE(seed), n).slice(0, n)
}

/**
 * @param {number[] | Uint8Array} a
 * @param {number[] | Uint8Array} b
 * @returns {boolean}
 */
export function equalsBytes(a, b) {
    return compareBytes(a, b) == 0
}

/**
 * Pad by appending zeroes.
 * If `n < nCurrent`, pad to next multiple of `n`.
 * @param {number[]} bytes
 * @param {number} n
 * @returns {number[]}
 */
export function padBytes(bytes, n) {
    const nBytes = bytes.length

    if (nBytes == n) {
        return bytes
    } else if (n <= 0) {
        throw new Error(`invalid pad length (must be > 0, got ${n})`)
    } else if (nBytes % n != 0 || nBytes == 0) {
        // padded to multiple of n
        const nPad = n - (nBytes % n)

        bytes = bytes.concat(new Array(nPad).fill(0))
    }

    return bytes
}

/**
 * Pad by prepending zeroes.
 * Throws an error if bytes.length > n
 * @param {number[]} bytes
 * @param {number} n
 * @returns {number[]}
 */
export function prepadBytes(bytes, n) {
    const nBytes = bytes.length

    if (nBytes == n) {
        return bytes
    } else if (n <= 0) {
        throw new Error(`invalid prepad length (must be > 0, got ${n})`)
    } else if (nBytes > n) {
        throw new Error(
            `padding goal length smaller than bytes length (${n} < ${nBytes})`
        )
    } else {
        const nPad = n - nBytes

        return new Array(nPad).fill(0).concat(bytes)
    }
}
