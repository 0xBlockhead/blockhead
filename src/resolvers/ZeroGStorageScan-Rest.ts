import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], '$storageNode')]: {
			[EntityMetaKey.Selector]: {
				$network,
				nodeId,
			},
		},
		[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'timestampMs')]: timestampMs,
		[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'source')]: Source.ZeroGStorageScan_Rest,
		[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'balance')]: balance,
		[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'totalReward')]: totalReward,
		[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'winCount')]: winCount,
		[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'miningAttempts')]: miningAttempts,
	},
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.ZeroGStorageNode, [], '$operator')]: {
			[EntityMetaKey.Selector]: {
				address: nodeId,
			},
		},
		[entityFieldAddressKey(EntityType.ZeroGStorageNode, [], '$$timestamps')]: [
			zeroGStorageNodeTimestampRow({
				$network,
				nodeId,
				timestampMs,
				totalReward,
				winCount,
				miningAttempts,
			}),
		],
	},
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.ZeroGDataBlob, [], 'sizeBytes')]: BigInt(dataSize),
	},
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], '$dataBlob')]: {
			[EntityMetaKey.Selector]: {
				$network,
				dataRoot: rootHash,
			},
		},
		[entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], '$consensusNetwork')]: {
			[EntityMetaKey.Selector]: {
				$network,
				consensusNetworkId: zeroGConsensusNetworkId($network),
			},
		},
		[entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], 'sequenceNumber')]: BigInt(txSeq),
		[entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], 'commitment')]: rootHash,
	},
})

export default {
	source: Source.ZeroGStorageScan_Rest,

	resolvers: [
		defineResolver(Source.ZeroGStorageScan_Rest, {
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

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertZeroGMainnet(network)
						return [
							{
								[EntityMetaKey.Selector]: zeroGNetworkTimestampSelector(
									network,
									Date.now()
								),
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

		defineResolver(Source.ZeroGStorageScan_Rest, {
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
			},
		})({
				$operator: (snapshot) => snapshot.$operator,
				$$timestamps: (snapshot) => snapshot.$$timestamps,
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
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
			},
		})({
				$storageNode: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], '$storageNode')],
				timestampMs: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'timestampMs')],
				source: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'source')],
				balance: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'balance')],
				totalReward: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'totalReward')],
				winCount: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'winCount')],
				miningAttempts: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'miningAttempts')],
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertZeroGMainnet(network)
						const { listStorageMiners } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
						return (await listStorageMiners({
							limit: resolverContextRowLimit(context),
						})).list.map((miner) => zeroGStorageNodeRow({
							$network: network,
							nodeId: miner.miner,
							totalReward: miner.totalReward,
							winCount: miner.winCount,
							miningAttempts: miner.miningAttempts,
							timestampMs: Date.now(),
						}))
					},
				},
			},
		})({
				ZeroG: {
					$$storageNodes: (storageNodes) => storageNodes,
				},
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
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
						if (transaction == null)
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

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertZeroGMainnet(network)
						const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
						return (await listStorageTransactions({
							limit: resolverContextRowLimit(context),
						})).list.map((transaction) => zeroGDataBlobRow({
							$network: network,
							dataRoot: transaction.rootHash,
							dataSize: transaction.dataSize,
							txSeq: transaction.txSeq,
						}))
					},
				},
			},
		})({
				ZeroG: {
					$$dataBlobs: (dataBlobs) => dataBlobs,
				},
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
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
						return zeroGStorageLogEntryFields({
							$network,
							txSeq: transaction.txSeq,
							rootHash: transaction.rootHash,
						})
					},
				},
			},
		})({
				$dataBlob: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], '$dataBlob')],
				$consensusNetwork: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], '$consensusNetwork')],
				sequenceNumber: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], 'sequenceNumber')],
				commitment: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.ZeroGStorageLogEntry, [], 'commitment')],
			}),

		defineResolver(Source.ZeroGStorageScan_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertZeroGMainnet(network)
						const { listStorageTransactions } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
						return (await listStorageTransactions({
							limit: resolverContextRowLimit(context),
						})).list.map((transaction) => zeroGStorageLogEntryFields({
							$network: network,
							txSeq: transaction.txSeq,
							rootHash: transaction.rootHash,
						}))
					},
				},
			},
		})({
				ZeroG: {
					$$storageLogEntries: (storageLogEntries) => storageLogEntries,
				},
			}),

	],
}
