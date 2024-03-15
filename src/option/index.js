/**
 * @template T
 * @typedef {null | T} Option
 */

/**
 * @template T
 * @param {Option<T>} opt
 * @returns {opt is T}
 */
export function isSome(opt) {
    return opt !== null
}

/**
 * @template T
 * @param {Option<T>} opt
 * @returns {opt is null}
 */
export function isNone(opt) {
    return opt === null
}
