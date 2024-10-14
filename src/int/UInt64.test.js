import { deepEqual, strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { UINT64_ZERO, makeUInt64 } from "./UInt64.js"

describe("UInt64", () => {
    describe("toBytes()", () => {
        it(`roundtrip returns the same for [0, 1, 2, 3, 4, 5, 6, 7] if littleEndian==true`, () => {
            deepEqual(
                makeUInt64({ bytes: [0, 1, 2, 3, 4, 5, 6, 7] }).toBytes(true),
                [0, 1, 2, 3, 4, 5, 6, 7]
            )
        })

        it(`roundtrip returns the same for [0, 1, 2, 3, 4, 5, 6, 7] if littleEndian==false`, () => {
            deepEqual(
                makeUInt64({
                    bytes: [0, 1, 2, 3, 4, 5, 6, 7],
                    littleEndian: false
                }).toBytes(false),
                [0, 1, 2, 3, 4, 5, 6, 7]
            )
        })
    })

    describe("makeUInt64({hex})", () => {
        it(`returns [0, 0, 0, 0, 255, 255, 255, 255] for "00000000ffffffff"`, () => {
            deepEqual(
                makeUInt64({ hex: "00000000ffffffff" }).toBytes(false),
                [0, 0, 0, 0, 255, 255, 255, 255]
            )
        })
    })

    describe("UInt64 zero", () => {
        it(`returns [0, 0, 0, 0, 0, 0, 0, 0]`, () => {
            deepEqual(UINT64_ZERO.toBytes(false), [0, 0, 0, 0, 0, 0, 0, 0])
        })
    })

    describe("eq()", () => {
        it(`returns true for UInt64.zero() && UInt64.zero()`, () => {
            strictEqual(UINT64_ZERO.eq(UINT64_ZERO), true)
        })

        it(`returns false for UInt64.zero() && UInt64.fromBytes([0, 0, 0, 0, 255, 255, 255, 255])`, () => {
            strictEqual(
                UINT64_ZERO.eq(
                    makeUInt64({ bytes: [0, 0, 0, 0, 255, 255, 255, 255] })
                ),
                false
            )
        })
    })

    describe("not()", () => {
        it(`returns [255, 255, 255, 255, 255, 255, 255, 255] for UInt64.zero().not()`, () => {
            deepEqual(
                UINT64_ZERO.not().toBytes(),
                [255, 255, 255, 255, 255, 255, 255, 255]
            )
        })
    })
})
