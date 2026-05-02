import { QueryClient } from '@tanstack/query-core'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import {
	persistedCollectionOptions,
	type PersistedCollectionPersistence,
} from '@tanstack/db-sqlite-persistence-core'
import {
	BasicIndex,
	createCollection,
	parseLoadSubsetOptions,
	parseOrderByExpression,
} from '@tanstack/svelte-db'
import { stringify, parse } from 'devalue'

import {
	EntityFieldCardinality,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import type {
	EntityDefinitionForEntityType,
	EntityFieldName,
	EntityFieldValue,
	EntityFieldValues,
	EntityId,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'
import type {
	EntityFieldResolver,
	EntityResolver,
} from '$/resolvers/$resolvers.ts'
import { Source } from '$/sources/$Source.ts'
import { resolverPublicEnvBySource } from '$/sources/index.ts'


export type EntityCollectionItem<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	[EntityMetaKey.Id]: EntityId<_Schema, _EntityType>
	[EntityMetaKey.IdKey]: string
	[EntityMetaKey.Fields]: Partial<EntityFieldValues<_Schema, _EntityType>>
	[EntityMetaKey.Source]: Source
}

/** Stable row key for entity field collection items; must match `getKey` in `createEntityFieldCollection`. */
export const entityFieldCollectionItemKey = (entityFieldItem: {
	[EntityMetaKey.Source]: Source
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: unknown
}) => (
	[
		entityFieldItem[EntityMetaKey.Source],
		entityFieldItem[EntityMetaKey.ParentIdKey],
		stringify(
			typeof entityFieldItem[EntityMetaKey.Value] === 'object'
			&& entityFieldItem[EntityMetaKey.Value] != null
			&& EntityMetaKey.Id in (entityFieldItem[EntityMetaKey.Value] as object) ?
				(entityFieldItem[EntityMetaKey.Value] as { [EntityMetaKey.Id]: unknown })[EntityMetaKey.Id]
			:
				entityFieldItem[EntityMetaKey.Value],
		),
	]
		.join('\x1E')
)

export type EntityFieldCollectionItem<
	_Schema extends Schema,
	_ParentEntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _ParentEntityType>,
> = {
	[EntityMetaKey.ParentId]: EntityId<_Schema, _ParentEntityType>
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: (
		Exclude<EntityFieldValue<_Schema, _ParentEntityType, _EntityFieldName>, undefined> extends infer _Value ?
			_Value extends unknown[] ?
				_Value[number]
			:
				_Value
		:
			never
	)
	[EntityMetaKey.Source]: Source
}

type EntityCollectionResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = ReturnType<typeof createEntityCollection<_Schema, _EntityType>>

type EntityFieldCollectionResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number],
> = ReturnType<typeof createEntityFieldCollection<_Schema, _EntityType, _FieldDefinition>>

const fulfilledOrThrow = <T>(
	settled: PromiseSettledResult<T>[],
	allFailedMessage: string,
): T[] => {
	const fulfilled = settled.filter((r): r is PromiseFulfilledResult<T> => (
		r.status === 'fulfilled'
	))

	if (settled.length > 0 && fulfilled.length === 0) {
		const reasons = settled.filter((r): r is PromiseRejectedResult => r.status === 'rejected').map((r) => r.reason)
		throw new AggregateError(
			reasons,
			`${allFailedMessage}: ${reasons.map((r) => (r instanceof Error ? r.message : String(r))).join(' | ')}`,
		)
	}

	return fulfilled.map((r) => r.value)
}

/** Live-query subset `eq` values: devalue strings, unwrap single-element arrays, normalize global parent wire shapes to `stringify({})`. */
const subsetFilterEntityId = (value: unknown): unknown => (
	typeof value === 'string' ?
		value === '[{}]' ?
			stringify({})
		: (() => {
			try {
				return subsetFilterEntityId(parse(value))
			} catch {
				return stringify({})
			}
		})()
	: Array.isArray(value) && value.length === 1 ?
		subsetFilterEntityId(value[0])
	: value != null && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0 ?
		stringify({})
	:
		value
)

