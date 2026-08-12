import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.MagnetUri_Uri,

	resolvers: [
		defineResolver({
			entityType: EntityType.MagnetLink,
			resolve: {
				MagnetUri: {
					resolve: async ({ magnetUri }) => (
						import('$/sources/MagnetUri/Uri/queries.ts')
							.then(({ parseMagnetUri }) => parseMagnetUri(magnetUri))
					),
				},
			},
		})({
			magnetUri: (snapshot) => snapshot.uri,
			infoHash: (snapshot) => snapshot.torrent?.infoHash,
			displayName: (snapshot) => snapshot.displayName,
			exactLength: (snapshot) => snapshot.exactLength,
			trackers: (snapshot) => snapshot.trackers,
			webSeeds: (snapshot) => snapshot.webSeeds,
			acceptableSources: (snapshot) => snapshot.acceptableSources,
			$torrent: (snapshot) => (
				snapshot.torrent == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: snapshot.torrent,
					}
			),
		}),
	],
} satisfies RegisteredSourceResolverModule
