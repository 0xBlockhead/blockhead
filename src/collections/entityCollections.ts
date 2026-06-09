import { createCollectionsFromSchema } from '$/collections/$collections.ts'
import { resolverIndexes } from '$/resolvers/index.ts'
import { schema } from '$/schema/index.ts'
import { resolverPublicEnvBySource } from '$/sources/index.ts'


export const entityCollectionsContext = await createCollectionsFromSchema({
	schema,
	resolverIndexes,
	resolverPublicEnvBySource,
	persistence: {
		loadedKeys: new Set<string>(),
		startedLiveScopes: new Set<string>(),
	},
})

export const entityCollectionByEntityType = entityCollectionsContext.entityCollections
export const entityFieldCollections = entityCollectionsContext.entityFieldCollections
export const entityFieldCountCollections = entityCollectionsContext.entityFieldCountCollections
export const entityCollectionsQueryClient = entityCollectionsContext.queryClient
