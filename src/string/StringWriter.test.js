import { strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { makeStringWriter } from "./StringWriter.js"

describe("StringWriter", () => {
    it(`writes "a" "b" "c" as "abc"`, () => {
        const w = makeStringWriter()
        w.write("a")
        w.write("b")
        w.write("c")

        strictEqual(w.finalize(), "abc")
    })

    it(`writes three empty lines as four empty lines (last line is empty)`, () => {
        const w = makeStringWriter()
        w.writeLine("")
        w.writeLine("")
        w.writeLine("")

        strictEqual(w.finalize().split("\n").length, 4)
    })
})
