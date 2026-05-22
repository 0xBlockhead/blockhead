// Types/constants
import type { Query, QueryClient } from '@tanstack/query-core'
import { parseLoadSubsetOptions } from '@tanstack/svelte-db'
import { entityFieldCollectionQueryKeyBase } from '$/collections/$collections.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import {
	entityCollectionsQueryClient,
	entityFieldCollections,
} from '$/routes/+layout.svelte'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import {
	entityLiveResolversByEntityType,
	entityFieldNamesWithResolveLiveByEntityType,
	entityFieldResolversByEntityTypeAndFieldName,
} from '$/resolvers/index.ts'
import type { EntityId, EntityType as SchemaEntityType } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import type { EntityType } from '$/schema/$EntityType.ts'
import type { Source } from '$/sources/$Source.ts'
import { stringify } from 'devalue'

import type { ResolveLiveContext } from '$/resolvers/$resolvers.ts'


// Entity field collection invalidation
const comparisonValuesForField = (
	query: Query,
	fieldName: string,
): Set<JsonValue | undefined> => {
	try {
		const meta = query.options.meta
		return new Set(
			(parseLoadSubsetOptions(
				typeof meta === 'object' && meta != null && 'loadSubsetOptions' in meta ?
					meta.loadSubsetOptions
				:
					undefined,
			).filters ?? [])
				.filter((clause) => (
					String(clause.field[clause.field.length - 1] ?? '') === fieldName
					&& (clause.operator === 'eq' || clause.operator === 'in')
				))
				.flatMap((clause) => (
					clause.operator === 'eq' ?
						[clause.value]
					: Array.isArray(clause.value) ?
						clause.value
					:
						[clause.value]
				)),
		)
	} catch {
		return new Set()
	}
}

const deleteEntityFieldRowsForContext = <_EntityType extends SchemaEntityType<typeof schema>>({
	entityType,
	fieldName,
	parentEntityIds,
	sources,
}: {
	entityType: _EntityType
	fieldName: string
	parentEntityIds: readonly EntityId<typeof schema, _EntityType>[]
	sources?: readonly Source[]
}): void => {
	const fieldCollection = entityFieldCollections[entityType]?.[fieldName]
	if (fieldCollection == null) return

	const parentIdKeys = new Set(
		parentEntityIds.map((id) => stringify(id)),
	)
	const sourceKeys = sources != null ? new Set(sources.map(String)) : null

	const keysToDelete: (string | number)[] = []
	for (const [rowKey, row] of fieldCollection.entries()) {
		if (!(typeof row === 'object' && row !== null && !Array.isArray(row))) continue
		const r = row
		if (!parentIdKeys.has(String(r[EntityMetaKey.ParentIdKey]))) continue
		if (sourceKeys != null && !sourceKeys.has(String(r[EntityMetaKey.Source]))) continue
		keysToDelete.push(rowKey)
	}
	if (keysToDelete.length === 0) return
	fieldCollection.utils.writeBatch(() => {
		for (const key of keysToDelete) {
			fieldCollection.utils.writeDelete(key)
		}
	})
}

const writeEntityFieldUpsertsForContext = <_EntityType extends SchemaEntityType<typeof schema>>({
	entityType,
	fieldName,
	rows,
	defaultParentEntityId,
}: {
	entityType: _EntityType
	fieldName: string
	rows: readonly {
		parentEntityId?: EntityId<typeof schema, _EntityType>
		parentIdKey?: string
		source: Source
		value: JsonValue
	}[]
	defaultParentEntityId: EntityId<typeof schema, _EntityType>
}): void => {
	const fieldCollection = entityFieldCollections[entityType]?.[fieldName]
	if (fieldCollection == null || rows.length === 0) return
	fieldCollection.utils.writeBatch(() => {
		for (const row of rows) {
			const parentEntityId = row.parentEntityId ?? defaultParentEntityId
			fieldCollection.utils.writeUpsert({
				[EntityMetaKey.ParentId]: parentEntityId,
				[EntityMetaKey.ParentIdKey]: row.parentIdKey ?? stringify(parentEntityId),
				[EntityMetaKey.Source]: row.source,
				[EntityMetaKey.Value]: row.value,
			})
		}
	})
}

