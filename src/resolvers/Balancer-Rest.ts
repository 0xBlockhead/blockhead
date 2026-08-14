import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	BalancerAccountPoolBalance,
	BalancerPool,
	BalancerPoolEvent,
	BalancerVotingGauge,
} from '$/sources/Balancer/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type BalancerPoolId = EntitySelector<typeof schema, EntityType.BalancerPool>
type BalancerPoolEventId = EntitySelector<typeof schema, EntityType.BalancerPoolEvent>
type BalancerGaugeId = EntitySelector<typeof schema, EntityType.BalancerGauge>
type BalancerAccountPoolBalanceId = EntitySelector<typeof schema, EntityType.BalancerAccountPoolBalance>
type BalancerVeBalBalanceId = EntitySelector<typeof schema, EntityType.BalancerVeBalBalance>
type EvmNetworkAccountId = EntitySelector<typeof schema, EntityType.EvmNetworkAccount>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Balancer_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Balancer_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const accountAddress = (account: EvmNetworkAccountId) => {
	const address = account.$actor.address
	if (address.length < 1)
		throw new Error(`${Source.Balancer_Rest}: account address missing`)
	return address
}

const balancerPaginationSkip = (
	context: ResolverContext
) => {
	const skip = context.providerContinuationToken == null ?
		context.pagination.offset ?? 0
	:
		Number(context.providerContinuationToken)
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error(`${Source.Balancer_Rest}: invalid pagination skip`)

	return skip
}

const mapBalancerPoolSnapshot = (
	network: NetworkId,
	pool: BalancerPool
) => {
	const poolSelector = {
		$network: network,
		poolId: pool.id,
	}
	return {
		$network: {
			[EntityMetaKey.Selector]: network,
		},
		poolId: pool.id,
		address: pool.address,
		name: pool.name,
		poolType: pool.type,
		version: pool.version,
		protocolVersion: pool.protocolVersion,
		vaultAddress: pool.vaultAddress,
		swapFee: pool.swapFee,
		totalLiquidity: pool.totalLiquidity,
		totalShares: pool.totalShares,
		...(pool.gaugeAddress != null && {
			$gauge: {
				[EntityMetaKey.Selector]: {
					$network: network,
					gaugeAddress: pool.gaugeAddress,
				},
				[EntityMetaKey.Fields]: {
					...(pool.gaugeVersion != null && {
						[entityFieldAddressKey(EntityType.BalancerGauge, [], 'version')]: pool.gaugeVersion,
					}),
					[entityFieldAddressKey(EntityType.BalancerGauge, [], '$pool')]: {
						[EntityMetaKey.Selector]: poolSelector,
					},
				},
			},
		}),
		$$aprItems: pool.aprItems.map((item) => ({
			[EntityMetaKey.Selector]: {
				$pool: poolSelector,
				title: item.title,
				aprType: item.type,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BalancerPoolAprItem, [], 'apr')]: item.apr,
			},
		})),
		$$tokens: pool.poolTokens.map((token, tokenIndex) => ({
			[EntityMetaKey.Selector]: {
				$pool: poolSelector,
				tokenIndex,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BalancerPoolToken, [], 'address')]: token.address,
				[entityFieldAddressKey(EntityType.BalancerPoolToken, [], 'symbol')]: token.symbol,
				[entityFieldAddressKey(EntityType.BalancerPoolToken, [], 'balance')]: token.balance,
				[entityFieldAddressKey(EntityType.BalancerPoolToken, [], 'decimals')]: token.decimals,
				...(token.weight != null && {
					[entityFieldAddressKey(EntityType.BalancerPoolToken, [], 'weight')]: token.weight,
				}),
				[entityFieldAddressKey(EntityType.BalancerPoolToken, [], '$contract')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: token.address,
					},
				},
			},
		})),
	}
}

