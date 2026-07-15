import { describe, expect, it } from 'vitest'

import { match } from '$/params/solanaPubkey.ts'


describe('Solana public key route param', () => {
	it('accepts canonical base58 encodings of exactly 32 bytes', () => {
		expect(match('SysvarRent111111111111111111111111111111111')).toBe(true)
		expect(match('11111111111111111111111111111111')).toBe(true)
	})

	it('rejects base58 strings that decode to lengths other than 32 bytes', () => {
		expect(match('z'.repeat(44))).toBe(false)
		expect(match('1'.repeat(44))).toBe(false)
	})

	it('rejects malformed base58', () => {
		expect(match('invalid-0OIl-pubkey')).toBe(false)
	})
})
