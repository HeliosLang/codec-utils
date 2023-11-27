/**
 * Converts an unbounded integer into a list of big endian uint8 numbers.
 * Throws an error if `x` is negative.
 * @param {number | bigint} x
 * @returns {number[]}
 */
export function encodeIntBE(x) {
    if (typeof x == "number") {
        return encodeIntBE(BigInt(x))
    } else if (x < 0n) {
        throw new Error("unexpected negative number")
    } else if (x == 0n) {
        return [0]
    } else {
        /**
         * @type {number[]}
         */
        const res = []

        while (x > 0n) {
            res.unshift(Number(x % 256n))

            x = x / 256n
        }

        return res
    }
}

/**
 * Converts a list of big endian uint8 numbers into an unbounded int
 * @param {number[] | Uint8Array} bytes
 * @return {bigint}
 */
export function decodeIntBE(bytes) {
    let p = 1n
    let total = 0n

    for (let i = bytes.length - 1; i >= 0; i--) {
        const b = bytes[i]

        if (b < 0 || b > 255 || b % 1.0 != 0.0) {
            throw new Error(`invalid byte ${b}`)
        }

        total += BigInt(b) * p

        p *= 256n
    }

    return total
}
