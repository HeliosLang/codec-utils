import { describe, it } from "node:test"
import { strictEqual } from "node:assert"
import { StringWriter } from "./StringWriter.js"

describe(StringWriter.name, () => {
    it(`writes "a" "b" "c" as "abc"`, () => {
        const w = new StringWriter()
        w.write("a")
        w.write("b")
        w.write("c")

        strictEqual(w.finalize(), "abc")
    })

    it(`writes three empty lines as four empty lines (last line is empty)`, () => {
        const w = new StringWriter()
        w.writeLine("")
        w.writeLine("")
        w.writeLine("")

        strictEqual(w.finalize().split("\n").length, 4)
    })
})
