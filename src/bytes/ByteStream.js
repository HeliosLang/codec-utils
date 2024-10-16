import { toUint8Array } from "./ByteArrayLike.js"

/**
 * @typedef {import("./ByteArrayLike.js").ByteArrayLike} ByteArrayLike
 */

/**
 * @typedef {{
 *   bytes: Uint8Array
 *   pos: number
 *   copy(): ByteStream
 *   isAtEnd(): boolean
 *   peekOne(): number
 *   peekMany(n: number): number[]
 *   peekRemaining(): number[]
 *   shiftOne(): number
 *   shiftMany(n: number): number[]
 *   shiftRemaining(): number[]
 * }} ByteStream
 */

/**
 * @param {{
 *   bytes: ByteStream | ByteArrayLike
 * } | {
 *   bytes: ByteArrayLike
 *   pos?: number
 * }} args
 * @returns {ByteStream}
 */
export function makeByteStream(args) {
    const bytes = args.bytes

    if (bytes instanceof ByteStreamImpl) {
        return bytes
    } else if (typeof bytes == "string" || Array.isArray(bytes)) {
        return new ByteStreamImpl(toUint8Array(bytes), 0)
    } else if ("pos" in bytes && "bytes" in bytes) {
        return new ByteStreamImpl(toUint8Array(bytes.bytes), bytes.pos)
    } else {
        return new ByteStreamImpl(
            toUint8Array(bytes),
            "pos" in args ? args.pos : 0
        )
    }
}

/**
 * @implements {ByteStream}
 */
class ByteStreamImpl {
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
     * @param {Uint8Array} bytes
     * @param {number} pos
     */
    constructor(bytes, pos = 0) {
        this._bytes = bytes
        this._pos = pos
    }

    /**
     * @type {Uint8Array}
     */
    get bytes() {
        return this._bytes
    }

    /**
     * @type {number}
     */
    get pos() {
        return this._pos
    }

    /**
     * Copy ByteStream so mutations doesn't change original ByteStream
     * @returns {ByteStream}
     */
    copy() {
        return new ByteStreamImpl(this._bytes, this._pos)
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
