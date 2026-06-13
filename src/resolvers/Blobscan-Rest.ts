import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EntityIdProjection } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'


const blobscanChainId = async (network: { caip2: { reference: string } }) => {
	const { blobscanRestApiOriginForChainId } = await import(
		'$/sources/Blobscan/Rest/constants.ts'
	)
	const chainId = Number(network.caip2.reference)
	if (blobscanRestApiOriginForChainId(chainId) == null) {
		throw new Error(
			`Blobscan_Rest: unsupported chain ${String(chainId)}`,
		)
	}
	return chainId
}

const blobscanBlobDetail = async (entityId: {
	$network: { caip2: { reference: string } }
	txHash: string
	blobIndex: number
}) => {
	const { getBlobDetail } = await import(
		'$/sources/Blobscan/Rest/queries.ts'
	)
	return singleFlight(getBlobDetail)({
		blobIndex: entityId.blobIndex,
		chainId: await blobscanChainId(entityId.$network),
		txHash: entityId.txHash,
	})
}

export default {
	source: Source.Blobscan_Rest,

	resolvers: [
		defineResolver(Source.Blobscan_Rest, {
			entityType: EntityType.EvmBlob,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, _context) => {
				return (await blobscanBlobDetail(entityId))?.blob?.commitment
			}
			}
		})({
				fields: {
			kzgCommitment: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Blobscan_Rest, {
			entityType: EntityType.EvmBlob,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, _context) => {
				return (await blobscanBlobDetail(entityId))?.blobDataStorage
					?.flatMap((reference) => (
						reference.storage != null && reference.reference != null ?
							[{
								storage: reference.storage,
								reference: reference.reference,
							}]
						:
							[]
					))
			}
			}
		})({
				fields: {
			blobDataStorageReferences: (snapshot) => snapshot,
		},
			}),
	],
}
