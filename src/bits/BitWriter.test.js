import { describe, it } from "node:test"

import { BitWriter } from "./BitWriter.js"
import { deepEqual, strictEqual, throws } from "node:assert"

describe(BitWriter.name, () => {
    describe("initialized without writing any bits", () => {
        it("finalizes as []", () => {
            const bw = new BitWriter()
            deepEqual(bw.finalize(false), [])
        })

        it("finalizes as [] after writing an empty bit-string", () => {
            const bw = new BitWriter()
            deepEqual(bw.writeBits("").finalize(false), [])
        })

        it('fails when writing a bit-string not consisting of only "0"s and "1"s', () => {
            throws(() => {
                const bw = new BitWriter()
                bw.writeBits("2")
            })
        })

        it("fails when writing -1 as a byte", () => {
            const bw = new BitWriter()
            throws(() => bw.writeByte(-1))
        })

        it("fails when writing 256 as a byte", () => {
            const bw = new BitWriter()
            throws(() => bw.writeByte(256))
        })
    })

    describe('initialized by writing "0", "" (empty string), and then "1"', () => {
        it("finalizes as [0b01000001]", () => {
            const bw = new BitWriter()
            deepEqual(bw.writeBits("0").writeBits("1").finalize(false), [
                0b01000001
            ])
        })

        it("finalizes as [] after popping 2 bits", () => {
            const bw = new BitWriter()
            bw.writeBits("0").writeBits("").writeBits("1").pop(2)
            deepEqual(bw.finalize(false), [])
        })

        it("fails when popping 3 bits", () => {
            const bw = new BitWriter()
            throws(() => bw.writeBits("0").writeBits("").writeBits("1").pop(3))
        })

        it("finalizes as a bit-string with length divisible by 8", () => {
            const bw = new BitWriter()
            bw.writeBits("0").writeBits("1").finalize(false)
            strictEqual(bw.length % 8, 0)
        })
    })

    describe("initialized by writing 7 as a single byte", () => {
        it("finalizes as [7]", () => {
            const bw = new BitWriter()
            deepEqual(bw.writeByte(7).finalize(false), [7])
        })

        it("finalizes as [7, 1] if force is set to true", () => {
            const bw = new BitWriter()
            deepEqual(bw.writeByte(7).finalize(true), [7, 1])
        })

        it('returns "111" when popping 3 bits', () => {
            const bw = new BitWriter()
            bw.writeByte(7)
            strictEqual(bw.pop(3), "111")
        })

        it("fails when popping a negative number of bits", () => {
            const bw = new BitWriter()
            bw.writeByte(7)
            throws(() => bw.pop(-1))
        })

        it("returns an empty string when when popping 0 bits", () => {
            const bw = new BitWriter()
            bw.writeByte(7)
            strictEqual(bw.pop(0), "")
        })

        it("after popping 3 bits, finalizes as [1]", () => {
            const bw = new BitWriter()
            bw.writeByte(7).pop(3)
            deepEqual(bw.finalize(false), [1])
        })
    })
})
