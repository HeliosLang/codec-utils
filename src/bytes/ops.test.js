import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { compareBytes, dummyBytes, padBytes, prepadBytes } from "./ops.js"
import { hexToBytes } from "./base16.js"

describe(padBytes.name, () => {
    describe("padding with n=0", () => {
        it("returns [] for []", () => {
            deepEqual(padBytes([], 0), [])
        })

        it("fails for [1]", () => {
            throws(() => padBytes([1], 0))
        })
    })

    describe("padding with n=2", () => {
        it("returns [0, 0] for []", () => {
            deepEqual(padBytes([], 2), [0, 0])
        })

        it("returns [1, 0] for [1]", () => {
            deepEqual(padBytes([1], 2), [1, 0])
        })
    })

    describe("padding [0, 1, 2]", () => {
        it("fails if n=-1", () => {
            throws(() => padBytes([0, 1, 2], -1))
        })

        it("returns [0, 1, 2, 0, 0, ...] if n=32", () => {
            const expect = new Array(32).fill(0)
            expect[1] = 1
            expect[2] = 2
            deepEqual(padBytes([0, 1, 2], 32), expect)
        })
    })
})

describe(prepadBytes.name, () => {
    describe("prepadding with n=0", () => {
        it("returns [] for []", () => {
            deepEqual(prepadBytes([], 0), [])
        })

        it("fails for [1]", () => {
            throws(() => prepadBytes([1], 0))
        })
    })

    describe("prepadding with n=2", () => {
        it("returns [0, 0] for []", () => {
            deepEqual(padBytes([], 2), [0, 0])
        })

        it("returns [0, 1] for [1]", () => {
            deepEqual(prepadBytes([1], 2), [0, 1])
        })
    })

    describe("prepadding [0, 1, 2]", () => {
        it("fails if n=-1", () => {
            throws(() => prepadBytes([0, 1, 2], -1))
        })

        it("returns [0, 0, ..., 0, 1, 2] if n=32", () => {
            const expect = new Array(32).fill(0)
            expect[30] = 1
            expect[31] = 2
            deepEqual(prepadBytes([0, 1, 2], 32), expect)
        })
    })
})

describe(compareBytes.name, () => {
    it("returns -1 when comparing #01010101 to #02020202", () => {
        strictEqual(
            compareBytes(hexToBytes("01010101"), hexToBytes("02020202")),
            -1
        )
    })

    it("returns 1 when comparing #02020202 to #02010202", () => {
        strictEqual(
            compareBytes(hexToBytes("02020202"), hexToBytes("02010202")),
            1
        )
    })

    it("returns 1 when comparing #01010101 to #020202 with shortestFirst=true", () => {
        strictEqual(
            compareBytes(hexToBytes("01010101"), hexToBytes("020202"), true),
            1
        )
    })

    it("returns 1 when comparing #010101 to #02020202 with shortestFirst=true", () => {
        strictEqual(
            compareBytes(hexToBytes("010101"), hexToBytes("02020202"), true),
            -1
        )
    })

    it("returns 0 when comparing #01010101 to #01010101", () => {
        strictEqual(
            compareBytes(hexToBytes("01010101"), hexToBytes("01010101")),
            0
        )
    })

    it("returns 1 when comparing #01010101 to #010101", () => {
        strictEqual(
            compareBytes(hexToBytes("01010101"), hexToBytes("010101")),
            1
        )
    })

    it("returns 1 when comparing #010101 to #01010101", () => {
        strictEqual(
            compareBytes(hexToBytes("010101"), hexToBytes("01010101")),
            -1
        )
    })
})

describe(dummyBytes.name, () => {
    it("returns all 0 with default 2nd arg", () => {
        deepEqual(dummyBytes(28), new Array(28).fill(0))
    })
})
