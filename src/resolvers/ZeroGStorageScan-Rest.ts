import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { ZeroGStorageScanTransaction } from '$/sources/ZeroG/StorageScan/Rest/types.ts'

const assertZeroGMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.ZeroG || network.reference !== 'mainnet') {
		throw new Error(`ZeroGStorageScan_Rest: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const storageLogEntryIdFromTransaction = (
	transaction: ZeroGStorageScanTransaction,
) => transaction.txSeq.toString()

const storageLogEntryFromTransaction = (
	network: {
		namespace: string
		reference: string
	},
	transaction: ZeroGStorageScanTransaction,
) => ({
	[EntityMetaKey.Id]: {
		$network: network,
		logEntryId: storageLogEntryIdFromTransaction(transaction),
	},
	$dataBlob: {
		[EntityMetaKey.Id]: {
			$network: network,
			dataRoot: transaction.rootHash,
		},
	},
	$consensusNetwork: {
		[EntityMetaKey.Id]: {
			$network: network,
			consensusNetworkId: network.reference,
		},
	},
	sequenceNumber: BigInt(transaction.txSeq),
	commitment: transaction.rootHash,
})

export default {
	source: Source.ZeroGStorageScan_Rest,

	entityResolvers: [
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
							consensusNetworkId: entityId.$network.reference,
						},
					},
					sizeBytes: BigInt(transaction.dataSize),
					$storageLogEntry: storageLogEntryFromTransaction(
						entityId.$network,
						transaction,
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGStorageLogEntry,
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				const { getStorageTransaction } = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')
				return storageLogEntryFromTransaction(
					entityId.$network,
					await getStorageTransaction({
						txSeq: entityId.logEntryId,
					}),
				)
			},
		}),
	],

	entityFieldResolvers: [],
}
