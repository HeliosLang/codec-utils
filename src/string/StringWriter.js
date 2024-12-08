/**
 * @import { StringWriter } from "../index.js"
 */

/**
 * @param {{}} _args
 * @returns {StringWriter}
 */
export function makeStringWriter(_args = {}) {
    return new StringWriterImpl()
}

/**
 * @implements {StringWriter}
 */
class StringWriterImpl {
    /**
     * @private
     * @readonly
     * @type {string[]}
     */
    _parts

    constructor() {
        this._parts = []
    }

    /**
     * @returns {string}
     */
    finalize() {
        return this._parts.join("")
    }

    /**
     * @param {string} part
     * @returns {StringWriter}
     */
    write(part) {
        this._parts.push(part)
        return this
    }

    /**
     * @param {string} line
     * @returns {StringWriter}
     */
    writeLine(line) {
        this._parts.push(`${line}\n`)
        return this
    }
}