export const invalidateEntityFieldQueries = (
	queryClient: QueryClient,
	{
		entityType,
		fieldNames,
		parentEntityIds,
		sources,
	}: {
		entityType: EntityType
		fieldNames: readonly string[]
		parentEntityIds?: readonly EntityId<typeof schema, EntityType>[]
		sources?: readonly Source[]
	},
) => (
	Promise.all(
		fieldNames.map((fieldName) => {
			const parentIdKeys = new Set(
				(parentEntityIds ?? []).map((parentEntityId) => stringify(parentEntityId)),
			)
			const sourceKeys = new Set((sources ?? []).map(String))
			return queryClient.invalidateQueries({
				queryKey: [entityFieldCollectionQueryKeyBase(entityType), fieldName],
				predicate: (query) => {
					if (!Array.isArray(query.queryKey)) return false
					if (query.queryKey[0] !== entityFieldCollectionQueryKeyBase(entityType)) return false
					if (query.queryKey[1] !== fieldName) return false

					if (parentIdKeys.size > 0) {
						const queryParentIdKeys = comparisonValuesForField(
							query,
							EntityMetaKey.ParentIdKey,
						)
						if (
							queryParentIdKeys.size > 0
							&& ![...queryParentIdKeys].some((value) => parentIdKeys.has(String(value)))
						) {
							return false
						}
					}

					if (sourceKeys.size > 0) {
						const querySources = comparisonValuesForField(
							query,
							EntityMetaKey.Source,
						)
						if (
							querySources.size > 0
							&& ![...querySources].some((value) => sourceKeys.has(String(value)))
						) {
							return false
						}
					}

					return true
				},
				refetchType: 'all',
			})
		}),
	).then(() => undefined)
)

type ResolveLiveFunction = (
	ctx: ResolveLiveContext<typeof schema, SchemaEntityType<typeof schema>>,
) => void | Promise<void> | (() => void) | Promise<() => void>
type ResolveLiveEntityFieldOptions = {
	parentEntityIds?: readonly EntityId<typeof schema, EntityType>[]
	sources?: readonly Source[]
}
type ResolveLiveEntityFieldUpsertRow = {
	parentEntityId?: EntityId<typeof schema, EntityType>
	parentIdKey?: string
	source: Source
	value: JsonValue
}

const createSharedResolveLiveSubscription = ({
	entityType,
	parentEntityId,
	queryClient,
	resolveLive,
	scopeKey,
	source,
}: {
	entityType: EntityType
	parentEntityId: EntityId<typeof schema, EntityType>
	queryClient: QueryClient
	resolveLive: ResolveLiveFunction
	scopeKey: string
	source: Source
}): (() => void) => {
	const sharedSubscriptionsByKey = (
		sharedResolveLiveSubscriptionsByQueryClient.get(queryClient)
		?? new Map<string, SharedResolveLiveSubscription>()
	)
	sharedResolveLiveSubscriptionsByQueryClient.set(queryClient, sharedSubscriptionsByKey)

	const existing = sharedSubscriptionsByKey.get(scopeKey)
	if (existing != null) {
		existing.refCount += 1
		let releasedExisting = false
		const releaseExisting = () => {
			if (releasedExisting) return
			releasedExisting = true
			existing.refCount -= 1
			if (existing.refCount <= 0) {
				existing.dispose()
			}
		}
		return releaseExisting
	}

	const ac = new AbortController()
	const cleanups = new Set<() => void>()
	let disposed = false
	const runCleanup = (cleanup: (() => void) | undefined) => {
		if (cleanup == null) return
		try {
			cleanup()
		} catch (error) {
			console.error('resolveLive cleanup failed', {
				entityType,
				parentEntityId,
				scopeKey,
				source,
			}, error)
		}
	}
	const dispose = () => {
		if (disposed) return
		disposed = true
		ac.abort()
		for (const cleanup of cleanups) {
			runCleanup(cleanup)
		}
		cleanups.clear()
		sharedSubscriptionsByKey.delete(scopeKey)
	}

	const subscription: SharedResolveLiveSubscription = {
		refCount: 1,
		dispose,
	}
	sharedSubscriptionsByKey.set(scopeKey, subscription)

	void Promise.resolve(
		resolveLive({
			invalidate: (
				fieldNames: readonly string[],
				options?: ResolveLiveEntityFieldOptions,
			) => (
				invalidateEntityFieldQueries(
					queryClient,
					{
						entityType,
						fieldNames,
						parentEntityIds: options?.parentEntityIds ?? [parentEntityId],
						sources: options?.sources,
					},
				)
			),
			deleteEntityFieldRows: (
				fieldName: string,
				options?: ResolveLiveEntityFieldOptions,
			) => {
				deleteEntityFieldRowsForContext({
					entityType,
					fieldName,
					parentEntityIds: options?.parentEntityIds ?? [parentEntityId],
					sources: options?.sources,
				})
			},
			writeEntityFieldUpserts: (
				fieldName: string,
				rows: readonly ResolveLiveEntityFieldUpsertRow[],
			) => {
				writeEntityFieldUpsertsForContext({
					entityType,
					fieldName,
					rows,
					defaultParentEntityId: parentEntityId,
				})
			},
			parentEntityId,
			queryClient,
			signal: ac.signal,
		}),
	)
		.then((cleanup) => {
			if (typeof cleanup !== 'function') return
			if (disposed) {
				runCleanup(cleanup)
				return
			}
			cleanups.add(cleanup)
		})
		.catch((error) => {
			if (ac.signal.aborted) return
			console.error('resolveLive failed', {
				entityType,
				parentEntityId,
				scopeKey,
				source,
			}, error)
		})

	const release = () => {
		subscription.refCount -= 1
		if (subscription.refCount <= 0) {
			subscription.dispose()
		}
	}

	return release
}

