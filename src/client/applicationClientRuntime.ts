import { QueryClient } from '@tanstack/query-core'
import type { PersistedCollectionPersistence } from '@tanstack/db-sqlite-persistence-core'

import {
	client,
	trackPersistedCollectionPersistence,
	type ClientContext,
} from '$/client/$client.svelte.ts'
import { BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION } from '$/constants/Persistence.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import {
	schema,
	schemaMeta,
} from '$/schema/index.ts'
import {
	indexSourceProviders,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import {
	sourceProviders,
} from '$/sources/index.ts'
import type { Source } from '$/sources/Source.ts'

export type ApplicationClient = ClientContext<typeof schema, Source>

export type ApplicationPersistenceRuntime = {
	readonly ready: Promise<void>
	readonly persistence: PersistedCollectionPersistence
	close: () => void | Promise<void>
}

export type ApplicationClientRuntimeOptions = {
	persistenceRuntime: ApplicationPersistenceRuntime
	publicEnv: SourcePublicEnv
	enabledBindingIds: ReadonlySet<string> | Promise<ReadonlySet<string>>
	register: (client: ApplicationClient) => void
	unregister: (client: ApplicationClient) => void
}

export type ApplicationClientRuntime = {
	readonly client: ApplicationClient
	destroy: () => Promise<void>
}

export type ApplicationClientLifecycleOptions<_Client extends { destroy: () => void }> = {
	persistenceRuntime: Pick<ApplicationPersistenceRuntime, 'close'>
	createClient: () => Promise<_Client>
	register: (client: _Client) => void
	unregister: (client: _Client) => void
}

export type ApplicationClientLifecycle<_Client> = {
	readonly client: _Client
	destroy: () => Promise<void>
}

const closeApplicationClient = async <
	_Client extends { destroy: () => void },
>(
	client: _Client,
	persistenceRuntime: Pick<ApplicationPersistenceRuntime, 'close'>,
	unregister?: (client: _Client) => void
) => {
	// oxlint-disable-next-line typescript/no-restricted-types -- JavaScript throw and Promise rejection values are untyped and must retain their original identities for AggregateError.
	const failures: unknown[] = []
	try {
		unregister?.(client)
	} catch (error) {
		failures.push(error)
	}
	try {
		client.destroy()
	} catch (error) {
		failures.push(error)
	}
	try {
		await persistenceRuntime.close()
	} catch (error) {
		failures.push(error)
	}
	if (failures.length !== 0)
		throw new AggregateError(failures, 'Application client teardown failed')
}

export const createBlockheadApplicationClient = async ({
	persistenceRuntime,
	publicEnv,
	enabledBindingIds,
}: Pick<
	ApplicationClientRuntimeOptions,
	'persistenceRuntime' | 'publicEnv' | 'enabledBindingIds'
>): Promise<ApplicationClient> => {
	const [, resolvedBindingIds] = await Promise.all([
		persistenceRuntime.ready,
		enabledBindingIds,
	])
	const sourceIndex = indexSourceProviders(
		sourceProviders,
		publicEnv,
		resolvedBindingIds
	)
	const {
		persistence,
		waitForPersistence,
	} = trackPersistedCollectionPersistence(persistenceRuntime.persistence)

	return client({
		schema,
		schemaIndex: schemaMeta,
		sourceProviders,
	})({
		resolvers: await loadResolvers(sourceIndex.enabledSources),
		sourceIndex,
	})({
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
	})
}

export const openApplicationClientLifecycle = async <
	_Client extends { destroy: () => void },
>(
	options: ApplicationClientLifecycleOptions<_Client>
): Promise<ApplicationClientLifecycle<_Client>> => {
	let applicationClient: _Client
	try {
		applicationClient = await options.createClient()
	} catch (error) {
		try {
			await options.persistenceRuntime.close()
		} catch (cleanupError) {
			throw new AggregateError(
				[error, cleanupError],
				'Application client bootstrap and persistence cleanup failed'
			)
		}
		throw error
	}

	try {
		options.register(applicationClient)
	} catch (error) {
		try {
			await closeApplicationClient(applicationClient, options.persistenceRuntime)
		} catch (cleanupError) {
			throw new AggregateError(
				[error, cleanupError],
				'Application client registration and cleanup failed'
			)
		}
		throw error
	}
	let active = true
	let destroyPromise: Promise<void> | undefined
	return {
		client: applicationClient,
		destroy: () => {
			if (!active)
				return destroyPromise ?? Promise.resolve()

			active = false
			return destroyPromise ??= closeApplicationClient(
				applicationClient,
				options.persistenceRuntime,
				options.unregister
			)
		},
	}
}

export const openApplicationClientRuntime = async (
	options: ApplicationClientRuntimeOptions
): Promise<ApplicationClientRuntime> => openApplicationClientLifecycle({
	persistenceRuntime: options.persistenceRuntime,
	createClient: () => createBlockheadApplicationClient(options),
	register: options.register,
	unregister: options.unregister,
})
