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
	],
} satisfies RegisteredSourceResolverModule
