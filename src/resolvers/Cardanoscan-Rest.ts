import { networkBySlug } from '$/constants/Network.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	CardanoscanBlock,
	CardanoscanPool,
	CardanoscanTransaction,
} from '$/sources/Cardanoscan/Rest/envelopes.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertCardanoMainnet = (
	network: NetworkId
) => {
	if (
		!(
			'slug' in network
			&& network.slug === networkBySlug.cardano.slug
		)
		&& !(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.cardano.caip2.namespace
			&& network.caip2.reference === networkBySlug.cardano.caip2.reference
		)
	)
		throw new Error('Cardanoscan_Rest: unsupported network')
}

const cardanoNetworkSelectors = <const _Snapshot extends object>(
	resolve: (
		network: NetworkId,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Slug: { resolve },
	Caip2: { resolve },
})

const parseIsoTimestampMs = (
	value: string,
	label: string
) => {
	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error(`Cardanoscan_Rest: invalid ${label} timestamp`)
	return timestampMs
}

const parseFiniteNumber = (
	value: string,
	label: string
) => {
	const parsed = Number(value)
	if (!Number.isFinite(parsed))
		throw new Error(`Cardanoscan_Rest: invalid ${label}`)
	return parsed
}

const normalizeHex = (
	value: string
) => value.toLowerCase()

const blockFields = (
	block: CardanoscanBlock
) => ({
	hash: normalizeHex(block.hash),
	slot: BigInt(block.absSlot),
	blockNo: BigInt(block.blockHeight),
	epoch: block.epoch,
	...(block.vrfVKey != null && block.vrfVKey.length > 0 && {
		issuerVkey: block.vrfVKey,
	}),
	timestampMs: parseIsoTimestampMs(block.timestamp, 'block'),
	txCount: block.txCount,
})

const tipObservation = async () => {
	const {
		getLatestBlock,
		getNetworkState,
	} = await import('$/sources/Cardanoscan/Rest/queries.ts')
	const [
		block,
		networkState,
	] = await Promise.all([
		getLatestBlock(),
		getNetworkState(),
	])
	const fields = blockFields(block)
	return {
		timestampMs: fields.timestampMs,
		latestSlot: fields.slot,
		latestBlockNo: fields.blockNo,
		latestBlockHash: fields.hash,
		latestBlockTimeMs: fields.timestampMs,
		latestBlockTransactionCount: fields.txCount,
		epoch: fields.epoch,
		circulatingSupplyLovelace: BigInt(networkState.circulatingSupply),
	}
}

const resolveBlock = async (
	params:
		| { blockHash: string }
		| { blockHeight: number }
		| { absoluteSlot: number }
) => {
	const { getBlock } = await import('$/sources/Cardanoscan/Rest/queries.ts')
	return blockFields(await getBlock(params))
}

const transactionFields = (
	transaction: CardanoscanTransaction
) => ({
	hash: normalizeHex(transaction.hash),
	blockSlot: BigInt(transaction.absSlot),
	fee: BigInt(transaction.fees),
	...(transaction.ttl != null && {
		ttlSlot: BigInt(transaction.ttl.slot),
	}),
	...(transaction.metadata !== undefined && {
		metadata: transaction.metadata,
	}),
	mint: transaction.mint ?? [],
})

const nativeAssetObservation = async (
	policyId: string,
	assetName: string
) => {
	const {
		getAsset,
		getLatestBlock,
	} = await import('$/sources/Cardanoscan/Rest/queries.ts')
	const assetId = `${policyId}${assetName}`
	const [
		asset,
		block,
	] = await Promise.all([
		getAsset({
			assetId,
		}),
		getLatestBlock(),
	])
	if (
		normalizeHex(asset.policyId) !== normalizeHex(policyId)
		|| normalizeHex(asset.assetName) !== normalizeHex(assetName)
	)
		throw new Error('Cardanoscan_Rest: asset response does not match the subject')

	const tip = blockFields(block)
	return {
		fingerprint: asset.fingerprint,
		slot: tip.slot,
		timestampMs: tip.timestampMs,
		blockHash: tip.hash,
		supply: BigInt(asset.totalSupply),
		transactionCount: asset.txCount,
		mintedOnMs: parseIsoTimestampMs(asset.mintedOn, 'asset mintedOn'),
	}
}

