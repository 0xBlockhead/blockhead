import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroGDataBlobSelector } from '$/schema/ZeroGDataBlob.ts'
import { ZeroGNetworkSelector } from '$/schema/ZeroGNetwork.ts'
import { ZeroGNetwork_TimestampSelector } from '$/schema/ZeroGNetwork_Timestamp.ts'
import { ZeroGStorageLogEntrySelector } from '$/schema/ZeroGStorageLogEntry.ts'
import { ZeroGStorageNodeSelector } from '$/schema/ZeroGStorageNode.ts'
import { ZeroGStorageNode_TimestampSelector } from '$/schema/ZeroGStorageNode_Timestamp.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = { readonly slug: '0g' }

type InputNetworkId = { readonly caip2: {
	readonly namespace: string
	readonly reference: string
} } | { readonly slug: string }

const assertZeroGMainnet: (network: InputNetworkId) => asserts network is NetworkId = (network) => {
	if (!('slug' in network) || network.slug !== networkBySlug['0g'].slug)
		throw new Error('ZeroGStorageScan_Rest: unsupported network')
}

const zeroGConsensusNetworkId = (network: NetworkId) => network.slug

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

const zeroGNetworkTimestampSelector = ($network: NetworkId, timestampMs: number) => ({
	$network,
	timestampMs,
	source: Source.ZeroGStorageScan_Rest,
})

const zeroGStorageNodeTimestampRow = ({
	$network,
	nodeId,
	timestampMs,
	balance,
	totalReward,
	winCount,
	miningAttempts,
	source: _source,
}: {
	$network: NetworkId
	nodeId: `0x${string}`
	timestampMs: number
	balance?: string
	totalReward?: string
	winCount?: number
	miningAttempts?: number
	source?: Source
}) => ({
	[EntityMetaKey.Selector]: {
		$storageNode: {
			$network,
			nodeId,
		},
		timestampMs,
		source: Source.ZeroGStorageScan_Rest,
	},
	$storageNode: {
		[EntityMetaKey.Selector]: {
			$network,
			nodeId,
		},
	},
	timestampMs,
	source: Source.ZeroGStorageScan_Rest,
	balance,
	totalReward,
	winCount,
	miningAttempts,
})

const zeroGStorageNodeRow = ({
	$network,
	nodeId,
	totalReward,
	winCount,
	miningAttempts,
	timestampMs,
}: {
	$network: NetworkId
	nodeId: `0x${string}`
	totalReward?: string
	winCount?: number
	miningAttempts?: number
	timestampMs: number
}) => ({
	[EntityMetaKey.Selector]: {
		$network,
		nodeId,
	},
	$operator: {
		[EntityMetaKey.Selector]: {
			address: nodeId,
		},
	},
	$$timestamps: [
		zeroGStorageNodeTimestampRow({
			$network,
			nodeId,
			timestampMs,
			totalReward,
			winCount,
			miningAttempts,
		}),
	],
})

const zeroGDataBlobRow = ({
	$network,
	dataRoot,
	dataSize,
	txSeq,
}: {
	$network: NetworkId
	dataRoot: string
	dataSize: number
	txSeq: string | number
}) => ({
	[EntityMetaKey.Selector]: {
		$network,
		dataRoot,
	},
	sizeBytes: BigInt(dataSize),
})

const zeroGStorageLogEntryFields = ({
	$network,
	txSeq,
	rootHash,
}: {
	$network: NetworkId
	txSeq: string | number
	rootHash: string
}) => ({
	[EntityMetaKey.Selector]: {
		$network,
		logEntryId: txSeq.toString(),
	},
	$dataBlob: {
		[EntityMetaKey.Selector]: {
			$network,
			dataRoot: rootHash,
		},
	},
	$consensusNetwork: {
		[EntityMetaKey.Selector]: {
			$network,
			consensusNetworkId: zeroGConsensusNetworkId($network),
		},
	},
	sequenceNumber: BigInt(txSeq),
	commitment: rootHash,
})

export default {
	source: Source.ZeroGStorageScan_Rest,

	resolvers: [
		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGNetwork_Timestamp,
			resolve: {
				[ZeroGNetwork_TimestampSelector.NetworkTimestampMsSource]: async ({
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
		})({
			fields: {
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
			},
		}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGStorageNode,
			resolve: {
				[ZeroGStorageNodeSelector.NetworkNodeId]: async ({
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
							zeroGStorageNodeTimestampRow({
								$network,
								nodeId,
								timestampMs: Date.now(),
								balance: miner.balance,
								totalReward: miner.totalReward,
							}),
						],
					}
				},
			},
		})({
			fields: {
				$operator: (snapshot) => snapshot.$operator,
				$$timestamps: (snapshot) => snapshot.$$timestamps,
			},
		}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGStorageNode_Timestamp,
			resolve: {
				[ZeroGStorageNode_TimestampSelector.StorageNodeTimestampMsSource]: async ({
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
					return zeroGStorageNodeTimestampRow({
						$network: $storageNode.$network,
						nodeId: $storageNode.nodeId,
						timestampMs,
						source,
						balance: miner.balance,
						totalReward: miner.totalReward,
					})
				},
			},
		})({
			fields: {
				$storageNode: (snapshot) => snapshot.$storageNode,
				timestampMs: (snapshot) => snapshot.timestampMs,
				source: (snapshot) => snapshot.source,
				balance: (snapshot) => snapshot.balance,
				totalReward: (snapshot) => snapshot.totalReward,
				winCount: (snapshot) => snapshot.winCount,
				miningAttempts: (snapshot) => snapshot.miningAttempts,
			},
		}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGDataBlob,
			resolve: {
				[ZeroGDataBlobSelector.NetworkDataRoot]: async ({
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
					if (transaction == null)
						throw new Error(`ZeroGStorageScan_Rest: data root not found ${dataRoot}`)
					return {
						sizeBytes: BigInt(transaction.dataSize),
					}
				},
			},
		})({
			fields: {
				sizeBytes: (snapshot) => snapshot.sizeBytes,
			},
		}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.ZeroGStorageLogEntry,
			resolve: {
				[ZeroGStorageLogEntrySelector.NetworkLogEntryId]: async ({
					$network,
					logEntryId,
				}) => {
					assertZeroGMainnet($network)
					const { getStorageTransaction } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
					const transaction = await getStorageTransaction({
						txSeq: logEntryId,
					})
					return zeroGStorageLogEntryFields({
						$network,
						txSeq: transaction.txSeq,
						rootHash: transaction.rootHash,
					})
				},
			},
		})({
			fields: {
				$dataBlob: (snapshot) => snapshot.$dataBlob,
				$consensusNetwork: (snapshot) => snapshot.$consensusNetwork,
				sequenceNumber: (snapshot) => snapshot.sequenceNumber,
				commitment: (snapshot) => snapshot.commitment,
			},
		}),

	],
}
