/**
 * Balancer API named operations (GraphQL at api-v3.balancer.fi).
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/balancer-api.html
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/pool-details-with-apr.html
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Balancer/bindings.ts'
import {
	balancerChainByChainId,
	balancerPoolListDefaultLimit,
	balancerPoolListMaxLimit,
	balancerPoolIdPattern,
} from '$/sources/Balancer/Rest/constants.ts'
import type {
	BalancerPool,
	BalancerPoolData,
	BalancerPoolsData,
	BalancerPoolWire,
} from '$/sources/Balancer/Rest/types.ts'
import {
	balancerPoolDetailEnvelope,
	balancerPoolListEnvelope,
} from '$/sources/Balancer/Rest/types.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Balancer_Rest][0]

const poolFields = `
	id
	address
	name
	type
	version
	protocolVersion
	chain
	poolTokens {
		address
		symbol
		balance
		decimals
		weight
	}
	dynamicData {
		totalLiquidity
		totalShares
		swapFee
	}
`

const assertChainId = (chainId: number) => {
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Balancer_Rest}: invalid chain id ${String(chainId)}`)
	const chain = balancerChainByChainId[chainId]
	if (chain == null)
		throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)
	return chain
}

const assertPoolId = (poolId: string) => {
	if (!balancerPoolIdPattern.test(poolId))
		throw new Error(`${Source.Balancer_Rest}: invalid pool id ${poolId}`)
	return poolId.toLowerCase() as `0x${string}`
}

const assertAddress = (
	value: string,
	label: string
) => {
	const normalized = hexLowerOfByteSize(value, 20)
	if (normalized == null)
		throw new Error(`${Source.Balancer_Rest}: invalid ${label} ${value}`)
	return normalized
}

const assertNonEmptyString = (
	value: string | undefined,
	label: string
) => {
	if (value == null || value.length < 1)
		throw new Error(`${Source.Balancer_Rest}: pool missing ${label}`)
	return value
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
		throw new Error(`${Source.Balancer_Rest}: invalid ${label} response envelope`)
	}
}

const assertPoolWire = (
	wire: BalancerPoolWire,
	expected: {
		chainId: number
		gqlChain: string
		poolId?: `0x${string}`
	}
): BalancerPool => {
	const id = assertPoolId(wire.id)
	if (expected.poolId != null && id !== expected.poolId)
		throw new Error(`${Source.Balancer_Rest}: pool id mismatch`)
	if (wire.chain !== expected.gqlChain)
		throw new Error(`${Source.Balancer_Rest}: pool chain mismatch`)
	if (!Number.isSafeInteger(wire.version) || wire.version < 1)
		throw new Error(`${Source.Balancer_Rest}: invalid pool version`)
	if (wire.protocolVersion !== 2 && wire.protocolVersion !== 3)
		throw new Error(`${Source.Balancer_Rest}: unsupported protocolVersion ${String(wire.protocolVersion)}`)

	const chain = assertChainId(expected.chainId)
	const vaultAddress = (
		wire.protocolVersion === 3 ?
			chain.vaultV3
		:
			chain.vaultV2
	)
	if (vaultAddress == null)
		throw new Error(`${Source.Balancer_Rest}: missing vault for protocolVersion ${String(wire.protocolVersion)} on chain ${String(expected.chainId)}`)

	if (wire.poolTokens.length < 1)
		throw new Error(`${Source.Balancer_Rest}: pool missing tokens`)

	return {
		id,
		address: assertAddress(wire.address, 'pool address'),
		name: assertNonEmptyString(wire.name, 'name'),
		type: assertNonEmptyString(wire.type, 'type'),
		version: wire.version,
		protocolVersion: wire.protocolVersion,
		chainId: expected.chainId,
		vaultAddress,
		swapFee: assertNonEmptyString(wire.dynamicData.swapFee, 'swapFee'),
		totalLiquidity: assertNonEmptyString(wire.dynamicData.totalLiquidity, 'totalLiquidity'),
		totalShares: assertNonEmptyString(wire.dynamicData.totalShares, 'totalShares'),
		poolTokens: wire.poolTokens.map((token) => {
			if (!Number.isSafeInteger(token.decimals) || token.decimals < 0)
				throw new Error(`${Source.Balancer_Rest}: invalid token decimals`)
			return {
				address: assertAddress(token.address, 'token address'),
				symbol: assertNonEmptyString(token.symbol, 'token symbol'),
				balance: assertNonEmptyString(token.balance, 'token balance'),
				decimals: token.decimals,
				...(token.weight != null && {
					weight: assertNonEmptyString(token.weight, 'token weight'),
				}),
			}
		}),
	}
}

const assertListLimit = (limit: number) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > balancerPoolListMaxLimit)
		throw new Error(`${Source.Balancer_Rest}: limit must be 1..${String(balancerPoolListMaxLimit)}`)
	return limit
}

/** List Balancer v2/v3 pool snapshots for one EIP-155 chain, ordered by liquidity. */
export const listPools = async ({
	chainId,
	limit = balancerPoolListDefaultLimit,
}: {
	chainId: number
	limit?: number
}) => {
	const chain = assertChainId(chainId)
	assertListLimit(limit)

	const data = await graphql<BalancerPoolsData>({
		binding,
		query: `
			query PoolGetPools($chain: GqlChain!, $first: Int!) {
				poolGetPools(
					first: $first
					orderBy: totalLiquidity
					where: {
						chainIn: [$chain]
					}
				) {
					${poolFields}
				}
			}
		`,
		variables: {
			chain: chain.gqlChain,
			first: limit,
		},
	})
	if (data == null)
		throw new Error(`${Source.Balancer_Rest}: pool list response missing data`)

	if (data.poolGetPools === undefined)
		throw new Error(`${Source.Balancer_Rest}: pool list response poolGetPools is missing`)
	assertEnvelope(balancerPoolListEnvelope, data.poolGetPools, 'pool list')
	if (data.poolGetPools.length > limit)
		throw new Error(`${Source.Balancer_Rest}: pool list response exceeds requested limit ${String(limit)}`)

	const pools = data.poolGetPools.map((pool) => assertPoolWire(pool, {
		chainId,
		gqlChain: chain.gqlChain,
	}))
	if (new Set(pools.map((pool) => pool.id)).size !== pools.length)
		throw new Error(`${Source.Balancer_Rest}: pool list response contains duplicate pool ids`)

	return pools
}