const stakePoolIdentityFields = (
	pool: CardanoscanPool
) => ({
	...(pool.vrfKeyHash != null && {
		vrfKeyHash: normalizeHex(pool.vrfKeyHash),
	}),
	...(pool.name != null && pool.name.length > 0 && {
		name: pool.name,
	}),
	...(pool.ticker != null && pool.ticker.length > 0 && {
		ticker: pool.ticker,
	}),
	...(pool.description != null && pool.description.length > 0 && {
		description: pool.description,
	}),
	...(pool.website != null && pool.website.length > 0 && {
		homepage: pool.website,
	}),
})

const stakePoolObservation = async (
	poolId: string
) => {
	const {
		getLatestBlock,
		getPool,
		getPoolStats,
	} = await import('$/sources/Cardanoscan/Rest/queries.ts')
	const [
		pool,
		stats,
		block,
	] = await Promise.all([
		getPool(poolId),
		getPoolStats(poolId),
		getLatestBlock(),
	])
	if (pool.poolId !== poolId || stats.poolId !== poolId)
		throw new Error('Cardanoscan_Rest: stake pool response does not match the subject')

	const tip = blockFields(block)
	return {
		epoch: tip.epoch,
		source: Source.Cardanoscan_Rest,
		...(pool.declaredPledge != null && {
			pledge: BigInt(pool.declaredPledge),
		}),
		...(pool.margin != null && {
			margin: parseFiniteNumber(pool.margin, 'pool margin'),
		}),
		...(pool.cost != null && {
			fixedCostLovelace: BigInt(pool.cost),
		}),
		...(pool.rewardAccount != null && {
			rewardAccount: pool.rewardAccount,
		}),
		...(pool.owners != null && {
			owners: pool.owners,
		}),
		...(pool.metadata?.url != null && pool.metadata.url.length > 0 && {
			metadataUrl: pool.metadata.url,
		}),
		...(pool.metadata?.metadataHash != null && pool.metadata.metadataHash.length > 0 && {
			metadataHash: pool.metadata.metadataHash,
		}),
		liveStake: BigInt(stats.liveStake),
		activeStake: BigInt(stats.activePledge),
		blockCount: stats.lifetimeBlocks,
		saturation: parseFiniteNumber(stats.saturationLevel, 'pool saturation'),
		retired: !pool.status,
		identity: stakePoolIdentityFields(pool),
	}
}

