import { describe, expect, it } from 'vitest'

import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'


describe('EVM route params', () => {
	it('accepts only 32-byte transaction hashes and decimal non-negative indexes', () => {
		expect(matchEvmTxHash('0x5e4763cd6b6f129869fff1d60bfadf1d37e1677cb8f1d8997299680da09d5b01')).toBe(true)
		expect(matchEvmTxHash('not-a-hash')).toBe(false)
		expect(matchEvmTxHash('0x1')).toBe(false)

		expect(matchNonNegativeInteger('0')).toBe(true)
		expect(matchNonNegativeInteger('100')).toBe(true)
		expect(matchNonNegativeInteger('1e2')).toBe(false)
		expect(matchNonNegativeInteger('0x10')).toBe(false)
		expect(matchNonNegativeInteger('-1')).toBe(false)
	})
})
