import { maskBits } from "./ops.js"

/**
 * Read non-byte aligned numbers
 */
export class BitReader {
    /**
     * @private
     * @type {Uint8Array}
     */
    _view

    /**
     * bit position, not byte position
     * @private
     * @type {number}
     */
    _pos

    /**
     * If true then read last bits as low part of number, if false pad with zero bits (only applies when trying to read more bits than there are left )
     * @private
     * @type {boolean}
     */
    _truncate

    /**
     * @param {number[] | Uint8Array} bytes
     * @param {boolean} truncate determines behavior when reading too many bits
     */
    constructor(bytes, truncate = true) {
        if (bytes instanceof Uint8Array) {
            this._view = bytes
        } else {
            this._view = new Uint8Array(bytes)
        }

        this._pos = 0
        this._truncate = truncate
    }

    /**
     * @returns {boolean}
     */
    eof() {
        return Math.trunc(this._pos / 8) >= this._view.length
    }

    /**
     * Reads a number of bits (<= 8) and returns the result as an unsigned number
     * @param {number} n - number of bits to read
     * @returns {number}
     */
    readBits(n) {
        if (n > 8) {
            throw new Error("reading more than 1 byte")
        }

        let leftShift = 0
        if (this._pos + n > this._view.length * 8) {
            const newN = this._view.length * 8 - this._pos

            if (!this._truncate) {
                leftShift = n - newN
            }

            n = newN
        }

        if (n == 0) {
            throw new Error("eof")
        }

        // it is assumed we don't need to be at the byte boundary

        let res = 0
        let i0 = this._pos

        for (let i = this._pos + 1; i <= this._pos + n; i++) {
            if (i % 8 == 0) {
                const nPart = i - i0

                res +=
                    maskBits(this._view[Math.trunc(i / 8) - 1], i0 % 8, 8) <<
                    (n - nPart)

                i0 = i
            } else if (i == this._pos + n) {
                res += maskBits(this._view[Math.trunc(i / 8)], i0 % 8, i % 8)
            }
        }

        this._pos += n
        return res << leftShift
    }

    /**
     * Moves position to next byte boundary
     * @param {boolean} force - if true then move to next byte boundary if already at byte boundary
     */
    moveToByteBoundary(force = false) {
        if (this._pos % 8 != 0) {
            let n = 8 - (this._pos % 8)

            void this.readBits(n)
        } else if (force) {
            this.readBits(8)
        }
    }

    /**
     * Reads 8 bits
     * @returns {number}
     */
    readByte() {
        return this.readBits(8)
    }
}