type ParsedLoadSubset = ReturnType<typeof parseLoadSubsetOptions>

const whereExpressionRoot = (where: unknown) => (
	typeof where === 'object'
	&& where != null
	&& 'expression' in where ?
		(where as { expression: unknown }).expression
	:
		where
)

const comparisonsFromWhereLenient = (where: unknown): ParsedLoadSubset['filters'] => {
	const expr = whereExpressionRoot(where)
	const out: ParsedLoadSubset['filters'] = []
	const visit = (e: unknown) => {
		if (!e || typeof e !== 'object') return
		const node = e as { type?: string, name?: string, args?: unknown[] }
		if (node.type !== 'func' || !Array.isArray(node.args)) return
		if (node.name === 'and') {
			node.args.forEach(visit)
			return
		}
		if (node.name === 'eq') {
			const [l, r] = node.args
			const leftPath = (
				l
				&& typeof l === 'object'
				&& (l as { type: string }).type === 'ref' ?
					(l as { path: string[] }).path
				:
					null
			)
			const rightVal = (
				r
				&& typeof r === 'object'
				&& (r as { type: string }).type === 'val' ?
					(r as { value: unknown }).value
				:
					undefined
			)
			if (leftPath && rightVal !== undefined) {
				out.push({
					field: leftPath,
					operator: 'eq',
					value: rightVal,
				} as ParsedLoadSubset['filters'][number])
			}
			return
		}
		if (node.name === 'in') {
			const [l, r] = node.args
			const leftPath = (
				l
				&& typeof l === 'object'
				&& (l as { type: string }).type === 'ref' ?
					(l as { path: string[] }).path
				:
					null
			)
			const rightVal = (
				r
				&& typeof r === 'object'
				&& (r as { type: string }).type === 'val' ?
					(r as { value: unknown }).value
				:
					undefined
			)
			if (leftPath && rightVal !== undefined) {
				out.push({
					field: leftPath,
					operator: 'in',
					value: rightVal,
				} as ParsedLoadSubset['filters'][number])
			}
		}
	}
	visit(expr)
	return out
}

const parseLoadSubsetForQueryFn = (
	options: Parameters<typeof parseLoadSubsetOptions>[0],
): ParsedLoadSubset => {
	try {
		return parseLoadSubsetOptions(options)
	} catch {
		if (!options) {
			return { filters: [], sorts: [] }
		}
		return {
			filters: comparisonsFromWhereLenient(options.where),
			sorts: (
				(() => {
					try {
						return parseOrderByExpression(options.orderBy)
					} catch {
						return []
					}
				})()
			),
			limit: options.limit,
		}
	}
}

