import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'

export default {
	source: Source.Blobscan_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmBlob,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const { getTransaction } = await import(
							'$/sources/Blobscan/Rest/queries.ts'
						)
						const transaction = await getTransaction(
							entitySelector.$transaction.$network.caip2.reference,
							{
								txHash: entitySelector.$transaction.txHash,
							}
						)
						const versionedHash = hexLowerOfByteSize(
							transaction?.blobs?.[entitySelector.indexInTransaction]?.versionedHash ?? '',
							32
						)
						if (versionedHash == null || !versionedHash.startsWith('0x01'))
							throw new Error('Blobscan_Rest: blob versioned hash missing')

						const blockNumber = transaction?.blockNumber
						if (blockNumber == null)
							throw new Error('Blobscan_Rest: blob transaction block missing')

						return {
							versionedHash,
							$block: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$transaction.$network,
									blockNumber: BigInt(blockNumber),
								},
							},
						}
					},
				},
			},
		})({
			versionedHash: (snapshot) => snapshot.versionedHash,
			$block: (snapshot) => snapshot.$block,
		}),

		defineResolver({
			entityType: EntityType.EvmBlob,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						const { getBlobDetail } = await import(
							'$/sources/Blobscan/Rest/queries.ts'
						)
						const blobDetail = await getBlobDetail(
							$transaction.$network.caip2.reference,
							{
								blobIndex: indexInTransaction,
								txHash: $transaction.txHash,
							}
						)
						return {
							kzgCommitment: blobDetail?.commitment,
							blobDataStorageReferences: blobDetail?.dataStorageReferences?.flatMap((reference) => (
								reference.storage != null && (reference.reference != null || reference.url != null) ?
									[{
										storage: reference.storage,
										reference: reference.reference ?? reference.url,
									}]
								:
									[]
							)),
						}
					},
				},
			},
		})({
			kzgCommitment: (snapshot) => snapshot.kzgCommitment,
			blobDataStorageReferences: (snapshot) => snapshot.blobDataStorageReferences,
		}),
	],
} satisfies RegisteredSourceResolverModule
