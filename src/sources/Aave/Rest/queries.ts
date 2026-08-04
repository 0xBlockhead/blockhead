/**
 * Aave V3 GraphQL named operations (HTTP POST to api.v3.aave.com/graphql).
 * @see https://aave.com/docs/aave-v3/markets/data.md
 * @see https://aave.com/docs/aave-v3/getting-started/graphql.md
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Aave/bindings.ts'
import { aaveChainByChainId } from '$/sources/Aave/Rest/constants.ts'
import type {
	AaveMarketData,
	AaveMarketWire,
	AaveMarketsData,
} from '$/sources/Aave/Rest/types.ts'
import {
	aaveMarketEnvelope,
	aaveMarketsEnvelope,
} from '$/sources/Aave/Rest/types.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Aave_Rest][0]

const marketFields = `
	name
	address
	icon
	totalMarketSize
	totalAvailableLiquidity
	chain {
		chainId
		name
		icon
	}
`

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Aave_Rest}: invalid chain id ${String(chainId)}`)
	if (aaveChainByChainId[chainId] == null)
		throw new Error(`${Source.Aave_Rest}: unsupported chain id ${String(chainId)}`)
}

const assertPoolAddress = (poolAddress: string) => {
	const normalized = hexLowerOfByteSize(poolAddress, 20)
	if (normalized == null)
		throw new Error(`${Source.Aave_Rest}: invalid pool address ${poolAddress}`)
	return normalized
}

const assertEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`${Source.Aave_Rest}: invalid ${label} response envelope`)
	}
}

const assertMarketWire = (
	market: AaveMarketWire,
	expected?: {
		chainId: number
		poolAddress: `0x${string}`
	}
) => {
	assertChainId(market.chain.chainId)
	const address = assertPoolAddress(market.address)
	if (market.name.length < 1)
		throw new Error(`${Source.Aave_Rest}: market missing name`)
	if (market.icon.length < 1)
		throw new Error(`${Source.Aave_Rest}: market missing icon`)
	if (market.totalMarketSize.length < 1)
		throw new Error(`${Source.Aave_Rest}: market missing totalMarketSize`)
	if (market.totalAvailableLiquidity.length < 1)
		throw new Error(`${Source.Aave_Rest}: market missing totalAvailableLiquidity`)
	if (expected != null) {
		if (market.chain.chainId !== expected.chainId)
			throw new Error(`${Source.Aave_Rest}: market chain mismatch`)
		if (address !== expected.poolAddress)
			throw new Error(`${Source.Aave_Rest}: market address mismatch`)
	}
	return {
		...market,
		address,
	}
}

/** List Aave markets for one or more supported EIP-155 chain ids. */
export const listMarkets = async ({
	chainIds,
}: {
	chainIds: readonly number[]
}) => {
	if (chainIds.length < 1)
		throw new Error(`${Source.Aave_Rest}: chainIds required`)
	for (const chainId of chainIds)
		assertChainId(chainId)

	const data = await graphql<AaveMarketsData>({
		binding,
		query: `
			query Markets($request: MarketsRequest!) {
				markets(request: $request) {
					${marketFields}
				}
			}
		`,
		variables: {
			request: {
				chainIds: [
					...chainIds,
				],
			},
		},
	})
	if (data == null)
		throw new Error(`${Source.Aave_Rest}: markets response missing data`)
	if (data.markets == null)
		throw new Error(`${Source.Aave_Rest}: markets response missing markets`)
	assertEnvelope(aaveMarketsEnvelope, data.markets, 'markets')

	return data.markets.map((market) => {
		if (!chainIds.includes(market.chain.chainId))
			throw new Error(`${Source.Aave_Rest}: market chain filter violated`)

		return assertMarketWire(market)
	})
}

/** Fetch one Aave market by pool address and chain id. */
export const getMarket = async ({
	chainId,
	poolAddress,
}: {
	chainId: number
	poolAddress: string
}) => {
	assertChainId(chainId)
	const normalizedPoolAddress = assertPoolAddress(poolAddress)

	const data = await graphql<AaveMarketData>({
		binding,
		query: `
			query Market($request: MarketRequest!) {
				market(request: $request) {
					${marketFields}
				}
			}
		`,
		variables: {
			request: {
				address: normalizedPoolAddress,
				chainId,
			},
		},
	})
	if (data == null)
		throw new Error(`${Source.Aave_Rest}: market response missing data`)
	if (data.market === undefined)
		throw new Error(`${Source.Aave_Rest}: market response missing market`)
	if (data.market == null)
		throw new Error(`${Source.Aave_Rest}: market not found ${normalizedPoolAddress} on chain ${String(chainId)}`)
	assertEnvelope(aaveMarketEnvelope, data.market, 'market')

	return assertMarketWire(data.market, {
		chainId,
		poolAddress: normalizedPoolAddress,
	})
}
