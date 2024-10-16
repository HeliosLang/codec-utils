import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { encodeUtf8 } from "../string/index.js"
import {
    decodeBase32,
    encodeBase32,
    isValidBase32,
    makeBase32,
    BASE32_DEFAULT_ALPHABET,
    BASE32_DEFAULT_PROPS
} from "./base32.js"

/**
 * Some test vectors taken from https://chromium.googlesource.com/chromium/src/+/lkgr/components/base32/base32_unittest.cc
 */

describe(`makeBase32()`, () => {
    it("fails for non-32 char alphabet", () => {
        throws(() => makeBase32({ alphabet: "abcdefg" }))
    })

    it("fails for non-unique 32 char alphabet", () => {
        throws(() =>
            makeBase32({ alphabet: "aacdefghijklmnopqrstuvwxyz234567" })
        )
    })

    it("fails for non-single char padding (0 chars)", () => {
        throws(() =>
            makeBase32({
                alphabet: BASE32_DEFAULT_ALPHABET,
                padChar: ""
            })
        )
    })

    it("fails for non-single char padding (more than 1 chars)", () => {
        throws(() =>
            makeBase32({
                alphabet: BASE32_DEFAULT_ALPHABET,
                padChar: "=="
            })
        )
    })

    it("fails if padding char is part of alphabet", () => {
        throws(() =>
            makeBase32({
                alphabet: "abcdefghijklmnopqrstuvwxyz23456=",
                padChar: "="
            })
        )
    })
})

describe(isValidBase32.name, () => {
    it("returns true for an empty string", () => {
        strictEqual(isValidBase32(""), true)
    })

    it('returns true for "my"', () => {
        strictEqual(isValidBase32("my"), true)
    })

    it('returns false for "f0" (invalid char)', () => {
        strictEqual(isValidBase32("f0"), false)
    })

    it('returns false for "fo=" (bad alignment with padding)', () => {
        strictEqual(isValidBase32("fo="), false)
    })

    it('returns false for "fo=o====" (interrupted padding)', () => {
        strictEqual(isValidBase32("fo=o===="), false)
    })

    it('returns false for "foo=====" (invalid padding length)', () => {
        strictEqual(isValidBase32("foo====="), false)
    })

    it('returns false for "fooo====" (bad terminating char)', () => {
        strictEqual(isValidBase32("fooo===="), false)
    })

    it('returns true for "fooa===="', () => {
        strictEqual(isValidBase32("fooa===="), true)
    })
})

describe(`${encodeBase32.name} without padding`, () => {
    const codec = makeBase32({})

    it("returns an empty string for []", () => {
        strictEqual(codec.encode([]), "")
    })

    it('returns "my" for the utf-8 bytes of "f"', () => {
        strictEqual(codec.encode(encodeUtf8("f")), "my")
    })

    it('returns "mzxq" for the utf-8 bytes of "fo"', () => {
        strictEqual(codec.encode(encodeUtf8("fo")), "mzxq")
    })

    it('returns "mzxw6" for the utf-8 bytes of "foo"', () => {
        strictEqual(codec.encode(encodeUtf8("foo")), "mzxw6")
    })

    it('returns "mzxw6yq" for the utf-8 bytes of "foob"', () => {
        strictEqual(codec.encode(encodeUtf8("foob")), "mzxw6yq")
    })

    it('returns "mzxw6ytb" for the utf-8 bytes of "fooba"', () => {
        strictEqual(codec.encode(encodeUtf8("fooba")), "mzxw6ytb")
    })

    it('returns "mzxw6ytboi" for the utf-8 bytes of "foobar"', () => {
        strictEqual(codec.encode(encodeUtf8("foobar")), "mzxw6ytboi")
    })
})

describe(decodeBase32.name, () => {
    const paddingLessCodec = makeBase32({ alphabet: BASE32_DEFAULT_ALPHABET })
    const paddingCodec = makeBase32({
        ...BASE32_DEFAULT_PROPS,
        strict: true
    })

    it("returns [] for an empty string", () => {
        deepEqual(decodeBase32(""), [])
    })

    it('returns the utf-8 bytes of "f" for "my"', () => {
        deepEqual(paddingLessCodec.decode("my"), encodeUtf8("f"))
    })

    it('returns the utf-8 bytes of "fo" for "mzxq"', () => {
        deepEqual(decodeBase32("mzxq"), encodeUtf8("fo"))
    })

    it('fails for "mzxq" if strict', () => {
        throws(() => paddingCodec.decode("mzxq"))
    })

    it('returns the utf-8 btyes of "foo" for "mzxw6"', () => {
        deepEqual(decodeBase32("mzxw6"), encodeUtf8("foo"))
    })

    it('returns the utf-8 bytes of "foob" for "mzxw6yq"', () => {
        deepEqual(decodeBase32("mzxw6yq"), encodeUtf8("foob"))
    })

    it('returns the utf-8 bytes of "fooba" for "mzxw6ytb"', () => {
        deepEqual(decodeBase32("mzxw6ytb"), encodeUtf8("fooba"))
    })

    it('returns the utf-8 bytes of "foobar" for "mzxw6ytboi"', () => {
        deepEqual(decodeBase32("mzxw6ytboi"), encodeUtf8("foobar"))
    })

    it('fails for "0" (invalid char)', () => {
        throws(() => decodeBase32("0"))
    })

    it('fails for "1" (invalid char)', () => {
        throws(() => decodeBase32("1"))
    })

    it('fails for "8" (invalid char)', () => {
        throws(() => decodeBase32("8"))
    })

    it('fails for "9" (invalid char)', () => {
        throws(() => decodeBase32("9"))
    })

    it('fails for "$" (invalid char)', () => {
        throws(() => decodeBase32("$"))
    })

    it('returns the same for "mzxw6ytboi" as for "MZXW6YTBOI" (case insensitive)', () => {
        const s = "mzxw6ytboi"
        deepEqual(decodeBase32(s), decodeBase32(s.toUpperCase()))
    })
})

describe(`roundtrip ${decodeBase32.name}/${encodeBase32.name}`, () => {
    /**
     * @param {string} encoded
     * @returns {string}
     */
    function roundtrip(encoded) {
        return encodeBase32(decodeBase32(encoded))
    }

    it("fails for foo=====", () => {
        throws(() => roundtrip("foo====="))
    })

    it("fails for foo====", () => {
        throws(() => roundtrip("foo===="))
    })

    it("fails for foo=b", () => {
        throws(() => roundtrip("foo=b"))
    })

    it("ok for fooa====", () => {
        strictEqual(roundtrip("fooa===="), "fooa====")
    })

    it("fails for for fooo====", () => {
        throws(() => roundtrip("fooo===="))
    })
})
