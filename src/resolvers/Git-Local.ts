import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { createGitLocalSession } from '$/sources/Git/Local/platform.ts'
import type { GitLocalSession } from '$/sources/Git/Local/types.ts'

export const createGitLocalResolverModule = (session: GitLocalSession = createGitLocalSession()): RegisteredSourceResolverModule<Source.Git_Local> => ({
	source: Source.Git_Local,
	resolvers: [defineResolver({
		entityType: EntityType.GitRepository,
		resolve: { RepositoryId: { resolve: async ({ repositoryId }) => {
			const repository = await session.readRepository(repositoryId)
			return [{
				[EntityMetaKey.Selector]: { repositoryId: repository.repositoryId },
				[EntityMetaKey.Fields]: {
					repositoryId: repository.repositoryId,
					objectFormat: repository.objectFormat,
					...(repository.defaultRefName != null && { defaultRefName: repository.defaultRefName }),
					'$$refs': repository.refs.map((ref) => ({
						[EntityMetaKey.Selector]: { $repository: { repositoryId }, refName: ref.refName },
						[EntityMetaKey.Fields]: { refName: ref.refName, refKind: ref.refKind, targetObjectId: `0x${ref.targetObjectId}` },
					})),
				},
			}]
		} } },
	})({
		repositoryId: (row) => row.repositoryId,
		objectFormat: (row) => row.objectFormat,
		defaultRefName: (row) => row.defaultRefName,
		$$refs: { select: (row) => row.$$refs, resolveCount: (row) => row.$$refs.length },
	})],
})

export default createGitLocalResolverModule()