const createEntityCollection = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
>({
	entityResolvers,
	entityType,
	persistence,
	queryClient,
	schemaVersion,
}: {
	entityResolvers: EntityResolver<_Schema, _EntityType>[]
	entityType: _EntityType
	persistence: PersistedCollectionPersistence<EntityCollectionItem<_Schema, _EntityType>, string | number>
	queryClient: QueryClient
	schemaVersion: number
}) => {
	let collectionRef: ReturnType<typeof createCollection> | null = null
	const queryHashesServedFromHydration = new Set<string>()

	const collection = createCollection(
		persistedCollectionOptions<
			EntityCollectionItem<_Schema, _EntityType>,
			string | number,
			never,
			ReturnType<typeof queryCollectionOptions<EntityCollectionItem<_Schema, _EntityType>>>['utils']
		>({
			...queryCollectionOptions<EntityCollectionItem<_Schema, _EntityType>>({
				queryKey: [`EntityCollection:${entityType}`],

				syncMode: 'on-demand',

				autoIndex: 'eager',
				defaultIndexType: BasicIndex,

				persistedGcTime: Number.POSITIVE_INFINITY,

				staleTime: 5 * 60 * 1000,

				queryFn: async (queryContext) => {
					const subsetBase = parseLoadSubsetForQueryFn(queryContext.meta?.loadSubsetOptions)

					const { filters } = subsetBase

					const sources = new Set(
						(
							filters
								.filter((clause) => (
									clause.field[clause.field.length - 1] === EntityMetaKey.Source
									&& clause.operator === 'in'
								))
								.flatMap((clause) => (
									Array.isArray(clause.value) ?
										clause.value
									:
										[clause.value]
								))
						) as Source[],
					)

					const idKeyFilterValues = new Set(
						filters
							.filter((clause) => (
								clause.field[clause.field.length - 1] === EntityMetaKey.IdKey
								&& (clause.operator === 'eq' || clause.operator === 'in')
							))
							.flatMap((clause) => (
								clause.operator === 'eq' ?
									[clause.value]
								: Array.isArray(clause.value) ?
									clause.value
								:
									[clause.value]
							))
					)

					const queryHash = JSON.stringify(queryContext.queryKey)

					if (
						!queryHashesServedFromHydration.has(queryHash)
						&& collectionRef
						&& collectionRef.size > 0
					) {
						queryHashesServedFromHydration.add(queryHash)

						type EntityItem = EntityCollectionItem<_Schema, _EntityType>

						const matchingRows = (
							[...collectionRef.values()]
								.filter((row) => (
									(!sources.size || sources.has((row as EntityItem)[EntityMetaKey.Source]))
									&& (!idKeyFilterValues.size || idKeyFilterValues.has((row as EntityItem)[EntityMetaKey.IdKey]))
								))
						) as EntityItem[]

						if (matchingRows.length > 0)
							return matchingRows
					}
					queryHashesServedFromHydration.add(queryHash)

					const entityIds = (
						[...idKeyFilterValues]
							.map((value) => (
								subsetFilterEntityId(value) as EntityId<_Schema, _EntityType>
							))
					)

					return (
						(await Promise.all(
							entityIds.map(async (entityId) => {
								const resolvers = (
									sources.size ?
										entityResolvers
											.filter((entityResolver) => sources.has(entityResolver.source))
									:
										entityResolvers
								)

								const settled = await Promise.allSettled(
									resolvers
										.map(async (entityResolver) => {
											const fields = await entityResolver.resolve(
												entityId,
												{
													filters: subsetBase.filters,
													sorts: subsetBase.sorts,
													limit: subsetBase.limit,
													publicEnv: resolverPublicEnvBySource.get(entityResolver.source) ?? {},
												},
											)

											return (
												{
													[EntityMetaKey.Id]: entityId,
													[EntityMetaKey.IdKey]: stringify(entityId),
													[EntityMetaKey.Source]: entityResolver.source,
													[EntityMetaKey.Fields]: fields,
													...(
														fields != null && typeof fields === 'object' && !Array.isArray(fields) ?
															fields
														:
															{}
													),
												} satisfies EntityCollectionItem<_Schema, _EntityType>
											)
										}),
								)

								return fulfilledOrThrow(
									settled,
									`All ${settled.length} resolver(s) failed for ${stringify(entityId)}`,
								)
							}),
						))
							.flat()
					)
				},

				getKey: (entityItem) => (
					[
						entityItem[EntityMetaKey.Source],
						entityItem[EntityMetaKey.IdKey],
					]
						.join('\x1E')
				),

				queryClient,
			}),

			id: `EntityCollection:${entityType}`,

			persistence,
			schemaVersion,
		}),
	)

	collectionRef = collection

	collection.createIndex(
		(entityItem) => entityItem[EntityMetaKey.IdKey],
		{ name: `${collection.id}:idKey` },
	)

	collection.createIndex(
		(entityItem) => entityItem[EntityMetaKey.Source],
		{ name: `${collection.id}:source` },
	)

	return collection
}


