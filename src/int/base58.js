/**
 * @import { IntLike } from "../index.js"
 */

const BASE58_ALPHABET =
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

/**
 * @param {string} s
 * @returns {boolean}
 */
export function isValidBase58(s) {
    return s.split("").every((c) => BASE58_ALPHABET.indexOf(c) >= 0)
}

/**
 * @param {string} encoded
 * @returns {bigint}
 */
export function decodeBase58(encoded) {
    let p = 1n
    let total = 0n
    for (let i = encoded.length - 1; i >= 0; i--) {
        const c = encoded[i]
        const code = BASE58_ALPHABET.indexOf(c)

        if (code < 0) {
            throw new Error(`invalid base58 char ${c}`)
        }

        total += BigInt(code) * p

        p *= 58n
    }

    return total
}

/**
 * @param {bigint} x
 * @returns {number[]} numbers in range [0, 58)
 */
function encodeBase58Raw(x) {
    if (x < 0n) {
        throw new Error("can't encode negative number as base58")
    }

    const res = []

    while (x > 0n) {
        res.unshift(Number(x % 58n))

        x = x / 58n
    }

    return res
}

/**
 * @param {IntLike} x
 * @returns {string}
 */
export function encodeBase58(x) {
    if (typeof x == "number") {
        return encodeBase58(BigInt(x))
    } else {
        return encodeBase58Raw(x)
            .map((c) => BASE58_ALPHABET[c])
            .join("")
    }
}
