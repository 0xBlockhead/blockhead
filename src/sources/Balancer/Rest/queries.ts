/**
 * Balancer API named operations (GraphQL at api-v3.balancer.fi).
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/balancer-api.html
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/pool-details-with-apr.html
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/user-pool-balance.html
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/pools-top-ordered-tvl.html
 */
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	balancerChainByChainId,
	balancerPoolEventListDefaultLimit,
	balancerPoolEventListMaxLimit,
	balancerPoolListDefaultLimit,
	balancerPoolListMaxLimit,
	balancerPoolIdPattern,
} from '$/sources/Balancer/Rest/constants.ts'
import type {
	BalancerAccountPoolBalance,
	BalancerPool,
	BalancerPoolData,
	BalancerPoolEvent,
	BalancerPoolEventsData,
	BalancerPoolWire,
	BalancerPoolsCountData,
	BalancerPoolsData,
	BalancerVeBalUser,
	BalancerVeBalUserBalanceData,
	BalancerVeBalUserData,
	BalancerVotingGauge,
	BalancerVotingListData,
} from '$/sources/Balancer/Rest/types.ts'
import {
	balancerPoolDetailEnvelope,
	balancerPoolEventsEnvelope,
	balancerPoolListEnvelope,
	balancerPoolsCountEnvelope,
	balancerUserBalanceEnvelope,
	balancerVeBalUserBalanceEnvelope,
	balancerVeBalUserEnvelope,
	balancerVotingListEnvelope,
} from '$/sources/Balancer/Rest/types.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import { Source } from '$/sources/Source.ts'

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
		aprItems {
			title
			type
			apr
		}
	}
	staking {
		type
		gauge {
			gaugeAddress
			version
		}
	}
`

const userBalanceFields = `
	userBalance {
		stakedBalances {
			balance
			balanceUsd
			stakingId
			stakingType
		}
		walletBalance
		walletBalanceUsd
		totalBalance
		totalBalanceUsd
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

const assertTxHash = (
	value: string,
	label: string
) => {
	const normalized = hexLowerOfByteSize(value, 32)
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

const assertNonNegativeDecimal = (
	value: string | undefined,
	label: string
) => {
	const decimal = assertNonEmptyString(value, label)
	if (!/^(0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(decimal))
		throw new Error(`${Source.Balancer_Rest}: invalid ${label}`)
	return decimal
}

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => _Value
	},
	value: unknown,
	label: string
) => {
	try {
		return envelope.assert(value)
	} catch {
		throw new Error(`${Source.Balancer_Rest}: invalid ${label} response envelope`)
	}
}

const assertFiniteNumber = (
	value: number,
	label: string
) => {
	if (!Number.isFinite(value))
		throw new Error(`${Source.Balancer_Rest}: invalid ${label}`)
	return value
}

const chainIdByGqlChain = Object.fromEntries(
	Object.values(balancerChainByChainId).map((chain) => [
		chain.gqlChain,
		chain.chainId,
	])
)

const assertGqlChainId = (gqlChain: string) => {
	const chainId = chainIdByGqlChain[gqlChain]
	if (chainId == null)
		throw new Error(`${Source.Balancer_Rest}: unsupported GqlChain ${gqlChain}`)
	return chainId
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

	const aprItems = (wire.dynamicData.aprItems ?? []).map((item) => ({
		title: assertNonEmptyString(item.title, 'apr title'),
		type: assertNonEmptyString(item.type, 'apr type'),
		apr: assertFiniteNumber(item.apr, 'apr'),
	}))

	const gauge = wire.staking?.gauge
	if (wire.staking != null && wire.staking.type.length < 1)
		throw new Error(`${Source.Balancer_Rest}: pool missing staking type`)
	if (gauge != null && (!Number.isSafeInteger(gauge.version) || gauge.version < 1))
		throw new Error(`${Source.Balancer_Rest}: invalid gauge version`)

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
		aprItems,
		...(wire.staking != null && {
			stakingType: wire.staking.type,
		}),
		...(gauge != null && {
			gaugeAddress: assertAddress(gauge.gaugeAddress, 'gauge address'),
			gaugeVersion: gauge.version,
		}),
	}
}

