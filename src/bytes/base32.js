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
 * }} Base32Props
 */

/**
 * @typedef {{
 *   alphabet: string
 *   padChar: string
 *   strict: boolean
 *   decode(encoded: string): number[]
 *   decodeRaw(encoded: string): number[]
 *   encode(bytes: number[]): string
 *   encodeRaw(bytes: number[]): number[]
 *   isValid(encoded: string): boolean
 * }} Base32I
 */

/**
 * @implements {Base32I}
 */
export class Base32 {
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
     * @param {Base32Props} props
     */
    constructor(props = Base32.DEFAULT_PROPS) {
        const alphabet = props.alphabet ?? Base32.DEFAULT_ALPHABET
        const padChar = "padChar" in props ? props.padChar : ""
        const strict = "strict" in props ? (props.strict ?? false) : false

        if (alphabet.length != 32) {
            throw new Error(
                `expected base32 alphabet with 32 characters, got ${alphabet.length} characters`
            )
        }

        if (new Set(alphabet.split("")).size != 32) {
            throw new Error(
                "invalid base32 alphabet, doesn't consist 32 unique characters"
            )
        }

        if ("padChar" in props && padChar.length != 1) {
            throw new Error("expected single base32 padChar")
        }

        if ("padChar" in props && alphabet.indexOf(padChar) != -1) {
            throw new Error("base32 padChar can't be part of alphabet")
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
        return "abcdefghijklmnopqrstuvwxyz234567"
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
     * @type {Base32Props}
     */
    static get DEFAULT_PROPS() {
        return {
            alphabet: Base32.DEFAULT_ALPHABET,
            padChar: Base32.DEFAULT_PAD_CHAR,
            strict: false
        }
    }

    /**
     * Checks if all the characters in `s` are in the given base32 alphabet.
     * Checks lengths if their pad characters at the end
     * @param {string} encoded
     * @returns {boolean}
     */
    isValid(encoded) {
        let n = encoded.length

        if (
            this.padChar.length == 1 &&
            (this.strict || encoded.endsWith(this.padChar))
        ) {
            if (encoded.length % 8 != 0) {
                return false
            }

            const iPad = encoded.indexOf(this.padChar)

            for (let i = iPad + 1; i < n; i++) {
                if (encoded.at(i) != this.padChar) {
                    return false
                }
            }

            const nPad = n - iPad

            if (nPad != 6 && nPad != 4 && nPad != 3 && nPad != 1) {
                return false
            }

            encoded = encoded.slice(0, iPad)

            n = iPad
        }

        // the last char can't be any possible number

        return encoded.split("").every((c, i) => {
            const code = this.alphabet.indexOf(c.toLowerCase())

            if (code < 0) {
                return false
            }

            if (i == n - 1) {
                const nBitsExtra = n * 5 - Math.floor((n * 5) / 8) * 8

                return (((1 << nBitsExtra) - 1) & code) == 0
            } else {
                return true
            }
        })
    }

    /**
     * @param {number[]} bytes
     * @returns {number[]} list of numbers between 0 and 32
     */
    encodeRaw(bytes) {
        const result = []

        const reader = new BitReader(bytes, false)

        while (!reader.eof()) {
            result.push(reader.readBits(5))
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
                (this.strict || n < encoded.length) &&
                encoded.length % 8 != 0
            ) {
                throw new Error("invalid length (expected multiple of 8)")
            }

            const nPad = encoded.length - n

            if (nPad != 0) {
                if (nPad != 6 && nPad != 4 && nPad != 3 && nPad != 1) {
                    throw new Error(
                        "invalid number of base32 padding characters"
                    )
                }
            }

            return encoded.slice(0, n)
        } else {
            return encoded
        }
    }

    /**
     * @param {string} encoded
     * @returns {number[]} numbers between 0 and 32
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
                throw new Error("unexpected padding character")
            }

            const code = this.alphabet.indexOf(c.toLowerCase())

            if (code < 0) {
                throw new Error(`invalid base32 character ${c}`)
            } else if (i == n - 1) {
                const nBitsExtra = n * 5 - Math.floor((n * 5) / 8) * 8

                if ((((1 << nBitsExtra) - 1) & code) != 0) {
                    throw new Error(`invalid base32 final character`)
                }
            }

            res.push(code)
        }

        return res
    }

    /**
     * Encodes bytes in using Base32.
     * @param {number[]} bytes list of uint8 numbers
     * @returns {string}
     */
    encode(bytes) {
        const s = this.encodeRaw(bytes)
            .map((c) => this.alphabet[c])
            .join("")

        const n = s.length

        if (n % 8 != 0 && this.padChar.length != 0) {
            return s + new Array(8 - (n % 8)).fill(this.padChar).join("")
        } else {
            return s
        }
    }

    /**
     * Decodes a Base32 string into bytes.
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

                const nCut = n * 5 - 8 * Math.floor((n * 5) / 8)

                const bits = padBits(code.toString(2), 5)

                writer.writeBits(bits.slice(0, 5 - nCut))
            } else {
                const bits = padBits(code.toString(2), 5)

                writer.writeBits(bits)
            }
        })

        const result = writer.finalize(false)

        return result
    }
}

/**
 * Not exported. Use `new Base32()` instead
 */
const DEFAULT_BASE32_CODEC = new Base32()

/**
 * Checks if all the characters in `s` are in the given base32 alphabet.
 * Checks lengths if their pad characters at the end
 * @param {string} encoded
 * @returns {boolean}
 */
export function isValidBase32(encoded) {
    return DEFAULT_BASE32_CODEC.isValid(encoded)
}

/**
 * Encodes bytes in using Base32.
 * @param {number[]} bytes list of uint8 numbers
 * @returns {string}
 */
export function encodeBase32(bytes) {
    return DEFAULT_BASE32_CODEC.encode(bytes)
}

/**
 * Decodes a Base32 string into bytes.
 * @param {string} encoded
 * @returns {number[]}
 */
export function decodeBase32(encoded) {
    return DEFAULT_BASE32_CODEC.decode(encoded)
}
