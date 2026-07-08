import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { EvmBlobSelector } from '$/schema/EvmBlob.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'


const blobscanChainId = async (network: { caip2: { reference: string } }) => {
	const { blobscanRestApiOriginByChainId } = await import(
		'$/sources/Blobscan/Rest/constants.ts'
	)
	const chainId = Number(network.caip2.reference)
	if (blobscanRestApiOriginByChainId[chainId] == null) {
		throw new Error(
			`Blobscan_Rest: unsupported chain ${String(chainId)}`
		)
	}
	return chainId
}

const blobscanBlobDetail = async ({ $transaction, indexInTransaction }: {
	$transaction: {
		$network: { caip2: { reference: string } }
		txHash: string
	}
	indexInTransaction: number
}) => {
	const { getBlobDetail } = await import(
		'$/sources/Blobscan/Rest/queries.ts'
	)
	return getBlobDetail({
		blobIndex: indexInTransaction,
		chainId: await blobscanChainId($transaction.$network),
		txHash: $transaction.txHash,
	})
}

export default {
	source: Source.Blobscan_Rest,

	resolvers: [
		defineResolver(Source.Blobscan_Rest, {
			entityType: EntityType.EvmBlob,
			resolve: {
				[EvmBlobSelector.TransactionIndexInTransaction]: async (entitySelector, _context) => {
					const { getTransactionBlob } = await import(
						'$/sources/Blobscan/Rest/queries.ts'
					)
					const versionedHash = hexLowerOfByteSize(
						(await getTransactionBlob({
							blobIndex: entitySelector.indexInTransaction,
							chainId: await blobscanChainId(entitySelector.$transaction.$network),
							txHash: entitySelector.$transaction.txHash,
						}))?.versionedHash ?? '',
						32
					)
					if (versionedHash == null || !versionedHash.startsWith('0x01'))
						throw new Error('Blobscan_Rest: blob versioned hash missing')

					return versionedHash
				},
			},
		})({
			versionedHash: (snapshot) => snapshot,
		}),

		defineResolver(Source.Blobscan_Rest, {
			entityType: EntityType.EvmBlob,
			resolve: {
				[EvmBlobSelector.TransactionIndexInTransaction]: async (entitySelector, _context) => {
					const { getTransaction } = await import(
						'$/sources/Blobscan/Rest/queries.ts'
					)
					const blockNumber = (await getTransaction({
						chainId: await blobscanChainId(entitySelector.$transaction.$network),
						txHash: entitySelector.$transaction.txHash,
					}))?.blockNumber
					if (blockNumber == null)
						throw new Error('Blobscan_Rest: blob transaction block missing')

					return {
						[EntityMetaKey.Selector]: {
							$network: entitySelector.$transaction.$network,
							blockNumber: BigInt(blockNumber),
						},
					}
				},
			},
		})({
			$block: (snapshot) => snapshot,
		}),

		defineResolver(Source.Blobscan_Rest, {
			entityType: EntityType.EvmBlob,
			resolve: {
				[EvmBlobSelector.TransactionIndexInTransaction]: async (entitySelector, _context) => {
					return (await blobscanBlobDetail(entitySelector))?.commitment
				},
			},
		})({
				kzgCommitment: (snapshot) => snapshot,
			}),

		defineResolver(Source.Blobscan_Rest, {
			entityType: EntityType.EvmBlob,
			resolve: {
				[EvmBlobSelector.TransactionIndexInTransaction]: async (entitySelector, _context) => {
					return (await blobscanBlobDetail(entitySelector))?.dataStorageReferences
						?.flatMap((reference) => (
							reference.storage != null && (reference.reference != null || reference.url != null) ?
								[{
									storage: reference.storage,
									reference: reference.reference ?? reference.url,
								}]
							:
								[]
						))
				},
			},
		})({
				blobDataStorageReferences: (snapshot) => snapshot,
			}),
	],
}
