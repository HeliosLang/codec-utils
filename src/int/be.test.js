import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { decodeIntBE, encodeIntBE } from "./be.js"
import { hexToBytes } from "../index.js"

describe(decodeIntBE.name, () => {
    it("returns 255n for [255]", () => {
        strictEqual(decodeIntBE([255]), 255n)
    })

    it("returns 255n for [0, 0, 0, 255]", () => {
        strictEqual(decodeIntBE([0, 0, 0, 255]), 255n)
    })

    it("fails for [256] (invalid byte)", () => {
        throws(() => decodeIntBE([256]))
    })

    it("fails for [3.14] (invalid byte)", () => {
        throws(() => decodeIntBE([3.14]))
    })

    it("fails for [-1] (invalid byte)", () => {
        throws(() => decodeIntBE([-1]))
    })

    it("fails for empty bytes", () => {
        throws(() => decodeIntBE([]))
    })
})

describe(`${decodeIntBE.name} compared to alt formula`, () => {
    /**
     * @param {number[]} bytes
     * @returns {bigint}
     */
    const alt = (bytes) => {
        let sum = 0n
        bytes = bytes.slice().reverse()
        bytes.forEach((b, i) => {
            sum += BigInt(b) * (1n << BigInt(i * 8))
        })
        return sum
    }

    const testVector = [
        "00",
        "80",
        "ff",
        "ffff",
        "fefe",
        "8080",
        "abcdef0123456789"
    ]

    testVector.forEach((t) => {
        it(`ok for #${t}`, () => {
            const bytes = hexToBytes(t)
            strictEqual(decodeIntBE(bytes), alt(bytes))
        })
    })
})

describe(encodeIntBE.name, () => {
    it("returns [1, 0] for 256", () => {
        deepEqual(encodeIntBE(256), [1, 0])
    })

    it("returns [0] for 0", () => {
        deepEqual(encodeIntBE(0), [0])
    })

    it("returns [0] for 0n", () => {
        deepEqual(encodeIntBE(0n), [0])
    })

    it("fails for a non-whole number", () => {
        throws(() => encodeIntBE(0.5))
    })

    it("fails for a negative number", () => {
        throws(() => encodeIntBE(-1n))
    })
})
