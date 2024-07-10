/**
 * @param {string} str
 * @returns {string}
 */
export function removeWhitespace(str) {
    return str.replace(/\s+/g, "").trim()
}

/**
 * Replaces the tab characters of a string with spaces
 * @param {string} str
 * @param {string} tab
 * @returns {string}
 */
export function replaceTabs(str, tab = "    ") {
    return str.replace(new RegExp("\t", "g"), tab)
}
