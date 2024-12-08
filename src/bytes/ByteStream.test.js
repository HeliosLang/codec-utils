import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { makeByteStream } from "./ByteStream.js"

/**
 * @import { BytesLike } from "../index.js"
 */

describe(`ByteStream`, () => {
    describe("initialized with [255]", () => {
        it("returns 255 when peeking a single byte", () => {
            const bs = makeByteStream({ bytes: [255] })

            strictEqual(bs.peekOne(), 255)
        })

        it("returns Uint8Array([255]) when inspecting all bytes", () => {
            const bs = makeByteStream([255])

            deepEqual(bs.bytes, new Uint8Array([255]))
        })

        it("returns pos == 0 right after initialization", () => {
            const bs = makeByteStream([255])

            strictEqual(bs.pos, 0)
        })

        it(`returns 255 when shifting a single byte`, () => {
            const bs = makeByteStream([255])

            strictEqual(bs.shiftOne(), 255)
            strictEqual(bs.pos, 1)
            deepEqual(bs.shiftRemaining(), [])
        })

        it(`after shifting a single byte, stream is at end`, () => {
            const bs = makeByteStream([255])
            bs.shiftOne()

            strictEqual(bs.isAtEnd(), true)
        })

        it("fails after shifting two bytes", () => {
            const bs = makeByteStream([255])
            bs.shiftOne()

            throws(() => bs.shiftOne())
        })

        it("after shifting a single byte, fails when peeking", () => {
            const bs = makeByteStream([255])
            bs.shiftOne()

            throws(() => bs.peekOne())
        })

        it(`returns [255] when calling shiftMany(1)`, () => {
            const bs = makeByteStream([255])

            deepEqual(bs.shiftMany(1), [255])
        })

        it(`returns [] when calling shiftMany(0)`, () => {
            const bs = makeByteStream([255])

            deepEqual(bs.shiftMany(0), [])
        })

        it(`fails when calling shiftMany(-1)`, () => {
            const bs = makeByteStream([255])

            throws(() => bs.shiftMany(-1))
        })

        it(`fails when calling shiftMany(2)`, () => {
            const bs = makeByteStream([255])

            throws(() => bs.shiftMany(2))
        })

        it(`returns [255] when calling peekMany(1)`, () => {
            const bs = makeByteStream([255])

            deepEqual(bs.peekMany(1), [255])
        })

        it(`returns [] when calling peekMany(0)`, () => {
            const bs = makeByteStream([255])

            deepEqual(bs.peekMany(0), [])
        })

        it(`fails when calling peekMany(-1)`, () => {
            const bs = makeByteStream([255])

            throws(() => bs.peekMany(-1))
        })

        it(`fails when calling peekMany(2)`, () => {
            const bs = makeByteStream([255])

            throws(() => bs.peekMany(2))
        })
    })

    describe(`initialized using makeByteStream({bytes: [255]})`, () => {
        it("returns 255 when peeking a single byte", () => {
            const bs = makeByteStream([255])

            strictEqual(bs.peekOne(), 255)
        })
    })

    describe(`initialized using makeByteStream({bytes: [255]}).copy()`, () => {
        it("returns 255 when peeking a single byte", () => {
            const bs = makeByteStream([255]).copy()

            strictEqual(bs.peekOne(), 255)
        })
    })

    describe(`initialized using makeByteStream({bytes: Uint8Array.from([255])})`, () => {
        it("returns 255 when peeking a single byte", () => {
            const bs = makeByteStream(Uint8Array.from([255]))

            strictEqual(bs.peekOne(), 255)
        })
    })

    describe(`initialized using makeByteStream({bytes: makeByteStream({bytes: [255]})})`, () => {
        it("returns 255 when peeking a single byte", () => {
            const bs = makeByteStream({
                bytes: makeByteStream([255])
            })
            strictEqual(bs.peekOne(), 255)
        })
    })

    describe("initialized with [255, 1]", () => {
        it(`after shifting a single byte, stream is NOT at end`, () => {
            const bs = makeByteStream([255, 1])
            bs.shiftOne()

            strictEqual(bs.isAtEnd(), false)
        })
    })
})

describe("typecheck of makeByteStream", () => {
    it("must be able to pass BytesLike to makeByteStream", () => {
        /**
         * @type {BytesLike}
         */
        const bytes = /** @type {any} */ ([])

        makeByteStream({ bytes })
    })
})
