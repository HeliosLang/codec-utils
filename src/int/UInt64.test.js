import { describe, it } from "node:test"
import { UInt64 } from "./UInt64.js"
import { deepEqual, strictEqual } from "node:assert"

describe(UInt64.name, () => {
    describe(UInt64.prototype.toBytes.name, () => {
        it(`roundtrip returns the same for [0, 1, 2, 3, 4, 5, 6, 7] if littleEndian==true`, () => {
            deepEqual(
                UInt64.fromBytes([0, 1, 2, 3, 4, 5, 6, 7]).toBytes(true),
                [0, 1, 2, 3, 4, 5, 6, 7]
            )
        })

        it(`roundtrip returns the same for [0, 1, 2, 3, 4, 5, 6, 7] if littleEndian==false`, () => {
            deepEqual(
                UInt64.fromBytes([0, 1, 2, 3, 4, 5, 6, 7], false).toBytes(
                    false
                ),
                [0, 1, 2, 3, 4, 5, 6, 7]
            )
        })
    })

    describe(UInt64.fromString.name, () => {
        it(`returns [0, 0, 0, 0, 255, 255, 255, 255] for "00000000ffffffff"`, () => {
            deepEqual(
                UInt64.fromString("00000000ffffffff").toBytes(false),
                [0, 0, 0, 0, 255, 255, 255, 255]
            )
        })
    })

    describe(UInt64.zero.name, () => {
        it(`returns [0, 0, 0, 0, 0, 0, 0, 0]`, () => {
            deepEqual(UInt64.zero().toBytes(false), [0, 0, 0, 0, 0, 0, 0, 0])
        })
    })

    describe(UInt64.prototype.eq.name, () => {
        it(`returns true for UInt64.zero() && UInt64.zero()`, () => {
            strictEqual(UInt64.zero().eq(UInt64.zero()), true)
        })

        it(`returns false for UInt64.zero() && UInt64.fromBytes([0, 0, 0, 0, 255, 255, 255, 255])`, () => {
            strictEqual(
                UInt64.zero().eq(
                    UInt64.fromBytes([0, 0, 0, 0, 255, 255, 255, 255])
                ),
                false
            )
        })
    })

    describe(UInt64.prototype.not.name, () => {
        it(`returns [255, 255, 255, 255, 255, 255, 255, 255] for UInt64.zero().not()`, () => {
            deepEqual(
                UInt64.zero().not().toBytes(),
                [255, 255, 255, 255, 255, 255, 255, 255]
            )
        })
    })
})
