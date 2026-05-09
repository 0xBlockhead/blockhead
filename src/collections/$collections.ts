import { QueryClient } from '@tanstack/query-core'
import {
	queryCollectionOptions,
	type QueryCollectionUtils,
} from '@tanstack/query-db-collection'
import {
	persistedCollectionOptions,
	type PersistedCollectionPersistence,
} from '@tanstack/db-sqlite-persistence-core'
import {
	BasicIndex,
	type Collection,
	createCollection,
	parseLoadSubsetOptions,
	parseOrderByExpression,
} from '@tanstack/svelte-db'
import { stringify, parse } from 'devalue'

import {
	EntityFieldCardinality,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
import type {
	EntityDefinitionForEntityType,
	EntityFieldDefinition,
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
} & Partial<EntityFieldValues<_Schema, _EntityType>>

export type EntityCollectionItemInsert<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntityCollectionItem<_Schema, _EntityType>

export const entityCollectionLoadDebugByType = new Map<string, {
	entityIds: unknown[]
	filters: {
		field: string[]
		operator: string
		value: unknown
	}[]
	idKeyFilterValues: unknown[]
	resolverSources: string[]
	resolverStatuses?: {
		reason?: string
		source: string
		status: string
	}[]
	sources: string[]
}>()

export const entityFieldCollectionLoadDebugByName = new Map<string, {
	filters: {
		field: string[]
		operator: string
		value: unknown
	}[]
	parentIdKeyFilterValues: unknown[]
	resolverSources: string[]
	rowCount?: number
	sources: string[]
}>()

type EntityFieldCollectionValue<_Value> = (
	_Value extends { [EntityMetaKey.Id]: infer _EntityId } ?
		{
			[EntityMetaKey.Id]: _EntityId
			[EntityMetaKey.IdKey]: string
		}
	:
		_Value
)

type EntityFieldCollectionValueId<_Value> = (
	_Value extends { [EntityMetaKey.Id]: infer _EntityId } ?
		_EntityId
	:
		never
)

type EntityCollectionUtils<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = QueryCollectionUtils<
	EntityCollectionItem<_Schema, _EntityType>,
	string | number,
	EntityCollectionItem<_Schema, _EntityType>,
	unknown
>

type EntityFieldCollectionUtils<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _EntityType>,
> = QueryCollectionUtils<
	EntityFieldCollectionItem<_Schema, _EntityType, _EntityFieldName>,
	string | number,
	EntityFieldCollectionItem<_Schema, _EntityType, _EntityFieldName>,
	unknown
>

const hasEntityValueId = <_Value extends object>(
	value: _Value,
): value is _Value & { [EntityMetaKey.Id]: EntityFieldCollectionValueId<_Value> } => (
	EntityMetaKey.Id in value
)

/** Stable row key for entity field collection items; must match `getKey` in `createEntityFieldCollection`. */
export const entityFieldCollectionItemKey = <_Value>(entityFieldItem: {
	[EntityMetaKey.Source]: Source
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: _Value
}) => (
	[
		entityFieldItem[EntityMetaKey.Source],
		entityFieldItem[EntityMetaKey.ParentIdKey],
		stringify(
			entityFieldItem[EntityMetaKey.Value] != null
			&& typeof entityFieldItem[EntityMetaKey.Value] === 'object'
			&& hasEntityValueId(entityFieldItem[EntityMetaKey.Value]) ?
				entityFieldItem[EntityMetaKey.Value][EntityMetaKey.Id]
			:
				entityFieldItem[EntityMetaKey.Value],
		),
	]
		.join('\x1E')
)

const entityFieldCollectionValue = <_Value>(
	value: _Value,
): EntityFieldCollectionValue<_Value> => (
	value != null
	&& typeof value === 'object'
	&& hasEntityValueId(value) ?
		{
			[EntityMetaKey.Id]: value[EntityMetaKey.Id],
			[EntityMetaKey.IdKey]: stringify(value[EntityMetaKey.Id]),
		} as EntityFieldCollectionValue<_Value>
	:
		value as EntityFieldCollectionValue<_Value>
)

type EntityFieldCollectionInnerValue<
	_Schema extends Schema,
	_ParentEntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _ParentEntityType>,
> = (
	Exclude<EntityFieldValue<_Schema, _ParentEntityType, _EntityFieldName>, undefined> extends infer _Value ?
		_Value extends readonly (infer _Element)[] ?
			_Element
		:
			_Value
	:
		never
)

export type EntityFieldCollectionItem<
	_Schema extends Schema,
	_ParentEntityType extends EntityType<_Schema>,
	_EntityFieldName extends EntityFieldName<_Schema, _ParentEntityType>,
> = {
	[EntityMetaKey.ParentId]: EntityId<_Schema, _ParentEntityType>
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: EntityFieldCollectionValue<EntityFieldCollectionInnerValue<_Schema, _ParentEntityType, _EntityFieldName>>
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

export type EntityCollections<_Schema extends Schema> = {
	[_EntityType in EntityType<_Schema>]: EntityCollectionResult<_Schema, _EntityType>
}

export type EntityFieldCollections<_Schema extends Schema> = {
	[_EntityType in EntityType<_Schema>]: {
		[_EntityFieldName in EntityFieldName<_Schema, _EntityType>]: EntityFieldCollectionResult<
			_Schema,
			_EntityType,
			EntityFieldDefinition<_Schema, _EntityType, _EntityFieldName>
		>
	}
}

export type EntityFieldCollectionForReference<
	_Schema extends Schema,
	_Reference,
> = (
	_Reference extends {
		entityType: infer _EntityType extends EntityType<_Schema>
	} ?
		_Reference extends {
			fieldName: infer _EntityFieldName extends EntityFieldName<_Schema, _EntityType>
		} ?
			EntityFieldCollections<_Schema>[_EntityType][_EntityFieldName]
		:
			never
	:
		never
)

export const entityFieldCollectionForReference = <
	_Schema extends Schema,
	_ListedEntity extends EntityType<_Schema>,
	_Reference extends EntityFieldReference<_Schema, _ListedEntity>,
>(
	entityFieldCollections: EntityFieldCollections<_Schema>,
	entityFieldReference: _Reference,
): EntityFieldCollectionForReference<_Schema, _Reference> => (
	entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName] as EntityFieldCollectionForReference<
		_Schema,
		_Reference
	>
)

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
		if (node.name === 'in' || node.name === 'inArray') {
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
	persistence: PersistedCollectionPersistence
	queryClient: QueryClient
	schemaVersion: number
}) => {
	let collectionRef: Collection<
		EntityCollectionItem<_Schema, _EntityType>,
		string | number,
		EntityCollectionUtils<_Schema, _EntityType>,
		never,
		EntityCollectionItem<_Schema, _EntityType>
	> | null = null
	const queryHashesServedFromHydration = new Set<string>()

	const collection = createCollection(
		persistedCollectionOptions<
			EntityCollectionItem<_Schema, _EntityType>,
			string | number,
			never,
			EntityCollectionUtils<_Schema, _EntityType>
		>({
			...queryCollectionOptions({
				queryKey: (loadSubsetOptions) => [
					`EntityCollection:${entityType}`,
					...(
						loadSubsetOptions == null || Object.keys(loadSubsetOptions).length === 0 ?
							[]
						:
							[
								{
									filters: parseLoadSubsetForQueryFn(loadSubsetOptions).filters.map((filter) => ({
										field: filter.field.map((part) => String(part)),
										operator: filter.operator,
										value: filter.value,
									})),
									limit: loadSubsetOptions.limit,
									sorts: parseLoadSubsetForQueryFn(loadSubsetOptions).sorts,
								},
							]
					),
				],

				syncMode: 'on-demand',

				autoIndex: 'eager',
				defaultIndexType: BasicIndex,

				persistedGcTime: Number.POSITIVE_INFINITY,

				staleTime: 5 * 60 * 1000,

				queryFn: async (queryContext) => {
					const subsetBase = parseLoadSubsetForQueryFn(queryContext.meta?.loadSubsetOptions)

					const { filters } = subsetBase

					const sources = new Set(
						[
							...(
								filters
									.filter((clause) => (
										clause.field[clause.field.length - 1] === EntityMetaKey.Source
										&& (clause.operator === 'in' || clause.operator === 'eq')
									))
									.flatMap((clause) => (
										clause.operator === 'eq' ?
											[clause.value]
										: Array.isArray(clause.value) ?
											clause.value
										:
											[clause.value]
									))
							) as Source[],
						],
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

						if (
							matchingRows.length > 0
							&& (
								!sources.size
								|| !idKeyFilterValues.size
								|| [...idKeyFilterValues].every((idKey) => (
									[...sources].every((source) => (
										matchingRows.some((row) => (
											row[EntityMetaKey.IdKey] === idKey
											&& row[EntityMetaKey.Source] === source
										))
									))
								))
							)
						)
							return matchingRows
					}
					const entityIds = (
						[...idKeyFilterValues]
							.map((value) => (
								subsetFilterEntityId(value) as EntityId<_Schema, _EntityType>
							))
					)
					entityCollectionLoadDebugByType.set(
						String(entityType),
						{
							entityIds,
							filters: subsetBase.filters.map((filter) => ({
								field: filter.field.map((part) => String(part)),
								operator: filter.operator,
								value: filter.value,
							})),
							idKeyFilterValues: [...idKeyFilterValues],
							resolverSources: entityResolvers.map((resolver) => resolver.source),
							sources: [...sources],
						},
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
												} as EntityCollectionItem<_Schema, _EntityType>
											)
										}),
								)
								entityCollectionLoadDebugByType.set(
									String(entityType),
									{
										...entityCollectionLoadDebugByType.get(String(entityType))!,
										resolverStatuses: settled.map((result, index) => ({
											reason: result.status === 'rejected' ? String(result.reason) : undefined,
											source: resolvers[index]!.source,
											status: result.status,
										})),
									},
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
	persistence: PersistedCollectionPersistence
	queryClient: QueryClient
	schemaVersion: number
}) => {
	const collection = createCollection(
		persistedCollectionOptions<
			EntityFieldCollectionItem<_Schema, _EntityType, _FieldDefinition['name']>,
			string | number,
			never,
			EntityFieldCollectionUtils<_Schema, _EntityType, _FieldDefinition['name']>
		>({
			...queryCollectionOptions({
				queryKey: (loadSubsetOptions) => [
					`EntityFieldCollection:${entityType}`,
					fieldDefinition.name,
					...(
						loadSubsetOptions == null || Object.keys(loadSubsetOptions).length === 0 ?
							[]
						:
							[
								{
									filters: parseLoadSubsetForQueryFn(loadSubsetOptions).filters.map((filter) => ({
										field: filter.field.map((part) => String(part)),
										operator: filter.operator,
										value: filter.value,
									})),
									limit: loadSubsetOptions.limit,
									sorts: parseLoadSubsetForQueryFn(loadSubsetOptions).sorts,
								},
							]
					),
				],

				syncMode: 'on-demand',

				autoIndex: 'eager',
				defaultIndexType: BasicIndex,

				persistedGcTime: Number.POSITIVE_INFINITY,

				staleTime: 5 * 60 * 1000,

				queryFn: async (queryContext) => {
					const subsetBase = parseLoadSubsetForQueryFn(queryContext.meta?.loadSubsetOptions)

					const { filters } = subsetBase

					const sources = new Set(
						[
							...(
								filters
									.filter((clause) => (
										clause.field[clause.field.length - 1] === EntityMetaKey.Source
										&& (clause.operator === 'in' || clause.operator === 'eq')
									))
									.flatMap((clause) => (
										clause.operator === 'eq' ?
											[clause.value]
										: Array.isArray(clause.value) ?
											clause.value
										:
											[clause.value]
									))
							) as Source[],
						],
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
					entityFieldCollectionLoadDebugByName.set(
						`${entityType}:${fieldDefinition.name}`,
						{
							filters: subsetBase.filters.map((filter) => ({
								field: filter.field.map((part) => String(part)),
								operator: filter.operator,
								value: filter.value,
							})),
							parentIdKeyFilterValues: [...parentIdKeyFilterValues],
							resolverSources: entityFieldResolvers.map((resolver) => resolver.source),
							sources: [...sources],
						},
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
												) as EntityFieldCollectionInnerValue<
													_Schema,
													_EntityType,
													_FieldDefinition['name']
												>[]

												return (
													innerValues.map((innerValue) => {
														const value = entityFieldCollectionValue(innerValue)

														return {
															[EntityMetaKey.ParentId]: parentEntityId,
															[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
															[EntityMetaKey.Source]: fieldResolver.source,
															[EntityMetaKey.Value]: value,
														} satisfies EntityFieldCollectionItem<
															_Schema,
															_EntityType,
															_FieldDefinition['name']
														>
													})
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

					entityFieldCollectionLoadDebugByName.set(
						`${entityType}:${fieldDefinition.name}`,
						{
							...entityFieldCollectionLoadDebugByName.get(`${entityType}:${fieldDefinition.name}`)!,
							rowCount: loadedRows.length,
						},
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
	persistence: PersistedCollectionPersistence
	schemaVersion?: number
}) => {
	const queryClient = new QueryClient()

	const entityCollections: Partial<EntityCollections<_Schema>> = {}

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
					persistence,
					queryClient,
					schemaVersion,
				})
			),
			enumerable: true,
			configurable: true,
		})
	}

	const entityFieldCollections: {
		[_EntityType in EntityType<_Schema>]?: Partial<EntityFieldCollections<_Schema>[_EntityType]>
	} = {}

	for (const definition of schema) {
		const entityType = definition.entityType
		const fieldCollections: Partial<EntityFieldCollections<_Schema>[typeof entityType]> = {}

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
						persistence,
						queryClient,
						schemaVersion,
					})
				),
				enumerable: true,
				configurable: true,
			})
		}

		entityFieldCollections[entityType as EntityType<_Schema>] = fieldCollections
	}

	return {
		entityCollections: entityCollections as EntityCollections<_Schema>,
		entityFieldCollections: entityFieldCollections as EntityFieldCollections<_Schema>,
		queryClient,
	}
}

export const entityFieldCollectionQueryKeyBase = (entityType: string) => (
	`EntityFieldCollection:${entityType}`
)
