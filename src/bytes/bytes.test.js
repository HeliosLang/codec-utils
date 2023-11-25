import { deepEqual, strictEqual, throws } from "node:assert"
import { describe, it } from "node:test"

import { bytesToHex, hexToBytes } from "./index.js"

describe("converting bytes to hex and back", () => {
    it("should convert [0,255,52] to hex 00ff34", () => {
        strictEqual(bytesToHex([0, 255, 52]), "00ff34")
    })

    it("should fail for invalid bytes [-1, 10, 256]", () => {
        throws(() => bytesToHex([-1, 10, 256]))
    })

    it("should convert 00ff34 to [0, 255, 52]", () => {
        deepEqual(hexToBytes("00ff34"), [0, 255, 52])
    })

    it("should fail for invalid hex chars 00zz34", () => {
        throws(() => hexToBytes("00zz34"))
    })

    it("should fail for uneven hex string 00ff3", () => {
        throws(() => hexToBytes("00ff3"))
    })
})