/** Fetch one Balancer v2/v3 pool by EIP-155 chain id and native pool id. */
export const getPool = async ({
	chainId,
	poolId,
}: {
	chainId: number
	poolId: string
}) => {
	const chain = assertChainId(chainId)
	const normalizedPoolId = assertPoolId(poolId)

	const data = await graphql<BalancerPoolData>({
		binding,
		query: `
			query PoolGetPool($id: String!, $chain: GqlChain!) {
				poolGetPool(id: $id, chain: $chain) {
					${poolFields}
				}
			}
		`,
		variables: {
			id: normalizedPoolId,
			chain: chain.gqlChain,
		},
	})
	if (data == null)
		throw new Error(`${Source.Balancer_Rest}: pool response missing data`)
	if (data.poolGetPool === undefined)
		throw new Error(`${Source.Balancer_Rest}: pool response missing poolGetPool`)
	if (data.poolGetPool == null)
		throw new Error(`${Source.Balancer_Rest}: pool not found ${normalizedPoolId} on chain ${String(chainId)}`)
	assertEnvelope(balancerPoolDetailEnvelope, data.poolGetPool, 'pool')

	return assertPoolWire(data.poolGetPool, {
		chainId,
		poolId: normalizedPoolId,
		gqlChain: chain.gqlChain,
	})
}
