import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { BitReader } from "./BitReader.js"

describe("using BitReader", () => {
    it("should reading 3 bits from [255] return 7", () => {
        const br = new BitReader([255])
        strictEqual(br.readBits(3), 7)
    })

    it("should fail reading from empty Uint8Array", () => {
        const br = new BitReader(new Uint8Array(0))
        throws(() => br.readBits(1))
    })

    it("should not be eof when reading 7 bits from [255]", () => {
        const br = new BitReader([255])
        br.readBits(7)
        strictEqual(br.eof(), false)
    })

    it("should not be eof when reading 8 bits from [255]", () => {
        const br = new BitReader([255])
        br.readBits(8)
        strictEqual(br.eof(), true)
    })

    it("should fail when reading 9 bits from [255]", () => {
        const br = new BitReader([255])
        throws(() => br.readBits(9))
    })

    it("should fail when reading 9 bits from [255, 255]", () => {
        const br = new BitReader([255])
        throws(() => br.readBits(9))
    })

    it("should return 3 when reading 2 bits at end of [255, 255]", () => {
        const br = new BitReader([255, 255])
        br.readBits(7)
        br.readBits(7)
        strictEqual(br.readBits(2), 3)
    })

    it("should return 0b11000000 when reading 2 bits at of [255, 255] with truncate==false", () => {
        const br = new BitReader([255, 255], false)
        br.readBits(7)
        br.readBits(7)
        strictEqual(br.readBits(8), 0b11000000)
    })

    it("shouldn't do anything when calling moveToByteBoundary at byte boundary", () => {
        const br = new BitReader([255, 255])
        br.readBits(8)
        br.moveToByteBoundary()
        strictEqual(br.readByte(), 255)
    })

    it("should read second byte after moveToByteBoundary", () => {
        const br = new BitReader([255, 255])
        br.readBits(7)
        br.moveToByteBoundary()
        strictEqual(br.readByte(), 255)
    })

    it("should read second byte after moveToByteBoundary from start", () => {
        const br = new BitReader([255, 255])
        br.moveToByteBoundary(true)
        strictEqual(br.readByte(), 255)
    })
})
