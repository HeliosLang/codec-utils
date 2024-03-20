import { hexToBytes } from "./base16.js"

/**
 * @typedef {string | number[] | {bytes: number[]} | Uint8Array} ByteStreamLike
 */

export class ByteStream {
    /**
     * @type {Uint8Array}
     */
    #bytes

    /**
     * @type {number}
     */
    #pos

    /**
     * Not intended for external use
     * @param {ByteStreamLike} bytes
     * @param {number} pos
     */
    constructor(bytes, pos = 0) {
        if (bytes instanceof Uint8Array) {
            this.#bytes = bytes
        } else if (typeof bytes == "string") {
            this.#bytes = Uint8Array.from(hexToBytes(bytes))
        } else if (typeof bytes == "object" && "bytes" in bytes) {
            this.#bytes = Uint8Array.from(bytes.bytes)
        } else {
            this.#bytes = Uint8Array.from(bytes)
        }

        this.#pos = pos
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
        return new ByteStream(this.#bytes, this.#pos)
    }

    /**
     * @returns {boolean}
     */
    isAtEnd() {
        return this.#pos >= this.#bytes.length
    }

    /**
     * @returns {number}
     */
    peekOne() {
        if (this.#pos < this.#bytes.length) {
            return this.#bytes[this.#pos]
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

        if (this.#pos + n <= this.#bytes.length) {
            return Array.from(this.#bytes.slice(this.#pos, this.#pos + n))
        } else {
            throw new Error("at end")
        }
    }

    /**
     * @returns {number[]}
     */
    peekRemaining() {
        return Array.from(this.#bytes.slice(this.#pos))
    }

    /**
     * @returns {number}
     */
    shiftOne() {
        if (this.#pos < this.#bytes.length) {
            const b = this.#bytes[this.#pos]
            this.#pos += 1
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

        if (this.#pos + n <= this.#bytes.length) {
            const res = Array.from(this.#bytes.slice(this.#pos, this.#pos + n))
            this.#pos += n
            return res
        } else {
            throw new Error("at end")
        }
    }

    /**
     * @returns {number[]}
     */
    shiftRemaining() {
        const res = Array.from(this.#bytes.slice(this.#pos))
        this.#pos = this.#bytes.length
        return res
    }
}
