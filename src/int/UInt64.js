/**
 * @typedef {{
 *   high: number
 *   low: number
 *   add(other: UInt64I): UInt64I
 *   and(other: UInt64I): UInt64I
 *   xor(other: UInt64I): UInt64I
 *   eq(other: UInt64I): boolean
 *   not(): UInt64I
 *   rotr(n: number): UInt64I
 *   shiftr(n: number): UInt64I
 *   toBytes(littleEndian?: boolean): number[]
 * }} UInt64I
 */

/**
 * UInt64 number (represented by 2 UInt32 numbers)
 * If performance is very important: create a first prototype of your algo using this class, and then inline all the operations (eg. how it was done for sha2_512)
 * @implements {UInt64I}
 */
export class UInt64 {
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
     * @param {number[]} bytes - 8 uint8 numbers
     * @param {boolean} littleEndian
     * @returns {UInt64}
     */
    static fromBytes(bytes, littleEndian = true) {
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

        return new UInt64(high >>> 0, low >>> 0)
    }

    /**
     * @param {string} str
     * @returns {UInt64}
     */
    static fromString(str) {
        const high = parseInt(str.slice(0, 8), 16)
        const low = parseInt(str.slice(8, 16), 16)

        return new UInt64(high >>> 0, low >>> 0)
    }

    /**
     * @returns {UInt64}
     */
    static zero() {
        return new UInt64(0, 0)
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
     * @param {UInt64I} other
     * @returns {boolean}
     */
    eq(other) {
        return this.high == other.high && this.low == other.low
    }

    /**
     * @returns {UInt64}
     */
    not() {
        return new UInt64(~this.high, ~this.low)
    }

    /**
     * @param {UInt64I} other
     * @returns {UInt64}
     */
    and(other) {
        return new UInt64(this.high & other.high, this.low & other.low)
    }

    /**
     * @param {UInt64I} other
     * @returns {UInt64}
     */
    xor(other) {
        return new UInt64(
            (this.high ^ other.high) >>> 0,
            (this.low ^ other.low) >>> 0
        )
    }

    /**
     * @param {UInt64I} other
     * @returns {UInt64}
     */
    add(other) {
        const low = this.low + other.low
        let high = this.high + other.high

        if (low >= 0x100000000) {
            high += 1
        }

        return new UInt64(high >>> 0, low >>> 0)
    }

    /**
     * @param {number} n
     * @returns {UInt64}
     */
    rotr(n) {
        let h = this.high
        let l = this.low

        if (n == 32) {
            return new UInt64(l, h)
        } else if (n > 32) {
            n -= 32
            ;[h, l] = [l, h]
        }

        return new UInt64(
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
            return new UInt64(0, this.high >>> (n - 32))
        } else {
            return new UInt64(
                this.high >>> n,
                ((this.low >>> n) | (this.high << (32 - n))) >>> 0
            )
        }
    }
}
