import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { ByteStream } from "./ByteStream.js"

const from = ByteStream.from
const isAtEnd = ByteStream.prototype.isAtEnd
const peekOne = ByteStream.prototype.peekOne
const shiftOne = ByteStream.prototype.shiftOne
const shiftMany = ByteStream.prototype.shiftMany
const peekMany = ByteStream.prototype.peekMany

describe(ByteStream.name, () => {
    describe("initialized with [255]", () => {
        it("returns 255 when peeking a single byte", () => {
            const bs = new ByteStream([255])

            strictEqual(bs.peekOne(), 255)
        })

        it(`returns 255 when shifting a single byte`, () => {
            const bs = new ByteStream([255])

            strictEqual(bs.shiftOne(), 255)
        })

        it(`after shifting a single byte, stream is at end`, () => {
            const bs = new ByteStream([255])
            bs.shiftOne()

            strictEqual(bs.isAtEnd(), true)
        })

        it("fails after shifting two bytes", () => {
            const bs = new ByteStream([255])
            bs.shiftOne()

            throws(() => bs.shiftOne())
        })

        it("after shifting a single byte, fails when peeking", () => {
            const bs = new ByteStream([255])
            bs.shiftOne()

            throws(() => bs.peekOne())
        })

        it(`returns [255] when calling ${shiftMany.name}(1)`, () => {
            const bs = new ByteStream([255])

            deepEqual(bs.shiftMany(1), [255])
        })

        it(`returns [] when calling ${shiftMany.name}(0)`, () => {
            const bs = new ByteStream([255])

            deepEqual(bs.shiftMany(0), [])
        })

        it(`fails when calling ${shiftMany.name}(-1)`, () => {
            const bs = new ByteStream([255])

            throws(() => bs.shiftMany(-1))
        })

        it(`fails when calling ${shiftMany.name}(2)`, () => {
            const bs = new ByteStream([255])

            throws(() => bs.shiftMany(2))
        })

        it(`returns [255] when calling ${peekMany.name}(1)`, () => {
            const bs = new ByteStream([255])

            deepEqual(bs.peekMany(1), [255])
        })

        it(`returns [] when calling ${peekMany.name}(0)`, () => {
            const bs = new ByteStream([255])

            deepEqual(bs.peekMany(0), [])
        })

        it(`fails when calling ${peekMany.name}(-1)`, () => {
            const bs = new ByteStream([255])

            throws(() => bs.peekMany(-1))
        })

        it(`fails when calling ${peekMany.name}(2)`, () => {
            const bs = new ByteStream([255])

            throws(() => bs.peekMany(2))
        })
    })

    describe(`initialized using ${ByteStream.name}.${from.name}([255])`, () => {
        it("returns 255 when peeking a single byte", () => {
            const bs = ByteStream.from([255])

            strictEqual(bs.peekOne(), 255)
        })
    })

    describe(`initialized using new ${ByteStream.name}(Uint8Array.from([255]))`, () => {
        it("returns 255 when peeking a single byte", () => {
            const bs = new ByteStream(Uint8Array.from([255]))

            strictEqual(bs.peekOne(), 255)
        })
    })

    describe(`initialized using ${ByteStream.name}.${from.name}(new ${ByteStream.name}([255]))`, () => {
        it("returns 255 when peeking a single byte", () => {
            const bs = ByteStream.from(new ByteStream([255]))
            strictEqual(bs.peekOne(), 255)
        })
    })

    describe("initialized with [255, 1]", () => {
        it(`after shifting a single byte, stream is NOT at end`, () => {
            const bs = new ByteStream([255, 1])
            bs.shiftOne()

            strictEqual(bs.isAtEnd(), false)
        })
    })
})
