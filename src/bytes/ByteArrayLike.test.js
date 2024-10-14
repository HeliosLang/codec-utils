import { deepEqual } from "node:assert"
import { describe, it } from "node:test"
import { toUint8Array } from "./ByteArrayLike.js"

describe("toUint8Array()", () => {
    it("returns [] for #", () => {
        deepEqual(toUint8Array(""), new Uint8Array([]))
    })

    it("returns [] for []", () => {
        deepEqual(toUint8Array([]), new Uint8Array([]))
    })

    it("returns [] for {value: []}", () => {
        deepEqual(toUint8Array({ value: [] }), new Uint8Array([]))
    })

    it("returns [] for {bytes: []}", () => {
        deepEqual(toUint8Array({ bytes: [] }), new Uint8Array([]))
    })

    it("returns [] for empty Uint8Array", () => {
        deepEqual(toUint8Array(new Uint8Array([])), new Uint8Array([]))
    })

    it("returns [255] for #ff", () => {
        deepEqual(toUint8Array("ff"), new Uint8Array([255]))
    })

    it("returns [255] for [255]", () => {
        deepEqual(toUint8Array([255]), new Uint8Array([255]))
    })

    it("returns [0] for [256]", () => {
        deepEqual(toUint8Array([256]), new Uint8Array([0]))
    })

    it("returns [255] for {value: [255]}", () => {
        deepEqual(toUint8Array({ value: [255] }), new Uint8Array([255]))
    })

    it("returns [0] for {value: [256]}", () => {
        deepEqual(toUint8Array({ value: [256] }), new Uint8Array([0]))
    })

    it("returns [255] for {bytes: [255]}", () => {
        deepEqual(toUint8Array({ bytes: [255] }), new Uint8Array([255]))
    })

    it("returns [0] for {bytes: [256]}", () => {
        deepEqual(toUint8Array({ bytes: [256] }), new Uint8Array([0]))
    })

    it("returns [255] for Uint8Array([255])", () => {
        deepEqual(toUint8Array(new Uint8Array([255])), new Uint8Array([255]))
    })
})
