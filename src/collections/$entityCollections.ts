import {
	createBrowserWASQLitePersistence,
	openBrowserWASQLiteOPFSDatabase,
} from '@tanstack/browser-db-sqlite-persistence'

import { createCollectionsFromSchema } from '$/collections/$collections.ts'
import { BLOCKHEAD_WA_SQLITE_DATABASE_NAME } from '$/constants/Persistence.ts'
import { resolverDefinitions } from '$/resolvers/index.ts'
import { schema } from '$/schema/index.ts'


const persistence = createBrowserWASQLitePersistence({
	database: await openBrowserWASQLiteOPFSDatabase({ databaseName: BLOCKHEAD_WA_SQLITE_DATABASE_NAME }),
})

const entityCollectionsContext = createCollectionsFromSchema({
	schema,
	resolverDefinitions,
	persistence,
	schemaVersion: 7,
})

export const entityCollectionByEntityType = entityCollectionsContext.entityCollections
export const entityFieldCollections = entityCollectionsContext.entityFieldCollections
export const entityFieldCountCollections = entityCollectionsContext.entityFieldCountCollections
export const entityCollectionsQueryClient = entityCollectionsContext.queryClient
