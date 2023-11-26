import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { ByteStream } from "./ByteStream.js"

describe("using ByteStream", () => {
    it("should peekOne of [255] as 255", () => {
        const bs = new ByteStream([255])

        strictEqual(bs.peekOne(), 255)
    })

    it("should peekOne of Uint8Array([255]) as 255", () => {
        const bs = new ByteStream(Uint8Array.from([255]))

        strictEqual(bs.peekOne(), 255)
    })

    it("should peekOne of ByteStream.fromBytes([255]) as 255", () => {
        const bs = ByteStream.fromBytes([255])

        strictEqual(bs.peekOne(), 255)
    })

    it("should peekOne of ByteStream.fromBytes(ByteStream([255])) as 255", () => {
        const bs = ByteStream.fromBytes(new ByteStream([255]))

        strictEqual(bs.peekOne(), 255)
    })

    it("should shiftOne of [255] as 255", () => {
        const bs = new ByteStream([255])

        strictEqual(bs.shiftOne(), 255)
    })

    it("should be at end after shiftOne of [255] as 255", () => {
        const bs = new ByteStream([255])
        bs.shiftOne()

        strictEqual(bs.isAtEnd(), true)
    })

    it("should not be at end after shiftOne of [255, 1] as 255", () => {
        const bs = new ByteStream([255, 1])
        bs.shiftOne()

        strictEqual(bs.isAtEnd(), false)
    })

    it("should fail after doing shiftOne twice on [255]", () => {
        const bs = new ByteStream([255])
        bs.shiftOne()

        throws(() => bs.shiftOne())
    })

    it("should fail after doing peekOne after shiftOne on [255]", () => {
        const bs = new ByteStream([255])
        bs.shiftOne()

        throws(() => bs.peekOne())
    })

    it("should return [255] when calling shiftMany(1) on [255]", () => {
        const bs = new ByteStream([255])

        deepEqual(bs.shiftMany(1), [255])
    })

    it("should fail for shiftMany(0)", () => {
        const bs = new ByteStream([255])

        throws(() => bs.shiftMany(0))
    })

    it("should fail for shiftMany(2) on [255]", () => {
        const bs = new ByteStream([255])

        throws(() => bs.shiftMany(2))
    })

    it("should return [255] when calling peekMany(1) on [255]", () => {
        const bs = new ByteStream([255])

        deepEqual(bs.peekMany(1), [255])
    })

    it("should fail when calling peekMany(2) on [255]", () => {
        const bs = new ByteStream([255])

        throws(() => bs.peekMany(2))
    })

    it("should fail for peekMany(0)", () => {
        const bs = new ByteStream([255])

        throws(() => bs.peekMany(0))
    })
})
