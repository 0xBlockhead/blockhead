import type { QueryFunctionContext, QueryKey } from '@tanstack/query-core'
import type { Collection, LoadSubsetOptions } from '@tanstack/svelte-db'

import { createPersistedQueryCollection } from '$/data/collections/persistedQueryCollection.ts'
import { queryClient } from '$/data/tanstackQuery/queryClient.ts'
import { serializeEntityId } from '$/schema/$entityId.ts'
import { sourcesForEntityFieldLoad } from '$/data/tanstackDb/entityQuerySources.ts'
import {
	entityFieldNamesFromLoadSubset,
	entitySubsetFromLoadSubsetOptions,
	scopedEntityIdFromLoadSubsetOptions,
} from '$/data/tanstackDb/entitySubsetFromLoadSubset.ts'
import { resolverContextFromLoadSubset } from '$/data/tanstackDb/resolverLoadSubset.ts'
import { resolveRegisteredEntityField } from '$/resolvers/$resolveEntity.ts'
import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { Source } from '$/sources/$Sources.ts'

type RowRecord = Record<string, string | number | boolean | null | undefined | EntityId | Source>

type RowCollection = Collection<RowRecord, string | number, {}>
const entry = <Key extends PropertyKey, Value>(key: Key, value: Value): readonly [Key, Value] => [key, value]

/** TanStack row shape for entity-field collection query results (scope + `$id` / `$idKey`). */
export const entityFieldRowWithScopeKeys = (
	scope: EntityId,
	row: RowRecord | string | number | boolean | null | undefined,
	source: Source,
) => {
	const scopeWire = serializeEntityId(scope)
	const scopeFields = {
		[entityCollectionRow.fieldScopeKey]: scopeWire,
	}
	const sourceFields = { [entityCollectionRow.source]: source }
	if (typeof row !== 'object' || row == null || Array.isArray(row)) {
		return {
			...scopeFields,
			...sourceFields,
			value: row,
			[entityCollectionRow.id]: scope,
			[entityCollectionRow.idKey]: scopeWire,
		}
	}
	const e = row[entityCollectionRow.id]
	return (
		e != null && typeof e === 'object' && !Array.isArray(e) ?
			{ ...scopeFields, ...sourceFields, ...row, [entityCollectionRow.idKey]: serializeEntityId(e) }
		:	{
				...scopeFields,
				...sourceFields,
				...row,
				[entityCollectionRow.id]: scope,
				[entityCollectionRow.idKey]: scopeWire,
			}
	)
}

type EntityFieldRow = ReturnType<typeof entityFieldRowWithScopeKeys>

export const entityFieldCollections = Object.fromEntries(
	schema.map((entityDefinition) => entry(
		entityDefinition.entityType,
		Object.fromEntries(
			entityDefinition.fields.map((field) => entry(
				field.name,
				createPersistedQueryCollection<EntityFieldRow>({
					id: `${entityDefinition.entityType}\0${field.name}`,
					syncMode: 'on-demand',
					queryClient,
					queryKey: (opts: LoadSubsetOptions) => {
						const { idKeyWire } = entitySubsetFromLoadSubsetOptions(
							opts,
							entityDefinition.entityType,
						)
						const sources = sourcesForEntityFieldLoad(
							opts,
							entityDefinition.entityType,
							field.name,
						)
						const sourcesKey = sources.slice().sort().join('\0')
						const fieldTail = entityFieldNamesFromLoadSubset(opts).sort().join('\0')
						return [
							entityDefinition.entityType,
							field.name,
							idKeyWire,
							sourcesKey,
							fieldTail || null,
						]
					},
					queryFn: async ({ meta }: QueryFunctionContext<QueryKey>) => {
						const loadSubsetOptions = meta?.loadSubsetOptions
						const scopedEntityId = scopedEntityIdFromLoadSubsetOptions(
							loadSubsetOptions,
							entityDefinition.entityType,
						)
						if (scopedEntityId == null) return []

						const sources = sourcesForEntityFieldLoad(
							loadSubsetOptions,
							entityDefinition.entityType,
							field.name,
						)

						const rowsBySource = await Promise.all(
							sources.map(async (source) => {
								const raw = await resolveRegisteredEntityField(
									entityDefinition.entityType,
									field.name,
									scopedEntityId,
									resolverContextFromLoadSubset(loadSubsetOptions),
									[source],
								)
								if (raw === undefined) return []

								return (
									Array.isArray(raw) ?
										raw
											.filter((x) => x != null)
											.map((x) => entityFieldRowWithScopeKeys(scopedEntityId, x, source))
									:	[entityFieldRowWithScopeKeys(scopedEntityId, raw, source)]
								)
							}),
						)

						return rowsBySource.flat()
					},
					getKey: (item) =>
						`${item[entityCollectionRow.source]}\0${String(item[entityCollectionRow.idKey] ?? '')}`,
				}),
			)),
		),
	)),
)
