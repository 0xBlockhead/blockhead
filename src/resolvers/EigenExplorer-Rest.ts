import { networkBySlug } from '$/constants/Network.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertEthereumMainnet = (network: NetworkId) => {
	if (
		(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.ethereum.caip2.namespace
			&& network.caip2.reference === networkBySlug.ethereum.caip2.reference
		)
		|| (
			'slug' in network
			&& network.slug === networkBySlug.ethereum.slug
		)
	)
		return

	throw new Error('EigenExplorer_Rest: unsupported network')
}

const ethereumNetwork = {
	caip2: networkBySlug.ethereum.caip2,
}

const ethereumMainnetApplicability = [
	{
		$network: {
			caip2: networkBySlug.ethereum.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.ethereum.slug,
		},
	},
] as const

const eigenExplorerPaginationSkip = (
	context: ResolverContext
) => {
	const skip = context.providerContinuationToken == null ?
		context.pagination.offset ?? 0
	:
		Number(context.providerContinuationToken)
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error('EigenExplorer_Rest: invalid pagination offset')

	return skip
}

const allocationMagnitude = (
	magnitude: string
) => {
	const value = Number(magnitude)
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error('EigenExplorer_Rest: allocation magnitude not a safe integer')

	return value
}

const slashIdForStrategy = ({
	operatorSetId,
	createdAtBlock,
	strategyAddress,
}: {
	operatorSetId: number
	createdAtBlock: number
	strategyAddress: string
}) => (
	`${operatorSetId}:${createdAtBlock}:${strategyAddress.toLowerCase()}`
)

const allocationObservation = (
	allocation: {
		avsAddress: string
		operatorSetId: number
		operatorAddress: string
		strategyAddress: string
		magnitude: string
		updatedAt: string
	}
) => {
	const operatorAddress = hexLowerOfByteSize(allocation.operatorAddress, 20)
	const avsAddress = hexLowerOfByteSize(allocation.avsAddress, 20)
	const strategyAddress = hexLowerOfByteSize(allocation.strategyAddress, 20)
	if (
		operatorAddress == null
		|| avsAddress == null
		|| strategyAddress == null
	)
		throw new Error('EigenExplorer_Rest: allocation address not normalized')

	const timestampMs = Date.parse(allocation.updatedAt)
	if (!Number.isFinite(timestampMs))
		throw new Error('EigenExplorer_Rest: invalid allocation timestamp')

	return {
		[EntityMetaKey.Selector]: {
			$operator: {
				$network: ethereumNetwork,
				operatorAddress,
			},
			$avs: {
				$network: ethereumNetwork,
				avsAddress,
			},
			$strategy: {
				$network: ethereumNetwork,
				strategyAddress,
			},
			timestampMs,
			source: Source.EigenExplorer_Rest,
		},
		[EntityMetaKey.Fields]: {
			allocationMagnitude: allocationMagnitude(allocation.magnitude),
			operatorSetId: String(allocation.operatorSetId),
		},
	}
}

