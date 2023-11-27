/**
 * @param {number | bigint} x
 * @returns {bigint}
 */
export function encodeZigZag(x) {
    if (typeof x == "number") {
        return encodeZigZag(BigInt(x))
    } else if (x < 0n) {
        return -x * 2n - 1n
    } else {
        return x * 2n
    }
}

/**
 * @param {number | bigint} x
 * @returns {bigint}
 */
export function decodeZigZag(x) {
    if (typeof x == "number") {
        return decodeZigZag(BigInt(x))
    } else if (x < 0n) {
        throw new Error("invalid zigzag encoding")
    } else if (x % 2n == 0n) {
        return x / 2n
    } else {
        return -(x + 1n) / 2n
    }
}
