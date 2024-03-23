const SPECIAL_EXPONENT = 31
const LARGEST_SIGNIFICAND = 1024
const POW2 = [
    0.00006103515625, // 2^-14
    0.0001220703125, // 2^-13
    0.000244140625, // 2^-12
    0.00048828125, // 2^-11
    0.0009765625, // 2^-10
    0.001953125, // 2^-9
    0.00390625, // 2^-8
    0.0078125, // 2^-7
    0.015625, // 2^-6
    0.03125, // 2^-5
    0.0625, // 2^-4
    0.125, // 2^-3
    0.25, // 2^-2
    0.5, // 2^-1
    1, // 2^0
    2, // 2^1
    4, // 2^2
    8, // 2^3
    16, // 2^4
    32, // 2^5
    64, // 2^6
    128, // 2^7
    256, // 2^8
    512, // 2^9
    1024, // 2^10
    2048, // 2^11
    4096, // 2^12
    8192, // 2^13
    16384, // 2^14
    32768, // 2^15
    65536 // 2^16
]

/**
 * Custom IEEE 754 Float16 implementation, not fast, but easy to audit
 * @param {number[]} bytes
 * @returns {number}
 */
export function decodeFloat16(bytes) {
    if (bytes.length != 2) {
        throw new Error(
            `expected 2 bytes for IEEE 754 encoded Float16 number, got ${bytes.length}`
        )
    }

    const sign = bytes[0] >> 7 ? -1 : 1
    const exponent = (bytes[0] & 0b01111100) >> 2
    const significand = (bytes[0] & 0b00000011) * 256 + bytes[1]

    if (exponent === 0) {
        if (significand == 0) {
            return sign < 0 ? -0 : 0
        } else {
            return (sign * POW2[0] * significand) / LARGEST_SIGNIFICAND
        }
    } else if (exponent === SPECIAL_EXPONENT) {
        if (significand == 0) {
            return sign < 0
                ? Number.NEGATIVE_INFINITY
                : Number.POSITIVE_INFINITY
        } else {
            return Number.NaN
        }
    } else {
        return (
            sign *
            POW2[exponent - 1] *
            (1.0 + significand / LARGEST_SIGNIFICAND)
        )
    }
}

/**
 * Custom IEEE 754 Float16 implementation, not fast, but easy to audit
 * @param {number} f
 * @returns {number[]}
 */
export function encodeFloat16(f) {
    if (Object.is(f, 0)) {
        return [0, 0]
    } else if (Object.is(f, -0)) {
        return [0x80, 0]
    } else if (f === Number.NEGATIVE_INFINITY) {
        return [0xfc, 0]
    } else if (f === Number.POSITIVE_INFINITY) {
        return [0x7c, 0]
    } else if (Number.isNaN(f)) {
        return [0x7c, 1]
    } else {
        const sign = Math.sign(f)
        const signBit = sign > 0 ? 0 : 0b10000000
        f = Math.abs(f)

        if (f < POW2[0]) {
            const significand = Math.floor((f / POW2[0]) * LARGEST_SIGNIFICAND)

            return [signBit | (significand >> 8), significand & 0xff]
        } else {
            const unbiasedExponent = Math.floor(Math.log2(f))
            const exponent = (unbiasedExponent + 15) & 0b00011111

            const significand = Math.round(
                (f / POW2[exponent - 1] - 1) * LARGEST_SIGNIFICAND
            )

            return [
                signBit | (exponent << 2) | (significand >> 8),
                significand & 0xff
            ]
        }
    }
}
