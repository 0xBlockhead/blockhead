// Types/constants
import {
	BaseQueryBuilder,
	type Collection,
	type CollectionStatus,
	createLiveQueryCollection,
	eq,
	inArray,
	useLiveQuery,
} from '@tanstack/svelte-db'
import { stringify } from 'devalue'
import { tick, untrack } from 'svelte'
import { SvelteMap } from 'svelte/reactivity'

import type { RemoteResource } from '@sveltejs/kit'

import { derive, reduce } from '$/lib/svelte/RemoteResource.svelte.ts'

import { normalizeBoundaryError } from '$/lib/errors.ts'

import type {
	EntityFieldName,
	EntityId,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { entityCollectionByEntityType, entityFieldCollections } from '$/routes/+layout.svelte'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'

import {
	type DeclarativeOrderBy,
	fingerprintOrderByIr,
	foldOrderBySteps,
	orderByIrFromSteps,
} from '$/lib/tanstackDb/orderBySteps.ts'


/** Subset rows for `useEntity` field live queries; required by resolvers that reject unbounded loads. */
const defaultEntityFieldLiveQueryLimit = 64


const ENTITY_SELECTION_META_KEYS = new Set([
	'$',
	'$limit',
	'$orderBy',
	'$orderByDep',
])


export type EntitySelection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	/** Root source priority; nested field selections inherit this when their own `$` is omitted. */
	$?: readonly Source[]
	$limit?: number
	/** Same tuples as chained `.orderBy(callback, options?)` on `{ fieldRow }`. */
	$orderBy?: DeclarativeOrderBy<{ fieldRow: unknown }>
	/** When clauses aren’t fingerprintable (e.g. non–field-ref expressions), set for live-query deps. */
	$orderByDep?: string
} & {
	[
		_FieldName in EntityFieldName<_Schema, _EntityType>
	]?:
		EntitySelection<_Schema, EntityType<_Schema>>
}


export const entitySelectionFieldEntries = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
>(
	selection: EntitySelection<_Schema, _EntityType>,
) => (
	Object.entries(selection).filter(([fieldName]) => (
		!ENTITY_SELECTION_META_KEYS.has(fieldName)
	)) as [
		EntityFieldName<_Schema, _EntityType>,
		EntitySelection<_Schema, EntityType<_Schema>> | undefined,
	][]
)


const fieldOrderDepsFingerprint = (
	fieldCollection: Collection<any>,
	orderBy: DeclarativeOrderBy<{ fieldRow: unknown }>,
	orderByDep: string | undefined,
) => (
	orderBy.length === 0 ?
		''
	:
		(
			orderByDep
			?? stringify(fingerprintOrderByIr(orderByIrFromSteps({ fieldRow: fieldCollection }, orderBy)))
		)
)


const entityFieldDefinitionsByEntityType = Object.fromEntries(
	schema.map((entityDefinition) => [
		entityDefinition.entityType,
		Object.fromEntries(
			entityDefinition.fields.map((fieldDefinition) => [
				fieldDefinition.name,
				fieldDefinition,
			]),
		),
	]),
)

export const useEntity1 = <
	_EntityType extends EntityType<typeof schema>,
