/**
 * @import { UInt64 } from "../index.js"
 */

/**
 * @param {{
 *   high: number
 *   low: number
 * } | {
 *   bytes: number[]
 *   littleEndian?: boolean // defaults to true
 * } | {
 *   hex: string
 * }} args
 * @returns {UInt64}
 */
export function makeUInt64(args) {
    if ("high" in args) {
        return new UInt64Impl(args.high, args.low)
    } else if ("bytes" in args) {
        const bytes = args.bytes
        const littleEndian = args.littleEndian ?? true

        /**
         * @type {number}
         */
        let low

        /**
         * @type {number}
         */
        let high

        if (littleEndian) {
            low =
                (bytes[0] << 0) |
                (bytes[1] << 8) |
                (bytes[2] << 16) |
                (bytes[3] << 24)
            high =
                (bytes[4] << 0) |
                (bytes[5] << 8) |
                (bytes[6] << 16) |
                (bytes[7] << 24)
        } else {
            high =
                (bytes[0] << 24) |
                (bytes[1] << 16) |
                (bytes[2] << 8) |
                (bytes[3] << 0)
            low =
                (bytes[4] << 24) |
                (bytes[5] << 16) |
                (bytes[6] << 8) |
                (bytes[7] << 0)
        }

        return new UInt64Impl(high >>> 0, low >>> 0)
    } else if ("hex" in args) {
        const hex = args.hex

        const high = parseInt(hex.slice(0, 8), 16)
        const low = parseInt(hex.slice(8, 16), 16)

        return new UInt64Impl(high >>> 0, low >>> 0)
    } else {
        throw new Error("invalid makeUInt64() arguments")
    }
}

/**
 * Skips the overload-handling overhead of makeUInt64()
 * @param {number} high
 * @param {number} low
 * @returns {UInt64}
 */
export function makeUInt64Fast(high, low) {
    return new UInt64Impl(high, low)
}

/**
 * @implements {UInt64}
 */
class UInt64Impl {
    /**
     * @type {number}
     */
    high

    /**
     * @type {number}
     */
    low

    /**
     * @param {number} high  - uint32 number
     * @param {number} low - uint32 number
     */
    constructor(high, low) {
        this.high = high
        this.low = low
    }

    /**
     * Returns [low[0], low[1], low[2], low[3], high[0], high[1], high[2], high[3]] if littleEndian==true
     * @param {boolean} littleEndian
     * @returns {number[]}
     */
    toBytes(littleEndian = true) {
        const res = [
            0x000000ff & this.low,
            (0x0000ff00 & this.low) >>> 8,
            (0x00ff0000 & this.low) >>> 16,
            (0xff000000 & this.low) >>> 24,
            0x000000ff & this.high,
            (0x0000ff00 & this.high) >>> 8,
            (0x00ff0000 & this.high) >>> 16,
            (0xff000000 & this.high) >>> 24
        ]

        if (!littleEndian) {
            res.reverse()
        }

        return res
    }

    /**
     * @param {UInt64} other
     * @returns {boolean}
     */
    eq(other) {
        return this.high == other.high && this.low == other.low
    }

    /**
     * @returns {UInt64}
     */
    not() {
        return new UInt64Impl(~this.high, ~this.low)
    }

    /**
     * @param {UInt64} other
     * @returns {UInt64}
     */
    and(other) {
        return new UInt64Impl(this.high & other.high, this.low & other.low)
    }

    /**
     * @param {UInt64} other
     * @returns {UInt64}
     */
    xor(other) {
        return new UInt64Impl(
            (this.high ^ other.high) >>> 0,
            (this.low ^ other.low) >>> 0
        )
    }

    /**
     * @param {UInt64} other
     * @returns {UInt64}
     */
    add(other) {
        const low = this.low + other.low
        let high = this.high + other.high

        if (low >= 0x100000000) {
            high += 1
        }

        return new UInt64Impl(high >>> 0, low >>> 0)
    }

    /**
     * @param {number} n
     * @returns {UInt64}
     */
    rotr(n) {
        let h = this.high
        let l = this.low

        if (n == 32) {
            return new UInt64Impl(l, h)
        } else if (n > 32) {
            n -= 32
            ;[h, l] = [l, h]
        }

        return new UInt64Impl(
            ((h >>> n) | (l << (32 - n))) >>> 0,
            ((l >>> n) | (h << (32 - n))) >>> 0
        )
    }

    /**
     * @param {number} n
     * @returns {UInt64}
     */
    shiftr(n) {
        if (n >= 32) {
            return new UInt64Impl(0, this.high >>> (n - 32))
        } else {
            return new UInt64Impl(
                this.high >>> n,
                ((this.low >>> n) | (this.high << (32 - n))) >>> 0
            )
        }
    }
}

/**
 * @type {UInt64}
 */
export const UINT64_ZERO = new UInt64Impl(0, 0)
