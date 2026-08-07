import {
	EvmTransactionEnvelopeType,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
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
import type { BlobscanBlockDetail } from '$/sources/Blobscan/Rest/types.ts'

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

const mapEvmBlockFromWire = (
	$network: {
		caip2: {
			namespace: string
			reference: string
		}
	},
	block: BlobscanBlockDetail
) => {
	if ($network.caip2.namespace !== 'eip155')
		throw new Error('Blobscan_Rest: EvmBlock requires eip155')

	const hash = hexLowerOfByteSize(block.hash, 32)
	if (hash == null)
		throw new Error('Blobscan_Rest: block hash missing')

	const timestampMs = Math.floor(Date.parse(block.timestamp) / 1_000) * 1_000
	if (!Number.isFinite(timestampMs) || timestampMs < 0)
		throw new Error('Blobscan_Rest: block timestamp missing')

	const blobGasUsed = (
		block.blobGasUsed == null || block.blobGasUsed === '' ?
			undefined
		:
			BigInt(block.blobGasUsed)
	)
	const excessBlobGas = (
		block.excessBlobGas == null || block.excessBlobGas === '' ?
			undefined
		:
			BigInt(block.excessBlobGas)
	)

	return {
		hash,
		blockNumber: BigInt(block.number),
		timestamp: timestampMs,
		...(blobGasUsed != null && {
			blobGasUsed,
		}),
		...(excessBlobGas != null && {
			excessBlobGas,
		}),
		transactionCount: block.transactions.length,
		transactions: block.transactions.flatMap((transaction) => {
			const txHash = hexLowerOfByteSize(transaction.hash, 32)
			if (txHash == null)
				return []

			return [{
				[EntityMetaKey.Selector]: {
					$network,
					txHash,
				},
			}]
		}),
	}
}

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
			entityType: EntityType.EvmBlock,
			resolve: {
				EvmNetworkBlockNumber: {
					resolve: async ({ $network, blockNumber }) => {
						const { getBlock } = await import(
							'$/sources/Blobscan/Rest/queries.ts'
						)
						const block = await getBlock(
							$network.caip2.reference,
							{
								blockId: String(blockNumber),
							}
						)
						if (block == null)
							throw new Error('Blobscan_Rest: block not found')

						return mapEvmBlockFromWire($network, block)
					},
				},
				EvmNetworkBlockHash: {
					resolve: async ({ $network, hash: hashSelector }) => {
						const { getBlock } = await import(
							'$/sources/Blobscan/Rest/queries.ts'
						)
						const block = await getBlock(
							$network.caip2.reference,
							{
								blockId: hashSelector,
							}
						)
						if (block == null)
							throw new Error('Blobscan_Rest: block not found')

						return mapEvmBlockFromWire($network, block)
					},
				},
			},
		})({
			hash: (block) => block.hash,
			blockNumber: (block) => block.blockNumber,
			timestamp: (block) => block.timestamp,
			blobGasUsed: (block) => block.blobGasUsed,
			excessBlobGas: (block) => block.excessBlobGas,
			transactionCount: (block) => block.transactionCount,
			$$transactions: (block) => block.transactions,
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
						if (transaction.blobs.length === 0)
							throw new Error('Blobscan_Rest: transaction missing blobs')

						const from = (
							transaction.from == null ?
								undefined
							:
								hexLowerOfByteSize(transaction.from, 20)
						)
						if (from == null)
							throw new Error('Blobscan_Rest: transaction missing from address')

						const to = (
							transaction.to == null ?
								undefined
							:
								hexLowerOfByteSize(transaction.to, 20)
						)
						const blobGasUsed = (
							transaction.blobGasUsed == null || transaction.blobGasUsed === '' ?
								undefined
							:
								BigInt(transaction.blobGasUsed)
						)
						const maxFeePerBlobGas = (
							transaction.maxFeePerBlobGas == null || transaction.maxFeePerBlobGas === '' ?
								undefined
							:
								BigInt(transaction.maxFeePerBlobGas)
						)

						return {
							envelopeType: EvmTransactionEnvelopeType.Blob,
							kind: (
								to == null ?
									EvmTransactionKind.ContractCreation
								:
									EvmTransactionKind.ContractCall
							),
							$block: {
								[EntityMetaKey.Selector]: {
									$network,
									blockNumber: BigInt(transaction.blockNumber),
								},
							},
							$from: {
								[EntityMetaKey.Selector]: {
									address: from,
								},
							},
							...(to != null && {
								$to: {
									[EntityMetaKey.Selector]: {
										address: to,
									},
								},
							}),
							...(transaction.index != null && {
								indexInBlock: transaction.index,
							}),
							...(blobGasUsed != null && {
								blobGasUsed,
							}),
							...(maxFeePerBlobGas != null && {
								maxFeePerBlobGas,
							}),
						}
					},
				},
			},
		})({
			envelopeType: (transaction) => transaction.envelopeType,
			kind: (transaction) => transaction.kind,
			$block: (transaction) => transaction.$block,
			$from: (transaction) => transaction.$from,
			$to: (transaction) => transaction.$to,
			indexInBlock: (transaction) => transaction.indexInBlock,
			Blob: {
				blobGasUsed: (transaction) => transaction.blobGasUsed,
				maxFeePerBlobGas: (transaction) => transaction.maxFeePerBlobGas,
			},
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (entitySelector, context) => {
						if (entitySelector.caip2.namespace !== 'eip155')
							throw new Error('Blobscan_Rest: Network.$$blocks requires eip155')

						const limit = Math.min(resolverContextRowLimit(context), 100)
						if (limit === 0)
							return []

						const { listBlocks } = await import(
							'$/sources/Blobscan/Rest/queries.ts'
						)
						const blocks = await listBlocks(
							entitySelector.caip2.reference,
							{
								limit,
								offset: context.pagination.offset ?? 0,
							}
						)

						return blocks.flatMap((block) => {
							const hash = hexLowerOfByteSize(block.hash, 32)
							if (hash == null || !Number.isSafeInteger(block.number) || block.number < 1)
								return []

							const timestampMs = Math.floor(Date.parse(block.timestamp) / 1_000) * 1_000
							const blobGasUsed = (
								block.blobGasUsed == null || block.blobGasUsed === '' ?
									undefined
								:
									BigInt(block.blobGasUsed)
							)
							const excessBlobGas = (
								block.excessBlobGas == null || block.excessBlobGas === '' ?
									undefined
								:
									BigInt(block.excessBlobGas)
							)

							return [{
								[EntityMetaKey.Selector]: {
									$network: entitySelector,
									blockNumber: BigInt(block.number),
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EvmBlock, [], 'hash')]: hash,
									[entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: BigInt(block.number),
									...(Number.isFinite(timestampMs) && timestampMs >= 0 && {
										[entityFieldAddressKey(EntityType.EvmBlock, [], 'timestamp')]: timestampMs,
									}),
									...(blobGasUsed != null && {
										[entityFieldAddressKey(EntityType.EvmBlock, [], 'blobGasUsed')]: blobGasUsed,
									}),
									...(excessBlobGas != null && {
										[entityFieldAddressKey(EntityType.EvmBlock, [], 'excessBlobGas')]: excessBlobGas,
									}),
									...(block.transactions != null && {
										[entityFieldAddressKey(EntityType.EvmBlock, [], 'transactionCount')]: block.transactions.length,
									}),
								},
							}]
						})
					},
				},
			},
		})({
			Evm: {
				$$blocks: (entity) => entity,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