const releaseWithAbortSignal = (
	signal: AbortSignal,
	release: () => void,
): (() => void) => {
	let removeAbortListener = () => {}
	const releaseAndRemoveAbortListener = () => {
		removeAbortListener()
		release()
	}
	if (signal.aborted) {
		release()
	} else {
		signal.addEventListener('abort', releaseAndRemoveAbortListener, { once: true })
		removeAbortListener = () => signal.removeEventListener('abort', releaseAndRemoveAbortListener)
	}
	return releaseAndRemoveAbortListener
}

export const startEntityResolveLive = ({
	entityId,
	entityType,
	queryClient,
	signal,
}: {
	entityId: EntityId<typeof schema, EntityType>
	entityType: EntityType
	queryClient: QueryClient
	signal: AbortSignal
}): (() => void) => {
	const resolvers = entityLiveResolversByEntityType[entityType] ?? []
	const releases = resolvers.map((resolver) => (
		createSharedResolveLiveSubscription({
			entityType,
			parentEntityId: entityId,
			queryClient,
			resolveLive: resolver.resolveLive,
			scopeKey: [
				'entity',
				entityType,
				resolver.source,
				stringify(entityId),
			].join('\x1E'),
			source: resolver.source,
		})
	))
	let released = false
	const releaseAll = () => {
		if (released) return
		released = true
		for (const release of releases) {
			release()
		}
	}
	return releaseWithAbortSignal(signal, releaseAll)
}

export const startEntityFieldResolveLiveForParent = ({
	entityType,
	fieldNames = entityFieldNamesWithResolveLiveByEntityType[entityType] ?? [],
	parentEntityId,
	queryClient,
	signal,
}: {
	entityType: EntityType
	fieldNames?: readonly string[]
	parentEntityId: EntityId<typeof schema, EntityType>
	queryClient: QueryClient
	signal: AbortSignal
}): (() => void) => {
	const byField = entityFieldResolversByEntityTypeAndFieldName[entityType]
	if (byField == null) return () => {}

	const releases: (() => void)[] = []
	const seenResolverKeys = new Set<string>()

	for (const fieldName of new Set(fieldNames)) {
		for (const resolver of (byField[fieldName] ?? [])) {
			if (resolver.resolveLive == null) continue
			const subscriptionKey = [
				'field',
				entityType,
				fieldName,
				resolver.source,
				stringify(parentEntityId),
			].join('\x1E')
			if (seenResolverKeys.has(subscriptionKey)) continue
			seenResolverKeys.add(subscriptionKey)
			releases.push(
				createSharedResolveLiveSubscription({
					entityType,
					parentEntityId,
					queryClient,
					resolveLive: resolver.resolveLive,
					scopeKey: subscriptionKey,
					source: resolver.source,
				}),
			)
		}
	}

	let released = false
	const releaseAll = () => {
		if (released) return
		released = true
		for (const release of releases) {
			release()
		}
	}
	return releaseWithAbortSignal(signal, releaseAll)
}

export const mountEntityResolveLive = ({
	entityId: entityIdGetter,
	entityType,
}: {
	entityType: EntityType
	entityId: () => EntityId<typeof schema, EntityType>
}): void => {
	$effect(() => {
		const entityId = entityIdGetter()
		void stringify(entityId)
		const ac = new AbortController()
		const releaseEntityLive = startEntityResolveLive({
			entityId,
			entityType,
			queryClient: entityCollectionsQueryClient,
			signal: ac.signal,
		})
		const releaseFieldLive = startEntityFieldResolveLiveForParent({
			entityType,
			parentEntityId: entityId,
			queryClient: entityCollectionsQueryClient,
			signal: ac.signal,
		})
		return () => {
			ac.abort()
			releaseEntityLive()
			releaseFieldLive()
		}
	})
}

type SharedResolveLiveSubscription = {
	refCount: number
	dispose: () => void
}

const sharedResolveLiveSubscriptionsByQueryClient = new WeakMap<
	QueryClient,
	Map<string, SharedResolveLiveSubscription>
>()
