import {
	describe,
	expect,
	it,
} from 'vitest'

import { DecimalString } from '$/schema/DecimalString.ts'
import { NonNegativeDecimalString } from '$/schema/NonNegativeDecimalString.ts'

describe('decimal string value types', () => {
	it.each([
		'0',
		'-0',
		'1',
		'-1',
		'0.000000000000000001',
		'-9007199254740993.000000000000000001',
	])('accepts canonical signed decimal %s', (value) => {
		expect(DecimalString.allows(value)).toBe(true)
	})

	it.each([
		'+1',
		'.1',
		'1.',
		'01',
		'-01',
		'1e3',
		' 1',
	])('rejects noncanonical decimal %s', (value) => {
		expect(DecimalString.allows(value)).toBe(false)
	})

	it('accepts only unsigned representations as nonnegative decimals', () => {
		expect(NonNegativeDecimalString.allows('9007199254740993.000000000000000001')).toBe(true)
		expect(NonNegativeDecimalString.allows('-0')).toBe(false)
		expect(NonNegativeDecimalString.allows('-0.000000000000000001')).toBe(false)
	})
})
