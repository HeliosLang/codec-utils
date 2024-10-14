import { deepEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { toBytes } from "./BytesLike.js"
import { makeByteStream } from "./ByteStream.js"

describe("toBytes()", () => {
    it("converts [255] into [255]", () => {
        deepEqual(toBytes([255]), [255])
    })

    it("converts #ff into [255]", () => {
        deepEqual(toBytes("ff"), [255])
    })

    it("converts {value: [255]} into [255]", () => {
        deepEqual(toBytes({ value: [255] }), [255])
    })

    it("converts {bytes: [255]} into [255]", () => {
        deepEqual(toBytes({ bytes: [255] }), [255])
    })

    it("converts Uint8Array([255]) into [255]", () => {
        deepEqual(toBytes(new Uint8Array([255])), [255])
    })

    it("converts ByteStream([255]) into [255]", () => {
        deepEqual(toBytes(makeByteStream({ bytes: [255] })), [255])
    })

    it("fails for wrong type", () => {
        throws(() => {
            toBytes(/** @type {any} */ ({}))
        })
    })
})
