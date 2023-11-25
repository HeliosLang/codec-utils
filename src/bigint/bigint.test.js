import { deepEqual, strictEqual } from "node:assert"
import { describe, it } from "node:test"

import { intToBytesBE } from "./be.js"
import { bytesToIntLE, intToBytesLE32 } from "./le.js"

describe("converting bigint to/from bytes", () => {
    it("should convert 256 to [1, 0] if big-endian", () => {
        deepEqual(intToBytesBE(256n), [1, 0])
    })

    it("should convert 0 to [0] if big-endian", () => {
        deepEqual(intToBytesBE(0n), [0])
    })

    it("should convert 0 to [0, ...] if little-endian", () => {
        deepEqual(intToBytesLE32(0n), new Array(32).fill(0))
    })

    it("should convert 256 to [0, 1, 0, ...] if little-endian", () => {
        const expected = new Array(32).fill(0)
        expected[1] = 1
        deepEqual(intToBytesLE32(256n), expected)
    })

    it("should convert [0, 1, 1, 0, ....] to 65792 if little-endian", () => {
        const bytes = new Array(32).fill(0)
        bytes[1] = 1
        bytes[2] = 1
        strictEqual(bytesToIntLE(bytes), 65792n)
    })

    it("should convert [0, 1, 1] to 65792 if little-endian", () => {
        const bytes = [0, 1, 1]
        strictEqual(bytesToIntLE(bytes), 65792n)
    })
})
