import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { decodeZigZag, encodeZigZag } from "./zigzag.js"

/* (new UplcInt(Site.dummy(), -1n, true)).toUnsigned().int == 1n
 * @example
 * (new UplcInt(Site.dummy(), -1n, true)).toUnsigned().toSigned().int == -1n
 * @example
 * (new UplcInt(Site.dummy(), -2n, true)).toUnsigned().toSigned().int == -2n
 * @example
 * (new UplcInt(Site.dummy(), -3n, true)).toUnsigned().toSigned().int == -3n
 * @example
 * (new UplcInt(Site.dummy(), -4n, true)).toUnsigned().toSigned().int == -4n
 */
describe(encodeZigZag.name, () => {
    it("returns 0n for 0", () => {
        strictEqual(encodeZigZag(0), 0n)
    })

    it("returns 1n for -1", () => {
        strictEqual(encodeZigZag(-1), 1n)
    })

    it("returns 2n for 1", () => {
        strictEqual(encodeZigZag(1), 2n)
    })

    it("returns 3n for -2", () => {
        strictEqual(encodeZigZag(-2), 3n)
    })

    it("returns 4n for 2", () => {
        strictEqual(encodeZigZag(2), 4n)
    })

    it("fails for a non-whole number", () => {
        throws(() => encodeZigZag(3.14))
    })
})

describe(decodeZigZag.name, () => {
    it("returns 0n for 0", () => {
        strictEqual(decodeZigZag(0), 0n)
    })

    it("returns -1n for 1", () => {
        strictEqual(decodeZigZag(1), -1n)
    })

    it("returns 1n for 2", () => {
        strictEqual(decodeZigZag(2), 1n)
    })

    it("returns -2n for 3", () => {
        strictEqual(decodeZigZag(3), -2n)
    })

    it("returns 2n for 4", () => {
        strictEqual(decodeZigZag(4), 2n)
    })

    it("fails for a negative number", () => {
        throws(() => decodeZigZag(-1))
    })

    it("fails for a non-whole number", () => {
        throws(() => decodeZigZag(3.14))
    })
})