const slashObservations = (
	slash: {
		avsAddress: string
		operatorSetId: number
		operatorAddress: string
		strategies: string[]
		wadSlashed: string[]
		description: string
		createdAt: string
		createdAtBlock: number
	}
) => {
	if (slash.strategies.length !== slash.wadSlashed.length)
		throw new Error('EigenExplorer_Rest: slash strategy and quantity counts differ')

	if (
		!Number.isSafeInteger(slash.operatorSetId)
		|| slash.operatorSetId < 0
		|| !Number.isSafeInteger(slash.createdAtBlock)
		|| slash.createdAtBlock < 0
	)
		throw new Error('EigenExplorer_Rest: slash coordinates not safe nonnegative integers')

	const operatorAddress = hexLowerOfByteSize(slash.operatorAddress, 20)
	const avsAddress = hexLowerOfByteSize(slash.avsAddress, 20)
	if (operatorAddress == null || avsAddress == null)
		throw new Error('EigenExplorer_Rest: slash address not normalized')

	const timestampMs = Date.parse(slash.createdAt)
	if (!Number.isFinite(timestampMs))
		throw new Error('EigenExplorer_Rest: invalid slash timestamp')

	return slash.strategies.map((strategyAddressWire, index) => {
		const strategyAddress = hexLowerOfByteSize(strategyAddressWire, 20)
		if (strategyAddress == null)
			throw new Error('EigenExplorer_Rest: slash strategy address not normalized')

		const wadSlashed = slash.wadSlashed[index]
		if (wadSlashed == null)
			throw new Error('EigenExplorer_Rest: slash wad missing')
		if (!/^\d+$/.test(wadSlashed))
			throw new Error('EigenExplorer_Rest: slash wad not a nonnegative integer')

		return {
			[EntityMetaKey.Selector]: {
				$operator: {
					$network: ethereumNetwork,
					operatorAddress,
				},
				$avs: {
					$network: ethereumNetwork,
					avsAddress,
				},
				source: Source.EigenExplorer_Rest,
				slashId: slashIdForStrategy({
					operatorSetId: slash.operatorSetId,
					createdAtBlock: slash.createdAtBlock,
					strategyAddress,
				}),
			},
			[EntityMetaKey.Fields]: {
				$network: {
					[EntityMetaKey.Selector]: ethereumNetwork,
				},
				$operator: {
					[EntityMetaKey.Selector]: {
						$network: ethereumNetwork,
						operatorAddress,
					},
				},
				$avs: {
					[EntityMetaKey.Selector]: {
						$network: ethereumNetwork,
						avsAddress,
					},
				},
				$strategy: {
					[EntityMetaKey.Selector]: {
						$network: ethereumNetwork,
						strategyAddress,
					},
				},
				slashedShares: BigInt(wadSlashed),
				reason: slash.description,
				blockNumber: BigInt(slash.createdAtBlock),
				timestampMs,
				source: Source.EigenExplorer_Rest,
				slashId: slashIdForStrategy({
					operatorSetId: slash.operatorSetId,
					createdAtBlock: slash.createdAtBlock,
					strategyAddress,
				}),
			},
		}
	})
}

