import { padBits } from "../bits/ops.js"

/**
 * Converts a hexadecimal string into a list of bytes.
 * @example
 * hexToBytes("00ff34") == [0, 255, 52]
 * @param {string} hex
 * @returns {number[]}
 */
export function hexToBytes(hex) {
    hex = hex.trim()

    const bytes = []

    const n = hex.length

    if (n % 2 != 0) {
        throw new Error(`invalid hexstring "${hex}" due to uneven length`)
    }

    for (let i = 0; i < n; i += 2) {
        const b = parseInt(hex.slice(i, i + 2), 16)

        if (Number.isNaN(b)) {
            throw new Error(`invalid hexstring "${hex}"`)
        }

        bytes.push(b)
    }

    return bytes
}

/**
 * Converts a list of uint8 bytes into its hexadecimal string representation.
 * @example
 * bytesToHex([0, 255, 52]) == "00ff34"
 * @param {number[]} bytes
 * @returns {string}
 */
export function bytesToHex(bytes) {
    const parts = []

    for (let b of bytes) {
        if (b < 0 || b > 255) {
            throw new Error("invalid byte")
        }

        parts.push(padBits(b.toString(16), 2))
    }

    return parts.join("")
}
