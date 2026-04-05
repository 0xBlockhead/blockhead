import type { QueryFunctionContext, QueryKey } from '@tanstack/query-core'
import {
	type Collection,
	type InitialQueryBuilder,
	type LoadSubsetOptions,
	createLiveQueryCollection,
	and,
	eq,
	toArray,
} from '@tanstack/svelte-db'

import type { Source } from '$/sources/$Sources.ts'
import { createPersistedQueryCollection } from '$/data/collections/persistedQueryCollection.ts'
import { queryClient } from '$/data/tanstackQuery/queryClient.ts'
import { serializeEntityId } from '$/schema/$entityId.ts'
import {
	entityFieldNamesFromLoadSubset,
	entitySubsetFromLoadSubsetOptions,
} from '$/data/tanstackDb/entitySubsetFromLoadSubset.ts'
import { sourcesForEntityBaseLoad } from '$/data/tanstackDb/entityQuerySources.ts'
import { resolveEntity } from '$/resolvers/$resolveEntity.ts'
import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/$schema.ts'

import { entityFieldCollections } from '$/data/collections/entityFieldCollections.ts'

/** Distinguishes TanStack collection namespaces (e.g. profile vs global caches). */
export enum CollectionScope {
	Profile = 'Profile',
	Global = 'Global',
}

type RowValue = string | number | boolean | null | undefined | EntityId | object

type EntityBaseRow = Record<string, RowValue> & {
	[entityCollectionRow.id]: EntityId
	[entityCollectionRow.idKey]: string
} & Partial<Record<typeof entityCollectionRow.source, Source>>

type RowCollection = Collection<Record<string, RowValue>, string | number, {}>
const entry = <Key extends PropertyKey, Value>(key: Key, value: Value): readonly [Key, Value] => [key, value]

export { entitySubsetFromLoadSubsetOptions } from '$/data/tanstackDb/entitySubsetFromLoadSubset.ts'

const hierarchicalEntitiesListFields = (def: (typeof schema)[number]) => (
	def.fields.filter(
		(f) => (
			f.type === EntityFieldType.EntitiesReference &&
			(
				f.cardinality === EntityFieldCardinality.Many ||
				f.cardinality === EntityFieldCardinality.ZeroOrMany
			)
		),
	)
)

const entityBaseCollections = Object.fromEntries(
	schema.map((def) => {
		const stripKeys = new Set<string>(
			hierarchicalEntitiesListFields(def).map((f) => f.name),
		)
		return entry(
			def.entityType,
			createPersistedQueryCollection<EntityBaseRow>({
				id: `${def.entityType}:base`,
				syncMode: 'on-demand',
				queryClient,
				getKey: (item) => (
					`${item[entityCollectionRow.source]}\0${item[entityCollectionRow.idKey]}`
				),
				queryKey: (opts: LoadSubsetOptions) => {
					const { idKeyWire } = entitySubsetFromLoadSubsetOptions(
						opts,
						def.entityType,
					)
					const sources = sourcesForEntityBaseLoad(opts, def.entityType)
					const sourcesKey = sources.slice().sort().join('\0')
					const fieldTail = entityFieldNamesFromLoadSubset(opts).sort().join('\0')
					return [def.entityType, idKeyWire, sourcesKey, fieldTail || null]
				},
				queryFn: async ({ meta }: QueryFunctionContext<QueryKey>) => {
					const loadSubsetOptions = meta?.loadSubsetOptions
					const sources = sourcesForEntityBaseLoad(loadSubsetOptions, def.entityType)

					const rowsBySource = await Promise.all(
						sources.map(async (source) => {
							const resolved = await resolveEntity(def.entityType, loadSubsetOptions, [source])
							if (resolved == null) return []

							const entity = Object.fromEntries(
								Object.entries(resolved.entity).filter(([key]) => !stripKeys.has(key)),
							)

							return [
								{
									...entity,
									[entityCollectionRow.id]: resolved.entityId,
									[entityCollectionRow.idKey]: serializeEntityId(resolved.entityId),
									[entityCollectionRow.source]: source,
								} satisfies EntityBaseRow,
							]
						}),
					)

					return rowsBySource.flat()
				},
			}),
		)
	}),
)

export const entityCollections = Object.fromEntries(
	schema.map((def) => {
		const listFields = hierarchicalEntitiesListFields(def)
		const listKeys = new Set<string>(listFields.map((f) => f.name))
		const scalarFields = def.fields.filter(
			(f) => (
				!listKeys.has(f.name) &&
				(
					f.type === EntityFieldType.Primitive ||
					f.type === EntityFieldType.EntityReference
				)
			),
		)
		const scalarKeys = new Set<string>(scalarFields.map((f) => f.name))

		const hierarchicalQuery = (
			listFields.length === 0 && scalarFields.length === 0 ?
				null
			:	(iq: InitialQueryBuilder) => (
					iq
						.from({
							row: entityBaseCollections[def.entityType],
						})
						.select(({ row }) => {
							const base = row as Record<string, RowValue>
							const out: Record<string, RowValue> = {
								[entityCollectionRow.id]: base[entityCollectionRow.id],
								[entityCollectionRow.idKey]: base[entityCollectionRow.idKey],
							}
							out[entityCollectionRow.source] = base[entityCollectionRow.source]
							const parentKey = base[entityCollectionRow.idKey]
							const parentSource = base[entityCollectionRow.source]
							for (const field of listFields) {
								out[field.name] = toArray(
									iq
										.from({
											child: entityFieldCollections[def.entityType][field.name],
										})
										.where(({ child }) =>
											and(
												eq(child[entityCollectionRow.fieldScopeKey], parentKey),
												eq(child[entityCollectionRow.source], parentSource),
											),
										)
										.select(({ child }) => child),
								)
							}
							for (const field of scalarFields) {
								out[field.name] = (
									iq
										.from({
											child: entityFieldCollections[def.entityType][field.name],
										})
										.where(({ child }) =>
											and(
												eq(child[entityCollectionRow.fieldScopeKey], parentKey),
												eq(child[entityCollectionRow.source], parentSource),
											),
										)
										.findOne()
										.fn.select(({ child }) => {
											const c = (
												child != null && typeof child === 'object' && !Array.isArray(child) ?
													child as Record<string, unknown>
												:	null
											)
											const collVal = (
												c == null ?
													undefined
												: field.type === EntityFieldType.Primitive ?
													c.value
												: field.type === EntityFieldType.EntityReference ?
													Object.fromEntries(
														Object.entries(c).filter(
															([k]) => (
																k !== entityCollectionRow.fieldScopeKey &&
																k !== entityCollectionRow.source
															),
														),
													)
												:
													undefined
											)
											return (
												collVal !== undefined ?
													collVal
												:	base[field.name]
											)
										})
								)
							}
							for (const field of def.fields) {
								if (listKeys.has(field.name)) continue
								if (scalarKeys.has(field.name)) continue
								if (field.name in base) out[field.name] = base[field.name]
							}
							return out
						})
				)
		)

		return entry(
			def.entityType,
			hierarchicalQuery != null ?
				createLiveQueryCollection({
					id: def.entityType,
					query: hierarchicalQuery,
					getKey: (item) => {
						const row = item as Record<string, unknown>
						return (
							`${String(row[entityCollectionRow.source] ?? '')}\0${String(row[entityCollectionRow.idKey] ?? '')}`
						)
					},
				})
			:
				entityBaseCollections[def.entityType],
		)
	}),
)
