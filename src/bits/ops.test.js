import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { byteToBits, maskBits, padBits } from "./ops.js"

describe(byteToBits.name, () => {
    describe("calling with 7 as the input byte", () => {
        it('returns "0b00000111"', () => {
            strictEqual(byteToBits(7), "0b00000111")
        })

        it('returns "00000111" if prefix=false', () => {
            strictEqual(byteToBits(7, 8, false), "00000111")
        })

        it('returns "111" if n=3 and prefix=false', () => {
            strictEqual(byteToBits(7, 3, false), "111")
        })

        it("fails if n=2", () => {
            throws(() => byteToBits(7, 2))
        })
    })

    it("fails for 0 if n=0", () => {
        throws(() => byteToBits(0, 0, false))
    })

    it("fails for a negative number", () => {
        throws(() => byteToBits(-1))
    })

    it("fails for a non-whole number", () => {
        throws(() => byteToBits(3.14))
    })

    it("fails for a number larger than 255", () => {
        throws(() => byteToBits(256))
    })
})

describe(maskBits.name, () => {
    describe("calling with 0b11111111 as the input byte", () => {
        it("returns 0b0111 if range=[1, 4)", () => {
            strictEqual(maskBits(0b11111111, 1, 4), 0b0111)
        })

        it("returns 0b11111111 if range=[0, 8)", () => {
            const bits = 0b11111111
            strictEqual(maskBits(bits, 0, 8), bits)
        })

        it("fails for range=[1, 1)", () => {
            throws(() => maskBits(0b11111111, 1, 1))
        })

        it("fails for a range starting with a negative number", () => {
            throws(() => maskBits(0b11111111, -1, 8))
        })

        it("fails for a range starting after 7", () => {
            throws(() => maskBits(0b11111111, 8, 9))
        })

        it("fails for a range ending after 8", () => {
            throws(() => maskBits(0b11111111, 0, 9))
        })
    })

    it("fails for a negative input number", () => {
        throws(() => maskBits(-1, 0, 8))
    })

    it("fails for an input number larger than 255", () => {
        throws(() => maskBits(256, 0, 8))
    })
})

describe(padBits.name, () => {
    describe('calling with "1111" as a bit-string', () => {
        it('returns "00001111" if n=8', () => {
            strictEqual(padBits("1111", 8), "00001111")
        })

        it('returns "001111" if n=3 (pads to next multiple of n if n is less than the number of bits)', () => {
            strictEqual(padBits("1111", 3), "001111")
        })

        it('returns "1111" if n=4 (does nothing if n is equal to the input number of bits)', () => {
            const bits = "1111"
            strictEqual(padBits(bits, bits.length), bits)
        })

        it("fails for negative n", () => {
            throws(() => padBits("1111", -1))
        })
    })
})
