/**
 * Leverages the builtin DataView class to decode a IEEE 754 float32 number
 * @param {number[]} bytes
 */
export function decodeFloat32(bytes) {
    if (bytes.length != 4) {
        throw new Error(
            `expected 4 bytes for IEEE 754 encoded Float32, got ${bytes.length} bytes`
        )
    }

    const view = new DataView(Uint8Array.from(bytes).buffer)

    return view.getFloat32(0)
}

/**
 * Leverages the builtin DataView class to encode a floating point number using IEEE 754 float32 encoding
 * @param {number} f
 * @returns {number[]}
 */
export function encodeFloat32(f) {
    const view = new DataView(new ArrayBuffer(4))

    view.setFloat32(0, f)

    return Array.from(new Uint8Array(view.buffer))
}
