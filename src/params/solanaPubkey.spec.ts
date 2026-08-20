import { expect, it } from 'vitest'

import { match } from '$/params/solanaPubkey.ts'

it('accepts only canonical base58 encodings of exactly 32 bytes', () => {
	expect(match('SysvarRent111111111111111111111111111111111')).toBe(true)
	expect(match('11111111111111111111111111111111')).toBe(true)
	expect(match('z'.repeat(44))).toBe(false)
	expect(match('1'.repeat(44))).toBe(false)
	expect(match('invalid-0OIl-pubkey')).toBe(false)
})
