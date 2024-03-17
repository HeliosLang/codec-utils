/**
 * @template T
 * @typedef {null | undefined | T} Option
 */

/**
 * @type {null}
 */
export const None = null

/**
 * @template T
 * @param {Option<T>} opt
 * @returns {opt is T}
 */
export function isSome(opt) {
    return opt !== null && opt !== undefined
}

/**
 * @template T
 * @param {Option<T>} opt
 * @returns {opt is null}
 */
export function isNone(opt) {
    return opt === null || opt === undefined
}
