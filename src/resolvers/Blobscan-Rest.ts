import { singleFlight } from '$/lib/singleFlight.ts'
import { defineEntityFieldResolver } from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


export default {
	source: Source.Blobscan_Rest,

	entityResolvers: [],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmBlob,
			fieldName: 'blobscanBlobJson',
			resolve: async (entityId, _context) => {
				const { blobscanRestApiOriginForChainId } = await import(
					'$/sources/Blobscan/Rest/constants.ts'
				)
				if (blobscanRestApiOriginForChainId(entityId.$network.chainId) == null) {
					throw new Error(
						`Blobscan_Rest: unsupported chain ${String(entityId.$network.chainId)}`,
					)
				}
				const { getBlobscanBlobJsonString } = await import(
					'$/sources/Blobscan/Rest/queries.ts'
				)

				return singleFlight(getBlobscanBlobJsonString)({
					blobIndex: entityId.blobIndex,
					chainId: entityId.$network.chainId,
					txHash: entityId.txHash,
				})
			},
		}),
	],
}