export default {
	source: Source.EigenExplorer_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EigenLayerDelegation_Timestamp,
			resolve: {
				StakerOperatorStrategyTimestampMsSource: {
					appliesTo: [
						{
							$staker: {
								$network: {
									caip2: networkBySlug.ethereum.caip2,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
						{
							$staker: {
								$network: {
									slug: networkBySlug.ethereum.slug,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
					],
					resolve: async ({
						$staker,
						$operator,
						$strategy,
						timestampMs,
						source,
					}) => {
						assertEthereumMainnet($staker.$network)
						assertEthereumMainnet($operator.$network)
						assertEthereumMainnet($strategy.$network)
						if (source !== Source.EigenExplorer_Rest)
							throw new Error('EigenExplorer_Rest: observation source mismatch')

						const {
							getStaker,
							getStakerDeposits,
							getStakerWithdrawals,
						} = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const staker = await getStaker($staker.$actor.address)
						if (
							staker.operatorAddress == null
							|| staker.operatorAddress.toLowerCase() !== $operator.operatorAddress.toLowerCase()
						)
							throw new Error('EigenExplorer_Rest: delegation operator mismatch')

						if (Date.parse(staker.updatedAt) !== timestampMs)
							throw new Error('EigenExplorer_Rest: delegation timestamp mismatch')

						const strategyShares = staker.shares.find(({ strategyAddress }) => (
							strategyAddress.toLowerCase() === $strategy.strategyAddress.toLowerCase()
						))
						if (strategyShares == null)
							throw new Error('EigenExplorer_Rest: delegation strategy mismatch')

						const [
							deposits,
							withdrawals,
						] = await Promise.all([
							getStakerDeposits($staker.$actor.address),
							getStakerWithdrawals($staker.$actor.address),
						])
						const depositRoot = hexLowerOfByteSize(
							deposits.data.find(({ strategyAddress }) => (
								strategyAddress.toLowerCase() === $strategy.strategyAddress.toLowerCase()
							))?.transactionHash ?? '',
							32
						)
						const withdrawal = withdrawals.data.find(({
							shares,
							delegatedTo,
						}) => (
							delegatedTo.toLowerCase() === $operator.operatorAddress.toLowerCase()
							&& shares.some(({ strategyAddress }) => (
								strategyAddress.toLowerCase() === $strategy.strategyAddress.toLowerCase()
							))
						))
						const withdrawalRoot = (
							withdrawal == null ?
								undefined
							:
								hexLowerOfByteSize(withdrawal.withdrawalRoot, 32)
						)
						if (withdrawal != null && withdrawalRoot == null)
							throw new Error('EigenExplorer_Rest: withdrawal root not normalized')

						return {
							delegatedShares: BigInt(strategyShares.shares),
							...(depositRoot != null && {
								depositRoot,
							}),
							...(withdrawalRoot != null && withdrawal != null && {
								withdrawalRoot,
								withdrawalQueued: !withdrawal.isCompleted,
								withdrawalCompleted: withdrawal.isCompleted,
							}),
						}
					},
				},
			},
		})({
			delegatedShares: (delegation) => delegation.delegatedShares,
			depositRoot: (delegation) => delegation.depositRoot,
			withdrawalRoot: (delegation) => delegation.withdrawalRoot,
			withdrawalQueued: (delegation) => delegation.withdrawalQueued,
			withdrawalCompleted: (delegation) => delegation.withdrawalCompleted,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
						$actor,
					}) => {
						assertEthereumMainnet($network)

						const { getStaker } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const staker = await getStaker($actor.address)
						if (staker.operatorAddress == null)
							return {
								delegations: [],
							}

						const operatorAddress = hexLowerOfByteSize(staker.operatorAddress, 20)
						if (operatorAddress == null)
							throw new Error('EigenExplorer_Rest: staker operator address not normalized')

						const timestampMs = Date.parse(staker.updatedAt)
						if (!Number.isFinite(timestampMs))
							throw new Error('EigenExplorer_Rest: invalid staker observation timestamp')

						return {
							delegations: staker.shares.map(({ strategyAddress }) => {
								const normalizedStrategyAddress = hexLowerOfByteSize(strategyAddress, 20)
								if (normalizedStrategyAddress == null)
									throw new Error('EigenExplorer_Rest: staker strategy address not normalized')

								return {
									[EntityMetaKey.Selector]: {
										$staker: {
											$network: ethereumNetwork,
											$actor,
										},
										$operator: {
											$network: ethereumNetwork,
											operatorAddress,
										},
										$strategy: {
											$network: ethereumNetwork,
											strategyAddress: normalizedStrategyAddress,
										},
										timestampMs,
										source: Source.EigenExplorer_Rest,
									},
								}
							}),
						}
					},
				},
			},
		})({
			$$eigenLayerDelegations: {
				select: (snapshot) => snapshot.delegations,
				resolveCount: (snapshot) => snapshot.delegations.length,
			},
		}),

		defineResolver({
			entityType: EntityType.EigenLayerOperator,
			resolve: {
				NetworkOperatorAddress: {
					appliesTo: [
						{
							$network: {
								caip2: networkBySlug.ethereum.caip2,
							},
						},
						{
							$network: {
								slug: networkBySlug.ethereum.slug,
							},
						},
					],
					resolve: async ({
						$network,
						operatorAddress,
					}) => {
						assertEthereumMainnet($network)

						const { getOperator } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const operator = await getOperator(operatorAddress)
						const address = hexLowerOfByteSize(operator.address, 20)
						if (address == null)
							throw new Error('EigenExplorer_Rest: operator address not normalized')

						return {
							name: operator.metadataName,
							...(operator.metadataDescription != null && {
								description: operator.metadataDescription,
							}),
							...(operator.metadataWebsite != null && {
								website: operator.metadataWebsite,
							}),
							...(operator.metadataLogo != null && {
								metadataUri: operator.metadataLogo,
							}),
							$operatorAccount: {
								[EntityMetaKey.Selector]: {
									$network: ethereumNetwork,
									$actor: {
										address,
									},
								},
							},
						}
					},
				},
			},
		})({
			name: (operator) => operator.name,
			description: (operator) => operator.description,
			website: (operator) => operator.website,
			metadataUri: (operator) => operator.metadataUri,
			$operatorAccount: (operator) => operator.$operatorAccount,
		}),

		defineResolver({
			entityType: EntityType.EigenLayerOperator,
			resolve: {
				NetworkOperatorAddress: {
					appliesTo: [
						{
							$network: {
								caip2: networkBySlug.ethereum.caip2,
							},
						},
						{
							$network: {
								slug: networkBySlug.ethereum.slug,
							},
						},
					],
					resolve: async ({
						$network,
						operatorAddress,
					}) => {
						assertEthereumMainnet($network)

						const {
							getOperator,
							getOperatorRewardInfo,
						} = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const [
							operator,
							rewardInfo,
						] = await Promise.all([
							getOperator(operatorAddress),
							getOperatorRewardInfo(operatorAddress),
						])
						const earnerAddress = hexLowerOfByteSize(rewardInfo.address, 20)
						if (earnerAddress == null)
							throw new Error('EigenExplorer_Rest: reward earner address not normalized')

						const timestampMs = Date.parse(operator.updatedAt)

						return (
							rewardInfo.rewardStrategies.flatMap((strategyAddressWire) => {
								const strategyAddress = hexLowerOfByteSize(strategyAddressWire, 20)
								if (strategyAddress == null)
									throw new Error('EigenExplorer_Rest: reward strategy address not normalized')

								return rewardInfo.rewardTokens.map((rewardTokenWire) => {
									const rewardToken = hexLowerOfByteSize(rewardTokenWire, 20)
									if (rewardToken == null)
										throw new Error('EigenExplorer_Rest: reward token address not normalized')

									return {
										[EntityMetaKey.Selector]: {
											$earner: {
												$network: ethereumNetwork,
												$actor: {
													address: earnerAddress,
												},
											},
											rewardContextKey: `${strategyAddress}:${rewardToken}`,
											timestampMs,
											source: Source.EigenExplorer_Rest,
										},
										[EntityMetaKey.Fields]: {
											$strategy: {
												[EntityMetaKey.Selector]: {
													$network: ethereumNetwork,
													strategyAddress,
												},
											},
											$operator: {
												[EntityMetaKey.Selector]: {
													$network: ethereumNetwork,
													operatorAddress: earnerAddress,
												},
											},
											rewardToken,
										},
									}
								})
							})
						)
					},
				},
			},
		})({
			$$rewards: (rewards) => rewards,
		}),

		defineResolver({
			entityType: EntityType.EigenLayerReward_Timestamp,
			resolve: {
				EarnerRewardContextKeyTimestampMsSource: {
					appliesTo: [
						{
							$earner: {
								$network: {
									caip2: networkBySlug.ethereum.caip2,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
						{
							$earner: {
								$network: {
									slug: networkBySlug.ethereum.slug,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
					],
					resolve: async ({
						$earner,
						rewardContextKey,
						timestampMs,
						source,
					}) => {
						assertEthereumMainnet($earner.$network)
						if (source !== Source.EigenExplorer_Rest)
							throw new Error('EigenExplorer_Rest: observation source mismatch')

						const [
							strategyAddressWire,
							rewardTokenWire,
						] = rewardContextKey.split(':')
						const strategyAddress = hexLowerOfByteSize(strategyAddressWire ?? '', 20)
						const rewardToken = hexLowerOfByteSize(rewardTokenWire ?? '', 20)
						if (
							strategyAddress == null
							|| rewardToken == null
							|| rewardContextKey !== `${strategyAddress}:${rewardToken}`
						)
							throw new Error('EigenExplorer_Rest: invalid reward context key')

						const {
							getOperator,
							getOperatorRewardInfo,
						} = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const [
							operator,
							rewardInfo,
						] = await Promise.all([
							getOperator($earner.$actor.address),
							getOperatorRewardInfo($earner.$actor.address),
						])
						if (Date.parse(operator.updatedAt) !== timestampMs)
							throw new Error('EigenExplorer_Rest: reward timestamp mismatch')

						const earnerAddress = hexLowerOfByteSize(rewardInfo.address, 20)
						if (
							earnerAddress == null
							|| earnerAddress !== $earner.$actor.address.toLowerCase()
						)
							throw new Error('EigenExplorer_Rest: foreign reward earner')

						if (
							!rewardInfo.rewardStrategies.some((value) => (
								value.toLowerCase() === strategyAddress
							))
							|| !rewardInfo.rewardTokens.some((value) => (
								value.toLowerCase() === rewardToken
							))
						)
							throw new Error('EigenExplorer_Rest: reward context mismatch')

						return {
							$strategy: {
								[EntityMetaKey.Selector]: {
									$network: ethereumNetwork,
									strategyAddress,
								},
							},
							$operator: {
								[EntityMetaKey.Selector]: {
									$network: ethereumNetwork,
									operatorAddress: earnerAddress,
								},
							},
							rewardToken,
						}
					},
				},
			},
		})({
			$strategy: (reward) => reward.$strategy,
			$operator: (reward) => reward.$operator,
			rewardToken: (reward) => reward.rewardToken,
		}),

		defineResolver({
			entityType: EntityType.EigenLayerAvs,
			resolve: {
				NetworkAvsAddress: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
						avsAddress,
					}) => {
						assertEthereumMainnet($network)

						const { getAvs } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const avs = await getAvs(avsAddress)
						const address = hexLowerOfByteSize(avs.address, 20)
						if (address == null)
							throw new Error('EigenExplorer_Rest: AVS address not normalized')

						return {
							name: avs.metadataName,
							...(avs.metadataDescription != null && {
								description: avs.metadataDescription,
							}),
							...(avs.metadataWebsite != null && {
								website: avs.metadataWebsite,
							}),
							...(avs.metadataLogo != null && {
								metadataUri: avs.metadataLogo,
							}),
							$avsAccount: {
								[EntityMetaKey.Selector]: {
									$network: ethereumNetwork,
									$actor: {
										address,
									},
								},
							},
						}
					},
				},
			},
		})({
			name: (avs) => avs.name,
			description: (avs) => avs.description,
			website: (avs) => avs.website,
			metadataUri: (avs) => avs.metadataUri,
			$avsAccount: (avs) => avs.$avsAccount,
		}),

		defineResolver({
			entityType: EntityType.EigenLayerAvs,
			resolve: {
				NetworkAvsAddress: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
						avsAddress,
					}) => {
						assertEthereumMainnet($network)

						const { getAvs } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const avs = await getAvs(avsAddress)
						const address = hexLowerOfByteSize(avs.address, 20)
						if (address == null)
							throw new Error('EigenExplorer_Rest: AVS address not normalized')
						const timestampMs = Date.parse(avs.updatedAt)

						return [{
							[EntityMetaKey.Selector]: {
								$avs: {
									[EntityMetaKey.Selector]: {
										$network: ethereumNetwork,
										avsAddress: address,
									},
								},
								timestampMs,
								source: Source.EigenExplorer_Rest,
							},
						}]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.EigenLayerAvs,
			resolve: {
				NetworkAvsAddress: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
						avsAddress,
					}, context) => {
						assertEthereumMainnet($network)

						const skip = eigenExplorerPaginationSkip(context)
						const take = Math.min(resolverContextRowLimit(context), 100)
						const { listAvsOperators } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const page = await listAvsOperators(avsAddress, {
							skip,
							take,
						})

						return {
							skip,
							totalCount: page.meta.total,
							rows: page.data.map((operator) => {
								const operatorAddress = hexLowerOfByteSize(operator.address, 20)
								if (operatorAddress == null)
									throw new Error('EigenExplorer_Rest: operator address not normalized')

								return {
									[EntityMetaKey.Selector]: {
										$network: ethereumNetwork,
										operatorAddress,
									},
								}
							}),
						}
					},
				},
			},
		})({
			$$operators: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.rows.length

					return {
						operation: 'avs-operators',
						target: 'eigen-explorer',
						terminal: nextSkip >= snapshot.totalCount,
						...(nextSkip < snapshot.totalCount && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EigenLayerAvs_Timestamp,
			resolve: {
				AvsTimestampMsSource: {
					appliesTo: [
						{
							$avs: {
								$network: {
									caip2: networkBySlug.ethereum.caip2,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
						{
							$avs: {
								$network: {
									slug: networkBySlug.ethereum.slug,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
					],
					resolve: async ({
						$avs,
						timestampMs,
						source,
					}) => {
						assertEthereumMainnet($avs.$network)
						if (source !== Source.EigenExplorer_Rest)
							throw new Error('EigenExplorer_Rest: observation source mismatch')

						const { getAvs } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const avs = await getAvs($avs.avsAddress)
						if (Date.parse(avs.updatedAt) !== timestampMs)
							throw new Error('EigenExplorer_Rest: AVS timestamp mismatch')

						const blockNumber = BigInt(avs.updatedAtBlock)

						return {
							blockNumber,
							operatorCount: avs.totalOperators,
							strategyCount: avs.shares.length,
						}
					},
				},
			},
		})({
			blockNumber: (timestamp) => timestamp.blockNumber,
			operatorCount: (timestamp) => timestamp.operatorCount,
			strategyCount: (timestamp) => timestamp.strategyCount,
		}),

		defineResolver({
			entityType: EntityType.EigenLayerStrategy,
			resolve: {
				NetworkStrategyAddress: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
						strategyAddress,
					}) => {
						assertEthereumMainnet($network)

						const address = hexLowerOfByteSize(strategyAddress, 20)
						if (address == null)
							throw new Error('EigenExplorer_Rest: strategy address not normalized')

						const { getStrategyTvl } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						await getStrategyTvl(address)

						return {
							$strategyContract: {
								[EntityMetaKey.Selector]: {
									$network: ethereumNetwork,
									address,
								},
							},
						}
					},
				},
			},
		})({
			$strategyContract: (strategy) => strategy.$strategyContract,
		}),

		defineResolver({
			entityType: EntityType.EigenLayerOperator,
			resolve: {
				NetworkOperatorAddress: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
						operatorAddress,
					}, context) => {
						assertEthereumMainnet($network)

						const skip = eigenExplorerPaginationSkip(context)
						const take = Math.min(resolverContextRowLimit(context), 100)
						const { listOperatorAllocations } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const page = await listOperatorAllocations(operatorAddress, {
							skip,
							take,
						})

						return {
							skip,
							totalCount: page.meta.total,
							rows: page.data.map((allocation) => (
								{
									[EntityMetaKey.Selector]: allocationObservation(allocation)[EntityMetaKey.Selector],
								}
							)),
						}
					},
				},
			},
		})({
			$$allocations: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.rows.length

					return {
						operation: 'operator-allocations',
						target: 'eigen-explorer',
						terminal: nextSkip >= snapshot.totalCount,
						...(nextSkip < snapshot.totalCount && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EigenLayerAvs,
			resolve: {
				NetworkAvsAddress: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
						avsAddress,
					}, context) => {
						assertEthereumMainnet($network)

						const skip = eigenExplorerPaginationSkip(context)
						const take = Math.min(resolverContextRowLimit(context), 100)
						const { listAvsAllocations } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const page = await listAvsAllocations(avsAddress, {
							skip,
							take,
						})

						return {
							skip,
							totalCount: page.meta.total,
							rows: page.data.map((allocation) => (
								{
									[EntityMetaKey.Selector]: allocationObservation(allocation)[EntityMetaKey.Selector],
								}
							)),
						}
					},
				},
			},
		})({
			$$allocations: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.rows.length

					return {
						operation: 'avs-allocations',
						target: 'eigen-explorer',
						terminal: nextSkip >= snapshot.totalCount,
						...(nextSkip < snapshot.totalCount && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EigenLayerAllocation_Timestamp,
			resolve: {
				OperatorAvsStrategyTimestampMsSource: {
					appliesTo: [
						{
							$operator: {
								$network: {
									caip2: networkBySlug.ethereum.caip2,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
						{
							$operator: {
								$network: {
									slug: networkBySlug.ethereum.slug,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
					],
					resolve: async ({
						$operator,
						$avs,
						$strategy,
						timestampMs,
						source,
					}) => {
						assertEthereumMainnet($operator.$network)
						assertEthereumMainnet($avs.$network)
						assertEthereumMainnet($strategy.$network)
						if (source !== Source.EigenExplorer_Rest)
							throw new Error('EigenExplorer_Rest: observation source mismatch')

						const {
							getOperator,
							listOperatorAllocations,
						} = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const take = 100
						let skip = 0
						let allocation

						for (;;) {
							const page = await listOperatorAllocations($operator.operatorAddress, {
								skip,
								take,
								avsAddress: $avs.avsAddress,
								strategyAddress: $strategy.strategyAddress,
							})
							allocation = page.data.find((candidate) => (
								candidate.avsAddress.toLowerCase() === $avs.avsAddress.toLowerCase()
								&& candidate.strategyAddress.toLowerCase() === $strategy.strategyAddress.toLowerCase()
								&& Date.parse(candidate.updatedAt) === timestampMs
							))
							if (allocation != null)
								break

							skip += page.data.length
							if (page.data.length === 0 || skip >= page.meta.total)
								break
						}

						if (allocation == null)
							throw new Error('EigenExplorer_Rest: allocation observation mismatch')

						const operator = await getOperator($operator.operatorAddress, {
							withAvsData: true,
						})
						const registration = operator.avsRegistrations?.find((candidate) => (
							candidate.avsAddress.toLowerCase() === $avs.avsAddress.toLowerCase()
						))

						return {
							allocationMagnitude: allocationMagnitude(allocation.magnitude),
							operatorSetId: String(allocation.operatorSetId),
							...(registration != null && {
								registrationStatus: (
									registration.isActive ?
										'active'
									:
										'inactive'
								),
							}),
						}
					},
				},
			},
		})({
			allocationMagnitude: (allocation) => allocation.allocationMagnitude,
			operatorSetId: (allocation) => allocation.operatorSetId,
			registrationStatus: (allocation) => allocation.registrationStatus,
		}),

		defineResolver({
			entityType: EntityType.EigenLayerOperator,
			resolve: {
				NetworkOperatorAddress: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
						operatorAddress,
					}, context) => {
						assertEthereumMainnet($network)

						const skip = eigenExplorerPaginationSkip(context)
						const take = Math.min(resolverContextRowLimit(context), 100)
						const { listOperatorSlashes } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const page = await listOperatorSlashes(operatorAddress, {
							skip,
							take,
						})

						return {
							skip,
							pageCount: page.data.length,
							totalCount: page.meta.total,
							rows: page.data.flatMap((slash) => (
								slashObservations(slash).map((observation) => (
									{
										[EntityMetaKey.Selector]: observation[EntityMetaKey.Selector],
									}
								))
							)),
						}
					},
				},
			},
		})({
			$$slashingEvents: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.pageCount

					return {
						operation: 'operator-slashes',
						target: 'eigen-explorer',
						terminal: nextSkip >= snapshot.totalCount,
						...(nextSkip < snapshot.totalCount && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EigenLayerAvs,
			resolve: {
				NetworkAvsAddress: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
						avsAddress,
					}, context) => {
						assertEthereumMainnet($network)

						const skip = eigenExplorerPaginationSkip(context)
						const take = Math.min(resolverContextRowLimit(context), 100)
						const { listAvsSlashes } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const page = await listAvsSlashes(avsAddress, {
							skip,
							take,
						})

						return {
							skip,
							pageCount: page.data.length,
							totalCount: page.meta.total,
							rows: page.data.flatMap((slash) => (
								slashObservations(slash).map((observation) => (
									{
										[EntityMetaKey.Selector]: observation[EntityMetaKey.Selector],
									}
								))
							)),
						}
					},
				},
			},
		})({
			$$slashingEvents: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.pageCount

					return {
						operation: 'avs-slashes',
						target: 'eigen-explorer',
						terminal: nextSkip >= snapshot.totalCount,
						...(nextSkip < snapshot.totalCount && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EigenLayerSlashingEvent,
			resolve: {
				OperatorAvsSourceSlashId: {
					appliesTo: [
						{
							$operator: {
								$network: {
									caip2: networkBySlug.ethereum.caip2,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
						{
							$operator: {
								$network: {
									slug: networkBySlug.ethereum.slug,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
					],
					resolve: async ({
						$operator,
						$avs,
						source,
						slashId,
					}) => {
						assertEthereumMainnet($operator.$network)
						assertEthereumMainnet($avs.$network)
						if (source !== Source.EigenExplorer_Rest)
							throw new Error('EigenExplorer_Rest: slash source mismatch')

						const { listOperatorSlashes } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const avsAddress = hexLowerOfByteSize($avs.avsAddress, 20)
						if (avsAddress == null)
							throw new Error('EigenExplorer_Rest: AVS address not normalized')

						const take = 100
						let skip = 0
						for (;;) {
							const page = await listOperatorSlashes($operator.operatorAddress, {
								skip,
								take,
							})
							const observation = page.data
								.flatMap((slash) => slashObservations(slash))
								.find((candidate) => (
									candidate[EntityMetaKey.Selector].slashId === slashId
									&& candidate[EntityMetaKey.Selector].$avs.avsAddress === avsAddress
									&& candidate[EntityMetaKey.Selector].$operator.operatorAddress
										=== $operator.operatorAddress.toLowerCase()
								))
							if (observation != null)
								return observation[EntityMetaKey.Fields]

							skip += page.data.length
							if (page.data.length === 0 || skip >= page.meta.total)
								break
						}

						throw new Error('EigenExplorer_Rest: slash observation mismatch')
					},
				},
			},
		})({
			$network: (slash) => slash.$network,
			$operator: (slash) => slash.$operator,
			$avs: (slash) => slash.$avs,
			$strategy: (slash) => slash.$strategy,
			slashedShares: (slash) => slash.slashedShares,
			reason: (slash) => slash.reason,
			blockNumber: (slash) => slash.blockNumber,
			timestampMs: (slash) => slash.timestampMs,
			source: (slash) => slash.source,
			slashId: (slash) => slash.slashId,
		}),

		defineResolver({
			entityType: EntityType.EigenLayerProtocol,
			resolve: {
				Network: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
					}, context) => {
						assertEthereumMainnet($network)

						const skip = eigenExplorerPaginationSkip(context)
						const take = Math.min(resolverContextRowLimit(context), 100)
						const { listOperators } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const page = await listOperators({
							skip,
							take,
						})

						return {
							skip,
							totalCount: page.meta.total,
							rows: page.data.map((operator) => {
								const operatorAddress = hexLowerOfByteSize(operator.address, 20)
								if (operatorAddress == null)
									throw new Error('EigenExplorer_Rest: operator address not normalized')

								return {
									[EntityMetaKey.Selector]: {
										$network: ethereumNetwork,
										operatorAddress,
									},
								}
							}),
						}
					},
				},
			},
		})({
			$$operators: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.rows.length

					return {
						operation: 'protocol-operators',
						target: 'eigen-explorer',
						terminal: nextSkip >= snapshot.totalCount,
						...(nextSkip < snapshot.totalCount && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EigenLayerProtocol,
			resolve: {
				Network: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
					}, context) => {
						assertEthereumMainnet($network)

						const skip = eigenExplorerPaginationSkip(context)
						const take = Math.min(resolverContextRowLimit(context), 100)
						const { listAvss } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const page = await listAvss({
							skip,
							take,
						})

						return {
							skip,
							totalCount: page.meta.total,
							rows: page.data.map((avs) => {
								const address = hexLowerOfByteSize(avs.address, 20)
								if (address == null)
									throw new Error('EigenExplorer_Rest: AVS address not normalized')

								return {
									[EntityMetaKey.Selector]: {
										$network: ethereumNetwork,
										avsAddress: address,
									},
								}
							}),
						}
					},
				},
			},
		})({
			$$avss: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.rows.length

					return {
						operation: 'protocol-avss',
						target: 'eigen-explorer',
						terminal: nextSkip >= snapshot.totalCount,
						...(nextSkip < snapshot.totalCount && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EigenLayerProtocol,
			resolve: {
				Network: {
					appliesTo: ethereumMainnetApplicability,
					resolve: async ({
						$network,
					}, context) => {
						assertEthereumMainnet($network)

						const skip = eigenExplorerPaginationSkip(context)
						const take = Math.min(resolverContextRowLimit(context), 100)
						const { listStrategies } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const page = await listStrategies({
							skip,
							take,
						})

						return {
							skip,
							totalCount: page.meta.total,
							rows: page.data.map((strategy) => {
								const strategyAddress = hexLowerOfByteSize(strategy.strategyAddress, 20)
								if (strategyAddress == null)
									throw new Error('EigenExplorer_Rest: strategy address not normalized')

								return {
									[EntityMetaKey.Selector]: {
										$network: ethereumNetwork,
										strategyAddress,
									},
								}
							}),
						}
					},
				},
			},
		})({
			$$strategies: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.rows.length

					return {
						operation: 'protocol-strategies',
						target: 'eigen-explorer',
						terminal: nextSkip >= snapshot.totalCount,
						...(nextSkip < snapshot.totalCount && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
