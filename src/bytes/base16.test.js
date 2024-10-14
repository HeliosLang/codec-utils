import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"
import { bytesToHex, hexToBytes, isValidHex } from "./base16.js"

describe(isValidHex.name, () => {
    it("returns true for an empty string", () => {
        strictEqual(isValidHex(""), true)
    })

    it('returns true for "00ff34"', () => {
        strictEqual(isValidHex("00ff34"), true)
    })

    it('returns true for "00FF34"', () => {
        strictEqual(isValidHex("00FF34"), true)
    })

    it('returns false for "00ff3"', () => {
        strictEqual(isValidHex("00ff3"), false)
    })

    it('returns false for "00fz34"', () => {
        strictEqual(isValidHex("00fz34"), false)
    })
})

describe(bytesToHex.name, () => {
    it("returns an empty string for []", () => {
        strictEqual(bytesToHex([]), "")
    })

    it('returns "00ff34" for [0,255,52]', () => {
        strictEqual(bytesToHex([0, 255, 52]), "00ff34")
    })

    it("fails for [-1, 10, 256]", () => {
        throws(() => bytesToHex([-1, 10, 256]))
    })
})

describe(hexToBytes.name, () => {
    it('returns [] for ""', () => {
        deepEqual(hexToBytes(""), [])
    })

    it('returns [0, 255, 52] for "00ff34"', () => {
        deepEqual(hexToBytes("00ff34"), [0, 255, 52])
    })

    it('returns [0, 255, 52] for "#00ff34"', () => {
        deepEqual(hexToBytes("#00ff34"), [0, 255, 52])
    })

    it('returns [0, 255, 52] for "00FF34" (case insensitive)', () => {
        deepEqual(hexToBytes("00FF34"), [0, 255, 52])
    })

    it('returns [0, 255, 52] for "00Ff34" (case insensitive)', () => {
        deepEqual(hexToBytes("00Ff34"), [0, 255, 52])
    })

    it('fails for "00zz34" (invalid chars)', () => {
        throws(() => hexToBytes("00zz34"))
    })

    it('fails for "00ff3" (uneven length)', () => {
        throws(() => hexToBytes("00ff3"))
    })
})
