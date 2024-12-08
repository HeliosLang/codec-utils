export { segmentArray } from "./array/index.js"
export {
    byteToBits,
    getBit,
    makeBitReader,
    makeBitWriter,
    maskBits,
    padBits
} from "./bits/index.js"
export {
    bytesToHex,
    compareBytes,
    decodeBase32,
    decodeBase64,
    dummyBytes,
    encodeBase32,
    encodeBase64,
    equalsBytes,
    hexToBytes,
    isValidBase32,
    isValidBase64,
    isValidHex,
    makeBase32,
    makeBase64,
    makeByteStream,
    padBytes,
    prepadBytes,
    toBytes,
    BASE32_DEFAULT_ALPHABET,
    BASE32_DEFAULT_PAD_CHAR,
    BASE32_DEFAULT_PROPS,
    BASE64_DEFAULT_ALPHABET,
    BASE64_DEFAULT_PAD_CHAR,
    BASE64_DEFAULT_PROPS
} from "./bytes/index.js"
export {
    decodeFloat16,
    decodeFloat32,
    decodeFloat64,
    encodeFloat16,
    encodeFloat32,
    encodeFloat64
} from "./float/index.js"
export {
    decodeBase58,
    decodeIntBE,
    decodeIntLE,
    decodeZigZag,
    encodeBase58,
    encodeIntBE,
    encodeIntLE32,
    encodeZigZag,
    makeUInt64,
    makeUInt64Fast,
    toInt,
    UINT64_ZERO
} from "./int/index.js"
export {
    decodeUtf8,
    encodeUtf8,
    isValidUtf8,
    makeStringWriter,
    removeWhitespace,
    replaceTabs
} from "./string/index.js"

/**
 * @typedef {object} Base32
 * @prop {string} alphabet
 * @prop {string} padChar
 * @prop {boolean} strict
 * @prop {(encoded: string) => number[]} decode
 * @prop {(encoded: string) => number[]} decodeRaw
 * @prop {(bytes: number[]) => string} encode
 * @prop {(bytes: number[]) => number[]} encodeRaw
 * @prop {(encoded: string) => boolean} isValid
 */

/**
 * In the first case the encoding operates without padding (and encoded strings with padding are invalid)
 * In the second case the padding character is specified. Strict defaults to false in which case unpadded encoded strings are also valid
 * @typedef {{
 *   alphabet?: string
 * } | {
 *   alphabet?: string
 *   padChar: string
 *   strict?: boolean
 * }} Base32Props
 */

/**
 * @typedef {object} Base64
 * @prop {string} alphabet
 * @prop {string} padChar
 * @prop {boolean} strict
 * @prop {(encoded: string) => number[]} decode
 * @prop {(encoded: string) => number[]} decodeRaw
 * @prop {(bytes: number[]) => string} encode
 * @prop {(bytes: number[]) => number[]} encodeRaw
 * @prop {(encoded: string) => boolean} isValid
 */

/**
 * In the first case the encoding operates without padding (and encoded strings with padding are invalid)
 * In the second case the padding character is specified. Strict defaults to false in which case unpadded encoded strings are also valid
 * @typedef {{
 *   alphabet?: string
 * } | {
 *   alphabet?: string
 *   padChar: string
 *   strict?: boolean
 * }} Base64Props
 */

/**
 * Read non-byte aligned numbers
 * @typedef {object} BitReader
 * @prop {() => boolean} eof
 * @prop {(force?: boolean) => void} moveToByteBoundary
 * @prop {(n: number) => number} readBits
 * @prop {() => number} readByte
 */

/**
 * BitWriter turns a string of '0's and '1's into a list of bytes.
 * Finalization pads the bits using '0*1' if not yet aligned with the byte boundary.
 * @typedef {object} BitWriter
 * @prop {number} length
 * @prop {(force?: boolean) => number[]} finalize
 * @prop {(force?: boolean) => void} padToByteBoundary
 * @prop {(n: number) => string} pop
 * @prop {(bitChars: string) => BitWriter} writeBits
 * @prop {(byte: number) => BitWriter} writeByte
 */

/**
 * @typedef {string | number[] | {value: number[]} | {bytes: number[]} | Uint8Array} ByteArrayLike
 */

/**
 * @typedef {ByteArrayLike | ByteStream} BytesLike
 */

/**
 * @typedef {object} ByteStream
 * @prop {Uint8Array} bytes
 * @prop {number} pos
 * @prop {() => ByteStream} copy
 * @prop {() => boolean} isAtEnd
 * @prop {() => number} peekOne
 * @prop {(n: number) => number[]} peekMany
 * @prop {() => number[]} peekRemaining
 * @prop {() => number} shiftOne
 * @prop {(n: number) => number[]} shiftMany
 * @prop {() => number[]} shiftRemaining
 */

/**
 * @typedef {number | bigint} IntLike
 */

/**
 * @typedef {object} StringWriter
 * @prop {() => string} finalize
 * @prop {(part: string) => StringWriter} write
 * @prop {(line: string) => StringWriter} writeLine
 */

/**
 * UInt64 number (represented by 2 UInt32 numbers)
 * If performance is very important: create an initial prototype of your algorithm using this class, and then inline all the operations (eg. how it was done for sha2_512)
 * @typedef {object} UInt64
 * @prop {number} high
 * @prop {number} low
 * @prop {(other: UInt64) => UInt64} add
 * @prop {(other: UInt64) => UInt64} and
 * @prop {(other: UInt64) => UInt64} xor
 * @prop {(other: UInt64) => boolean} eq
 * @prop {() => UInt64} not
 * @prop {(n: number) => UInt64} rotr
 * @prop {(n: number) => UInt64} shiftr
 * @prop {(littleEndian?: boolean) => number[]} toBytes
 */
