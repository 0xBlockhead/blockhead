/**
 * Allium wallet balances and token metadata endpoints.
 * @see https://docs.allium.so/api/developer/wallets/latest-token-balances.md
 * @see https://docs.allium.so/api/developer/tokens/get-tokens-by-chain-address.md
 */

import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { alliumFetch } from '$/sources/Allium/Rest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	alliumLatestWalletBalancesEnvelopeWire,
	alliumTokenLookupErrorWire,
	alliumTokenWire,
	type AlliumLatestWalletBalancesEnvelope,
	type AlliumTokensByChainAddress,
} from '$/sources/Allium/Rest/types.ts'
import { type as arktype } from 'arktype'

const evmAddressPattern = /^0x[0-9a-f]{40}$/i

const unknownArrayWire = arktype('unknown[]').atMostLength(200)

const assertEnvelope = <_Value>(
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Allium_Rest: invalid ${label} response envelope`)
	}
}

const assertAlliumLatestWalletBalancesBusinessRules = (
	envelope: AlliumLatestWalletBalancesEnvelope,
	address: string,
	apiChain: string,
	cursor?: string
) => {
	if (cursor != null && cursor !== '' && envelope.cursor === cursor)
		throw new Error('Allium_Rest: wallet balances cursor did not advance')

	for (const balance of envelope.items) {
		if (
			balance.address.toLowerCase() !== address.toLowerCase()
			|| balance.chain !== apiChain
		)
			throw new Error('Allium_Rest: wallet balance subject mismatch')
		if (balance.token != null && balance.token.chain !== apiChain)
			throw new Error('Allium_Rest: wallet balance token chain mismatch')

		if (
			balance.token?.type === 'evm_erc20'
			&& !evmAddressPattern.test(balance.token.address)
		)
			throw new Error('Allium_Rest: invalid token address')

		if (
			balance.block_timestamp != null
			&& balance.block_timestamp !== ''
			&& !Number.isFinite(Date.parse(balance.block_timestamp))
		)
			throw new Error('Allium_Rest: invalid balance block_timestamp')
	}

	return envelope
}

export const getLatestWalletBalances = async ({
	binding,
	publicEnv,
	address,
	apiChain,
	withLiquidityInfo = false,
	cursor,
}: {
	binding: SourceBinding
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

	return assertAlliumLatestWalletBalancesBusinessRules(
		assertEnvelope(
			'wallet balances',
			alliumLatestWalletBalancesEnvelopeWire,
			await alliumFetch<unknown>(
				binding,
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
		),
		address,
		apiChain,
		cursor
	)
}

export const getTokensByChainAddress = async ({
	binding,
	publicEnv,
	apiChain,
	tokenAddress,
}: {
	binding: SourceBinding
	publicEnv: SourcePublicEnv
	apiChain: string
	tokenAddress: string
}): Promise<AlliumTokensByChainAddress> => {
	if (apiChain.trim() === '')
		throw new Error('Allium_Rest: invalid api chain')

	if (!evmAddressPattern.test(tokenAddress))
		throw new Error('Allium_Rest: invalid token address')

	const rows = assertEnvelope(
		'tokens-by-address',
		unknownArrayWire,
		await alliumFetch<unknown>(
			binding,
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

	const parsed: AlliumTokensByChainAddress = []

	for (const row of rows) {
		const asError = alliumTokenLookupErrorWire(row)
		if (!(asError instanceof arktype.errors)) {
			if (asError.error.trim() === '')
				throw new Error('Allium_Rest: invalid tokens-by-address response envelope')

			parsed.push(asError)
			continue
		}

		const token = assertEnvelope(
			'tokens-by-address',
			alliumTokenWire,
			row
		)
		if (!evmAddressPattern.test(token.address))
			throw new Error('Allium_Rest: invalid token address')
		if (
			token.chain !== apiChain
			|| token.address.toLowerCase() !== tokenAddress.toLowerCase()
		)
			throw new Error('Allium_Rest: token response subject mismatch')

		parsed.push(token)
	}

	return parsed
}
