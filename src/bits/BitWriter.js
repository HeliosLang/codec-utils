import { padBits } from "./ops.js"

/**
 * BitWriter turns a string of '0's and '1's into a list of bytes.
 * Finalization pads the bits using '0*1' if not yet aligned with the byte boundary.
 */
export class BitWriter {
    /**
     * Concatenated and padded upon finalization
     * @private
     * @type {string[]}
     */
    _parts

    /**
     * Number of bits written so far
     * @private
     * @type {number}
     */
    _n

    constructor() {
        this._parts = []
        this._n = 0
    }

    /**
     * @type {number}
     */
    get length() {
        return this._n
    }

    /**
     * Write a string of '0's and '1's to the BitWriter.
     * Returns the BitWriter to enable chaining
     * @param {string} bitChars
     * @returns {BitWriter}
     */
    writeBits(bitChars) {
        for (let c of bitChars) {
            if (c != "0" && c != "1") {
                throw new Error(
                    `bit string contains invalid chars: ${bitChars}`
                )
            }
        }

        this._parts.push(bitChars)
        this._n += bitChars.length

        return this
    }

    /**
     * Returns the BitWriter to enable chaining
     * @param {number} byte
     * @returns {BitWriter}
     */
    writeByte(byte) {
        if (byte < 0 || byte > 255) {
            throw new Error("invalid byte")
        }

        this.writeBits(padBits(byte.toString(2), 8))

        return this
    }

    /**
     * Add padding to the BitWriter in order to align with the byte boundary.
     * If 'force == true' then 8 bits are added if the BitWriter is already aligned.
     * @param {boolean} force
     */
    padToByteBoundary(force = false) {
        let nPad = 0
        if (this._n % 8 != 0) {
            nPad = 8 - (this._n % 8)
        } else if (force) {
            nPad = 8
        }

        if (nPad != 0) {
            let padding = new Array(nPad).fill("0")
            padding[nPad - 1] = "1"

            this._parts.push(padding.join(""))

            this._n += nPad
        }
    }

    /**
     * Pop n bits of the end
     * @param {number} n
     * @returns {string}
     */
    pop(n) {
        if (n > this._n) {
            throw new Error(
                `too many bits to pop, only have ${this._n} bits, but want ${n}`
            )
        }

        const n0 = n

        /**
         * @type {string[]}
         */
        const parts = []

        while (n > 0) {
            const last = this._parts.pop()

            if (last) {
                if (last.length <= n) {
                    parts.unshift(last)
                    n -= last.length
                } else {
                    parts.unshift(last.slice(last.length - n))
                    this._parts.push(last.slice(0, last.length - n))
                    n = 0
                }
            }
        }

        this._n -= n0

        const bits = parts.join("")

        if (bits.length != n0) {
            throw new Error("unexpected")
        }

        return bits
    }

    /**
     * Pads the BitWriter to align with the byte boundary and returns the resulting bytes.
     * @param {boolean} force - force padding (will add one byte if already aligned)
     * @returns {number[]}
     */
    finalize(force = true) {
        this.padToByteBoundary(force)

        let chars = this._parts.join("")

        let bytes = []

        for (let i = 0; i < chars.length; i += 8) {
            let byteChars = chars.slice(i, i + 8)
            let byte = parseInt(byteChars, 2)

            bytes.push(byte)
        }

        return bytes
    }
}