>(
	entityType: _EntityType,
	entityId: EntityId<typeof schema, _EntityType>,
	selection: EntitySelection<typeof schema, _EntityType>,
) => {
	const idKey = $derived(
		stringify(entityId),
	)
	const query = useLiveQuery(
		(queryBuilder) => {
			const idKey = stringify(entityId)
			const selectedFieldEntries = entitySelectionFieldEntries(selection)
			const fieldSourcesByName = Object.fromEntries(
				selectedFieldEntries.map(([fieldName, fieldSelection]) => [
					fieldName,
					fieldSelection?.$ ?? selection.$ ?? [],
				]),
			)
			const sourcePriority = [
				...(selection.$ ?? []),
				...Object.values(fieldSourcesByName).flat(),
			].filter((source, index, sources) => (
				sources.indexOf(source) === index
			))

			return queryBuilder
				.from({ entityRow: entityCollectionByEntityType[entityType] })
				.where(({ entityRow }) => (
					eq(entityRow[EntityMetaKey.IdKey], idKey)
				))
				.where(({ entityRow }) => (
					inArray(entityRow[EntityMetaKey.Source], sourcePriority)
				))
				.orderBy(({ entityRow }) => (
					sourcePriority.indexOf(entityRow[EntityMetaKey.Source])
				), 'asc')
				.select(({ entityRow }) => {
					return {
						entity: {
							[EntityMetaKey.Id]: entityId,
							...Object.fromEntries(
								selectedFieldEntries
									.map(([fieldName]) => [
										fieldName,
										entityFieldDefinitionsByEntityType[entityType][fieldName].cardinality === EntityFieldCardinality.Many
										|| entityFieldDefinitionsByEntityType[entityType][fieldName].cardinality === EntityFieldCardinality.ZeroOrMany ?
											[
												...[
													entityRow,
													...sourcePriority.flatMap((source) => (
														[...entityCollectionByEntityType[entityType].values()]
															.filter((row) => (
																row[EntityMetaKey.IdKey] === idKey
																&& row[EntityMetaKey.Source] === source
															))
													)),
												].flatMap((row) => (
													Array.isArray(row[EntityMetaKey.Fields][fieldName]) ?
														row[EntityMetaKey.Fields][fieldName]
													:
														[]
												)),
												...(fieldSourcesByName[fieldName] ?? [])
													.flatMap((source) => (
														[...entityFieldCollections[entityType][fieldName as EntityFieldName<typeof schema, _EntityType>].values()]
															.filter((fieldRow) => (
																fieldRow[EntityMetaKey.ParentIdKey] === idKey
																&& fieldRow[EntityMetaKey.Source] === source
															))
													))
													.map((fieldRow) => (
														fieldRow[EntityMetaKey.Value]
													)),
											]
										:
											[
												...[
													entityRow,
													...sourcePriority.flatMap((source) => (
														[...entityCollectionByEntityType[entityType].values()]
															.filter((row) => (
																row[EntityMetaKey.IdKey] === idKey
																&& row[EntityMetaKey.Source] === source
															))
													)),
												].map((row) => (
													row[EntityMetaKey.Fields][fieldName]
												)),
												...(fieldSourcesByName[fieldName] ?? [])
													.flatMap((source) => (
														[...entityFieldCollections[entityType][fieldName as EntityFieldName<typeof schema, _EntityType>].values()]
															.filter((fieldRow) => (
																fieldRow[EntityMetaKey.ParentIdKey] === idKey
																&& fieldRow[EntityMetaKey.Source] === source
															))
													))
													.map((fieldRow) => (
														fieldRow[EntityMetaKey.Value]
													)),
											].find((value) => value !== undefined),
									])
									.filter(([, value]) => value !== undefined),
							),
						},
					}
				})
				.findOne()
		},
		[
			() => idKey,
			() => stringify(selection),
		],
	)

	return {
		get data() {
			return query.data?.entity
		},
		get error() {
			return query.error
		},
		get isError() {
			return query.isError
		},
		get isLoading() {
			return query.isLoading
		},
		get isReady() {
			return query.isReady
		},
		get status() {
			return query.status
		},
	}
}

export const useEntity2 = <
	_EntityType extends EntityType<typeof schema>,
