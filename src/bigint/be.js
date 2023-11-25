/**
 * Converts an unbounded integer into a list of big endian uint8 numbers
 * @param {bigint} x
 * @returns {number[]}
 */
export function intToBytesBE(x) {
    if (x == 0n) {
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
 * @param {number[]} b
 * @return {bigint}
 */
export function bytesToIntBE(b) {
    let s = 1n
    let total = 0n

    let last = b.pop()

    while (last !== undefined) {
        total += BigInt(last) * s

        s *= 256n

        last = b.pop()
    }

    return total
}
