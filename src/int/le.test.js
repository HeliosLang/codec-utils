import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { decodeIntLE, encodeIntLE32 } from "./le.js"

describe(decodeIntLE.name, () => {
    it("returns 65792 for [0, 1, 1, 0, ....]", () => {
        const bytes = new Array(32).fill(0)
        bytes[1] = 1
        bytes[2] = 1
        strictEqual(decodeIntLE(bytes), 65792n)
    })

    it("returns 65792 for [0, 1, 1]", () => {
        const bytes = [0, 1, 1]
        strictEqual(decodeIntLE(bytes), 65792n)
    })

    it("fails for [-1] (invalid byte)", () => {
        throws(() => decodeIntLE([-1]))
    })

    it("fails for [256] (invalid byte)", () => {
        throws(() => decodeIntLE([256]))
    })

    it("fails for [3.14] (invalid byte)", () => {
        throws(() => decodeIntLE([3.14]))
    })

    it("fails for empty bytes", () => {
        throws(() => decodeIntLE([]))
    })
})

describe(encodeIntLE32.name, () => {
    it("returns [0, ...] for 0n", () => {
        deepEqual(encodeIntLE32(0n), new Array(32).fill(0))
    })

    it("returns [0, 1, 0, ...] for 256", () => {
        const expected = new Array(32).fill(0)
        expected[1] = 1
        deepEqual(encodeIntLE32(256), expected)
    })

    it("fails for a non-whole number", () => {
        throws(() => encodeIntLE32(3.14))
    })

    it("fails for a negative number", () => {
        throws(() => encodeIntLE32(-1))
    })
})
