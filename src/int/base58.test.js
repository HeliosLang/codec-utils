import { strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { decodeBase58, encodeBase58, isValidBase58 } from "./base58.js"

const VALID_BASE58 = "233QC4"
const VALID_BASE58_INT = 0x287fb4cd
const INVALID_BASE58 = "233OC4"

describe(isValidBase58.name, () => {
    it(`returns true for "${VALID_BASE58}"`, () => {
        strictEqual(isValidBase58(VALID_BASE58), true)
    })

    it(`returns false for "${INVALID_BASE58}" (invalid char)`, () => {
        strictEqual(isValidBase58(INVALID_BASE58), false)
    })
})

describe(encodeBase58.name, () => {
    it(`returns "${VALID_BASE58}" for ${VALID_BASE58_INT}`, () => {
        strictEqual(encodeBase58(VALID_BASE58_INT), VALID_BASE58)
    })

    it("fails for a negative number", () => {
        throws(() => encodeBase58(-1))
    })

    it("fails for a non-whole number", () => {
        throws(() => encodeBase58(3.14))
    })
})

describe(decodeBase58.name, () => {
    it(`returns ${VALID_BASE58_INT} for "${VALID_BASE58}"`, () => {
        strictEqual(Number(decodeBase58(VALID_BASE58)), VALID_BASE58_INT)
    })

    it(`fails for "${INVALID_BASE58}" (invalid char)`, () => {
        throws(() => decodeBase58(INVALID_BASE58))
    })
})
