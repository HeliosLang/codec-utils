import { strictEqual } from "node:assert"
import { describe, it } from "node:test"
import { removeWhitespace, replaceTabs } from "./whitespace.js"

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

describe(replaceTabs.name, () => {
    it("tabs replaced correctly", () => {
        const tab = "  "
        const src = "\t\t\t"

        strictEqual(replaceTabs(src, tab), [tab, tab, tab].join(""))
    })
})
