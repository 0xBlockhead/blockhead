import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { ZeroGNetworkSelector } from '$/schema/ZeroGNetwork.ts'
import { ZeroGNetwork_TimestampSelector } from '$/schema/ZeroGNetwork_Timestamp.ts'
import { ZeroGStorageNodeSelector } from '$/schema/ZeroGStorageNode.ts'
import { ZeroGDataBlobSelector } from '$/schema/ZeroGDataBlob.ts'
import { ZeroGStorageLogEntrySelector } from '$/schema/ZeroGStorageLogEntry.ts'

const assertZeroGMainnet = (network: { caip2: { namespace: string; reference: string } } | { slug: string }) => {
	if (!('slug' in network) || network.slug !== '0g') {
		throw new Error('ZeroGStorageScan_Rest: unsupported network')
	}
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
		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async (entitySelector) => {
				assertZeroGMainnet(entitySelector)
				const {
					listStorageMiners,
					listStorageTransactions,
				} = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				const [
					timestampFields,
					miners,
					transactions,
				] = await Promise.all([
					zeroGStorageTimestampFields(),
					listStorageMiners({
						limit: 6,
					}),
					listStorageTransactions({
						limit: 6,
					}),
				])
				return {
					$$timestamps: [
						{
							[EntityMetaKey.Selector]: {
								$network: entitySelector,
								timestampMs: Date.now(),
							},
							...timestampFields,
						},
					],
					$$storageNodes: miners.list.map((miner) => ({
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							nodeId: miner.miner,
						},
						$operator: {
							[EntityMetaKey.Selector]: {
								address: miner.miner,
							},
						},
						totalReward: miner.totalReward,
						winCount: miner.winCount,
						miningAttempts: miner.miningAttempts,
					})),
					$$dataBlobs: transactions.list.map((transaction) => ({
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							dataRoot: transaction.rootHash,
						},
						sizeBytes: BigInt(transaction.dataSize),
						$storageLogEntry: {
							[EntityMetaKey.Selector]: {
								$network: entitySelector,
								logEntryId: transaction.txSeq.toString(),
							},
						},
					})),
				}
			}
			}
		})({
				fields: {
			$$timestamps: (snapshot) => snapshot.$$timestamps,
			$$storageNodes: (snapshot) => snapshot.$$storageNodes,
			$$dataBlobs: (snapshot) => snapshot.$$dataBlobs,
		},
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGNetwork_Timestamp,
			resolve: {
				[ZeroGNetwork_TimestampSelector.ZeroGNetworkTimestampMs]: async ({ $network }) => {
				assertZeroGMainnet($network)
				return zeroGStorageTimestampFields()
			}
			}
		})({
				fields: {
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
		},
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGStorageNode,
			resolve: {
				[ZeroGStorageNodeSelector.NetworkNodeId]: async ({ $network, nodeId }) => {
				assertZeroGMainnet($network)
				const { getStorageMiner } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				const miner = await getStorageMiner({
					address: nodeId,
				})
				return {
					$operator: {
						[EntityMetaKey.Selector]: {
							address: nodeId,
						},
					},
					balance: miner.balance,
					totalReward: miner.totalReward,
				}
			}
			}
		})({
				fields: {
			$operator: (snapshot) => snapshot.$operator,
			balance: (snapshot) => snapshot.balance,
			totalReward: (snapshot) => snapshot.totalReward,
		},
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGDataBlob,
			resolve: {
				[ZeroGDataBlobSelector.NetworkDataRoot]: async ({ $network, dataRoot }) => {
				assertZeroGMainnet($network)
				const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				const transactions = await listStorageTransactions({
					limit: 1,
					rootHash: dataRoot,
				})
				const transaction = transactions.list.at(0)
				if (transaction == null) throw new Error(`ZeroGStorageScan_Rest: data root not found ${dataRoot}`)
				return {
					$consensusNetwork: {
						[EntityMetaKey.Selector]: {
							$network: $network,
							consensusNetworkId: 'slug' in $network ? $network.slug : $network.caip2.reference,
						},
					},
					sizeBytes: BigInt(transaction.dataSize),
					$storageLogEntry: {
						[EntityMetaKey.Selector]: {
							$network: $network,
							logEntryId: transaction.txSeq.toString(),
						},
						$dataBlob: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								dataRoot: transaction.rootHash,
							},
						},
						$consensusNetwork: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								consensusNetworkId: 'slug' in $network ? $network.slug : $network.caip2.reference,
							},
						},
						sequenceNumber: BigInt(transaction.txSeq),
						commitment: transaction.rootHash,
					},
				}
			}
			}
		})({
				fields: {
			$consensusNetwork: (snapshot) => snapshot.$consensusNetwork,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			$storageLogEntry: (snapshot) => snapshot.$storageLogEntry,
		},
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGStorageLogEntry,
			resolve: {
				[ZeroGStorageLogEntrySelector.NetworkLogEntryId]: async ({ $network, logEntryId }) => {
				assertZeroGMainnet($network)
				const { getStorageTransaction } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				const transaction = await getStorageTransaction({
					txSeq: logEntryId,
				})
				return {
					[EntityMetaKey.Selector]: {
						$network: $network,
						logEntryId: transaction.txSeq.toString(),
					},
					$dataBlob: {
						[EntityMetaKey.Selector]: {
							$network: $network,
							dataRoot: transaction.rootHash,
						},
					},
					$consensusNetwork: {
						[EntityMetaKey.Selector]: {
							$network: $network,
							consensusNetworkId: 'slug' in $network ? $network.slug : $network.caip2.reference,
						},
					},
					sequenceNumber: BigInt(transaction.txSeq),
					commitment: transaction.rootHash,
				}
			}
			}
		})({
				fields: {
			$dataBlob: (snapshot) => snapshot.$dataBlob,
			$consensusNetwork: (snapshot) => snapshot.$consensusNetwork,
			sequenceNumber: (snapshot) => snapshot.sequenceNumber,
			commitment: (snapshot) => snapshot.commitment,
		},
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async (entitySelector) => {
				assertZeroGMainnet(entitySelector)
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							timestampMs: Date.now(),
						},
						...(await zeroGStorageTimestampFields()),
					},
				]
			}
			}
		})({
				fields: {
			$$timestamps: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async (entitySelector, context) => {
				assertZeroGMainnet(entitySelector)
				const { listStorageMiners } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				return (await listStorageMiners({
					limit: resolverContextRowLimit(context),
				})).list.map((miner) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
						nodeId: miner.miner,
					},
					$operator: {
						[EntityMetaKey.Selector]: {
							address: miner.miner,
						},
					},
					totalReward: miner.totalReward,
					winCount: miner.winCount,
					miningAttempts: miner.miningAttempts,
				}))
			}
			}
		})({
				fields: {
			$$storageNodes: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.Slug]: async (entitySelector, context) => {
				assertZeroGMainnet(entitySelector)
				const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				return (await listStorageTransactions({
					limit: resolverContextRowLimit(context),
				})).list.map((transaction) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
						dataRoot: transaction.rootHash,
					},
					sizeBytes: BigInt(transaction.dataSize),
					$storageLogEntry: {
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							logEntryId: transaction.txSeq.toString(),
						},
					},
				}))
			}
			}
		})({
				fields: {
			$$dataBlobs: (snapshot) => snapshot,
		},
			}),
	],
}
