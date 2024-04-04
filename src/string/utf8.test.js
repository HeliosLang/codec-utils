import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { decodeUtf8, encodeUtf8, isValidUtf8 } from "./utf8.js"

describe(isValidUtf8.name, () => {
    it("returns true for []", () => {
        strictEqual(isValidUtf8([]), true)
    })

    it("returns true for [104, 101, 108, ...]", () => {
        strictEqual(
            isValidUtf8([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]),
            true
        )
    })

    it("returns false for [256] (invalid byte)", () => {
        strictEqual(isValidUtf8([256]), false)
    })

    it("returns false for [255, 255, 255, 255] (invalid utf-8 sequence)", () => {
        strictEqual(isValidUtf8([255, 255, 255, 255]), false)
    })

    it("returns true for [0xf0, 0xb1, 0x8d, 0x90]", () => {
        strictEqual(isValidUtf8([0xf0, 0xb1, 0x8d, 0x90]), true)
    })
})

describe(encodeUtf8.name, () => {
    it("returns [] for an empty string", () => {
        deepEqual(encodeUtf8(""), [])
    })

    it('returns [104, 101, 108, ...] for "hello world"', () => {
        deepEqual(
            encodeUtf8("hello world"),
            [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
        )
    })

    it('returns [0xf0, 0xb1, 0x8d, 0x90] for "\ud884\udf50"', () => {
        deepEqual(encodeUtf8("\ud884\udf50"), [0xf0, 0xb1, 0x8d, 0x90])
    })
})

describe(decodeUtf8.name, () => {
    it("returns an empty string for []", () => {
        strictEqual(decodeUtf8([]), "")
    })

    it('returns "hello world" for [104, 101, 108, ...]', () => {
        strictEqual(
            decodeUtf8([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]),
            "hello world"
        )
    })

    it('returns "\ud884\udf50" for [0xf0, 0xb1, 0x8d, 0x90]', () => {
        deepEqual(decodeUtf8([0xf0, 0xb1, 0x8d, 0x90]), "\ud884\udf50")
    })

    it("fails for [255, 255, 255, 255] (invalid utf-8 sequence)", () => {
        throws(() => decodeUtf8([255, 255, 255, 255]))
    })
})
