import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { PayjoinDirectorySelector } from '$/schema/PayjoinDirectory.ts'

export default {
	source: Source.PayjoinDirectory_Rest,

	resolvers: [
		defineResolver(Source.PayjoinDirectory_Rest, {
			entityType: EntityType.PayjoinDirectory,
			resolve: {
				[PayjoinDirectorySelector.DirectoryUrl]: {
					resolve: async ({ directoryUrl }) => {
					const {
						getOhttpKeyConfigBase64,
						ohttpGatewayUrlForDirectory,
					} = await import('$/sources/Payjoin/Directory/Rest/queries.ts')
					return {
						ohttpGatewayUrl: ohttpGatewayUrlForDirectory(directoryUrl),
						ohttpKeyConfig: await getOhttpKeyConfigBase64({
							directoryUrl: directoryUrl,
						}),
					}
				},
				}
			}
		})({
			ohttpGatewayUrl: (snapshot) => snapshot.ohttpGatewayUrl,
			ohttpKeyConfig: (snapshot) => snapshot.ohttpKeyConfig,
		}),
	],
}
