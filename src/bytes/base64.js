import { BitReader, BitWriter, padBits } from "../bits/index.js"

/**
 * Implemented separately because atob() and btoa() are stated as being outdated,
 *   and Buffer.from(encoded, "base64") and buffer.toString("base64") only work in nodejs
 *
 * The implementation here is the strictest possible implementation, and also allows using alternate alphabets and pad character
 */

/**
 * Rfc 4648
 * @type {string}
 */
export const DEFAULT_BASE64_ALPHABET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

/**
 * Rfc 4648
 * Technically redundant, but needed to adhere to the spec
 * @type {string}
 */
export const DEFAULT_BASE64_PAD_CHAR = "="

/**
 * Checks if all the characters in `s` are in the given base32 alphabet.
 * Checks lengths if their pad characters at the end
 * @param {string} s
 * @param {string} padChar
 * @returns {boolean}
 */
export function isValidBase64(
    s,
    alphabet = DEFAULT_BASE64_ALPHABET,
    padChar = DEFAULT_BASE64_PAD_CHAR
) {
    let n = s.length

    if (s.endsWith(padChar)) {
        if (s.length % 4 != 0) {
            return false
        }

        const iPad = s.indexOf(padChar)

        for (let i = iPad + 1; i < n; i++) {
            if (s.at(i) != padChar) {
                return false
            }
        }

        // only 1 or 2 pad chars are possible
        if (iPad < n - 2) {
            return false
        }

        s = s.slice(0, iPad)
        n = iPad
    }

    return s.split("").every((c, i) => {
        const code = alphabet.indexOf(c)

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
 * @returns {number[]} list of numbers between 0 and 32
 */
export function encodeBase64Raw(bytes) {
    const result = []

    const reader = new BitReader(bytes, false)

    while (!reader.eof()) {
        result.push(reader.readBits(6))
    }

    return result
}

/**
 * @param {string} encoded
 * @returns {number[]} numbers between 0 and 32
 */
function decodeBase64Raw(
    encoded,
    alphabet = DEFAULT_BASE64_ALPHABET,
    padChar = DEFAULT_BASE64_PAD_CHAR
) {
    let n = encoded.length

    while (n >= 0 && encoded.at(n - 1) == padChar) {
        n -= 1
    }

    // length alignment is only checked if there are some padding characters at the end
    if (n < encoded.length && encoded.length % 4 != 0) {
        throw new Error("invalid length (expected multiple of 4)")
    }

    const nPad = encoded.length - n
    if (nPad > 2) {
        throw new Error("too many base64 padding characters")
    }

    /**
     * @type {number[]}
     */
    const res = []

    for (let i = 0; i < n; i++) {
        const c = encoded[i]

        if (c == padChar) {
            throw new Error("unexpected base64 padding character")
        }

        const code = alphabet.indexOf(c)

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
 * @param {string} alphabet
 * @param {string} padChar
 * @returns {number[]}
 */
export function decodeBase64(
    encoded,
    alphabet = DEFAULT_BASE64_ALPHABET,
    padChar = DEFAULT_BASE64_PAD_CHAR
) {
    const writer = new BitWriter()

    const raw = decodeBase64Raw(encoded, alphabet, padChar)

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
export function encodeBase64(
    bytes,
    alphabet = DEFAULT_BASE64_ALPHABET,
    padChar = DEFAULT_BASE64_PAD_CHAR
) {
    const s = encodeBase64Raw(bytes)
        .map((c) => alphabet[c])
        .join("")

    const n = s.length

    if (n % 4 != 0 && padChar != "") {
        return s + new Array(4 - (n % 4)).fill(padChar).join("")
    } else {
        return s
    }
}
