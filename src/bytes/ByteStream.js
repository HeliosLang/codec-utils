import { hexToBytes } from "./base16.js"

/**
 * @typedef {string | number[] | {value: number[]} | Uint8Array} ByteStreamLike
 */

export class ByteStream {
    /**
     * @private
     * @type {Uint8Array}
     */
    _bytes

    /**
     * @private
     * @type {number}
     */
    _pos

    /**
     * Not intended for external use
     * @param {ByteStreamLike} bytes
     * @param {number} pos
     */
    constructor(bytes, pos = 0) {
        if (bytes instanceof Uint8Array) {
            this._bytes = bytes
        } else if (typeof bytes == "string") {
            this._bytes = Uint8Array.from(hexToBytes(bytes))
        } else if (typeof bytes == "object" && "value" in bytes) {
            this._bytes = Uint8Array.from(bytes.value)
        } else {
            this._bytes = Uint8Array.from(bytes)
        }

        this._pos = pos
    }

    /**
     * @param {ByteStreamLike | ByteStream} bytes
     * @returns {ByteStream}
     */
    static from(bytes) {
        if (bytes instanceof ByteStream) {
            return bytes
        } else {
            return new ByteStream(bytes)
        }
    }

    /**
     * Copy ByteStream so mutations doesn't change original ByteStream
     * @returns {ByteStream}
     */
    copy() {
        return new ByteStream(this._bytes, this._pos)
    }

    /**
     * @returns {boolean}
     */
    isAtEnd() {
        return this._pos >= this._bytes.length
    }

    /**
     * @returns {number}
     */
    peekOne() {
        if (this._pos < this._bytes.length) {
            return this._bytes[this._pos]
        } else {
            throw new Error("at end")
        }
    }

    /**
     * Throws an error if eof
     * @param {number} n
     * @returns {number[]}
     */
    peekMany(n) {
        if (n < 0) {
            throw new Error("unexpected negative n")
        }

        if (this._pos + n <= this._bytes.length) {
            return Array.from(this._bytes.slice(this._pos, this._pos + n))
        } else {
            throw new Error("at end")
        }
    }

    /**
     * @returns {number[]}
     */
    peekRemaining() {
        return Array.from(this._bytes.slice(this._pos))
    }

    /**
     * @returns {number}
     */
    shiftOne() {
        if (this._pos < this._bytes.length) {
            const b = this._bytes[this._pos]
            this._pos += 1
            return b
        } else {
            throw new Error("at end")
        }
    }

    /**
     * @param {number} n
     * @returns {number[]}
     */
    shiftMany(n) {
        if (n < 0) {
            throw new Error("unexpected negative n")
        }

        if (this._pos + n <= this._bytes.length) {
            const res = Array.from(this._bytes.slice(this._pos, this._pos + n))
            this._pos += n
            return res
        } else {
            throw new Error("at end")
        }
    }

    /**
     * @returns {number[]}
     */
    shiftRemaining() {
        const res = Array.from(this._bytes.slice(this._pos))
        this._pos = this._bytes.length
        return res
    }
}
