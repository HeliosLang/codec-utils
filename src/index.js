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
 * @typedef {import("./bits/index.js").BitReader} BitReader
 * @typedef {import("./bits/index.js").BitWriter} BitWriter
 * @typedef {import("./bytes/index.js").Base32} Base32
 * @typedef {import("./bytes/index.js").Base64} Base64
 * @typedef {import("./bytes/index.js").BytesLike} BytesLike
 * @typedef {import("./bytes/index.js").ByteStream} ByteStream
 * @typedef {import("./int/index.js").IntLike} IntLike
 * @typedef {import("./int/index.js").UInt64} UInt64
 * @typedef {import("./string/index.js").StringWriter} StringWriter
 */