>(
	entityType: _EntityType,
	entityId: EntityId<typeof schema, _EntityType>,
	selection: EntitySelection<typeof schema, _EntityType>,
) => {
	const idKey = $derived(
		stringify(entityId),
	)
	const selectedFieldEntries = $derived(
		entitySelectionFieldEntries(selection),
	)
	const fieldSourcesByName = $derived(
		Object.fromEntries(
			selectedFieldEntries.map(([fieldName, fieldSelection]) => [
				fieldName,
				fieldSelection?.$ ?? selection.$ ?? [],
			]),
		),
	)
	const sourcePriority = $derived(
		[
			...(selection.$ ?? []),
			...Object.values(fieldSourcesByName).flat(),
		].filter((source, index, sources) => (
			sources.indexOf(source) === index
		)),
	)
	const entityRowsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ entityRow: entityCollectionByEntityType[entityType] })
				.where(({ entityRow }) => (
					eq(entityRow[EntityMetaKey.IdKey], idKey)
				))
				.where(({ entityRow }) => (
					inArray(entityRow[EntityMetaKey.Source], sourcePriority)
				))
				.orderBy(({ entityRow }) => (
					sourcePriority.indexOf(entityRow[EntityMetaKey.Source])
				), 'asc')
				.select(({ entityRow }) => ({
					entityRow,
				}))
		),
		[
			() => idKey,
			() => stringify(sourcePriority),
		],
	)
	const fieldRowsQueries = $derived(
		Object.fromEntries(
			selectedFieldEntries.map(([fieldName]) => [
				fieldName,
				useLiveQuery(
					(queryBuilder) => (
						queryBuilder
							.from({
								fieldRow: entityFieldCollections[entityType][fieldName as EntityFieldName<typeof schema, _EntityType>],
							})
							.where(({ fieldRow }) => (
								eq(fieldRow[EntityMetaKey.ParentIdKey], idKey)
							))
							.where(({ fieldRow }) => (
								inArray(fieldRow[EntityMetaKey.Source], fieldSourcesByName[fieldName] ?? [])
							))
							.orderBy(({ fieldRow }) => (
								(fieldSourcesByName[fieldName] ?? []).indexOf(fieldRow[EntityMetaKey.Source])
							), 'asc')
							.select(({ fieldRow }) => ({
								fieldRow,
							}))
					),
					[
						() => idKey,
						() => stringify(fieldSourcesByName[fieldName] ?? []),
					],
				),
			]),
		),
	)
	const query = $derived.by(() => {
		return {
			...entityRowsQuery,
			data: (
				entityRowsQuery.isReady
				&& Object.values(fieldRowsQueries).every((fieldRowsQuery) => fieldRowsQuery.isReady) ?
					{
						[EntityMetaKey.Id]: entityId,
						...Object.fromEntries(
							selectedFieldEntries
								.map(([fieldName]) => [
									fieldName,
									entityFieldDefinitionsByEntityType[entityType][fieldName].cardinality === EntityFieldCardinality.Many
									|| entityFieldDefinitionsByEntityType[entityType][fieldName].cardinality === EntityFieldCardinality.ZeroOrMany ?
										[
											...(entityRowsQuery.data?.map(({ entityRow }) => entityRow) ?? []).flatMap((entityRow) => (
												Array.isArray(entityRow[EntityMetaKey.Fields][fieldName]) ?
													entityRow[EntityMetaKey.Fields][fieldName]
												:
													[]
											)),
											...(fieldRowsQueries[fieldName]?.data?.map(({ fieldRow }) => fieldRow[EntityMetaKey.Value]) ?? []),
										]
									:
										[
											...(entityRowsQuery.data?.map(({ entityRow }) => entityRow[EntityMetaKey.Fields][fieldName]) ?? []),
											...(fieldRowsQueries[fieldName]?.data?.map(({ fieldRow }) => fieldRow[EntityMetaKey.Value]) ?? []),
										].find((value) => value !== undefined),
								])
								.filter(([, value]) => value !== undefined),
						),
					}
				:
					undefined
			),
			isLoading: (
				entityRowsQuery.isLoading
				|| Object.values(fieldRowsQueries).some((fieldRowsQuery) => fieldRowsQuery.isLoading)
			),
			isReady: (
				entityRowsQuery.isReady
				&& Object.values(fieldRowsQueries).every((fieldRowsQuery) => fieldRowsQuery.isReady)
			),
		}
	})

	return query
}

