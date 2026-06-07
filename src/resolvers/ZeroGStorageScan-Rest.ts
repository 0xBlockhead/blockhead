import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const assertZeroGMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (!('networkSlug' in network) || network.networkSlug !== '0g') {
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
		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId)
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
							[EntityMetaKey.Id]: {
								$network: entityId,
								timestampMs: Date.now(),
							},
							...timestampFields,
						},
					],
					$$storageNodes: miners.list.map((miner) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							nodeId: miner.miner,
						},
						$operator: {
							[EntityMetaKey.Id]: {
								address: miner.miner,
							},
						},
						totalReward: miner.totalReward,
						winCount: miner.winCount,
						miningAttempts: miner.miningAttempts,
					})),
					$$dataBlobs: transactions.list.map((transaction) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							dataRoot: transaction.rootHash,
						},
						sizeBytes: BigInt(transaction.dataSize),
						$storageLogEntry: {
							[EntityMetaKey.Id]: {
								$network: entityId,
								logEntryId: transaction.txSeq.toString(),
							},
						},
					})),
				}
			},
			fields: {
			$$timestamps: (snapshot) => snapshot.$$timestamps,
			$$storageNodes: (snapshot) => snapshot.$$storageNodes,
			$$dataBlobs: (snapshot) => snapshot.$$dataBlobs,
		}
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork_Timestamp,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				return zeroGStorageTimestampFields()
			},
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
		}
		}),

		defineResolver({
			entityType: EntityType.ZeroGStorageNode,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				const { getStorageMiner } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				const miner = await getStorageMiner({
					address: entityId.nodeId,
				})
				return {
					$operator: {
						[EntityMetaKey.Id]: {
							address: entityId.nodeId,
						},
					},
					balance: miner.balance,
					totalReward: miner.totalReward,
				}
			},
			fields: {
			$operator: (snapshot) => snapshot.$operator,
			balance: (snapshot) => snapshot.balance,
			totalReward: (snapshot) => snapshot.totalReward,
		}
		}),

		defineResolver({
			entityType: EntityType.ZeroGDataBlob,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				const transactions = await listStorageTransactions({
					limit: 1,
					rootHash: entityId.dataRoot,
				})
				const transaction = transactions.list.at(0)
				if (transaction == null) throw new Error(`ZeroGStorageScan_Rest: data root not found ${entityId.dataRoot}`)
				return {
					$consensusNetwork: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							consensusNetworkId: 'networkSlug' in entityId.$network ? entityId.$network.networkSlug : entityId.$network.caip2.reference,
						},
					},
					sizeBytes: BigInt(transaction.dataSize),
					$storageLogEntry: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							logEntryId: transaction.txSeq.toString(),
						},
						$dataBlob: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								dataRoot: transaction.rootHash,
							},
						},
						$consensusNetwork: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								consensusNetworkId: 'networkSlug' in entityId.$network ? entityId.$network.networkSlug : entityId.$network.caip2.reference,
							},
						},
						sequenceNumber: BigInt(transaction.txSeq),
						commitment: transaction.rootHash,
					},
				}
			},
			fields: {
			$consensusNetwork: (snapshot) => snapshot.$consensusNetwork,
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			$storageLogEntry: (snapshot) => snapshot.$storageLogEntry,
		}
		}),

		defineResolver({
			entityType: EntityType.ZeroGStorageLogEntry,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				const { getStorageTransaction } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				const transaction = await getStorageTransaction({
					txSeq: entityId.logEntryId,
				})
				return {
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						logEntryId: transaction.txSeq.toString(),
					},
					$dataBlob: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							dataRoot: transaction.rootHash,
						},
					},
					$consensusNetwork: {
						[EntityMetaKey.Id]: {
							$network: entityId.$network,
							consensusNetworkId: 'networkSlug' in entityId.$network ? entityId.$network.networkSlug : entityId.$network.caip2.reference,
						},
					},
					sequenceNumber: BigInt(transaction.txSeq),
					commitment: transaction.rootHash,
				}
			},
			fields: {
			$dataBlob: (snapshot) => snapshot.$dataBlob,
			$consensusNetwork: (snapshot) => snapshot.$consensusNetwork,
			sequenceNumber: (snapshot) => snapshot.sequenceNumber,
			commitment: (snapshot) => snapshot.commitment,
		}
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
						...(await zeroGStorageTimestampFields()),
					},
				]
			},
			fields: {
			$$timestamps: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				assertZeroGMainnet(entityId)
				const { listStorageMiners } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				return (await listStorageMiners({
					limit: resolverContextRowLimit(context),
				})).list.map((miner) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						nodeId: miner.miner,
					},
					$operator: {
						[EntityMetaKey.Id]: {
							address: miner.miner,
						},
					},
					totalReward: miner.totalReward,
					winCount: miner.winCount,
					miningAttempts: miner.miningAttempts,
				}))
			},
			fields: {
			$$storageNodes: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				assertZeroGMainnet(entityId)
				const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				return (await listStorageTransactions({
					limit: resolverContextRowLimit(context),
				})).list.map((transaction) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						dataRoot: transaction.rootHash,
					},
					sizeBytes: BigInt(transaction.dataSize),
					$storageLogEntry: {
						[EntityMetaKey.Id]: {
							$network: entityId,
							logEntryId: transaction.txSeq.toString(),
						},
					},
				}))
			},
			fields: {
			$$dataBlobs: (snapshot) => snapshot,
		}
		}),
	],
}
