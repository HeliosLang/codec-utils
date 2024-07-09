/**
 * @param {string} str
 * @returns {string}
 */
export function removeWhitespace(str) {
    return str.replace(/\s+/g, "").trim()
}
