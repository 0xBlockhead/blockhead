/**
 * Allium wallet balances and token metadata endpoints.
 * @see https://docs.allium.so/api/developer/wallets/latest-token-balances.md
 * @see https://docs.allium.so/api/developer/tokens/get-tokens-by-chain-address.md
 */

import { alliumFetch } from '$/sources/Allium/Rest/client.ts'
import type {
	AlliumLatestWalletBalancesEnvelope,
	AlliumToken,
} from '$/sources/Allium/Rest/types.ts'

export const getAlliumLatestWalletBalances = async ({
	address,
	alliumChain,
	withLiquidityInfo = false,
}: {
	address: string
	alliumChain: string
	withLiquidityInfo?: boolean
}) => (
	await alliumFetch<AlliumLatestWalletBalancesEnvelope>(
		`/api/v1/developer/wallet/balances?with_liquidity_info=${String(withLiquidityInfo)}`,
		{
			method: 'POST',
			body: JSON.stringify([
				{
					address,
					chain: alliumChain,
				},
			]),
		},
	)
)

export const getAlliumTokensByChainAddress = async ({
	alliumChain,
	tokenAddress,
}: {
	alliumChain: string
	tokenAddress: string
}) => (
	await alliumFetch<(AlliumToken | {
		error: string
		address: string
		chain: string
	})[]>(
		'/api/v1/developer/tokens/chain-address',
		{
			method: 'POST',
			body: JSON.stringify([
				{
					chain: alliumChain,
					token_address: tokenAddress,
				},
			]),
		},
	)
)
