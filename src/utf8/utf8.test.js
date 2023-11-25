import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { bytesToUtf8, utf8ToBytes } from "./index.js"

describe("converting strings from/to bytes", () => {
    it('should convert "hello world" to [104, 101, 108, ...]', () => {
        deepEqual(
            utf8ToBytes("hello world"),
            [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
        )
    })

    it("should convert empty string to empty array", () => {
        deepEqual(utf8ToBytes(""), [])
    })

    it("should convert ", () => {
        deepEqual(utf8ToBytes("\ud884\udf50"), [0xf0, 0xb1, 0x8d, 0x90])
    })

    it('should convert [104, 101, 108, ...] to "hello world"', () => {
        strictEqual(
            bytesToUtf8([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]),
            "hello world"
        )
    })

    it("should fail for [255, 255, 255, 255]", () => {
        throws(() => bytesToUtf8([255, 255, 255, 255]))
    })
})