const createEntityFieldCollection = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldDefinition extends EntityDefinitionForEntityType<_Schema, _EntityType>['fields'][number],
>({
	entityFieldResolvers,
	entityType,
	fieldDefinition,
	persistence,
	queryClient,
	schemaVersion,
}: {
	entityFieldResolvers: EntityFieldResolver<_Schema, _EntityType, _FieldDefinition['name']>[]
	entityType: _EntityType
	fieldDefinition: _FieldDefinition
	persistence: PersistedCollectionPersistence<
		EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
		string | number
	>
	queryClient: QueryClient
	schemaVersion: number
}) => {
	let collectionRef: ReturnType<typeof createCollection> | null = null

	const collection = createCollection(
		persistedCollectionOptions<
			EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
			string | number,
			never,
			ReturnType<typeof queryCollectionOptions<EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>>>['utils']
		>({
			...queryCollectionOptions<
				EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>
			>({
				queryKey: [`EntityFieldCollection:${entityType}`, fieldDefinition.name],

				syncMode: 'on-demand',

				autoIndex: 'eager',
				defaultIndexType: BasicIndex,

				persistedGcTime: Number.POSITIVE_INFINITY,

				staleTime: 5 * 60 * 1000,

				queryFn: async (queryContext) => {
					const subsetBase = parseLoadSubsetForQueryFn(queryContext.meta?.loadSubsetOptions)

					const { filters } = subsetBase

					const sources = new Set(
						(
							filters
								.filter((clause) => (
									clause.field[clause.field.length - 1] === EntityMetaKey.Source
									&& clause.operator === 'in'
								))
								.flatMap((clause) => (
									Array.isArray(clause.value) ?
										clause.value
									:
										[clause.value]
								))
						) as Source[],
					)

					const parentIdKeyFilterValues = new Set(
						filters
							.filter((clause) => (
								String(clause.field[clause.field.length - 1] ?? '') === EntityMetaKey.ParentIdKey
								&& (clause.operator === 'eq' || clause.operator === 'in')
							))
							.flatMap((clause) => (
								clause.operator === 'eq' ?
									[clause.value]
								: Array.isArray(clause.value) ?
									clause.value
								:
									[clause.value]
							))
					)

					const globalRootIdKey = stringify({})

					const parentEntityIds = (
						[...parentIdKeyFilterValues]
							.map((value) => (
								subsetFilterEntityId(value) as EntityId<_Schema, _EntityType>
							))
					)

					const parentsForResolvers = (
						(
							parentEntityIds.length > 0 ?
								parentEntityIds
							: entityType === '_Global' && (
								fieldDefinition.cardinality === EntityFieldCardinality.Many
								|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
							) ?
								[{} as EntityId<_Schema, _EntityType>]
							:
								parentEntityIds
						)
							.map((parentEntityId) => (
								entityType === '_Global'
								&& typeof parentEntityId === 'string'
								&& parentEntityId === globalRootIdKey ?
									({} as EntityId<_Schema, _EntityType>)
								:
									parentEntityId
							))
					)

					const loadedRows = (
						(await Promise.all(
							parentsForResolvers
								.map(async (parentEntityId) => {
									const resolvers = (
										sources.size ?
											entityFieldResolvers.filter((fieldResolver) => (
												sources.has(fieldResolver.source)
											))
										:
											entityFieldResolvers
									)

									const settled = await Promise.allSettled(
										resolvers
											.map(async (fieldResolver) => {
												const value = await fieldResolver.resolve(
													parentEntityId,
													{
														filters: subsetBase.filters,
														sorts: subsetBase.sorts,
														limit: subsetBase.limit,
														publicEnv: resolverPublicEnvBySource.get(fieldResolver.source) ?? {},
													},
												)

												const innerValues = (
													fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
													|| fieldDefinition.cardinality === EntityFieldCardinality.Many ?
														Array.isArray(value) ?
															value
														:
															[]
													: value == null ?
														[]
													:
														[value]
												) as EntityFieldCollectionItem<
													_Schema,
													_EntityType,
													_FieldDefinition['name']
												>[EntityMetaKey.Value][]

												return (
													innerValues.map((innerValue) => ({
														[EntityMetaKey.ParentId]: parentEntityId,
														[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
														[EntityMetaKey.Source]: fieldResolver.source,
														[EntityMetaKey.Value]: innerValue,
													}))
												)
											}),
									)

									return fulfilledOrThrow(
										settled,
										`All ${settled.length} resolver(s) failed for parent ${stringify(parentEntityId)}`,
									)
										.flat()
								}),
						))
							.flat()
					)

					return loadedRows
				},

				getKey: (entityFieldItem) => entityFieldCollectionItemKey(entityFieldItem),

				queryClient,
			}),

			id: `EntityFieldCollection:${entityType}:${fieldDefinition.name}`,

			persistence,
			schemaVersion,
		}),
	)

	collectionRef = collection

	collection.createIndex(
		(entityFieldItem) => entityFieldItem[EntityMetaKey.ParentIdKey],
		{ name: `${collection.id}:parentIdKey` },
	)

	collection.createIndex(
		(entityFieldItem) => entityFieldItem[EntityMetaKey.Source],
		{ name: `${collection.id}:source` },
	)

	return collection
}

export const createCollectionsFromSchema = <
	_Schema extends Schema,
>({
	schema,
	entityResolvers,
	entityFieldResolvers,
	persistence,
	schemaVersion = 1,
}: {
	schema: _Schema
	entityResolvers: {
		[_ResolvedEntityType in EntityType<_Schema>]: EntityResolver<_Schema, _ResolvedEntityType>
	}[EntityType<_Schema>][]
	entityFieldResolvers: {
		[_ResolvedEntityType in EntityType<_Schema>]: EntityFieldResolver<
			_Schema,
			_ResolvedEntityType,
			EntityFieldName<_Schema, _ResolvedEntityType>
		>
	}[EntityType<_Schema>][]
	persistence: PersistedCollectionPersistence<object, string | number>
	schemaVersion?: number
}) => {
	const queryClient = new QueryClient()

	const entityCollections: Record<string, ReturnType<typeof createEntityCollection>> = {}

	for (const definition of schema) {
		const entityType = definition.entityType
		let cached: EntityCollectionResult<_Schema, typeof entityType> | undefined

		Object.defineProperty(entityCollections, entityType, {
			get: () => (
				cached ??= createEntityCollection({
					entityResolvers: entityResolvers.filter((entityResolver) => (
						entityResolver.entityType === entityType
					)),
					entityType,
					persistence: persistence as PersistedCollectionPersistence<
						EntityCollectionItem<_Schema, typeof entityType>,
						string | number
					>,
					queryClient,
					schemaVersion,
				})
			),
			enumerable: true,
			configurable: true,
		})
	}

	const entityFieldCollections: Record<string, Record<string, ReturnType<typeof createEntityFieldCollection>>> = {}

	for (const definition of schema) {
		const entityType = definition.entityType
		const fieldCollections: Record<string, ReturnType<typeof createEntityFieldCollection>> = {}

		for (const field of definition.fields) {
			const fieldName = field.name
			let cached: EntityFieldCollectionResult<_Schema, typeof entityType, typeof field> | undefined

			Object.defineProperty(fieldCollections, fieldName, {
				get: () => (
					cached ??= createEntityFieldCollection({
						entityFieldResolvers: entityFieldResolvers.filter((
							entityFieldResolver,
						): entityFieldResolver is EntityFieldResolver<
							_Schema,
							typeof entityType,
							typeof fieldName
						> => (
							entityFieldResolver.entityType === entityType
							&& entityFieldResolver.fieldName === fieldName
						)),
						entityType,
						fieldDefinition: field,
						persistence: persistence as PersistedCollectionPersistence<
							EntityFieldCollectionItem<_Schema, typeof entityType, typeof fieldName>,
							string | number
						>,
						queryClient,
						schemaVersion,
					})
				),
				enumerable: true,
				configurable: true,
			})
		}

		entityFieldCollections[entityType] = fieldCollections
	}

	return {
		entityCollections,
		entityFieldCollections,
		queryClient,
	}
}

export const entityFieldCollectionQueryKeyBase = (entityType: string) => (
	`EntityFieldCollection:${entityType}`
)
