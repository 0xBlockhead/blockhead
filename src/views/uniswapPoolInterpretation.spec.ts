import { describe, expect, it } from 'vitest'
import { protocolFeeShares, rawSpotPrice } from './uniswapPoolInterpretation.ts'

describe('Uniswap pool interpretation', () => {
	it.each([
		[2n ** 96n, 1n, 1n],
		[2n ** 95n, 1n, 4n],
		[3n * 2n ** 96n, 9n, 1n],
		[1n, 1n, 2n ** 192n],
	])('preserves exact raw-unit price for %s', (sqrt, numerator, denominator) => {
		expect(rawSpotPrice(sqrt)).toEqual({ numerator, denominator })
	})

	it('does not round uint160 prices through floating point', () => {
		const sqrt = 2n ** 160n - 1n
		expect(rawSpotPrice(sqrt)).toEqual({
			numerator: sqrt * sqrt,
			denominator: 2n ** 192n,
		})
	})

	it.each([0n, -1n, 2n ** 160n])('rejects unavailable or invalid price %s', (sqrt) => {
		expect(() => rawSpotPrice(sqrt)).toThrow(RangeError)
	})

	it.each([
		[0, 0, 0],
		[4, 4, 0],
		[96, 0, 6],
		[100, 4, 6],
	])('decodes independent token fee denominators from %s', (packed, token0, token1) => {
		expect(protocolFeeShares(packed)).toEqual({ token0, token1 })
	})

	it.each([-1, 256, 1.5, NaN])('rejects invalid packed fee %s', (packed) => {
		expect(() => protocolFeeShares(packed)).toThrow(RangeError)
	})
})
