import { BitReader, BitWriter, padBits } from "../bits/index.js"

/**
 * In the first case the encoding operates without padding (and encoded strings with padding are invalid)
 * In the second case the padding character is specified. Strict defaults to false in which case unpadded encoded strings are also valid
 * @typedef {{
 *   alphabet?: string
 * } | {
 *   alphabet?: string
 *   padChar: string
 *   strict?: boolean
 * }} Base64Props
 */

export class Base64 {
    /**
     * @readonly
     * @type {string}
     */
    alphabet

    /**
     * @readonly
     * @type {string}
     */
    padChar

    /**
     * @readonly
     * @type {boolean}
     */
    strict

    /**
     * @param {Base64Props} props
     */
    constructor(props = Base64.DEFAULT_PROPS) {
        const alphabet = props.alphabet ?? Base64.DEFAULT_ALPHABET
        const padChar = "padChar" in props ? props.padChar : ""
        const strict = "strict" in props ? props.strict ?? false : false

        if (alphabet.length != 64) {
            throw new Error(
                `expected base64 alphabet with 64 characters, got ${alphabet.length} characters`
            )
        }

        if (new Set(alphabet.split("")).size != 64) {
            throw new Error(
                "invalid base64 alphabet, doesn't consist of 64 unique characters"
            )
        }

        if ("padChar" in props && padChar.length != 1) {
            throw new Error("base64 padChar can only be one character")
        }

        if ("padChar" in props && alphabet.indexOf(padChar) != -1) {
            throw new Error("base64 padChar can't be part of alphabet")
        }

        this.alphabet = alphabet
        this.padChar = padChar
        this.strict = strict
    }

    /**
     * Rfc 4648
     * @type {string}
     */
    static get DEFAULT_ALPHABET() {
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    }

    /**
     * Rfc 4648
     * @type {string}
     */
    static get DEFAULT_PAD_CHAR() {
        return "="
    }

    /**
     * Rfc 4648
     * @type {Base64Props}
     */
    static get DEFAULT_PROPS() {
        return {
            alphabet: Base64.DEFAULT_ALPHABET,
            padChar: Base64.DEFAULT_PAD_CHAR,
            strict: false
        }
    }

    /**
     * Checks if base64 encoding is valid.
     * @param {string} encoded
     */
    isValid(encoded) {
        let n = encoded.length

        if (
            this.padChar.length == 1 &&
            (this.strict || encoded.endsWith(this.padChar))
        ) {
            if (encoded.length % 4 != 0) {
                return false
            }

            const iPad = encoded.indexOf(this.padChar)

            for (let i = iPad + 1; i < n; i++) {
                if (encoded.at(i) != this.padChar) {
                    return false
                }
            }

            // only 1 or 2 pad chars are possible
            if (iPad < n - 2) {
                return false
            }

            encoded = encoded.slice(0, iPad)
            n = iPad
        }

        return encoded.split("").every((c, i) => {
            const code = this.alphabet.indexOf(c)

            if (code < 0) {
                return false
            }

            if (i == n - 1) {
                const nBitsExtra = n * 6 - Math.floor((n * 6) / 8) * 8

                return (((1 << nBitsExtra) - 1) & code) == 0
            } else {
                return true
            }
        })
    }

    /**
     * @param {number[]} bytes
     * @returns {number[]} list of numbers between 0 and 64
     */
    encodeRaw(bytes) {
        const result = []

        const reader = new BitReader(bytes, false)

        while (!reader.eof()) {
            result.push(reader.readBits(6))
        }

        return result
    }

    /**
     * Trims the padding, asserting it is correctly formed
     * @private
     * @param {string} encoded
     * @returns {string}
     */
    trimPadding(encoded) {
        if (this.padChar.length == 1) {
            let n = encoded.length

            while (n >= 0 && encoded.at(n - 1) == this.padChar) {
                n -= 1
            }

            // length alignment is only checked if there are some padding characters at the end
            if (
                (n < encoded.length || this.strict) &&
                encoded.length % 4 != 0
            ) {
                throw new Error("invalid length (expected multiple of 4)")
            }

            const nPad = encoded.length - n

            if (nPad > 2) {
                throw new Error("too many base64 padding characters")
            }

            return encoded.slice(0, n)
        } else {
            return encoded
        }
    }

    /**
     * @param {string} encoded
     * @returns {number[]} numbers between 0 and 64
     */
    decodeRaw(encoded) {
        encoded = this.trimPadding(encoded)

        const n = encoded.length

        /**
         * @type {number[]}
         */
        const res = []

        for (let i = 0; i < n; i++) {
            const c = encoded[i]

            if (c == this.padChar) {
                throw new Error("unexpected base64 padding character")
            }

            const code = this.alphabet.indexOf(c)

            if (code < 0) {
                throw new Error(`invalid base64 character ${c}`)
            } else if (i == n - 1) {
                const nBitsExtra = n * 6 - Math.floor((n * 6) / 8) * 8

                if ((((1 << nBitsExtra) - 1) & code) != 0) {
                    throw new Error(`invalid base64 final character`)
                }
            }

            res.push(code)
        }

        return res
    }

    /**
     * @param {string} encoded
     * @returns {number[]}
     */
    decode(encoded) {
        const writer = new BitWriter()

        const raw = this.decodeRaw(encoded)

        const n = raw.length

        raw.forEach((code, i) => {
            if (i == n - 1) {
                // last, make sure we align to byte

                const nCut = n * 6 - 8 * Math.floor((n * 6) / 8)

                const bits = padBits(code.toString(2), 6)

                writer.writeBits(bits.slice(0, 6 - nCut))
            } else {
                const bits = padBits(code.toString(2), 6)

                writer.writeBits(bits)
            }
        })

        const result = writer.finalize(false)

        return result
    }

    /**
     * @param {number[]} bytes
     * @returns {string}
     */
    encode(bytes) {
        const s = this.encodeRaw(bytes)
            .map((c) => this.alphabet[c])
            .join("")

        const n = s.length

        if (n % 4 != 0 && this.padChar != "") {
            return s + new Array(4 - (n % 4)).fill(this.padChar).join("")
        } else {
            return s
        }
    }
}

/**
 * Not exported. Use `new Base64()` instead
 */
const DEFAULT_BASE64_CODEC = new Base64()

/**
 * Checks if base64 encoding is correct.
 * @param {string} encoded
 * @returns {boolean}
 */
export function isValidBase64(encoded) {
    return DEFAULT_BASE64_CODEC.isValid(encoded)
}

/**
 * @param {string} encoded
 * @returns {number[]}
 */
export function decodeBase64(encoded) {
    return DEFAULT_BASE64_CODEC.decode(encoded)
}

/**
 * @param {number[]} bytes
 * @returns {string}
 */
export function encodeBase64(bytes) {
    return DEFAULT_BASE64_CODEC.encode(bytes)
}
