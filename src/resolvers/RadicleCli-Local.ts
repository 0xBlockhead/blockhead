import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { readRadicleRepository } from '$/sources/RadicleCli/Local/read.ts'
import { radicleCliPlatformAdapter } from '$/sources/RadicleCli/Local/platform.ts'

export default {
	source: Source.RadicleCli_Local,
	resolvers: [
		defineResolver({
			entityType: EntityType.RadicleRepository,
			resolve: {
				Rid: {
					resolve: async ({ rid }) => {
						if (radicleCliPlatformAdapter == null)
							throw new Error('RadicleCli_Local: local radicle CLI authority is unavailable')
						const repository = await readRadicleRepository(rid, radicleCliPlatformAdapter)
						return [{
							[EntityMetaKey.Selector]: { rid: repository.rid },
							[EntityMetaKey.Fields]: {
								rid: repository.rid,
								...(repository.name != null && { name: repository.name }),
								...(repository.description != null && { description: repository.description }),
								visibility: repository.visibility,
								...(repository.defaultBranch != null && { defaultBranch: repository.defaultBranch }),
								'$gitRepository': { [EntityMetaKey.Selector]: { repositoryId: repository.git.repositoryId } },
							},
						}]
					},
				},
			},
		})({
			rid: (row) => row.rid,
			name: (row) => row.name,
			description: (row) => row.description,
			visibility: (row) => row.visibility,
			defaultBranch: (row) => row.defaultBranch,
			$gitRepository: (row) => row['$gitRepository'],
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.RadicleCli_Local>
