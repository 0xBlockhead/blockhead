import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { EntityIdProjection } from '$/schema/$EntityDefinition.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.PayjoinDirectory_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.PayjoinDirectory,
			accepts: [EntityIdProjection.Identity],
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
			fields: {
			ohttpGatewayUrl: (snapshot) => snapshot.ohttpGatewayUrl,
			ohttpKeyConfig: (snapshot) => snapshot.ohttpKeyConfig,
		}
		}),
	],
}
