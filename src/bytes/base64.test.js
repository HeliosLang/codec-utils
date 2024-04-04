import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { hexToBytes } from "./base16.js"
import { Base64, decodeBase64, encodeBase64, isValidBase64 } from "./base64.js"
import { decodeUtf8, encodeUtf8 } from "../string/index.js"

describe(`${Base64.name} constructor`, () => {
    it("fails for non-64 char alphabet", () => {
        throws(() => new Base64({ alphabet: "abcdefg" }))
    })

    it("fails for non-unique 64 char alphabet", () => {
        throws(
            () =>
                new Base64({
                    alphabet:
                        "AACDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
                })
        )
    })

    it("fails for non-single padding char (0 chars)", () => {
        throws(
            () => new Base64({ alphabet: Base64.DEFAULT_ALPHABET, padChar: "" })
        )
    })

    it("fails for non-single padding char (more than 1 char)", () => {
        throws(
            () =>
                new Base64({ alphabet: Base64.DEFAULT_ALPHABET, padChar: "==" })
        )
    })

    it("fails if padding char is part of alphabet", () => {
        throws(
            () =>
                new Base64({
                    alphabet:
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+=",
                    padChar: "="
                })
        )
    })
})

describe(isValidBase64.name, () => {
    it("returns true for empty string", () => {
        strictEqual(isValidBase64(""), true)
    })

    it("returns false for string with invalid base64 char", () => {
        strictEqual(isValidBase64("{"), false)
    })

    it("returns false for non-aligned padding", () => {
        strictEqual(isValidBase64("="), false)
    })

    it("returns false for interrupted padding", () => {
        strictEqual(isValidBase64("=0=="), false)
    })

    it("returns false 3 pad chars", () => {
        strictEqual(isValidBase64("0==="), false)
    })

    it("returns false for invalid terminating char", () => {
        strictEqual(isValidBase64("00=="), false)
    })

    it("returns true for 2 pad bytes", () => {
        strictEqual(isValidBase64("0w=="), true)
    })
})

describe(encodeBase64.name, () => {
    it("#14fb9c03d97e isn't valid utf8", () => {
        throws(() => decodeUtf8(hexToBytes("14fb9c03d97e")))
    })

    it("returns FPucA9l+ for #14fb9c03d97e", () => {
        strictEqual(encodeBase64(hexToBytes("14fb9c03d97e")), "FPucA9l+")
    })

    it("returns FPucA9k= for #14fb9c03d9", () => {
        strictEqual(encodeBase64(hexToBytes("14fb9c03d9")), "FPucA9k=")
    })

    it("returns FPucAw== for #14fb9c03", () => {
        strictEqual(encodeBase64(hexToBytes("14fb9c03")), "FPucAw==")
    })

    it('returns YSDEgCDwkICAIOaWhyDwn6aE for "a Ā 𐀀 文 🦄"', () => {
        strictEqual(
            encodeBase64(encodeUtf8("a Ā 𐀀 文 🦄")),
            "YSDEgCDwkICAIOaWhyDwn6aE"
        )
    })
})

describe(decodeBase64.name, () => {
    const paddingCodec = new Base64({
        alphabet: Base64.DEFAULT_ALPHABET,
        padChar: Base64.DEFAULT_PAD_CHAR,
        strict: true
    })

    const paddingLessCodec = new Base64({ alphabet: Base64.DEFAULT_ALPHABET })

    it("returns #14fb9c03 for FPucAw==", () => {
        deepEqual(decodeBase64("FPucAw=="), hexToBytes("14fb9c03"))
    })

    it("returns #14fb9c03 for FPucAw", () => {
        deepEqual(decodeBase64("FPucAw"), hexToBytes("14fb9c03"))
    })

    it("fails for FPucAw== for padding-less configuration", () => {
        throws(() => paddingLessCodec.decode("FPucAw=="))
    })

    it("fails for FPucAw if strict is true", () => {
        throws(() => paddingCodec.decode("FPucAw"))
    })

    it("fails for }PucAw==", () => {
        throws(() => decodeBase64("}PucAw=="))
    })

    it("fails for FPucA===", () => {
        throws(() => decodeBase64("FPucA==="))
    })

    it("fails for FPucA=0=", () => {
        throws(() => decodeBase64("FPucA=0="))
    })

    it("fails for FPuc====", () => {
        throws(() => decodeBase64("FPuc===="))
    })

    it("fails for FPuc===", () => {
        throws(() => decodeBase64("FPuc==="))
    })

    it("returns empty for empty", () => {
        deepEqual(decodeBase64(""), [])
    })

    it('returns "a Ā 𐀀 文 🦄" for YSDEgCDwkICAIOaWhyDwn6aE', () => {
        strictEqual(
            decodeUtf8(decodeBase64("YSDEgCDwkICAIOaWhyDwn6aE")),
            "a Ā 𐀀 文 🦄"
        )
    })

    it("fails for FPucA9==", () => {
        throws(() => decodeBase64("FPucA9=="))
    })
})
