// Polyfills
import '$/polyfills.ts'

import { QueryClient } from '@tanstack/query-core'
import { env } from '$env/dynamic/public'

import {
	client,
	trackPersistedCollectionPersistence,
} from '$/client/$client.svelte.ts'
import { BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION } from '$/constants/Persistence.ts'
import type { BrowserPersistenceRuntime } from '$/lib/db/browserPersistenceRuntime.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import {
	schema,
	schemaMeta,
} from '$/schema/index.ts'
import {
	browserDirectSourceBindingIds,
	sourceProviders,
} from '$/sources/index.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'

const enabledSourceBindingIds = async () => {
	const { sourceRuntimeCapabilities } = await import('$/sources/_runtime/capabilities.remote.ts')
	const capabilities = await sourceRuntimeCapabilities()
	return new Set([
		...browserDirectSourceBindingIds,
		...capabilities.enabledServerBindingIds,
	])
}


export const bootstrapApplicationClient = async (
	persistenceRuntime: BrowserPersistenceRuntime,
	signal: AbortSignal
) => {
	const [enabledBindingIds] = await Promise.all([
		enabledSourceBindingIds(),
		persistenceRuntime.ready,
	])
	signal.throwIfAborted()
	const sourceIndex = indexSourceProviders(
		sourceProviders,
		env,
		enabledBindingIds
	)
	const resolvers = await loadResolvers(sourceIndex.enabledSources)
	signal.throwIfAborted()
	const {
		persistence,
		waitForPersistence,
	} = trackPersistedCollectionPersistence(persistenceRuntime.persistence)

	return client(
		{
			schema,
			schemaIndex: schemaMeta,
			sourceProviders,
		}
	)(
		{
			resolvers,
			sourceIndex,
		}
	)(
		{
			queryClient: new QueryClient({
				defaultOptions: {
					queries: {
						gcTime: 0,
					},
				},
			}),
			persistence,
			schemaVersion: BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION,
			waitForPersistence,
		}
	)
}
