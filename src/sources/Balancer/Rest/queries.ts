/**
 * Balancer API named operations (GraphQL at api-v3.balancer.fi).
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/balancer-api.html
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/pool-details-with-apr.html
 */
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/Balancer/bindings.ts'
import {
	balancerChainByChainId,
	balancerPoolIdPattern,
} from '$/sources/Balancer/Rest/constants.ts'
import type {
	BalancerPool,
	BalancerPoolData,
	BalancerPoolWire,
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
	value: string,
	label: string
) => {
	if (value.length < 1)
		throw new Error(`${Source.Balancer_Rest}: pool missing ${label}`)
	return value
}

const assertPoolWire = (
	wire: BalancerPoolWire,
	expected: {
		chainId: number
		poolId: `0x${string}`
		gqlChain: string
	}
): BalancerPool => {
	const id = assertPoolId(wire.id)
	if (id !== expected.poolId)
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
	if (data.poolGetPool == null)
		throw new Error(`${Source.Balancer_Rest}: pool not found ${normalizedPoolId} on chain ${String(chainId)}`)

	return assertPoolWire(data.poolGetPool, {
		chainId,
		poolId: normalizedPoolId,
		gqlChain: chain.gqlChain,
	})
}