export default {
	source: Source.Cardanoscan_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
					assertCardanoMainnet(network)
					return (await import('$/sources/Cardanoscan/Rest/queries.ts')).restEndpoints
				}
			),
		})({
			Cardano: {
				restEndpoints: (restEndpoints) => restEndpoints,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
					assertCardanoMainnet(network)
					const observation = await tipObservation()
					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							timestampMs: observation.timestampMs,
							source: Source.Cardanoscan_Rest,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestSlot')]: observation.latestSlot,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockNo')]: observation.latestBlockNo,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockHash')]: observation.latestBlockHash,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTimeMs')]: observation.latestBlockTimeMs,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTransactionCount')]: observation.latestBlockTransactionCount,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epoch')]: observation.epoch,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'circulatingSupplyLovelace')]: observation.circulatingSupplyLovelace,
						},
					}]
				}
			),
		})({
			Cardano: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
					assertCardanoMainnet(network)
					if (resolverContextRowLimit(context) === 0)
						return []

					const observation = await tipObservation()
					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							hash: observation.latestBlockHash,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoBlock, [], 'slot')]: observation.latestSlot,
							[entityFieldAddressKey(EntityType.CardanoBlock, [], 'blockNo')]: observation.latestBlockNo,
							[entityFieldAddressKey(EntityType.CardanoBlock, [], 'epoch')]: observation.epoch,
						},
					}]
				}
			),
		})({
			Cardano: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
					assertCardanoMainnet(network)
					const limit = Math.min(resolverContextRowLimit(context), 100)
					if (limit === 0)
						return []

					const page = context.providerContinuationToken == null ?
						1
					:
						Number(context.providerContinuationToken)
					if (!Number.isSafeInteger(page) || page < 1)
						throw new Error('Cardanoscan_Rest: invalid stake pool list continuation')

					const { listPools } = await import('$/sources/Cardanoscan/Rest/queries.ts')
					const listed = await listPools(page, limit)
					return {
						limit,
						page,
						pools: listed.pools.map((pool) => {
							const identity = stakePoolIdentityFields(pool)
							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									poolId: pool.poolId,
								},
								[EntityMetaKey.Fields]: {
									...('vrfKeyHash' in identity && {
										[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'vrfKeyHash')]: identity.vrfKeyHash,
									}),
									...('name' in identity && {
										[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'name')]: identity.name,
									}),
									...('ticker' in identity && {
										[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'ticker')]: identity.ticker,
									}),
									...('description' in identity && {
										[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'description')]: identity.description,
									}),
									...('homepage' in identity && {
										[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'homepage')]: identity.homepage,
									}),
								},
							}
						}),
					}
				}
			),
		})({
			Cardano: {
				$$stakePools: {
					select: (page) => page.pools,
					continuation: (page) => (
						page.pools.length < page.limit ?
							{
								operation: 'cardanoscan-stake-pools',
								terminal: true,
							}
						:
							{
								operation: 'cardanoscan-stake-pools',
								terminal: false,
								token: (page.page + 1).toString(),
							}
					),
				},
			},
		}),

		defineResolver({
			entityType: EntityType.CardanoNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: [{
						source: Source.Cardanoscan_Rest,
					}],
					resolve: async ({
						$network,
						source,
					}) => {
						assertCardanoMainnet($network)
						if (source !== Source.Cardanoscan_Rest)
							throw new Error('Cardanoscan_Rest: observation source mismatch')

						return tipObservation()
					},
				},
			},
		})({
			latestSlot: (observation) => observation.latestSlot,
			latestBlockNo: (observation) => observation.latestBlockNo,
			latestBlockHash: (observation) => observation.latestBlockHash,
			latestBlockTimeMs: (observation) => observation.latestBlockTimeMs,
			latestBlockTransactionCount: (observation) => observation.latestBlockTransactionCount,
			epoch: (observation) => observation.epoch,
			circulatingSupplyLovelace: (observation) => observation.circulatingSupplyLovelace,
		}),

		defineResolver({
			entityType: EntityType.CardanoBlock,
			resolve: {
				NetworkHash: {
					resolve: async ({
						$network,
						hash,
					}) => {
						assertCardanoMainnet($network)
						const block = await resolveBlock({
							blockHash: hash,
						})
						if (block.hash !== normalizeHex(hash))
							throw new Error('Cardanoscan_Rest: block hash does not match the requested selector')
						return block
					},
				},
				NetworkSlot: {
					resolve: async ({
						$network,
						slot,
					}) => {
						assertCardanoMainnet($network)
						const block = await resolveBlock({
							absoluteSlot: Number(slot),
						})
						if (block.slot !== slot)
							throw new Error('Cardanoscan_Rest: block slot does not match the requested selector')
						return block
					},
				},
				NetworkBlockNo: {
					resolve: async ({
						$network,
						blockNo,
					}) => {
						assertCardanoMainnet($network)
						const block = await resolveBlock({
							blockHeight: Number(blockNo),
						})
						if (block.blockNo !== blockNo)
							throw new Error('Cardanoscan_Rest: block number does not match the requested selector')
						return block
					},
				},
			},
		})({
			hash: (block) => block.hash,
			slot: (block) => block.slot,
			blockNo: (block) => block.blockNo,
			epoch: (block) => block.epoch,
			issuerVkey: (block) => block.issuerVkey,
		}),

		defineResolver({
			entityType: EntityType.CardanoTransaction,
			resolve: {
				NetworkHash: {
					resolve: async (cardanoTransaction) => {
						assertCardanoMainnet(cardanoTransaction.$network)
						const { getTransaction } = await import('$/sources/Cardanoscan/Rest/queries.ts')
						const transaction = transactionFields(await getTransaction(cardanoTransaction.hash))
						if (transaction.hash !== normalizeHex(cardanoTransaction.hash))
							throw new Error('Cardanoscan_Rest: transaction response does not match the subject')
						return transaction
					},
				},
			},
		})({
			blockSlot: (transaction) => transaction.blockSlot,
			fee: (transaction) => transaction.fee,
			ttlSlot: (transaction) => transaction.ttlSlot,
			metadata: (transaction) => transaction.metadata,
			$$assets: (transaction, cardanoTransaction) => transaction.mint.map((asset) => ({
				[EntityMetaKey.Selector]: {
					$network: cardanoTransaction.$network,
					policyId: normalizeHex(asset.policyId),
					assetName: normalizeHex(asset.assetName),
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoNativeAsset, [], 'fingerprint')]: asset.fingerprint,
				},
			})),
		}),

		defineResolver({
			entityType: EntityType.CardanoNativeAsset,
			resolve: {
				NetworkPolicyIdAssetName: {
					resolve: async ({
						$network,
						policyId,
						assetName,
					}) => {
						assertCardanoMainnet($network)
						const observation = await nativeAssetObservation(policyId, assetName)
						return {
							fingerprint: observation.fingerprint,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$asset: {
										$network,
										policyId,
										assetName,
									},
									slot: observation.slot,
									source: Source.Cardanoscan_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'timestampMs')]: observation.timestampMs,
									[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'blockHash')]: observation.blockHash,
									[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'supply')]: observation.supply,
									[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'transactionCount')]: observation.transactionCount,
								},
							}],
						}
					},
				},
			},
		})({
			fingerprint: (asset) => asset.fingerprint,
			$$timestamps: (asset) => asset.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CardanoNativeAsset_Timestamp,
			resolve: {
				AssetSlotSource: {
					appliesTo: [{
						source: Source.Cardanoscan_Rest,
					}],
					resolve: async ({
						$asset,
						slot,
						source,
					}) => {
						assertCardanoMainnet($asset.$network)
						if (source !== Source.Cardanoscan_Rest)
							throw new Error('Cardanoscan_Rest: observation source mismatch')

						const observation = await nativeAssetObservation($asset.policyId, $asset.assetName)
						if (observation.slot !== slot)
							throw new Error('Cardanoscan_Rest: historical asset observation is unavailable')
						return observation
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			blockHash: (observation) => observation.blockHash,
			supply: (observation) => observation.supply,
			transactionCount: (observation) => observation.transactionCount,
		}),

		defineResolver({
			entityType: EntityType.CardanoStakePool,
			resolve: {
				NetworkPoolId: {
					resolve: async ({
						$network,
						poolId,
					}) => {
						assertCardanoMainnet($network)
						const observation = await stakePoolObservation(poolId)
						return {
							...observation.identity,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$pool: {
										$network,
										poolId,
									},
									epoch: observation.epoch,
									source: Source.Cardanoscan_Rest,
								},
								[EntityMetaKey.Fields]: {
									...('pledge' in observation && {
										[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'pledge')]: observation.pledge,
									}),
									...('margin' in observation && {
										[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'margin')]: observation.margin,
									}),
									...('fixedCostLovelace' in observation && {
										[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'fixedCostLovelace')]: observation.fixedCostLovelace,
									}),
									...('rewardAccount' in observation && {
										[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'rewardAccount')]: observation.rewardAccount,
									}),
									...('owners' in observation && {
										[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'owners')]: observation.owners,
									}),
									...('metadataUrl' in observation && {
										[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'metadataUrl')]: observation.metadataUrl,
									}),
									...('metadataHash' in observation && {
										[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'metadataHash')]: observation.metadataHash,
									}),
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'liveStake')]: observation.liveStake,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'activeStake')]: observation.activeStake,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'blockCount')]: observation.blockCount,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'saturation')]: observation.saturation,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'retired')]: observation.retired,
								},
							}],
						}
					},
				},
			},
		})({
			vrfKeyHash: (pool) => pool.vrfKeyHash,
			name: (pool) => pool.name,
			ticker: (pool) => pool.ticker,
			description: (pool) => pool.description,
			homepage: (pool) => pool.homepage,
			$$timestamps: (pool) => pool.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CardanoStakePool_Timestamp,
			resolve: {
				PoolEpochSource: {
					appliesTo: [{
						source: Source.Cardanoscan_Rest,
					}],
					resolve: async ({
						$pool,
						epoch,
						source,
					}) => {
						assertCardanoMainnet($pool.$network)
						if (source !== Source.Cardanoscan_Rest)
							throw new Error('Cardanoscan_Rest: observation source mismatch')

						const observation = await stakePoolObservation($pool.poolId)
						if (observation.epoch !== epoch)
							throw new Error('Cardanoscan_Rest: historical stake pool observation is unavailable')
						return observation
					},
				},
			},
		})({
			pledge: (observation) => observation.pledge,
			margin: (observation) => observation.margin,
			fixedCostLovelace: (observation) => observation.fixedCostLovelace,
			rewardAccount: (observation) => observation.rewardAccount,
			owners: (observation) => observation.owners,
			metadataUrl: (observation) => observation.metadataUrl,
			metadataHash: (observation) => observation.metadataHash,
			liveStake: (observation) => observation.liveStake,
			activeStake: (observation) => observation.activeStake,
			blockCount: (observation) => observation.blockCount,
			saturation: (observation) => observation.saturation,
			retired: (observation) => observation.retired,
		}),

		defineResolver({
			entityType: EntityType.CardanoStakeCredential,
			resolve: {
				NetworkCredential: {
					resolve: async ({
						$network,
						credential,
					}) => {
						assertCardanoMainnet($network)
						const {
							getLatestBlock,
							getRewardAccount,
						} = await import('$/sources/Cardanoscan/Rest/queries.ts')
						const [
							account,
							block,
						] = await Promise.all([
							getRewardAccount(credential),
							getLatestBlock(),
						])
						if (account.rewardAddress !== credential)
							throw new Error('Cardanoscan_Rest: reward account response does not match the subject')

						const tip = blockFields(block)
						return {
							rewardAddress: account.rewardAddress,
							$$delegationEpochs: [{
								[EntityMetaKey.Selector]: {
									$stakeCredential: {
										$network,
										credential,
									},
									epoch: tip.epoch,
									source: Source.Cardanoscan_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(account.poolId != null && {
										[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], '$stakePool')]: {
											[EntityMetaKey.Selector]: {
												$network,
												poolId: account.poolId,
											},
										},
									}),
									...(account.stake != null && {
										[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'activeStake')]: BigInt(account.stake),
									}),
									...(account.rewardsAvailable != null && {
										[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'rewardAmount')]: BigInt(account.rewardsAvailable),
									}),
									...(account.rewardsWithdrawn != null && {
										[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'withdrawalAmount')]: BigInt(account.rewardsWithdrawn),
									}),
									...(account.status != null && {
										[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'registered')]: account.status,
									}),
								},
							}],
						}
					},
				},
			},
		})({
			rewardAddress: (account) => account.rewardAddress,
			$$delegationEpochs: (account) => account.$$delegationEpochs,
		}),
	],
} satisfies RegisteredSourceResolverModule
