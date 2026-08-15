import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	BencodeRequest,
	BencodeValue,
} from '$/sources/_shared/wire/Bencode/types.ts'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const concatChunks = (chunks: readonly Uint8Array[]) => {
	const totalLength = chunks.reduce((length, chunk) => length + chunk.byteLength, 0)
	const result = new Uint8Array(totalLength)
	let offset = 0
	for (const chunk of chunks) {
		result.set(chunk, offset)
		offset += chunk.byteLength
	}
	return result
}

const compareByteStrings = (left: Uint8Array, right: Uint8Array) => {
	const sharedLength = Math.min(left.byteLength, right.byteLength)
	for (let index = 0; index < sharedLength; index++) {
		if (left[index] !== right[index])
			return left[index] - right[index]
	}
	return left.byteLength - right.byteLength
}

/** Fail-closed bencode encoder (BEP 3). Byte strings are `Uint8Array` or ASCII strings. */
export const encodeBencode = (value: BencodeValue): Uint8Array => {
	const chunks: Uint8Array[] = []
	const encode = (current: BencodeValue) => {
		if (typeof current === 'string') {
			const bytes = textEncoder.encode(current)
			chunks.push(textEncoder.encode(`${bytes.byteLength}:`))
			chunks.push(bytes)
			return
		}
		if (typeof current === 'number') {
			if (!Number.isSafeInteger(current))
				throw new Error('Bencode: integer out of safe range')
			chunks.push(textEncoder.encode(`i${String(current)}e`))
			return
		}
		if (current instanceof Uint8Array) {
			chunks.push(textEncoder.encode(`${current.byteLength}:`))
			chunks.push(current)
			return
		}
		if (current instanceof Array) {
			chunks.push(textEncoder.encode('l'))
			for (const item of current)
				encode(item)
			chunks.push(textEncoder.encode('e'))
			return
		}
		if (!(current instanceof Object))
			throw new Error('Bencode: unsupported value in dict position')
		const entries = Object.entries(current)
		entries.sort(([leftKey], [rightKey]) => (
			compareByteStrings(textEncoder.encode(leftKey), textEncoder.encode(rightKey))
		))
		chunks.push(textEncoder.encode('d'))
		for (const [key, item] of entries) {
			const keyBytes = textEncoder.encode(key)
			chunks.push(textEncoder.encode(`${keyBytes.byteLength}:${key}`))
			encode(item)
		}
		chunks.push(textEncoder.encode('e'))
	}
	encode(value)
	return concatChunks(chunks)
}

/** Fail-closed bencode decoder (BEP 3). Byte strings decode to `Uint8Array`. */
export const decodeBencode = (bytes: Uint8Array): BencodeValue => {
	let offset = 0
	const readByte = () => {
		if (offset >= bytes.byteLength)
			throw new Error('Bencode: unexpected end of input')
		return bytes[offset++]
	}
	const decodeByteString = (): Uint8Array => {
		let lengthRaw = ''
		for (;;) {
			const byte = readByte()
			if (byte === 0x3a)
				break
			if (byte < 0x30 || byte > 0x39)
				throw new Error('Bencode: invalid byte string length')
			lengthRaw += String.fromCharCode(byte)
		}
		if (lengthRaw === '' || (lengthRaw.length > 1 && lengthRaw.startsWith('0')))
			throw new Error('Bencode: invalid byte string length')
		const length = Number(lengthRaw)
		if (!Number.isSafeInteger(length) || length < 0)
			throw new Error('Bencode: invalid byte string length')
		if (offset + length > bytes.byteLength)
			throw new Error('Bencode: byte string exceeds input')
		const value = bytes.subarray(offset, offset + length)
		offset += length
		return value
	}
	const decodeValue = (): BencodeValue => {
		const marker = bytes[offset]
		if (marker === 0x69) {
			offset++
			let raw = ''
			for (;;) {
				const byte = readByte()
				if (byte === 0x65)
					break
				if (byte === 0x2d) {
					if (raw !== '')
						throw new Error('Bencode: misplaced minus sign')
				} else if (byte < 0x30 || byte > 0x39)
					throw new Error('Bencode: invalid integer digit')
				raw += String.fromCharCode(byte)
			}
			if (raw === '' || raw === '-')
				throw new Error('Bencode: empty integer')
			if ((raw.length > 1 && raw.startsWith('0')) || raw.startsWith('-0'))
				throw new Error('Bencode: integer leading zero')
			const value = Number(raw)
			if (!Number.isSafeInteger(value))
				throw new Error('Bencode: integer exceeds safe integer range')
			return value
		}
		if (marker === 0x6c) {
			offset++
			const items: BencodeValue[] = []
			for (;;) {
				if (bytes[offset] === 0x65) {
					offset++
					break
				}
				items.push(decodeValue())
			}
			return items
		}
		if (marker === 0x64) {
			offset++
			const dict: { [key: string]: BencodeValue } = {}
			for (;;) {
				if (bytes[offset] === 0x65) {
					offset++
					break
				}
				const key = decodeByteString()
				dict[textDecoder.decode(key)] = decodeValue()
			}
			return dict
		}
		if (marker >= 0x30 && marker <= 0x39)
			return decodeByteString()
		throw new Error('Bencode: unexpected token')
	}
	const value = decodeValue()
	if (offset !== bytes.byteLength)
		throw new Error('Bencode: trailing data after value')
	return value
}

export const bencodeRequest = (
	binding: SourceBinding,
	request: BencodeRequest
) => ({
	binding,
	request,
})
