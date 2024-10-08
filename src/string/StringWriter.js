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

    /**
     * @returns {string}
     */
    finalize() {
        return this._parts.join("")
    }
}
