import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	decodeBencode,
	encodeBencode,
} from '$/sources/_shared/wire/Bencode/client.ts'
import type { BencodeValue } from '$/sources/_shared/wire/Bencode/types.ts'

const textDecoder = new TextDecoder()

const decodeAscii = (value: BencodeValue) => {
	if (value instanceof Uint8Array)
		return textDecoder.decode(value)
	return value
}

const decodeAsciiDict = (value: BencodeValue): { [key: string]: BencodeValue } => {
	if (!(value instanceof Object) || value instanceof Uint8Array || value instanceof Array || Number.isSafeInteger(value))
		throw new Error('expected dict')
	return Object.fromEntries(
		Object.entries(value).map(([key, item]) => [key, decodeAscii(item)])
	)
}

describe('shared bencode wire codec', () => {
	it('encodes byte strings, integers, lists and dicts per BEP 3 examples', () => {
		expect(textDecoder.decode(encodeBencode('spam'))).toBe('4:spam')
		expect(textDecoder.decode(encodeBencode({ bar: 'spam', foo: 42 }))).toBe(
			'd3:bar4:spam3:fooi42ee'
		)
		expect(textDecoder.decode(encodeBencode([1, 2, 'spam']))).toBe('li1ei2e4:spame')
		expect(textDecoder.decode(encodeBencode({ a: { b: 3 } }))).toBe('d1:ad1:bi3eee')
		expect(encodeBencode(new Uint8Array([0, 1, 2, 255]))).toEqual(
			new Uint8Array([0x34, 0x3a, 0x00, 0x01, 0x02, 0xff])
		)
	})

	it('sorts dict keys bytewise and supports nested values', () => {
		const bytes = encodeBencode({
			z: 1,
			a: 'x',
			m: 9,
		})
		expect(textDecoder.decode(bytes)).toBe('d1:a1:x1:mi9e1:zi1ee')
	})

	it('round-trips decoded values back to the same bytes', () => {
		const encoded = new TextEncoder().encode('d1:ad2:id20:abcdefghij0123456789e1:q4:ping1:t2:aa1:y1:qe')
		expect(encodeBencode(decodeBencode(encoded))).toEqual(encoded)
	})

	it('decodes BEP 3 canonical forms into structured values', () => {
		expect(decodeAsciiDict(decodeBencode(new TextEncoder().encode('d3:bar4:spam3:fooi42ee')))).toEqual({
			bar: 'spam',
			foo: 42,
		})
		const list = decodeBencode(new TextEncoder().encode('li1ei2e4:spame'))
		expect(Array.isArray(list)).toBe(true)
		expect(list).toEqual([1, 2, new Uint8Array([0x73, 0x70, 0x61, 0x6d])])
	})

	it('fails closed on malformed input', () => {
		expect(() => decodeBencode(new TextEncoder().encode('4:spa'))).toThrow('exceeds input')
		expect(() => decodeBencode(new TextEncoder().encode('i007e'))).toThrow('leading zero')
		expect(() => decodeBencode(new TextEncoder().encode('i-0e'))).toThrow('leading zero')
		expect(() => decodeBencode(new TextEncoder().encode('de2:x'))).toThrow('trailing data')
		expect(() => decodeBencode(new TextEncoder().encode('d1:ai1e'))).toThrow('unexpected end of input')
		expect(() => decodeBencode(new TextEncoder().encode('li1ei2'))).toThrow('unexpected end of input')
	})

	it('fails closed on values bencode cannot express', () => {
		expect(() => encodeBencode(1.5)).toThrow('integer out of safe range')
		expect(() => encodeBencode(Number.MAX_SAFE_INTEGER + 1)).toThrow('integer out of safe range')
	})
})
