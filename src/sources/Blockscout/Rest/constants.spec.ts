import { describe, expect, it } from 'vitest'

import { CoinId } from '$/constants/Coin.ts'
import { blockscoutNativeCoinOverrides } from '$/sources/Blockscout/Rest/constants.ts'

describe('Blockscout REST constants', () => {
	it('records only non-ETH native coin overrides', () => {
		expect(blockscoutNativeCoinOverrides).toEqual([
			{
				chainId: 56,
				nativeCoinId: CoinId.BNB,
			},
			{
				chainId: 100,
				nativeCoinId: CoinId.XDAI,
			},
			{
				chainId: 137,
				nativeCoinId: CoinId.POL,
			},
		])
	})
})
