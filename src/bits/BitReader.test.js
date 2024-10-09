import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { BitReader } from "./BitReader.js"

describe(BitReader.name, () => {
    describe("initialized with [255]", () => {
        const bytes = [255]

        it("returns 7 when reading the first 3 bits", () => {
            const br = new BitReader(bytes)
            strictEqual(br.readBits(3), 7)
        })

        it("is NOT at EOF when reading the first 7 bits", () => {
            const br = new BitReader(bytes)
            br.readBits(7)
            strictEqual(br.eof(), false)
        })

        it("is at EOF when reading the first 8 bits", () => {
            const br = new BitReader(bytes)
            br.readBits(8)
            strictEqual(br.eof(), true)
        })

        it("fails when reading 9 bits", () => {
            const br = new BitReader(bytes)
            throws(() => br.readBits(9))
        })
    })

    describe("initialized with an empty Uint8Array", () => {
        it(`fails when reading a single bit`, () => {
            const br = new BitReader(new Uint8Array(0))
            throws(() => br.readBits(1))
        })

        it(`fails when reading a single byte`, () => {
            const br = new BitReader(new Uint8Array(0))
            throws(() => br.readByte())
        })
    })

    describe("initialized with [255, 255] and truncate set to false", () => {
        const bytes = [255, 255]

        describe("discard 14 bits", () => {
            it("returns 3 when reading 2 bits", () => {
                const br = new BitReader(bytes, false)
                br.readBits(7)
                br.readBits(7)
                strictEqual(br.readBits(2), 3)
            })

            it("returns 0b11000000 when reading 8 bits", () => {
                const br = new BitReader(bytes, false)
                br.readBits(7)
                br.readBits(7)
                strictEqual(br.readBits(8), 0b11000000)
            })
        })
    })

    describe("initialized with [0, 1, 2, ...] so that EOF is never true", () => {
        /**
         * @type {number[]}
         */
        const bytes = []

        for (let i = 0; i < 1000; i++) {
            bytes.push(i)
        }

        it("fails when reading more than 8 bits at a time", () => {
            const br = new BitReader(bytes)
            throws(() => br.readBits(9))
        })

        it("after reading 8 bits and moving to byte boundary (which has no effect), returns 1 when reading a byte ", () => {
            const br = new BitReader(bytes)
            br.readBits(8)
            br.moveToByteBoundary()
            strictEqual(br.readByte(), 1)
        })

        it("after reading 7 bits and moving to byte boundary, returns 1 when reading a byte", () => {
            const br = new BitReader(bytes)
            br.readBits(7)
            br.moveToByteBoundary()
            strictEqual(br.readByte(), 1)
        })

        it("after forcing a move to byte boundary from start, returns 1 when reading a byte", () => {
            const br = new BitReader(bytes)
            br.moveToByteBoundary(true)
            strictEqual(br.readByte(), 1)
        })
    })
})
