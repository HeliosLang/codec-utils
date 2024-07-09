import { describe, it } from "node:test"
import { removeWhitespace } from "./whitespace.js"
import { strictEqual } from "node:assert"

describe(removeWhitespace.name, () => {
    it("whitespace removed correctly from beginning and end", () => {
        const src = "  hello  "

        strictEqual(removeWhitespace(src), "hello")
    })

    it("whitespace removed correctly from middle", () => {
        const src = "hello world"

        strictEqual(removeWhitespace(src), "helloworld")
    })

    it("newlines removed correctly", () => {
        const src = "\nhello\nworld\n"

        strictEqual(removeWhitespace(src), "helloworld")
    })

    it("tabs removed correctly", () => {
        const src = "   hello   world\t\t"

        strictEqual(removeWhitespace(src), "helloworld")
    })
})