export const useLiveQueryResource = <_Data>(
	queryBuilderFunction: (queryBuilder: BaseQueryBuilder) => ReturnType<BaseQueryBuilder['from']>,
	deps: (() => unknown)[] = [],
	options?: {
		normalize?: (data: _Data) => _Data
	},
): RemoteResource<_Data> => {
	const collection = $derived.by(() => {
		deps.forEach((dep) => dep())
		return createLiveQueryCollection({
			query: queryBuilderFunction,
			startSync: true,
		})
	})
	const state = new SvelteMap()
	let current = $state<_Data | undefined>()
	let status = $state<CollectionStatus>(
		collection.status,
	)
	let error = $state<unknown>()
	let currentUnsubscribe: (() => void) | undefined

	const assignCurrent = (raw: _Data | undefined) => {
		current = (
			raw === undefined ?
				undefined
			: options?.normalize !== undefined ?
				options.normalize(raw)
			:
				raw
		)
	}

	$effect(() => {
		status = collection.status
		currentUnsubscribe?.()
		untrack(() => {
			state.clear()
			for (const [key, value] of collection.entries()) {
				state.set(key, value)
			}
			assignCurrent(
				collection.config.singleResult ?
					Array.from(collection.values())[0] as _Data | undefined
				:
					Array.from(collection.values()) as _Data,
			)
		})
		collection.onFirstReady(() => {
			status = collection.status
		})
		const subscription = collection.subscribeChanges((changes) => {
			untrack(() => {
				for (const change of changes) {
					if (change.type === 'delete') state.delete(change.key)
					else state.set(change.key, change.value)
				}
				assignCurrent(
					collection.config.singleResult ?
						Array.from(collection.values())[0] as _Data | undefined
					:
						Array.from(collection.values()) as _Data,
				)
			})
			status = collection.status
		}, {
			includeInitialState: true,
		})
		collection.preload().catch((cause) => {
			error = normalizeBoundaryError(cause)
			status = 'error'
		})
		currentUnsubscribe = subscription.unsubscribe.bind(subscription)
		return () => {
			currentUnsubscribe?.()
			currentUnsubscribe = undefined
		}
	})
	const promise = $derived(
		Promise.resolve()
			.then(tick)
			.then(() => current as _Data)
	)

	return {
		get current() {
			return current
		},
		get data() {
			return current
		},
		get error() {
			return error
		},
		get isError() {
			return status === 'error'
		},
		get isLoading() {
			return status === 'loading'
		},
		get isReady() {
			return status === 'ready' || status === 'disabled'
		},
		get loading() {
			return status === 'loading'
		},
		get ready() {
			return status === 'ready' || status === 'disabled'
		},
		get status() {
			return status
		},
		get then() {
			return promise.then.bind(promise)
		},
		get catch() {
			return promise.catch.bind(promise)
		},
		get finally() {
			return promise.finally.bind(promise)
		},
		[Symbol.toStringTag]: 'RemoteResource',
	}
}

export const useEntity3 = <
	_EntityType extends EntityType<typeof schema>,
