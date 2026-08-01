/**
 * Allium wallet balances and token metadata endpoints.
 * @see https://docs.allium.so/api/developer/wallets/latest-token-balances.md
 * @see https://docs.allium.so/api/developer/tokens/get-tokens-by-chain-address.md
 */

import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { alliumFetch } from '$/sources/Allium/Rest/client.ts'
import type {
	AlliumLatestWalletBalancesEnvelope,
	AlliumToken,
} from '$/sources/Allium/Rest/types.ts'

export const getLatestWalletBalances = ({
	publicEnv,
	address,
	apiChain,
	withLiquidityInfo = false,
}: {
	publicEnv: SourcePublicEnv
	address: string
	apiChain: string
	withLiquidityInfo?: boolean
}) => (
	alliumFetch<AlliumLatestWalletBalancesEnvelope>(
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

export const getTokensByChainAddress = ({
	publicEnv,
	apiChain,
	tokenAddress,
}: {
	publicEnv: SourcePublicEnv
	apiChain: string
	tokenAddress: string
}) => (
	alliumFetch<(AlliumToken | {
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
