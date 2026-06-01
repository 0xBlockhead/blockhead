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
				const chainId = Number(entityId.$network.caip2.reference)
				if (blobscanRestApiOriginForChainId(chainId) == null) {
					throw new Error(
						`Blobscan_Rest: unsupported chain ${String(chainId)}`,
					)
				}
				const { getBlobJsonString } = await import(
					'$/sources/Blobscan/Rest/queries.ts'
				)

				return singleFlight(getBlobJsonString)({
					blobIndex: entityId.blobIndex,
					chainId,
					txHash: entityId.txHash,
				})
			},
		}),
	],
}
