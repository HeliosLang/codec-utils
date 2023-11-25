import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { byteToBits, maskBits, padBits } from "./ops.js"

describe("convert byte to bits", () => {
    it('should convert 7 to "0b00000111"', () => {
        strictEqual(byteToBits(7), "0b00000111")
    })

    it('should convert 7 to "00000111" if prefix==false', () => {
        strictEqual(byteToBits(7, 8, false), "00000111")
    })

    it('should convert 7 to "111" if n==3 and prefix==false', () => {
        strictEqual(byteToBits(7, 3, false), "111")
    })

    it('should fail when converting 7 with "111" if n==2 && prefix==false', () => {
        throws(() => byteToBits(7, 2, false))
    })

    it("should fail when converting 0 with n==0 and prefix==false", () => {
        throws(() => byteToBits(0, 0, false))
    })

    it("should fail for a negative argument", () => {
        throws(() => byteToBits(-1))
    })

    it("should fail for an overflowing argument", () => {
        throws(() => byteToBits(256))
    })
})

describe("mask bits of a byte", () => {
    it("should mask bits of 0b11111111 using range [1, 4) as 0b0111", () => {
        strictEqual(maskBits(0b11111111, 1, 4), 0b0111)
    })

    it("should mask bits of 0b11111111 using range [0, 8) as 0b11111111", () => {
        const bits = 0b11111111
        strictEqual(maskBits(bits, 0, 8), bits)
    })

    it("should fail for an invalid range [1, 1)", () => {
        throws(() => maskBits(0b11111111, 1, 1))
    })

    it("should fail for a negative i0", () => {
        throws(() => maskBits(0b11111111, -1, 8))
    })

    it("should fail for a i0 > 7", () => {
        throws(() => maskBits(0b11111111, 8, 9))
    })

    it("should fail for a i1 > 8", () => {
        throws(() => maskBits(0b11111111, 0, 9))
    })

    it("should fail for negative input", () => {
        throws(() => maskBits(-1, 0, 8))
    })

    it("should fail for overflowing input", () => {
        throws(() => maskBits(256, 0, 8))
    })
})

describe("pad a bit string using 0's", () => {
    it('should pad "1111" to a string of length 8 as "00001111"', () => {
        strictEqual(padBits("1111", 8), "00001111")
    })

    it("should fail for a negative pad length", () => {
        throws(() => padBits("1111", -1))
    })

    it("should fail for a pad length less than the number of bits", () => {
        throws(() => padBits("1111", 3))
    })

    it("should do nothing if the pad length is equal to the number of bits", () => {
        const bits = "1111"
        strictEqual(padBits(bits, bits.length), bits)
    })
})
