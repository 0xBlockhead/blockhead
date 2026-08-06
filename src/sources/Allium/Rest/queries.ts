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
	AlliumWalletBalance,
} from '$/sources/Allium/Rest/types.ts'

const unsignedIntegerPattern = /^(0|[1-9][0-9]*)$/
const evmAddressPattern = /^0x[0-9a-f]{40}$/i

const assertAlliumToken = (
	token: AlliumToken | undefined,
	{
		requireAddress = false,
	}: {
		requireAddress?: boolean
	} = {}
) => {
	if (token == null)
		throw new Error('Allium_Rest: wallet token metadata missing')

	if (token.chain.trim() === '')
		throw new Error('Allium_Rest: wallet token chain missing')

	if (
		token.decimals != null
		&& (
			!Number.isSafeInteger(token.decimals)
			|| token.decimals < 0
			|| token.decimals > 255
		)
	)
		throw new Error('Allium_Rest: invalid token decimals')

	if (
		token.price != null
		&& !Number.isFinite(token.price)
	)
		throw new Error('Allium_Rest: invalid token price')

	if (
		token.info != null
		&& (
			token.info.name.trim() === ''
			|| token.info.symbol.trim() === ''
		)
	)
		throw new Error('Allium_Rest: incomplete token info')

	if (
		requireAddress
		&& !evmAddressPattern.test(token.address)
	)
		throw new Error('Allium_Rest: invalid token address')
}

const assertAlliumWalletBalance = (
	balance: AlliumWalletBalance
) => {
	if (balance.chain.trim() === '' || balance.address.trim() === '')
		throw new Error('Allium_Rest: wallet balance identity missing')

	if (
		balance.raw_balance_str != null
		&& !unsignedIntegerPattern.test(balance.raw_balance_str)
	)
		throw new Error('Allium_Rest: invalid raw_balance_str')

	if (
		balance.block_number != null
		&& (
			!Number.isSafeInteger(balance.block_number)
			|| balance.block_number < 0
		)
	)
		throw new Error('Allium_Rest: invalid balance block_number')

	if (
		balance.block_timestamp != null
		&& balance.block_timestamp !== ''
		&& !Number.isFinite(Date.parse(balance.block_timestamp))
	)
		throw new Error('Allium_Rest: invalid balance block_timestamp')

	if (balance.token != null) {
		assertAlliumToken(balance.token, {
			requireAddress: balance.token.type === 'evm_erc20',
		})
	}
}

const assertAlliumLatestWalletBalancesEnvelope = (
	envelope: AlliumLatestWalletBalancesEnvelope
) => {
	if (!Array.isArray(envelope.items))
		throw new Error('Allium_Rest: wallet balances envelope missing items')

	if (envelope.items.length > 5_000)
		throw new Error('Allium_Rest: wallet balances page too large')

	if (
		envelope.cursor != null
		&& envelope.cursor.trim() === ''
	)
		throw new Error('Allium_Rest: invalid wallet balances cursor')

	for (const balance of envelope.items)
		assertAlliumWalletBalance(balance)

	return envelope
}

export const getLatestWalletBalances = async ({
	publicEnv,
	address,
	apiChain,
	withLiquidityInfo = false,
	cursor,
}: {
	publicEnv: SourcePublicEnv
	address: string
	apiChain: string
	withLiquidityInfo?: boolean
	cursor?: string
}) => {
	if (!evmAddressPattern.test(address))
		throw new Error('Allium_Rest: invalid wallet address')

	if (apiChain.trim() === '')
		throw new Error('Allium_Rest: invalid api chain')

	const search = new URLSearchParams({
		with_liquidity_info: String(withLiquidityInfo),
	})
	if (cursor != null && cursor !== '')
		search.set('cursor', cursor)

	return assertAlliumLatestWalletBalancesEnvelope(
		await alliumFetch<AlliumLatestWalletBalancesEnvelope>(
			publicEnv,
			`/api/v1/developer/wallet/balances?${search.toString()}`,
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
}

export const getTokensByChainAddress = async ({
	publicEnv,
	apiChain,
	tokenAddress,
}: {
	publicEnv: SourcePublicEnv
	apiChain: string
	tokenAddress: string
}) => {
	if (apiChain.trim() === '')
		throw new Error('Allium_Rest: invalid api chain')

	if (!evmAddressPattern.test(tokenAddress))
		throw new Error('Allium_Rest: invalid token address')

	const rows = await alliumFetch<(AlliumToken | {
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

	if (!Array.isArray(rows))
		throw new Error('Allium_Rest: tokens-by-address response is not an array')

	if (rows.length > 200)
		throw new Error('Allium_Rest: tokens-by-address response too large')

	for (const row of rows) {
		if ('error' in row) {
			if (row.error.trim() === '')
				throw new Error('Allium_Rest: token lookup error missing message')
			continue
		}

		assertAlliumToken(row, {
			requireAddress: true,
		})
	}

	return rows
}
