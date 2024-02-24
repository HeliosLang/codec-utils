/**
 * Converts a 8 bit integer number into a bit string with an optional "0b" prefix.
 * The result is padded with leading zeroes to become 'n' chars long ('2 + n' chars long if you count the "0b" prefix).
 * @example
 * byteToBits(7) == "0b00000111"
 * @param {number} b
 * @param {number} n
 * @param {boolean} prefix
 * @returns {string}
 */
export function byteToBits(b, n = 8, prefix = true) {
    if (b < 0 || b > 255) {
        throw new Error("invalid byte")
    }

    const bits = b.toString(2)

    if (n < bits.length) {
        throw new Error("n is smaller than the number of bits")
    }

    const s = padBits(bits, n)

    if (prefix) {
        return "0b" + s
    } else {
        return s
    }
}

/**
 * Masks bits of `b` by setting bits outside the range `[i0, i1)` to 0.
 * `b` is an 8 bit integer (i.e. number between 0 and 255).
 * The return value is also an 8 bit integer, shifted right by `i1`.
 * @example
 * maskBits(0b11111111, 1, 4) == 0b0111 // (i.e. 7)
 * @param {number} b
 * @param {number} i0
 * @param {number} i1
 * @returns {number}
 */
export function maskBits(b, i0, i1) {
    if (i0 >= i1 || i0 < 0 || i0 > 7 || i1 > 8 || b < 0 || b > 255) {
        throw new Error("unexpected")
    }

    const mask_bits = [
        0b11111111, 0b01111111, 0b00111111, 0b00011111, 0b00001111, 0b00000111,
        0b00000011, 0b00000001
    ]

    return (b & mask_bits[i0]) >> (8 - i1)
}

/**
 * Prepends zeroes to a bit-string so that 'result.length == n'.
 * If `n < nCurrent`, pad to next multiple of `n`.
 * @example
 * padBits("1111", 8) == "00001111"
 * @param {string} bits
 * @param {number} n
 * @returns {string}
 */
export function padBits(bits, n) {
    const nBits = bits.length

    if (nBits == n) {
        return bits
    } else if (n <= 0) {
        throw new Error(`invalid pad length (must be > 0, got ${n})`)
    } else if (nBits % n != 0) {
        // padded to multiple of n
        const nPad = n - (nBits % n)

        bits = new Array(nPad).fill("0").join("") + bits
    }

    return bits
}

/**
 * @param {number[]} bytes
 * @param {number} i - bit index
 * @returns {number} - 0 or 1
 */
export function getBit(bytes, i) {
    return (bytes[Math.floor(i / 8)] >> i % 8) & 1
}