const assertAccountPoolBalance = (
	wire: BalancerPoolWire,
	expected: {
		chainId: number
		gqlChain: string
	}
): BalancerAccountPoolBalance | undefined => {
	const pool = assertPoolWire(wire, {
		chainId: expected.chainId,
		gqlChain: expected.gqlChain,
	})
	if (wire.userBalance === undefined)
		throw new Error(`${Source.Balancer_Rest}: account pool balance missing userBalance`)
	if (wire.userBalance == null)
		return undefined

	assertEnvelope(balancerUserBalanceEnvelope, wire.userBalance, 'user balance')
	const totalBalance = assertNonEmptyString(wire.userBalance.totalBalance, 'totalBalance')
	if (totalBalance === '0' || totalBalance === '0.0')
		return undefined

	return {
		poolId: pool.id,
		poolAddress: pool.address,
		chainId: expected.chainId,
		totalBalance,
		totalBalanceUsd: assertFiniteNumber(wire.userBalance.totalBalanceUsd, 'totalBalanceUsd'),
		walletBalance: assertNonEmptyString(wire.userBalance.walletBalance, 'walletBalance'),
		walletBalanceUsd: assertFiniteNumber(wire.userBalance.walletBalanceUsd, 'walletBalanceUsd'),
		stakedBalances: wire.userBalance.stakedBalances.map((staked) => ({
			balance: assertNonEmptyString(staked.balance, 'staked balance'),
			balanceUsd: assertFiniteNumber(staked.balanceUsd, 'staked balanceUsd'),
			stakingId: assertNonEmptyString(staked.stakingId, 'stakingId'),
			stakingType: assertNonEmptyString(staked.stakingType, 'stakingType'),
		})),
		...(pool.gaugeAddress != null && {
			gaugeAddress: pool.gaugeAddress,
		}),
		...(pool.gaugeVersion != null && {
			gaugeVersion: pool.gaugeVersion,
		}),
		...(pool.stakingType != null && {
			stakingType: pool.stakingType,
		}),
	}
}

const assertListLimit = (
	limit: number,
	max: number,
	label: string
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > max)
		throw new Error(`${Source.Balancer_Rest}: ${label} must be 1..${String(max)}`)
	return limit
}

