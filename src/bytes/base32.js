import { BitReader, BitWriter, padBits } from "../bits/index.js"

/**
 * Rfc 4648 base32 alphabet
 * @type {string}
 */
export const DEFAULT_BASE32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567"

/**
 * Rfc 4648.
 * Although the pad-char is technically redundant, it is still needed to adhere to the spec
 * @type {string}
 */
export const DEFAULT_BASE32_PAD_CHAR = "="

/**
 * Checks if all the characters in `s` are in the given base32 alphabet.
 * Checks lengths if their pad characters at the end
 * @param {string} s
 * @param {string} padChar
 * @returns {boolean}
 */
export function isValidBase32(
    s,
    alphabet = DEFAULT_BASE32_ALPHABET,
    padChar = DEFAULT_BASE32_PAD_CHAR
) {
    let n = s.length

    if (s.endsWith(padChar)) {
        if (s.length % 8 != 0) {
            return false
        }

        const iPad = s.indexOf(padChar)

        for (let i = iPad + 1; i < n; i++) {
            if (s.at(i) != padChar) {
                return false
            }
        }

        const nPad = n - iPad

        if (nPad != 6 && nPad != 4 && nPad != 3 && nPad != 1) {
            return false
        }

        s = s.slice(0, iPad)

        n = iPad
    }

    // the last char can't be any possible number

    return s.split("").every((c, i) => {
        const code = alphabet.indexOf(c.toLowerCase())

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
function decodeBase32Raw(
    encoded,
    alphabet = DEFAULT_BASE32_ALPHABET,
    padChar = DEFAULT_BASE32_PAD_CHAR
) {
    let n = encoded.length

    while (n >= 0 && encoded.at(n - 1) == padChar) {
        n -= 1
    }

    // length alignment is only checked if there are some padding characters at the end
    if (n < encoded.length && encoded.length % 8 != 0) {
        throw new Error("invalid length (expected multiple of 8)")
    }

    const nPad = encoded.length - n

    if (nPad != 0) {
        if (nPad != 6 && nPad != 4 && nPad != 3 && nPad != 1) {
            throw new Error("invalid number of base32 padding characters")
        }
    }

    /**
     * @type {number[]}
     */
    const res = []

    for (let i = 0; i < n; i++) {
        const c = encoded[i]

        if (c == padChar) {
            throw new Error("unexpected padding character")
        }

        const code = alphabet.indexOf(c.toLowerCase())

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
 * @example
 * bytesToBase32(encodeUtf8("f")) == "my"
 * @param {number[]} bytes list of uint8 numbers
 * @param {string} alphabet list of chars, defaults to "abcdefghijklmnopqrstuvwxyz234567"
 * @return {string}
 */
export function encodeBase32(
    bytes,
    alphabet = DEFAULT_BASE32_ALPHABET,
    padChar = DEFAULT_BASE32_PAD_CHAR
) {
    const s = encodeBase32Raw(bytes)
        .map((c) => alphabet[c])
        .join("")

    const n = s.length

    if (n % 8 != 0 && padChar != "") {
        return s + new Array(8 - (n % 8)).fill(padChar).join("")
    } else {
        return s
    }
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

    const raw = decodeBase32Raw(encoded, alphabet)

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
