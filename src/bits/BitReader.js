import { byteToBits, maskBits } from "./ops.js"

/**
 * Read non-byte aligned numbers
 */
export class BitReader {
    /**
     * @type {Uint8Array}
     */
    #view

    /**
     * @type {number}
     */
    #pos

    /**
     * @type {boolean}
     */
    #truncate

    /**
     * @param {number[] | Uint8Array} bytes
     * @param {boolean} truncate if true then read last bits as low part of number, if false pad with zero bits (only applies when trying to read more bits than there are left )
     */
    constructor(bytes, truncate = true) {
        if (bytes instanceof Uint8Array) {
            this.#view = bytes
        } else {
            this.#view = new Uint8Array(bytes)
        }

        this.#pos = 0 // bit position, not byte position
        this.#truncate = truncate
    }

    /**
     * @returns {boolean}
     */
    eof() {
        return Math.trunc(this.#pos / 8) >= this.#view.length
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
        if (this.#pos + n > this.#view.length * 8) {
            const newN = this.#view.length * 8 - this.#pos

            if (!this.#truncate) {
                leftShift = n - newN
            }

            n = newN
        }

        if (n == 0) {
            throw new Error("eof")
        }

        // it is assumed we don't need to be at the byte boundary

        let res = 0
        let i0 = this.#pos

        for (let i = this.#pos + 1; i <= this.#pos + n; i++) {
            if (i % 8 == 0) {
                const nPart = i - i0

                res +=
                    maskBits(this.#view[Math.trunc(i / 8) - 1], i0 % 8, 8) <<
                    (n - nPart)

                i0 = i
            } else if (i == this.#pos + n) {
                res += maskBits(this.#view[Math.trunc(i / 8)], i0 % 8, i % 8)
            }
        }

        this.#pos += n
        return res << leftShift
    }

    /**
     * Moves position to next byte boundary
     * @param {boolean} force - if true then move to next byte boundary if already at byte boundary
     */
    moveToByteBoundary(force = false) {
        if (this.#pos % 8 != 0) {
            let n = 8 - (this.#pos % 8)

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
