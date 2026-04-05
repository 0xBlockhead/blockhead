import { browser } from '$app/environment'
import type { QueryFunctionContext, QueryKey } from '@tanstack/query-core'
import {
	persistedCollectionOptions,
	type PersistedCollectionPersistence,
} from '@tanstack/browser-db-sqlite-persistence'
import {
	queryCollectionOptions,
	type QueryCollectionConfig,
	type QueryCollectionUtils,
} from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/svelte-db'

import {
	browserSqlitePersistence,
	SQLITE_COLLECTION_SCHEMA_VERSION,
} from '$/data/tanstackQuery/browserSqlitePersistence.ts'

/**
 * TanStack: `createCollection(persistedCollectionOptions({ …queryCollectionOptions(config), persistence, schemaVersion }))`.
 * One `as unknown as PersistedCollectionPersistence<T, TKey>`: shared OPFS handle is typed for JSON rows; variance does not allow it to match per-collection `T` without this.
 */
export function createPersistedQueryCollection<
	T extends object,
	TError = unknown,
	TQueryKey extends QueryKey = QueryKey,
	TKey extends string | number = string | number,
>(
	config: QueryCollectionConfig<
		T,
		(context: QueryFunctionContext<TQueryKey>) => Array<T> | Promise<Array<T>>,
		TError,
		TQueryKey,
		TKey,
		never,
		Array<T>
	> & {
		schema?: never
	},
) {
	type TUtils = QueryCollectionUtils<T, TKey, T, TError>
	const qOpts = queryCollectionOptions(config)
	if (browser && browserSqlitePersistence != null) {
		return createCollection<T, TKey, TUtils>(
			persistedCollectionOptions<T, TKey, never, TUtils>({
				...qOpts,
				persistence: browserSqlitePersistence as unknown as PersistedCollectionPersistence<
					T,
					TKey
				>,
				schemaVersion: SQLITE_COLLECTION_SCHEMA_VERSION,
			}),
		)
	}
	return createCollection<T, TKey, TUtils>(qOpts)
}