const mapBalancerPoolEventSnapshot = (
	pool: BalancerPoolId,
	event: BalancerPoolEvent
) => ({
	$pool: {
		[EntityMetaKey.Selector]: pool,
	},
	eventId: event.id,
	eventType: event.type,
	$transaction: {
		[EntityMetaKey.Selector]: {
			$network: pool.$network,
			txHash: event.txHash,
		},
	},
	$user: {
		[EntityMetaKey.Selector]: {
			$network: pool.$network,
			$actor: {
				address: event.userAddress,
			},
		},
	},
	$block: {
		[EntityMetaKey.Selector]: {
			$network: pool.$network,
			blockNumber: BigInt(event.blockNumber),
		},
	},
	occurredAtMs: event.blockTimestampMs,
	valueUsd: event.valueUsd,
})

const mapVotingGaugeSnapshot = (
	gauge: BalancerVotingGauge,
	gaugeVersion?: number
) => {
	const network = {
		caip2: {
			namespace: 'eip155' as const,
			reference: String(gauge.chainId),
		},
	}
	return {
		$network: {
			[EntityMetaKey.Selector]: network,
		},
		gaugeAddress: gauge.gaugeAddress,
		$pool: {
			[EntityMetaKey.Selector]: {
				$network: network,
				poolId: gauge.poolId,
			},
		},
		isKilled: gauge.isKilled,
		poolSymbol: gauge.symbol,
		poolType: gauge.poolType,
		protocolVersion: gauge.protocolVersion,
		...(gauge.relativeWeightCap != null && {
			relativeWeightCap: gauge.relativeWeightCap,
		}),
		...(gaugeVersion != null && {
			version: gaugeVersion,
		}),
	}
}

const mapAccountPoolBalanceSnapshot = (
	account: EvmNetworkAccountId,
	balance: BalancerAccountPoolBalance
) => ({
	$account: {
		[EntityMetaKey.Selector]: account,
	},
	$pool: {
		[EntityMetaKey.Selector]: {
			$network: account.$network,
			poolId: balance.poolId,
		},
	},
	totalBalance: balance.totalBalance,
	totalBalanceUsd: balance.totalBalanceUsd,
	walletBalance: balance.walletBalance,
	walletBalanceUsd: balance.walletBalanceUsd,
	...(balance.gaugeAddress != null && {
		$gauge: {
			[EntityMetaKey.Selector]: {
				$network: account.$network,
				gaugeAddress: balance.gaugeAddress,
			},
			...(balance.gaugeVersion != null && {
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BalancerGauge, [], 'version')]: balance.gaugeVersion,
				},
			}),
		},
	}),
	...(balance.stakingType != null && {
		stakingType: balance.stakingType,
	}),
})

