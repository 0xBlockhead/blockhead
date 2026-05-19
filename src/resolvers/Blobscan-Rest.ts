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
