import { toUint8Array } from "./ByteArrayLike.js"

/**
 * @import { ByteArrayLike, ByteStream } from "../index.js"
 */

/**
 * @param {ByteStream |
 *   ByteArrayLike | {
 *      bytes: ByteStream | ByteArrayLike
 *   }} args
 * @returns {ByteStream}
 */
export function makeByteStream(args) {
    if (args instanceof ByteStreamImpl) {
        // most common case
        return args
    } else if (typeof args == "string" || Array.isArray(args)) {
        return new ByteStreamImpl(toUint8Array(args), 0)
    } else if ("pos" in args && "bytes" in args) {
        return args
    } else if ("value" in args) {
        return new ByteStreamImpl(toUint8Array(args))
    } else if (args instanceof Uint8Array) {
        return new ByteStreamImpl(args)
    }

    const bytes = args.bytes

    if (bytes instanceof ByteStreamImpl) {
        return bytes
    } else if (typeof bytes == "string" || Array.isArray(bytes)) {
        return new ByteStreamImpl(toUint8Array(bytes), 0)
    } else if ("pos" in bytes && "bytes" in bytes) {
        return bytes
    } else {
        return new ByteStreamImpl(toUint8Array(bytes), 0)
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