export default {
	source: Source.Balancer_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.BalancerPool,
			resolve: {
				NetworkPoolId: {
					resolve: async ({
						$network,
						poolId,
					}: BalancerPoolId, context) => {
						const chainId = eip155ChainId($network)
						const { balancerChainByChainId } = await import('$/sources/Balancer/Rest/constants.ts')
						if (balancerChainByChainId[chainId] == null)
							throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)

						const { balancerPoolEventListMaxLimit } = await import('$/sources/Balancer/Rest/constants.ts')
						const {
							getPool,
							listPoolEvents,
						} = await import('$/sources/Balancer/Rest/queries.ts')
						const [
							pool,
							events,
						] = await Promise.all([
							getPool({
								chainId,
								poolId,
							}),
							listPoolEvents({
								chainId,
								poolId,
								limit: Math.min(resolverContextRowLimit(context), balancerPoolEventListMaxLimit),
							}),
						])
						return {
							...mapBalancerPoolSnapshot(
								$network,
								pool
							),
							$$events: events.map((event) => mapBalancerPoolEventSnapshot({
								$network,
								poolId,
							}, event)),
						}
					},
				},
			},
		})({
			$network: (pool) => pool.$network,
			poolId: (pool) => pool.poolId,
			address: (pool) => pool.address,
			name: (pool) => pool.name,
			poolType: (pool) => pool.poolType,
			version: (pool) => pool.version,
			protocolVersion: (pool) => pool.protocolVersion,
			vaultAddress: (pool) => pool.vaultAddress,
			swapFee: (pool) => pool.swapFee,
			totalLiquidity: (pool) => pool.totalLiquidity,
			totalShares: (pool) => pool.totalShares,
			$gauge: (pool) => pool.$gauge,
			$$aprItems: (pool) => pool.$$aprItems,
			$$events: (pool) => pool.$$events,
			$$tokens: (pool) => pool.$$tokens,
		}),

		defineResolver({
			entityType: EntityType.BalancerPoolEvent,
			resolve: {
				PoolEventId: {
					resolve: async ({
						$pool,
						eventId,
					}: BalancerPoolEventId) => {
						const chainId = eip155ChainId($pool.$network)
						const { balancerChainByChainId, balancerPoolEventListMaxLimit } = await import('$/sources/Balancer/Rest/constants.ts')
						if (balancerChainByChainId[chainId] == null)
							throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)

						const { listPoolEvents } = await import('$/sources/Balancer/Rest/queries.ts')
						const event = (await listPoolEvents({
							chainId,
							poolId: $pool.poolId,
							limit: balancerPoolEventListMaxLimit,
						})).find((candidate) => candidate.id === eventId)
						if (event == null)
							throw new Error(`${Source.Balancer_Rest}: pool event not found ${eventId}`)

						return mapBalancerPoolEventSnapshot($pool, event)
					},
				},
			},
		})({
			$pool: (event) => event.$pool,
			eventId: (event) => event.eventId,
			eventType: (event) => event.eventType,
			$transaction: (event) => event.$transaction,
			$user: (event) => event.$user,
			$block: (event) => event.$block,
			occurredAtMs: (event) => event.occurredAtMs,
			valueUsd: (event) => event.valueUsd,
		}),

		defineResolver({
			entityType: EntityType.BalancerPoolAprItem,
			resolve: {
				PoolTitleAprType: {
					resolve: async ({
						$pool,
						title,
						aprType,
					}) => {
						const chainId = eip155ChainId($pool.$network)
						const { balancerChainByChainId } = await import('$/sources/Balancer/Rest/constants.ts')
						if (balancerChainByChainId[chainId] == null)
							throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)

						const { getPool } = await import('$/sources/Balancer/Rest/queries.ts')
						const pool = await getPool({
							chainId,
							poolId: $pool.poolId,
						})
						const item = pool.aprItems.find((candidate) => (
							candidate.title === title
							&& candidate.type === aprType
						))
						if (item == null)
							throw new Error(`${Source.Balancer_Rest}: APR item not found ${title}/${aprType}`)

						return {
							$pool: {
								[EntityMetaKey.Selector]: $pool,
							},
							title: item.title,
							aprType: item.type,
							apr: item.apr,
						}
					},
				},
			},
		})({
			$pool: (item) => item.$pool,
			title: (item) => item.title,
			aprType: (item) => item.aprType,
			apr: (item) => item.apr,
		}),

		defineResolver({
			entityType: EntityType.BalancerPoolToken,
			resolve: {
				PoolTokenIndex: {
					resolve: async ({
						$pool,
						tokenIndex,
					}) => {
						const chainId = eip155ChainId($pool.$network)
						const { balancerChainByChainId } = await import('$/sources/Balancer/Rest/constants.ts')
						if (balancerChainByChainId[chainId] == null)
							throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)

						const { getPool } = await import('$/sources/Balancer/Rest/queries.ts')
						const token = (await getPool({
							chainId,
							poolId: $pool.poolId,
						})).poolTokens.at(tokenIndex)
						if (token == null)
							throw new Error(`${Source.Balancer_Rest}: pool token ${String(tokenIndex)} not found`)

						return {
							$pool: {
								[EntityMetaKey.Selector]: $pool,
							},
							tokenIndex,
							address: token.address,
							symbol: token.symbol,
							balance: token.balance,
							decimals: token.decimals,
							...(token.weight != null && {
								weight: token.weight,
							}),
							$contract: {
								[EntityMetaKey.Selector]: {
									$network: $pool.$network,
									address: token.address,
								},
							},
						}
					},
				},
			},
		})({
			$pool: (token) => token.$pool,
			tokenIndex: (token) => token.tokenIndex,
			address: (token) => token.address,
			symbol: (token) => token.symbol,
			balance: (token) => token.balance,
			decimals: (token) => token.decimals,
			weight: (token) => token.weight,
			$contract: (token) => token.$contract,
		}),

		defineResolver({
			entityType: EntityType.BalancerGauge,
			resolve: {
				NetworkGaugeAddress: {
					resolve: async ({
						$network,
						gaugeAddress,
					}: BalancerGaugeId) => {
						const chainId = eip155ChainId($network)
						const { balancerChainByChainId } = await import('$/sources/Balancer/Rest/constants.ts')
						if (balancerChainByChainId[chainId] == null)
							throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)

						const {
							getPool,
							listVotingGauges,
						} = await import('$/sources/Balancer/Rest/queries.ts')
						const gauge = (await listVotingGauges({
							includeKilled: true,
						})).find((candidate) => (
							candidate.chainId === chainId
							&& candidate.gaugeAddress === gaugeAddress
						))
						if (gauge == null)
							throw new Error(`${Source.Balancer_Rest}: voting gauge not found ${gaugeAddress} on chain ${String(chainId)}`)

						const pool = await getPool({
							chainId,
							poolId: gauge.poolId,
						}).catch(() => undefined)
						return mapVotingGaugeSnapshot(
							gauge,
							(
								pool?.gaugeAddress === gauge.gaugeAddress ?
									pool.gaugeVersion
								:
									undefined
							)
						)
					},
				},
			},
		})({
			$network: (gauge) => gauge.$network,
			gaugeAddress: (gauge) => gauge.gaugeAddress,
			$pool: (gauge) => gauge.$pool,
			version: (gauge) => gauge.version,
			isKilled: (gauge) => gauge.isKilled,
			relativeWeightCap: (gauge) => gauge.relativeWeightCap,
			poolSymbol: (gauge) => gauge.poolSymbol,
			poolType: (gauge) => gauge.poolType,
			protocolVersion: (gauge) => gauge.protocolVersion,
		}),

		defineResolver({
			entityType: EntityType.BalancerAccountPoolBalance,
			resolve: {
				AccountPool: {
					resolve: async ({
						$account,
						$pool,
					}: BalancerAccountPoolBalanceId, context) => {
						const chainId = eip155ChainId($account.$network)
						if (eip155ChainId($pool.$network) !== chainId)
							throw new Error(`${Source.Balancer_Rest}: account and pool networks must match`)

						const { balancerChainByChainId } = await import('$/sources/Balancer/Rest/constants.ts')
						if (balancerChainByChainId[chainId] == null)
							throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)

						const { getAccountPoolBalances } = await import('$/sources/Balancer/Rest/queries.ts')
						const balance = (await getAccountPoolBalances({
							chainId,
							account: accountAddress($account),
							limit: resolverContextRowLimit(context),
						})).find((candidate) => candidate.poolId === $pool.poolId)
						if (balance == null)
							throw new Error(`${Source.Balancer_Rest}: account pool balance not found for ${$pool.poolId}`)

						return mapAccountPoolBalanceSnapshot($account, balance)
					},
				},
			},
		})({
			$account: (balance) => balance.$account,
			$pool: (balance) => balance.$pool,
			totalBalance: (balance) => balance.totalBalance,
			totalBalanceUsd: (balance) => balance.totalBalanceUsd,
			walletBalance: (balance) => balance.walletBalance,
			walletBalanceUsd: (balance) => balance.walletBalanceUsd,
			$gauge: (balance) => balance.$gauge,
			stakingType: (balance) => balance.stakingType,
		}),

		defineResolver({
			entityType: EntityType.BalancerVeBalBalance,
			resolve: {
				Account: {
					resolve: async ({
						$account,
					}: BalancerVeBalBalanceId) => {
						const chainId = eip155ChainId($account.$network)
						const { balancerChainByChainId } = await import('$/sources/Balancer/Rest/constants.ts')
						if (balancerChainByChainId[chainId] == null)
							throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)

						const { getVeBalUser } = await import('$/sources/Balancer/Rest/queries.ts')
						const veBal = await getVeBalUser({
							chainId,
							account: accountAddress($account),
						})
						return {
							$account: {
								[EntityMetaKey.Selector]: $account,
							},
							balance: veBal.balance,
							locked: veBal.locked,
							lockedUsd: veBal.lockedUsd,
							...(veBal.rank != null && {
								rank: veBal.rank,
							}),
						}
					},
				},
			},
		})({
			$account: (veBal) => veBal.$account,
			balance: (veBal) => veBal.balance,
			locked: (veBal) => veBal.locked,
			lockedUsd: (veBal) => veBal.lockedUsd,
			rank: (veBal) => veBal.rank,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({
						$actor,
						$network,
					}: EvmNetworkAccountId, context) => {
						const chainId = eip155ChainId($network)
						const { balancerChainByChainId } = await import('$/sources/Balancer/Rest/constants.ts')
						if (balancerChainByChainId[chainId] == null)
							throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)

						const account = {
							$network,
							$actor,
						}
						const skip = balancerPaginationSkip(context)
						const limit = resolverContextRowLimit(context)
						const {
							getAccountPoolBalances,
							getPoolsCount,
							getVeBalUser,
						} = await import('$/sources/Balancer/Rest/queries.ts')
						const balances = await getAccountPoolBalances({
							chainId,
							account: $actor.address,
							limit,
							skip,
						})
						const balanceCount = await getPoolsCount({
							chainId,
							userAddress: $actor.address,
						})
						const veBal = await getVeBalUser({
							chainId,
							account: $actor.address,
						}).catch(() => undefined)
						return {
							skip,
							limit,
							$$balancerPoolBalances: balances.map((balance) => ({
								[EntityMetaKey.Selector]: {
									$account: account,
									$pool: {
										$network,
										poolId: balance.poolId,
									},
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], 'totalBalance')]: balance.totalBalance,
									[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], 'totalBalanceUsd')]: balance.totalBalanceUsd,
									[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], 'walletBalance')]: balance.walletBalance,
									[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], 'walletBalanceUsd')]: balance.walletBalanceUsd,
									...(balance.stakingType != null && {
										[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], 'stakingType')]: balance.stakingType,
									}),
									...(balance.gaugeAddress != null && {
										[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], '$gauge')]: {
											[EntityMetaKey.Selector]: {
												$network,
												gaugeAddress: balance.gaugeAddress,
											},
										},
									}),
								},
							})),
							balancerPoolBalanceCount: balanceCount,
							...(veBal != null && {
								$veBal: {
									[EntityMetaKey.Selector]: {
										$account: account,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BalancerVeBalBalance, [], 'balance')]: veBal.balance,
										[entityFieldAddressKey(EntityType.BalancerVeBalBalance, [], 'locked')]: veBal.locked,
										[entityFieldAddressKey(EntityType.BalancerVeBalBalance, [], 'lockedUsd')]: veBal.lockedUsd,
										...(veBal.rank != null && {
											[entityFieldAddressKey(EntityType.BalancerVeBalBalance, [], 'rank')]: veBal.rank,
										}),
									},
								},
							}),
						}
					},
				},
			},
		})({
			$$balancerPoolBalances: {
				select: (snapshot) => snapshot.$$balancerPoolBalances,
				resolveCount: (snapshot) => snapshot.balancerPoolBalanceCount,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.$$balancerPoolBalances.length
					const terminal = nextSkip >= snapshot.balancerPoolBalanceCount

					return {
						operation: 'account-balancer-pool-balances',
						target: 'balancer',
						terminal,
						...(!terminal && {
							token: String(nextSkip),
						}),
					}
				},
			},
			$veBal: (snapshot) => snapshot.$veBal,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { balancerChainByChainId } = await import('$/sources/Balancer/Rest/constants.ts')
						if (balancerChainByChainId[chainId] == null)
							throw new Error(`${Source.Balancer_Rest}: unsupported chain id ${String(chainId)}`)

						const {
							getPoolsCount,
							listPools,
							listVotingGauges,
						} = await import('$/sources/Balancer/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const skip = balancerPaginationSkip(context)
						const pools = await listPools({
							chainId,
							limit,
							skip,
						})
						const poolCount = await getPoolsCount({
							chainId,
						})
						const gaugesForChain = (await listVotingGauges({
							includeKilled: false,
						}))
							.filter((gauge) => gauge.chainId === chainId)
						return {
							skip,
							poolLimit: limit,
							pools: pools.map((pool) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									poolId: pool.id,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BalancerPool, [], 'address')]: pool.address,
									[entityFieldAddressKey(EntityType.BalancerPool, [], 'name')]: pool.name,
									[entityFieldAddressKey(EntityType.BalancerPool, [], 'poolType')]: pool.type,
									[entityFieldAddressKey(EntityType.BalancerPool, [], 'version')]: pool.version,
									[entityFieldAddressKey(EntityType.BalancerPool, [], 'protocolVersion')]: pool.protocolVersion,
									[entityFieldAddressKey(EntityType.BalancerPool, [], 'vaultAddress')]: pool.vaultAddress,
									[entityFieldAddressKey(EntityType.BalancerPool, [], 'swapFee')]: pool.swapFee,
									[entityFieldAddressKey(EntityType.BalancerPool, [], 'totalLiquidity')]: pool.totalLiquidity,
									[entityFieldAddressKey(EntityType.BalancerPool, [], 'totalShares')]: pool.totalShares,
									...(pool.gaugeAddress != null && {
										[entityFieldAddressKey(EntityType.BalancerPool, [], '$gauge')]: {
											[EntityMetaKey.Selector]: {
												$network: network,
												gaugeAddress: pool.gaugeAddress,
											},
											...(pool.gaugeVersion != null && {
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.BalancerGauge, [], 'version')]: pool.gaugeVersion,
												},
											}),
										},
									}),
									[entityFieldAddressKey(EntityType.BalancerPool, [], '$$aprItems')]: pool.aprItems.map((item) => ({
										[EntityMetaKey.Selector]: {
											$pool: {
												$network: network,
												poolId: pool.id,
											},
											title: item.title,
											aprType: item.type,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.BalancerPoolAprItem, [], 'apr')]: item.apr,
										},
									})),
								},
							})),
							poolCount,
							gauges: gaugesForChain
								.slice(skip, skip + limit)
								.map((gauge) => ({
									[EntityMetaKey.Selector]: {
										$network: network,
										gaugeAddress: gauge.gaugeAddress,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BalancerGauge, [], '$pool')]: {
											[EntityMetaKey.Selector]: {
												$network: network,
												poolId: gauge.poolId,
											},
										},
										[entityFieldAddressKey(EntityType.BalancerGauge, [], 'isKilled')]: gauge.isKilled,
										[entityFieldAddressKey(EntityType.BalancerGauge, [], 'poolSymbol')]: gauge.symbol,
										[entityFieldAddressKey(EntityType.BalancerGauge, [], 'poolType')]: gauge.poolType,
										[entityFieldAddressKey(EntityType.BalancerGauge, [], 'protocolVersion')]: gauge.protocolVersion,
										...(gauge.relativeWeightCap != null && {
											[entityFieldAddressKey(EntityType.BalancerGauge, [], 'relativeWeightCap')]: gauge.relativeWeightCap,
										}),
									},
								})),
							gaugeCount: gaugesForChain.length,
						}
					},
				},
			},
		})({
			Evm: {
				$$balancerPools: {
					select: (snapshot) => snapshot.pools,
					resolveCount: (snapshot) => snapshot.poolCount,
					continuation: (snapshot) => {
						const nextSkip = snapshot.skip + snapshot.pools.length
						const terminal = nextSkip >= snapshot.poolCount

						return {
							operation: 'network-balancer-pools',
							target: 'balancer',
							terminal,
							...(!terminal && {
								token: String(nextSkip),
							}),
						}
					},
				},
				$$balancerGauges: {
					select: (snapshot) => snapshot.gauges,
					resolveCount: (snapshot) => snapshot.gaugeCount,
					continuation: (snapshot) => {
						const nextSkip = snapshot.skip + snapshot.gauges.length
						const terminal = nextSkip >= snapshot.gaugeCount

						return {
							operation: 'network-balancer-gauges',
							target: 'balancer',
							terminal,
							...(!terminal && { token: String(nextSkip) }),
						}
					},
				},
			},
		}),
	],
} as const
