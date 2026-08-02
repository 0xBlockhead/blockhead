import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	type EntitySelector,
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'

const zeroGNetworkSlug = '0g' as const satisfies keyof typeof networkBySlug

type NetworkId = {
	readonly slug: typeof zeroGNetworkSlug
}

const assertZeroGMainnet: (
	network:
		| EntitySelector<typeof schema, EntityType.Network>
		| EntitySelector<typeof schema, EntityType.ZeroGNetwork>
) => asserts network is NetworkId = (network) => {
	if (
		!('slug' in network)
		|| network.slug !== networkBySlug[zeroGNetworkSlug].slug
	)
		throw new Error('ZeroGStorageScan_Rest: unsupported network')
}

const zeroGStorageTimestampFields = async () => {
	const {
		getStorageSummary,
		listStorageMiners,
		listStorageTransactions,
	} = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
	const [
		summary,
		miners,
		transactions,
	] = await Promise.all([
		getStorageSummary(),
		listStorageMiners({
			limit: 1,
		}),
		listStorageTransactions({
			limit: 1,
		}),
	])
	const latestTransaction = transactions.list.at(0)
	const latestMiner = miners.list.at(0)
	return {
		storageLogSyncHeight: summary.logSync.logSyncHeight,
		storageLayer1LogSyncHeight: summary.logSync['layer1-logSyncHeight'],
		storageTransactionCount: transactions.total,
		...(latestTransaction != null && {
			latestDataRoot: latestTransaction.rootHash,
			latestDataSizeBytes: BigInt(latestTransaction.dataSize),
			latestStorageTxHash: latestTransaction.txHash,
		}),
		storageMinerCount: miners.total,
		...(latestMiner != null && {
			latestStorageMiner: latestMiner.miner,
		}),
		storageFeeTotal: summary.storageFee.storageFeeTotal,
		storageRewardTotal: summary.minerReward.totalReward,
		storageTotalWinCount: summary.minerReward.totalWinCount,
		expiredFileCount: summary.storageFile.totalExpiredFiles,
		prunedFileCount: summary.storageFile.totalPrunedFiles,
	}
}

