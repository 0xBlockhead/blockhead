/**
 * Blockscout REST API v2 base path.
 * @see https://docs.blockscout.com/devs/apis/rest
 */

import { CoinId } from '$/constants/Coin.ts'

// Constants

export const restPath = '/api/v2'

/**
 * Inclusive maximum list size for Blockscout REST v2 pagination (clamp client limits here).
 * Standard list endpoints use query param **`items_count`** (422 above this).
 * **`/proxy/account-abstraction/*`** list routes expect **`page_size`** instead (same numeric ceiling).
 */
export const blockscoutV2ItemsCountMax = 50

export const blockscoutNativeCoinOverrides = [
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
] as const satisfies readonly {
	chainId: number
	nativeCoinId: CoinId
}[]