/** List Balancer v2/v3 pool snapshots for one EIP-155 chain, ordered by liquidity. */
export const listPools = async ({
	binding,
	chainId,
	limit = balancerPoolListDefaultLimit,
}: {
	binding: SourceBinding
	chainId: number
	limit?: number
}) => {
	const chain = assertChainId(chainId)
	assertListLimit(limit, balancerPoolListMaxLimit, 'limit')

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

/** Authoritative on-chain indexed pool count for one EIP-155 chain (`poolGetPoolsCount`). */
export const getPoolsCount = async ({
	binding,
	chainId,
	userAddress,
}: {
	binding: SourceBinding
	chainId: number
	userAddress?: string
}) => {
	const chain = assertChainId(chainId)
	const normalizedUserAddress = (
		userAddress == null ?
			undefined
		:
			assertAddress(userAddress, 'account')
	)

	const data = await graphql<BalancerPoolsCountData>({
		binding,
		query: `
			query PoolGetPoolsCount($chain: GqlChain!, $userAddress: String) {
				poolGetPoolsCount(
					where: {
						chainIn: [$chain]
						userAddress: $userAddress
					}
				)
			}
		`,
		variables: {
			chain: chain.gqlChain,
			userAddress: normalizedUserAddress ?? null,
		},
	})
	if (data == null)
		throw new Error(`${Source.Balancer_Rest}: pool count response missing data`)
	if (data.poolGetPoolsCount === undefined)
		throw new Error(`${Source.Balancer_Rest}: pool count response poolGetPoolsCount is missing`)
	assertEnvelope(balancerPoolsCountEnvelope, data.poolGetPoolsCount, 'pool count')
	if (!Number.isSafeInteger(data.poolGetPoolsCount) || data.poolGetPoolsCount < 0)
		throw new Error(`${Source.Balancer_Rest}: invalid pool count`)

	return data.poolGetPoolsCount
}

/** Fetch one Balancer v2/v3 pool by EIP-155 chain id and native pool id. */
export const getPool = async ({
	binding,
	chainId,
	poolId,
}: {
	binding: SourceBinding
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

/**
 * Account BPT wallet + staked balances via `poolGetPools(where.userAddress)`.
 * Docs historically named this `userGetPoolBalances`; live API filters pools by userAddress.
 * @see https://docs.balancer.fi/data-and-analytics/data-and-analytics/balancer-api/user-pool-balance.html
 */
export const getAccountPoolBalances = async ({
	binding,
	chainId,
	account,
	limit = balancerPoolListMaxLimit,
}: {
	binding: SourceBinding
	chainId: number
	account: string
	limit?: number
}) => {
	const chain = assertChainId(chainId)
	const normalizedAccount = assertAddress(account, 'account')
	assertListLimit(limit, balancerPoolListMaxLimit, 'limit')

	const data = await graphql<BalancerPoolsData>({
		binding,
		query: `
			query AccountPoolBalances($chain: GqlChain!, $userAddress: String!, $first: Int!) {
				poolGetPools(
					first: $first
					where: {
						chainIn: [$chain]
						userAddress: $userAddress
					}
				) {
					${poolFields}
					${userBalanceFields}
				}
			}
		`,
		variables: {
			chain: chain.gqlChain,
			userAddress: normalizedAccount,
			first: limit,
		},
	})
	if (data == null)
		throw new Error(`${Source.Balancer_Rest}: account pool balances response missing data`)
	if (data.poolGetPools === undefined)
		throw new Error(`${Source.Balancer_Rest}: account pool balances response poolGetPools is missing`)
	assertEnvelope(balancerPoolListEnvelope, data.poolGetPools, 'account pool balances')
	if (data.poolGetPools.length > limit)
		throw new Error(`${Source.Balancer_Rest}: account pool balances response exceeds requested limit ${String(limit)}`)

	const balances = data.poolGetPools.flatMap((pool) => {
		const balance = assertAccountPoolBalance(pool, {
			chainId,
			gqlChain: chain.gqlChain,
		})
		return balance == null ? [] : [balance]
	})
	if (new Set(balances.map((balance) => balance.poolId)).size !== balances.length)
		throw new Error(`${Source.Balancer_Rest}: account pool balances response contains duplicate pool ids`)

	return balances
}

/** veBAL voting-gauge list (`veBalGetVotingList`), optionally including killed gauges. */
export const listVotingGauges = async ({
	binding,
	includeKilled = false,
}: {
	binding: SourceBinding
	includeKilled?: boolean
} = {}) => {
	const data = await graphql<BalancerVotingListData>({
		binding,
		query: `
			query VeBalGetVotingList($includeKilled: Boolean!) {
				veBalGetVotingList(includeKilled: $includeKilled) {
					id
					address
					chain
					type
					symbol
					protocolVersion
					gauge {
						address
						relativeWeightCap
						isKilled
					}
					tokens {
						address
						symbol
						logoURI
					}
				}
			}
		`,
		variables: {
			includeKilled,
		},
	})
	if (data == null)
		throw new Error(`${Source.Balancer_Rest}: voting list response missing data`)
	if (data.veBalGetVotingList === undefined)
		throw new Error(`${Source.Balancer_Rest}: voting list response veBalGetVotingList is missing`)
	assertEnvelope(balancerVotingListEnvelope, data.veBalGetVotingList, 'voting list')

	const gauges = data.veBalGetVotingList.map((wire): BalancerVotingGauge => {
		const chainId = assertGqlChainId(wire.chain)
		if (wire.protocolVersion !== 2 && wire.protocolVersion !== 3)
			throw new Error(`${Source.Balancer_Rest}: unsupported voting pool protocolVersion ${String(wire.protocolVersion)}`)
		if (wire.tokens.length < 1)
			throw new Error(`${Source.Balancer_Rest}: voting pool missing tokens`)

		return {
			poolId: assertPoolId(wire.id),
			poolAddress: assertAddress(wire.address, 'voting pool address'),
			chainId,
			poolType: assertNonEmptyString(wire.type, 'voting pool type'),
			symbol: assertNonEmptyString(wire.symbol, 'voting pool symbol'),
			protocolVersion: wire.protocolVersion,
			gaugeAddress: assertAddress(wire.gauge.address, 'voting gauge address'),
			isKilled: wire.gauge.isKilled,
			...(wire.gauge.relativeWeightCap != null && wire.gauge.relativeWeightCap.length > 0 && {
				relativeWeightCap: wire.gauge.relativeWeightCap,
			}),
			tokens: wire.tokens.map((token) => ({
				address: assertAddress(token.address, 'voting token address'),
				symbol: assertNonEmptyString(token.symbol, 'voting token symbol'),
				...(token.logoURI != null && token.logoURI.length > 0 && {
					logoURI: token.logoURI,
				}),
			})),
		}
	})
	if (new Set(gauges.map((gauge) => `${gauge.chainId}:${gauge.gaugeAddress}`)).size !== gauges.length)
		throw new Error(`${Source.Balancer_Rest}: voting list response contains duplicate gauges`)

	return gauges
}

/** veBAL voting power balance string for one account on one chain. */
export const getVeBalUserBalance = async ({
	binding,
	chainId,
	account,
}: {
	binding: SourceBinding
	chainId: number
	account: string
}) => {
	const chain = assertChainId(chainId)
	const normalizedAccount = assertAddress(account, 'account')

	const data = await graphql<BalancerVeBalUserBalanceData>({
		binding,
		query: `
			query VeBalGetUserBalance($address: String!, $chain: GqlChain!) {
				veBalGetUserBalance(address: $address, chain: $chain)
			}
		`,
		variables: {
			address: normalizedAccount,
			chain: chain.gqlChain,
		},
	})
	if (data == null)
		throw new Error(`${Source.Balancer_Rest}: veBAL balance response missing data`)
	if (data.veBalGetUserBalance === undefined)
		throw new Error(`${Source.Balancer_Rest}: veBAL balance response veBalGetUserBalance is missing`)
	assertEnvelope(balancerVeBalUserBalanceEnvelope, data.veBalGetUserBalance, 'veBAL balance')
	return assertNonNegativeDecimal(data.veBalGetUserBalance, 'veBAL balance')
}

/** veBAL lock snapshot for one account on one chain (`veBalGetUser`). */
export const getVeBalUser = async ({
	binding,
	chainId,
	account,
}: {
	binding: SourceBinding
	chainId: number
	account: string
}): Promise<BalancerVeBalUser> => {
	const chain = assertChainId(chainId)
	const normalizedAccount = assertAddress(account, 'account')

	const data = await graphql<BalancerVeBalUserData>({
		binding,
		query: `
			query VeBalGetUser($address: String!, $chain: GqlChain!) {
				veBalGetUser(address: $address, chain: $chain) {
					balance
					locked
					lockedUsd
					rank
				}
			}
		`,
		variables: {
			address: normalizedAccount,
			chain: chain.gqlChain,
		},
	})
	if (data == null)
		throw new Error(`${Source.Balancer_Rest}: veBAL user response missing data`)
	if (data.veBalGetUser === undefined)
		throw new Error(`${Source.Balancer_Rest}: veBAL user response veBalGetUser is missing`)
	if (data.veBalGetUser == null)
		throw new Error(`${Source.Balancer_Rest}: veBAL user not found ${normalizedAccount} on chain ${String(chainId)}`)
	assertEnvelope(balancerVeBalUserEnvelope, data.veBalGetUser, 'veBAL user')
	if (data.veBalGetUser.rank != null && (!Number.isSafeInteger(data.veBalGetUser.rank) || data.veBalGetUser.rank < 0))
		throw new Error(`${Source.Balancer_Rest}: invalid veBAL rank`)

	return {
		chainId,
		account: normalizedAccount,
		balance: assertNonNegativeDecimal(data.veBalGetUser.balance, 'veBAL balance'),
		locked: assertNonNegativeDecimal(data.veBalGetUser.locked, 'veBAL locked'),
		lockedUsd: assertNonNegativeDecimal(data.veBalGetUser.lockedUsd, 'veBAL lockedUsd'),
		...(data.veBalGetUser.rank != null && {
			rank: data.veBalGetUser.rank,
		}),
	}
}

/** Recent pool events (`poolEvents`) for one EIP-155 chain, optionally filtered by pool id. */
export const listPoolEvents = async ({
	binding,
	chainId,
	poolId,
	limit = balancerPoolEventListDefaultLimit,
}: {
	binding: SourceBinding
	chainId: number
	poolId?: string
	limit?: number
}): Promise<BalancerPoolEvent[]> => {
	const chain = assertChainId(chainId)
	assertListLimit(limit, balancerPoolEventListMaxLimit, 'limit')
	const normalizedPoolId = poolId == null ? undefined : assertPoolId(poolId)

	const data = await graphql<BalancerPoolEventsData>({
		binding,
		query: `
			query PoolEvents($chain: GqlChain!, $first: Int!, $poolIdIn: [String!]) {
				poolEvents(
					first: $first
					where: {
						chainIn: [$chain]
						poolIdIn: $poolIdIn
					}
				) {
					id
					type
					chain
					poolId
					valueUSD
					blockNumber
					blockTimestamp
					tx
					userAddress
				}
			}
		`,
		variables: {
			chain: chain.gqlChain,
			first: limit,
			poolIdIn: normalizedPoolId == null ? null : [normalizedPoolId],
		},
	})
	if (data == null)
		throw new Error(`${Source.Balancer_Rest}: pool events response missing data`)
	if (data.poolEvents === undefined)
		throw new Error(`${Source.Balancer_Rest}: pool events response poolEvents is missing`)
	assertEnvelope(balancerPoolEventsEnvelope, data.poolEvents, 'pool events')
	if (data.poolEvents.length > limit)
		throw new Error(`${Source.Balancer_Rest}: pool events response exceeds requested limit ${String(limit)}`)

	const events = data.poolEvents.map((wire): BalancerPoolEvent => {
		if (wire.chain !== chain.gqlChain)
			throw new Error(`${Source.Balancer_Rest}: pool event chain mismatch`)
		if (!Number.isSafeInteger(wire.blockNumber) || wire.blockNumber < 0)
			throw new Error(`${Source.Balancer_Rest}: invalid pool event blockNumber`)
		if (!Number.isSafeInteger(wire.blockTimestamp) || wire.blockTimestamp < 0)
			throw new Error(`${Source.Balancer_Rest}: invalid pool event blockTimestamp`)
		const eventPoolId = assertPoolId(wire.poolId)
		if (normalizedPoolId != null && eventPoolId !== normalizedPoolId)
			throw new Error(`${Source.Balancer_Rest}: pool event poolId mismatch`)

		return {
			id: assertNonEmptyString(wire.id, 'pool event id'),
			type: assertNonEmptyString(wire.type, 'pool event type'),
			chainId,
			poolId: eventPoolId,
			valueUsd: assertFiniteNumber(wire.valueUSD, 'pool event valueUSD'),
			blockNumber: wire.blockNumber,
			blockTimestampMs: wire.blockTimestamp * 1000,
			txHash: assertTxHash(wire.tx, 'pool event tx'),
			userAddress: assertAddress(wire.userAddress, 'pool event userAddress'),
		}
	})
	if (new Set(events.map((event) => event.id)).size !== events.length)
		throw new Error(`${Source.Balancer_Rest}: pool events response contains duplicate ids`)

	return events
}
