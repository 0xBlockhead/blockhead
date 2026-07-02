import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { EvmBlobSelector } from '$/schema/EvmBlob.ts'


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
					return (await blobscanBlobDetail(entitySelector))?.blob?.commitment
				},
			},
		})({
			fields: {
				kzgCommitment: (snapshot) => snapshot,
			},
		}),

		defineResolver(Source.Blobscan_Rest, {
			entityType: EntityType.EvmBlob,
			resolve: {
				[EvmBlobSelector.TransactionIndexInTransaction]: async (entitySelector, _context) => {
					return (await blobscanBlobDetail(entitySelector))?.blobDataStorage
						?.flatMap((reference) => (
							reference.storage != null && reference.reference != null ?
								[{
									storage: reference.storage,
									reference: reference.reference,
								}]
							:
								[]
						))
				},
			},
		})({
			fields: {
				blobDataStorageReferences: (snapshot) => snapshot,
			},
		}),
	],
}