>(
	entityType: _EntityType,
	entityId: EntityId<typeof schema, _EntityType>,
	selection: EntitySelection<typeof schema, _EntityType>,
) => {
	const idKey = $derived(
		stringify(entityId),
	)
	const selectedFieldEntries = $derived(
		entitySelectionFieldEntries(selection),
	)
	const fieldSourcesByName = $derived(
		Object.fromEntries(
			selectedFieldEntries.map(([fieldName, fieldSelection]) => [
				fieldName,
				fieldSelection?.$ ?? selection.$ ?? [],
			]),
		),
	)
	const sourcePriority = $derived(
		[
			...(selection.$ ?? []),
			...Object.values(fieldSourcesByName).flat(),
		].filter((source, index, sources) => (
			sources.indexOf(source) === index
		)),
	)
	const entityRowsResource = useLiveQueryResource(
		(queryBuilder) => (
			queryBuilder
				.from({ entityRow: entityCollectionByEntityType[entityType] })
				.where(({ entityRow }) => (
					eq(entityRow[EntityMetaKey.IdKey], idKey)
				))
				.where(({ entityRow }) => (
					inArray(entityRow[EntityMetaKey.Source], sourcePriority)
				))
				.orderBy(({ entityRow }) => (
					sourcePriority.indexOf(entityRow[EntityMetaKey.Source])
				), 'asc')
				.select(({ entityRow }) => ({
					entityRow,
				}))
		),
		[
			() => idKey,
			() => stringify(sourcePriority),
		],
	)
	const fieldRowsResources = $derived(
		Object.fromEntries(
			selectedFieldEntries.map(([fieldName]) => {
				const fieldSelection = selection[fieldName]
				return [
					fieldName,
					useLiveQueryResource(
						(queryBuilder) => {
							const cardinality = entityFieldDefinitionsByEntityType[entityType][fieldName].cardinality
							const base = foldOrderBySteps(
								queryBuilder
									.from({
										fieldRow: entityFieldCollections[entityType][fieldName],
									})
									.where(({ fieldRow }) => (
										eq(fieldRow[EntityMetaKey.ParentIdKey], idKey)
									))
									.where(({ fieldRow }) => (
										inArray(fieldRow[EntityMetaKey.Source], fieldSourcesByName[fieldName] ?? [])
									)),
								fieldSelection?.$orderBy ?? selection.$orderBy ?? [],
							)
								.orderBy(({ fieldRow }) => (
									(fieldSourcesByName[fieldName] ?? []).indexOf(fieldRow[EntityMetaKey.Source])
								), 'asc')
								.select(({ fieldRow }) => ({
									fieldRow,
								}))
							return (
								cardinality === EntityFieldCardinality.Many
								|| cardinality === EntityFieldCardinality.ZeroOrMany ?
									base.limit(
										fieldSelection?.$limit
										?? selection.$limit
										?? defaultEntityFieldLiveQueryLimit,
									)
								:
									base
							)
						},
						[
							() => idKey,
							() => stringify(
								[
									fieldSourcesByName[fieldName] ?? [],
									fieldSelection?.$limit ?? selection.$limit,
									fieldOrderDepsFingerprint(
										entityFieldCollections[entityType][fieldName],
										fieldSelection?.$orderBy ?? selection.$orderBy ?? [],
										fieldSelection?.$orderByDep ?? selection.$orderByDep,
									),
								],
							),
						],
					),
				]
			}),
		),
	)
	const mergedAccum = reduce(
		[
			derive(
				entityRowsResource,
				(entityRows) => ({
					entityRows,
				}),
			),
			...selectedFieldEntries.map(([fieldName]) => (
				derive(fieldRowsResources[fieldName], (rows) => ({
					fieldRowsByField: {
						[fieldName]: rows,
					},
				}))
			)),
		],
		(
			acc,
			part,
		) => ({
			...acc,
			fieldRowsByField: {
				...acc.fieldRowsByField,
				...(part.fieldRowsByField ?? {}),
			},
			...part,
		}),
		{
			entityRows: [] as { entityRow: { [EntityMetaKey.Fields]: Record<string, unknown> } }[],
			fieldRowsByField: {} as Record<string, { fieldRow: { [EntityMetaKey.Value]: unknown } }[]>,
		},
	)

	const mergedEntity = $derived.by(() => {
		const { entityRows, fieldRowsByField } = mergedAccum.current

		return {
			[EntityMetaKey.Id]: entityId,
			...Object.fromEntries(
				selectedFieldEntries
					.map(([fieldName]) => {
						const cardinality = entityFieldDefinitionsByEntityType[entityType][fieldName].cardinality
						return [
							fieldName,
							cardinality === EntityFieldCardinality.Many
							|| cardinality === EntityFieldCardinality.ZeroOrMany ?
								[
									...entityRows.flatMap(({ entityRow }) => (
										Array.isArray(entityRow[EntityMetaKey.Fields][fieldName]) ?
											entityRow[EntityMetaKey.Fields][fieldName]
										:
											[]
									)),
									...(fieldRowsByField[fieldName] ?? []).map(({ fieldRow }) => (
										fieldRow[EntityMetaKey.Value]
									)),
								]
							:
								[
									...entityRows.map(({ entityRow }) => (
										entityRow[EntityMetaKey.Fields][fieldName]
									)),
									...(fieldRowsByField[fieldName] ?? []).map(({ fieldRow }) => (
										fieldRow[EntityMetaKey.Value]
									)),
								].find((value) => value !== undefined),
						]
					})
					.filter(([, value]) => value !== undefined),
			),
		}
	})

	const promise = $derived(
		mergedAccum
			.then(tick)
			.then(() => mergedEntity),
	)

	return {
		get current() {
			return mergedEntity
		},
		get loading() {
			return mergedAccum.loading
		},
		get error() {
			return mergedAccum.error
		},
		get ready() {
			return mergedAccum.ready
		},
		get then() {
			return promise.then.bind(promise)
		},
		get catch() {
			return promise.catch.bind(promise)
		},
		get finally() {
			return promise.finally.bind(promise)
		},
		[Symbol.toStringTag]: 'RemoteResource',
	}
}

export const useEntity = useEntity3