export default {
	source: Source.ZeroGStorageScan_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.ZeroGNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						if (source !== Source.ZeroGStorageScan_Rest)
							throw new Error('ZeroGStorageScan_Rest: unsupported timestamp source')
						assertZeroGMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							...(await zeroGStorageTimestampFields()),
						}
					},
				},
			},
		})({
				$network: (snapshot) => snapshot.$network,
				timestampMs: (snapshot) => snapshot.timestampMs,
				source: (snapshot) => snapshot.source,
				storageLogSyncHeight: (snapshot) => snapshot.storageLogSyncHeight,
				storageLayer1LogSyncHeight: (snapshot) => snapshot.storageLayer1LogSyncHeight,
				storageTransactionCount: (snapshot) => snapshot.storageTransactionCount,
				latestDataRoot: (snapshot) => snapshot.latestDataRoot,
				latestDataSizeBytes: (snapshot) => snapshot.latestDataSizeBytes,
				latestStorageTxHash: (snapshot) => snapshot.latestStorageTxHash,
				storageMinerCount: (snapshot) => snapshot.storageMinerCount,
				latestStorageMiner: (snapshot) => snapshot.latestStorageMiner,
				storageFeeTotal: (snapshot) => snapshot.storageFeeTotal,
				storageRewardTotal: (snapshot) => snapshot.storageRewardTotal,
				storageTotalWinCount: (snapshot) => snapshot.storageTotalWinCount,
				expiredFileCount: (snapshot) => snapshot.expiredFileCount,
				prunedFileCount: (snapshot) => snapshot.prunedFileCount,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertZeroGMainnet(network)
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									timestampMs: Date.now(),
									source: Source.ZeroGStorageScan_Rest,
								},
							},
						]
					},
				},
			},
		})({
				ZeroG: {
					$$timestamps: (timestamps) => timestamps,
				},
			}),

		defineResolver({
			entityType: EntityType.ZeroGStorageNode,
			resolve: {
				NetworkNodeId: {
					resolve: async ({
						$network,
						nodeId,
					}) => {
						assertZeroGMainnet($network)
						const { getStorageMiner } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
						const miner = await getStorageMiner({
							address: EvmAddress.assert(nodeId),
						})
						return {
							$operator: {
								[EntityMetaKey.Selector]: {
									address: nodeId,
								},
							},
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$storageNode: {
											$network,
											nodeId,
										},
										timestampMs: Date.now(),
										source: Source.ZeroGStorageScan_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'balance')]: miner.balance,
										[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'totalReward')]: miner.totalReward,
									},
								},
							],
						}
					},
				},
			},
		})({
				$operator: (snapshot) => snapshot.$operator,
				$$timestamps: (snapshot) => snapshot.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.ZeroGStorageNode_Timestamp,
			resolve: {
				StorageNodeTimestampMsSource: {
					resolve: async ({
						$storageNode,
						timestampMs,
						source,
					}) => {
						if (source !== Source.ZeroGStorageScan_Rest)
							throw new Error('ZeroGStorageScan_Rest: unsupported storage node timestamp source')
						assertZeroGMainnet($storageNode.$network)
						const { getStorageMiner } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
						const miner = await getStorageMiner({
							address: EvmAddress.assert($storageNode.nodeId),
						})
						return {
							$storageNode: {
								[EntityMetaKey.Selector]: $storageNode,
							},
							timestampMs,
							source: Source.ZeroGStorageScan_Rest,
							balance: miner.balance,
							totalReward: miner.totalReward,
						}
					},
				},
			},
		})({
				$storageNode: (snapshot) => snapshot.$storageNode,
				timestampMs: (snapshot) => snapshot.timestampMs,
				source: (snapshot) => snapshot.source,
				balance: (snapshot) => snapshot.balance,
				totalReward: (snapshot) => snapshot.totalReward,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertZeroGMainnet(network)
						const { listStorageMiners } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
						const timestampMs = Date.now()
						return (await listStorageMiners({
							limit: resolverContextRowLimit(context),
						})).list.map((miner) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								nodeId: miner.miner,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.ZeroGStorageNode, [], '$operator')]: {
									[EntityMetaKey.Selector]: {
										address: miner.miner,
									},
								},
								[entityFieldAddressKey(EntityType.ZeroGStorageNode, [], '$$timestamps')]: [
									{
										[EntityMetaKey.Selector]: {
											$storageNode: {
												$network: network,
												nodeId: miner.miner,
											},
											timestampMs,
											source: Source.ZeroGStorageScan_Rest,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'totalReward')]: miner.totalReward,
											[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'winCount')]: miner.winCount,
											[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'miningAttempts')]: miner.miningAttempts,
										},
									},
								],
							},
						}))
					},
				},
			},
		})({
				ZeroG: {
					$$storageNodes: (storageNodes) => storageNodes,
				},
			}),

		defineResolver({
			entityType: EntityType.ZeroGDataBlob,
			resolve: {
				NetworkDataRoot: {
					resolve: async ({
						$network,
						dataRoot,
					}) => {
						assertZeroGMainnet($network)
						const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
						const transactions = await listStorageTransactions({
							limit: 1,
							rootHash: dataRoot,
						})
						const transaction = transactions.list.at(0)
						if (transaction == null || transaction.rootHash !== dataRoot)
							throw new Error(`ZeroGStorageScan_Rest: data root not found ${dataRoot}`)
						return {
							sizeBytes: BigInt(transaction.dataSize),
						}
					},
				},
			},
		})({
				sizeBytes: (snapshot) => snapshot.sizeBytes,
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertZeroGMainnet(network)
						const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
						return {
							network,
							transactions: (await listStorageTransactions({
								limit: resolverContextRowLimit(context),
							})).list,
						}
					},
				},
			},
		})({
				ZeroG: {
					$$dataBlobs: ({
						network,
						transactions,
					}) => transactions.map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							dataRoot: transaction.rootHash,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.ZeroGDataBlob, [], 'sizeBytes')]: BigInt(transaction.dataSize),
						},
					})),
					$$storageLogEntries: ({
						network,
						transactions,
					}) => transactions.map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							logEntryId: transaction.txSeq.toString(),
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], '$dataBlob')]: {
								[EntityMetaKey.Selector]: {
									$network: network,
									dataRoot: transaction.rootHash,
								},
							},
							[entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], '$consensusNetwork')]: {
								[EntityMetaKey.Selector]: {
									$network: network,
									consensusNetworkId: network.slug,
								},
							},
							[entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], 'sequenceNumber')]: BigInt(transaction.txSeq),
							[entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], 'commitment')]: transaction.rootHash,
						},
					})),
				},
			}),

		defineResolver({
			entityType: EntityType.ZeroGStorageLogEntry,
			resolve: {
				NetworkLogEntryId: {
					resolve: async ({
						$network,
						logEntryId,
					}) => {
						assertZeroGMainnet($network)
						const { getStorageTransaction } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
						const transaction = await getStorageTransaction({
							txSeq: logEntryId,
						})
						if (transaction.txSeq.toString() !== logEntryId)
							throw new Error(`ZeroGStorageScan_Rest: storage log entry not found ${logEntryId}`)

						return {
							$dataBlob: {
								[EntityMetaKey.Selector]: {
									$network,
									dataRoot: transaction.rootHash,
								},
							},
							$consensusNetwork: {
								[EntityMetaKey.Selector]: {
									$network,
									consensusNetworkId: $network.slug,
								},
							},
							sequenceNumber: BigInt(transaction.txSeq),
							commitment: transaction.rootHash,
						}
					},
				},
			},
		})({
				$dataBlob: (snapshot) => snapshot.$dataBlob,
				$consensusNetwork: (snapshot) => snapshot.$consensusNetwork,
				sequenceNumber: (snapshot) => snapshot.sequenceNumber,
				commitment: (snapshot) => snapshot.commitment,
			}),

	],
} satisfies RegisteredSourceResolverModule
