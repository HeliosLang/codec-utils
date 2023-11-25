import { describe, it } from "node:test"

import { BitWriter } from "./BitWriter.js"
import { deepEqual, strictEqual, throws } from "node:assert"

describe("using BitWriter", () => {
    it("should fail when writing non zero/one", () => {
        throws(() => {
            const bw = new BitWriter()
            bw.writeBits("2")
        })
    })

    it("should finalize a new BitWriter as []", () => {
        const bw = new BitWriter()
        deepEqual(bw.finalize(false), [])
    })

    it('should finalize ["0", "1"] as [0b01000001]', () => {
        const bw = new BitWriter()
        deepEqual(bw.writeBits("0").writeBits("1").finalize(false), [
            0b01000001
        ])
    })

    it('should finalize ["0", "1"] as [] if pop(2) is called before finalize', () => {
        const bw = new BitWriter()
        bw.writeBits("0").writeBits("1").pop(2)
        deepEqual(bw.finalize(false), [])
    })

    it('should finalize ["0", "", "1"] as [] if pop(2) is called before finalize', () => {
        const bw = new BitWriter()
        bw.writeBits("0").writeBits("").writeBits("1").pop(2)
        deepEqual(bw.finalize(false), [])
    })

    it("should fail when trying to pop more than has been written", () => {
        const bw = new BitWriter()
        throws(() => bw.writeBits("0").writeBits("1").pop(3))
    })

    it("should finalize as a bit string with length divisible by 8", () => {
        const bw = new BitWriter()
        bw.writeBits("0").writeBits("1").finalize(false)
        strictEqual(bw.length % 8, 0)
    })

    it("should write byte 7 as [7]", () => {
        const bw = new BitWriter()
        deepEqual(bw.writeByte(7).finalize(false), [7])
    })

    it("should write byte 7 as [7, 1] if force==true", () => {
        const bw = new BitWriter()
        deepEqual(bw.writeByte(7).finalize(true), [7, 1])
    })

    it('should return "111" if pop(3) is called after writing byte 7', () => {
        const bw = new BitWriter()
        bw.writeByte(7)
        strictEqual(bw.pop(3), "111")
    })

    it("should fail when calling pop() with a negative argument", () => {
        const bw = new BitWriter()
        bw.writeByte(7)
        throws(() => bw.pop(-1))
    })

    it("should write byte 7 as [1] if pop(3) is called before finalize", () => {
        const bw = new BitWriter()
        bw.writeByte(7).pop(3)
        deepEqual(bw.finalize(false), [1])
    })

    it("should fail when writing byte -1", () => {
        const bw = new BitWriter()
        throws(() => bw.writeByte(-1))
    })

    it("should fail when writing byte 256", () => {
        const bw = new BitWriter()
        throws(() => bw.writeByte(256))
    })
})
