import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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
	return {
		storageLogSyncHeight: summary.logSync.logSyncHeight,
		storageLayer1LogSyncHeight: summary.logSync['layer1-logSyncHeight'],
		storageTransactionCount: transactions.total,
		...(transactions.list[0] != null && {
			latestDataRoot: transactions.list[0].rootHash,
			latestDataSizeBytes: BigInt(transactions.list[0].dataSize),
			latestStorageTxHash: transactions.list[0].txHash,
		}),
		storageMinerCount: miners.total,
		...(miners.list[0] != null && {
			latestStorageMiner: miners.list[0].miner,
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.ZeroGNetwork,
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
						operatorAddress: miner.miner,
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
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGNetwork_Timestamp,
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				return zeroGStorageTimestampFields()
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGStorageNode,
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				const { getStorageMiner } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				const miner = await getStorageMiner({
					address: entityId.nodeId,
				})
				return {
					operatorAddress: entityId.nodeId,
					balance: miner.balance,
					totalReward: miner.totalReward,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGDataBlob,
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				const transactions = await listStorageTransactions({
					limit: 1,
					rootHash: entityId.dataRoot,
				})
				const transaction = transactions.list[0]
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
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGStorageLogEntry,
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
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.ZeroGNetwork,
			fieldName: '$$timestamps',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ZeroGNetwork,
			fieldName: '$$storageNodes',
			resolve: async (entityId, context) => {
				assertZeroGMainnet(entityId)
				const { listStorageMiners } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				return (await listStorageMiners({
					limit: resolverLoadSubsetRowLimit(context),
				})).list.map((miner) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						nodeId: miner.miner,
					},
					operatorAddress: miner.miner,
					totalReward: miner.totalReward,
					winCount: miner.winCount,
					miningAttempts: miner.miningAttempts,
				}))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ZeroGNetwork,
			fieldName: '$$dataBlobs',
			resolve: async (entityId, context) => {
				assertZeroGMainnet(entityId)
				const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				return (await listStorageTransactions({
					limit: resolverLoadSubsetRowLimit(context),
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
		}),
	],
}
