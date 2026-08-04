import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'

const blobDataStorageReferencesFromWire = (
	references: {
		storage?: string
		reference?: string
		url?: string
	}[] | undefined
) => (
	references?.flatMap((reference) => (
		reference.storage != null && (reference.reference != null || reference.url != null) ?
			[{
				storage: reference.storage,
				reference: reference.reference ?? reference.url,
			}]
		:
			[]
	))
)

const evmBlobRefsFromTransactionBlobs = ({
	$network,
	txHash,
	blockNumber,
	blobs,
}: {
	$network: {
		caip2: {
			namespace: string
			reference: string
		}
	}
	txHash: string
	blockNumber: number | undefined
	blobs: {
		versionedHash?: string
	}[] | undefined
}) => (
	(blobs ?? []).flatMap((blob, indexInTransaction) => {
		const versionedHash = hexLowerOfByteSize(blob.versionedHash ?? '', 32)
		if (versionedHash == null || !versionedHash.startsWith('0x01'))
			return []

		return [{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txHash,
				},
				indexInTransaction,
			},
			[EntityMetaKey.Fields]: {
				...(blockNumber != null && {
					[entityFieldAddressKey(EntityType.EvmBlob, [], '$block')]: {
						[EntityMetaKey.Selector]: {
							$network,
							blockNumber: BigInt(blockNumber),
						},
					},
				}),
				[entityFieldAddressKey(EntityType.EvmBlob, [], '$transaction')]: {
					[EntityMetaKey.Selector]: {
						$network,
						txHash,
					},
				},
				[entityFieldAddressKey(EntityType.EvmBlob, [], 'versionedHash')]: versionedHash,
			},
		}]
	})
)

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
						if (transaction == null)
							throw new Error('Blobscan_Rest: blob transaction not found')

						const versionedHash = hexLowerOfByteSize(
							transaction.blobs?.[entitySelector.indexInTransaction]?.versionedHash ?? '',
							32
						)
						if (versionedHash == null || !versionedHash.startsWith('0x01'))
							throw new Error('Blobscan_Rest: blob versioned hash missing')

						const blockNumber = transaction.blockNumber
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
						if (blobDetail == null)
							return {}

						return {
							kzgCommitment: blobDetail.commitment,
							blobDataStorageReferences: blobDataStorageReferencesFromWire(
								blobDetail.dataStorageReferences
							),
						}
					},
				},
			},
		})({
			kzgCommitment: (snapshot) => snapshot.kzgCommitment,
			blobDataStorageReferences: (snapshot) => snapshot.blobDataStorageReferences,
		}),

		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						const { getTransaction } = await import(
							'$/sources/Blobscan/Rest/queries.ts'
						)
						const transaction = await getTransaction(
							$network.caip2.reference,
							{
								txHash,
							}
						)
						if (transaction == null)
							throw new Error('Blobscan_Rest: transaction not found')

						return evmBlobRefsFromTransactionBlobs({
							$network,
							txHash,
							blockNumber: transaction.blockNumber,
							blobs: transaction.blobs,
						})
					},
				},
			},
		})({
			Blob: {
				$$blobs: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						if (entitySelector.caip2.namespace !== 'eip155')
							throw new Error('Blobscan_Rest: Network.$$blobs requires eip155')

						const limit = Math.min(resolverContextRowLimit(context), 100)
						if (limit === 0)
							return []

						const { listBlobs } = await import(
							'$/sources/Blobscan/Rest/queries.ts'
						)
						const blobs = await listBlobs(
							entitySelector.caip2.reference,
							{
								limit,
								offset: context.pagination.offset ?? 0,
							}
						)

						return blobs.flatMap((blob) => {
							const txHash = hexLowerOfByteSize(blob.txHash ?? '', 32)
							const versionedHash = hexLowerOfByteSize(blob.versionedHash ?? '', 32)
							const blobDataStorageReferences = blobDataStorageReferencesFromWire(
								blob.dataStorageReferences
							)
							if (
								txHash == null
								|| versionedHash == null
								|| !versionedHash.startsWith('0x01')
								|| blob.index == null
							)
								return []

							return [{
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network: entitySelector,
										txHash,
									},
									indexInTransaction: blob.index,
								},
								[EntityMetaKey.Fields]: {
									...(blob.blockNumber != null && {
										[entityFieldAddressKey(EntityType.EvmBlob, [], '$block')]: {
											[EntityMetaKey.Selector]: {
												$network: entitySelector,
												blockNumber: BigInt(blob.blockNumber),
											},
										},
									}),
									[entityFieldAddressKey(EntityType.EvmBlob, [], '$transaction')]: {
										[EntityMetaKey.Selector]: {
											$network: entitySelector,
											txHash,
										},
									},
									[entityFieldAddressKey(EntityType.EvmBlob, [], 'versionedHash')]: versionedHash,
									...(blob.commitment != null && {
										[entityFieldAddressKey(EntityType.EvmBlob, [], 'kzgCommitment')]: blob.commitment,
									}),
									...(blobDataStorageReferences != null && {
										[entityFieldAddressKey(EntityType.EvmBlob, [], 'blobDataStorageReferences')]: blobDataStorageReferences,
									}),
								},
							}]
						})
					},
				},
			},
		})({
			Evm: {
				$$blobs: (entity) => entity,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
