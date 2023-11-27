import { BitReader, BitWriter, padBits } from "../bits/index.js"

/**
 * Rfc 4648 base32 alphabet
 * @type {string}
 */
export const DEFAULT_BASE32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567"

/**
 * Checks if all the characters in `s` are in the given base32 alphabet.
 * @param {string} s
 * @returns {boolean}
 */
export function isValidBase32(s, alphabet = DEFAULT_BASE32_ALPHABET) {
    return s.split("").every((c) => alphabet.indexOf(c.toLowerCase()) >= 0)
}

/**
 * @param {number[]} bytes
 * @returns {number[]} list of numbers between 0 and 32
 */
export function encodeBase32Raw(bytes) {
    const result = []

    const reader = new BitReader(bytes, false)

    while (!reader.eof()) {
        result.push(reader.readBits(5))
    }

    return result
}

/**
 * @param {string} encoded
 * @returns {number[]} numbers between 0 and 32
 */
function decodeBase32Raw(encoded, alphabet = DEFAULT_BASE32_ALPHABET) {
    const n = encoded.length

    /**
     * @type {number[]}
     */
    const res = []

    for (let i = 0; i < n; i++) {
        const c = encoded[i]
        const code = alphabet.indexOf(c.toLowerCase())

        if (code < 0) {
            throw new Error(`invalid base32 character ${c}`)
        }

        res.push(code)
    }

    return res
}

/**
 * Encodes bytes in using Base32.
 * @example
 * bytesToBase32(encodeUtf8("f")) == "my"
 * @param {number[]} bytes list of uint8 numbers
 * @param {string} alphabet list of chars, defaults to "abcdefghijklmnopqrstuvwxyz234567"
 * @return {string}
 */
export function encodeBase32(bytes, alphabet = DEFAULT_BASE32_ALPHABET) {
    return encodeBase32Raw(bytes)
        .map((c) => alphabet[c])
        .join("")
}

/**
 * Decodes a Base32 string into bytes.
 * @example
 * base32ToBytes("my") == encodeUtf("f")
 * @param {string} encoded
 * @param {string} alphabet list of chars, defaults to "abcdefghijklmnopqrstuvwxyz234567"
 * @return {number[]}
 */
export function decodeBase32(encoded, alphabet = DEFAULT_BASE32_ALPHABET) {
    const writer = new BitWriter()

    const n = encoded.length

    decodeBase32Raw(encoded, alphabet).forEach((code, i) => {
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
