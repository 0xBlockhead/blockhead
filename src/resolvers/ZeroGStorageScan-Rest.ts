import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const assertZeroGMainnet = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (!('networkSlug' in network) || network.networkSlug !== '0g') {
		throw new Error('ZeroGStorageScan_Rest: unsupported network')
	}
}

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

	entityFieldResolvers: [],
}
