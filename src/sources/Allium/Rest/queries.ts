/**
 * Allium wallet balances and token metadata endpoints.
 * @see https://docs.allium.so/api/developer/wallets/latest-token-balances.md
 * @see https://docs.allium.so/api/developer/tokens/get-tokens-by-chain-address.md
 */

import { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { alliumFetch } from '$/sources/Allium/Rest/client.ts'
import type {
	AlliumLatestWalletBalancesEnvelope,
	AlliumToken,
} from '$/sources/Allium/Rest/types.ts'

export const getLatestWalletBalances = async ({
	publicEnv,
	address,
	apiChain,
	withLiquidityInfo = false,
}: {
	publicEnv: SourcePublicEnvFor<Source.Allium_Rest>
	address: string
	apiChain: string
	withLiquidityInfo?: boolean
}) => (
	await alliumFetch<AlliumLatestWalletBalancesEnvelope>(
		publicEnv,
		`/api/v1/developer/wallet/balances?with_liquidity_info=${String(withLiquidityInfo)}`,
		{
			method: 'POST',
			body: JSON.stringify([
				{
					address,
					chain: apiChain,
				},
			]),
		}
	)
)

export const getTokensByChainAddress = async ({
	publicEnv,
	apiChain,
	tokenAddress,
}: {
	publicEnv: SourcePublicEnvFor<Source.Allium_Rest>
	apiChain: string
	tokenAddress: string
}) => (
	await alliumFetch<(AlliumToken | {
		error: string
		address: string
		chain: string
	})[]>(
		publicEnv,
		'/api/v1/developer/tokens/chain-address',
		{
			method: 'POST',
			body: JSON.stringify([
				{
					chain: apiChain,
					token_address: tokenAddress,
				},
			]),
		}
	)
)
