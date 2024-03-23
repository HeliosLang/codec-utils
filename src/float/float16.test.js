import { describe, it } from "node:test"
import { deepEqual, strictEqual, throws } from "node:assert"
import { bytesToHex } from "../bytes/base16.js"
import { decodeFloat16, encodeFloat16 } from "./float16.js"

/**
 * Taken from https://en.wikipedia.org/wiki/Half-precision_floating-point_format
 * @type {[number[], number][]} - [encoded, original number]
 */
const testVector = [
    [[0, 0], 0],
    [[0, 1], 0.000000059604645],
    [[0x03, 0xff], 0.000060975552],
    [[4, 0], 0.00006103515625],
    [[0x35, 0x55], 0.33325195],
    [[0x3b, 0xff], 0.99951172],
    [[0x3c, 0x00], 1],
    [[0x3c, 0x01], 1.00097656],
    [[0x7b, 0xff], 65504],
    [[0x7c, 0x00], Number.POSITIVE_INFINITY],
    [[0x7c, 0x01], Number.NaN],
    [[0x80, 0x00], -0],
    [[0xc0, 0x00], -2],
    [[0xfc, 0x00], Number.NEGATIVE_INFINITY]
]

describe(decodeFloat16.name, () => {
    testVector.forEach(([bytes, f]) => {
        it(`decodes #${bytesToHex(bytes)} as ${f}`, () => {
            strictEqual(
                decodeFloat16(bytes).toExponential(7),
                f.toExponential(7)
            )
        })
    })

    it("fails for more than 2 input bytes", () => {
        throws(() => decodeFloat16([0, 0, 0]))
    })

    it("fails for less than 2 input bytes", () => {
        throws(() => decodeFloat16([0]))
    })
})

describe(encodeFloat16.name, () => {
    testVector.forEach(([bytes, f]) => {
        it(`encodes ${f} as #${bytesToHex(bytes)}`, () => {
            deepEqual(encodeFloat16(f), bytes)
        })
    })
})
