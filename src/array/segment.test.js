import { describe, it } from "node:test"
import { segmentArray } from "./segment.js"
import { deepEqual } from "node:assert"

describe(segmentArray.name, () => {
    it("returns an empty array for an empty input", () => {
        deepEqual(segmentArray([], 10), [])
    })

    it("returns an array of 5 arrays, with 2 items each, except that last containing 1, for an input with 9 items", () => {
        deepEqual(segmentArray(new Array(9).fill(0), 2), [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
            [0]
        ])
    })
})
