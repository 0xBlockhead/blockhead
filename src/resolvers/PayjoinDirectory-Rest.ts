import { defineEntityResolver } from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.PayjoinDirectory_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.PayjoinDirectory,
			resolve: async (entityId) => {
				const {
					getOhttpKeyConfigBase64,
					ohttpGatewayUrlForDirectory,
				} = await import('$/sources/Payjoin/Directory/Rest/queries.ts')
				return {
					ohttpGatewayUrl: ohttpGatewayUrlForDirectory(entityId.directoryUrl),
					ohttpKeyConfig: await getOhttpKeyConfigBase64({
						directoryUrl: entityId.directoryUrl,
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
