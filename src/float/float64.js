/**
 * Leverages the builtin DataView class to decode a IEEE 754 float64 number
 * @param {number[]} bytes
 * @returns {number}
 */
export function decodeFloat64(bytes) {
    if (bytes.length != 8) {
        throw new Error(
            `expected 8 bytes for IEEE 754 encoded Float64, got ${bytes.length} bytes`
        )
    }

    const view = new DataView(Uint8Array.from(bytes).buffer)

    return view.getFloat64(0)
}

/**
 * Leverages the builtin DataView class to encode a floating point number using IEEE 754 float64 encoding
 * @param {number} f
 * @returns {number[]}
 */
export function encodeFloat64(f) {
    const view = new DataView(new ArrayBuffer(8))

    view.setFloat64(0, f)

    return Array.from(new Uint8Array(view.buffer))
}
