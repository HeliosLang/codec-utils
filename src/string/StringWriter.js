/**
 * @typedef {{
 *   finalize(): string
 *   write(part: string): StringWriterI
 *   writeLine(line: string): StringWriterI
 * }} StringWriterI
 */

/**
 * @implements {StringWriterI}
 */
export class StringWriter {
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
