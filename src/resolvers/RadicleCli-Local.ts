import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { createRadicleCliSession } from '$/sources/RadicleCli/Local/platform.ts'
import type { RadicleCliSession } from '$/sources/RadicleCli/Local/types.ts'

export const createRadicleCliLocalResolverModule = (
	radicleCliSession: RadicleCliSession = createRadicleCliSession()
): RegisteredSourceResolverModule<Source.RadicleCli_Local> => ({
	source: Source.RadicleCli_Local,
	resolvers: [
		defineResolver({
			entityType: EntityType.RadicleRepository,
			resolve: {
				Rid: {
					resolve: async ({ rid }) => {
						const repository = await radicleCliSession.readRepository(rid)
						return [{
							[EntityMetaKey.Selector]: { rid: repository.rid },
							[EntityMetaKey.Fields]: {
								rid: repository.rid,
								...(repository.name != null && { name: repository.name }),
								...(repository.description != null && { description: repository.description }),
								visibility: repository.visibility,
								...(repository.defaultBranch != null && { defaultBranch: repository.defaultBranch }),
								'$gitRepository': {
									[EntityMetaKey.Selector]: { repositoryId: repository.git.repositoryId },
									[EntityMetaKey.Fields]: {
										objectFormat: repository.git.objectFormat,
									},
								},
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
	})

export default createRadicleCliLocalResolverModule()
