export {}

/**
 * @typedef {number | bigint} IntLike
 */

/**
 * Throws an error if the arg isn't a whole number
 * @param {IntLike} arg
 * @returns {number} - a whole number
 */
export function toInt(arg) {
    if (typeof arg == "bigint") {
        return Number(arg)
    } else if (arg % 1.0 == 0.0) {
        return arg
    } else {
        throw new Error("not a whole number")
    }
}
