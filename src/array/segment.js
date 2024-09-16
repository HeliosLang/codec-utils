/**
 * @template T
 * @param {T[]} array
 * @param {number} segmentSize
 * @returns {T[][]}
 */
export function segmentArray(array, segmentSize) {
    const n = array.length

    /**
     * @type {T[][]}
     */
    const segments = []

    for (let i = 0; i < n; i += segmentSize) {
        segments.push(array.slice(i, i + segmentSize))
    }

    return segments
}
