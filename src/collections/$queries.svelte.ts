// Types/constants
import {
	type Collection,
	type CollectionStatus,
	type InitialQueryBuilder,
	type IR,
	type QueryBuilder,
	caseWhen,
	createLiveQueryCollection,
	eq,
	inArray,
} from '@tanstack/svelte-db'
import { stringify } from 'devalue'
import { tick, untrack } from 'svelte'

import type { RemoteResource } from '@sveltejs/kit'

import { derive, reduce } from '$/lib/svelte/RemoteResource.svelte.ts'

import { normalizeBoundaryError } from '$/lib/errors.ts'
import type {
	EntityCollectionItem,
	EntityFieldCollectionItem,
} from '$/collections/$collections.ts'
import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'

import type {
	Entity,
	EntityBaseFieldName,
	EntityConditionalDiscriminatorName,
	EntityConditionalDiscriminatorValue,
	EntityConditionalFieldName,
	EntityDefinitionForEntityType,
	EntityFieldDefinition,
	EntityFieldName,
	EntityFieldValue,
	EntityFieldValues,
	EntityId,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	entityFieldDefinitions,
	entityIdentityIdsFromFields,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { entityCollectionByEntityType, entityFieldCollections, entityFieldCountCollections } from '$/collections/$entityCollections.ts'
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

type FieldRowsResource<_EntityType extends EntityType<typeof schema>> = RemoteResource<{
	fieldRow: EntityFieldCollectionItem<
		typeof schema,
		_EntityType,
		EntityFieldName<typeof schema, _EntityType>
	>
}[]>

type EntityFieldCountRow = {
	[EntityMetaKey.ParentId]: unknown
	[EntityMetaKey.ParentIdKey]: string
	[EntityMetaKey.Value]: number
	[EntityMetaKey.Source]: Source
	filterKey: string
	fieldName: string
}

const partialRecordFromEntries = <_Key extends PropertyKey, _Value>(
	entries: readonly (readonly [_Key, _Value])[],
): Partial<Record<_Key, _Value>> => (
	Object.fromEntries<_Key, _Value>(entries)
)

const entityCollectionFor = <_EntityType extends EntityType<typeof schema>>(
	entityType: _EntityType,
) => (
	entityCollectionByEntityType[entityType] as Collection<
		EntityCollectionItem<typeof schema, _EntityType>,
		string | number
	>
)

const entityFieldCollectionFor = <
	_EntityType extends EntityType<typeof schema>,
	_FieldName extends EntityFieldName<typeof schema, _EntityType>,
>(
	entityType: _EntityType,
	fieldName: _FieldName,
): Collection<
	EntityFieldCollectionItem<typeof schema, _EntityType, _FieldName>,
	string | number
> => (
	(
		entityFieldCollections[entityType] as Record<
			_FieldName,
			Collection<
				EntityFieldCollectionItem<typeof schema, _EntityType, _FieldName>,
				string | number
			>
		>
	)[fieldName]
)

const entityFieldCountCollectionFor = <
	_EntityType extends EntityType<typeof schema>,
	_FieldName extends EntityFieldName<typeof schema, _EntityType>,
>(
	entityType: _EntityType,
	fieldName: _FieldName,
): Collection<
	EntityFieldCountRow,
	string | number
> | undefined => (
	(
		entityFieldCountCollections[entityType] as Partial<Record<
			_FieldName,
			Collection<
				EntityFieldCountRow,
				string | number
			>
		>>
	)[fieldName]
)

const dedupeEntityReferenceManyField = <_Value>(
	values: _Value[],
) => {
	const seenIdKeys = new Set<string>()
	return values.flatMap((value) => {
		if (
			value == null
			|| typeof value !== 'object'
			|| !(EntityMetaKey.Id in value)
		) {
			return [value]
		}
		const idKey = stringify(
			value[EntityMetaKey.Id],
		)
		if (seenIdKeys.has(idKey)) return []
		seenIdKeys.add(idKey)
		return [value]
	})
}


export type EntitySelectionMeta = {
	/** Root source priority; nested field selections inherit this when their own `$` is omitted. */
	$?: readonly Source[]
	$limit?: number
	/** Same tuples as chained `.orderBy(callback, options?)` on `{ fieldRow }`. */
	$orderBy?: DeclarativeOrderBy<never>
	/** When clauses aren't fingerprintable (e.g. non-field-ref expressions), set for live-query deps. */
	$orderByDep?: string
	$count?: true
}

type EntitySelectionCase<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_DiscriminatorName extends EntityConditionalDiscriminatorName<_Schema, _EntityType>,
> = {
	[
		_DiscriminatorValue in EntityConditionalDiscriminatorValue<
			_Schema,
			_EntityType,
			_DiscriminatorName
		> & PropertyKey
	]?: {
		[
			_FieldName in EntityConditionalFieldName<
				_Schema,
				_EntityType,
				_DiscriminatorName,
				_DiscriminatorValue
			> & EntityFieldName<_Schema, _EntityType>
		]?: EntitySelectionForField<_Schema, _EntityType, _FieldName>
	}
}


type EntitySelectionForField<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinition<_Schema, _EntityType, _FieldName> extends {
		type:
			| EntityFieldType.EntityReference
			| EntityFieldType.EntitiesReference
		entityType: infer _RefEntityType extends EntityType<_Schema>
	} ?
		EntitySelection<_Schema, _RefEntityType>
	:
		EntitySelectionMeta
)


export type EntitySelection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = EntitySelectionMeta & {
	[
		_FieldName in EntityBaseFieldName<_Schema, _EntityType>
	]?: EntitySelectionForField<_Schema, _EntityType, _FieldName>
} & {
	$case?: {
		[
			_DiscriminatorName in EntityConditionalDiscriminatorName<_Schema, _EntityType> & string
		]?: EntitySelectionCase<_Schema, _EntityType, _DiscriminatorName>
	}
}

type EntitySelectionKey<
	_EntityType extends EntityType<typeof schema>,
> = keyof EntityFieldValues<typeof schema, _EntityType> & keyof EntitySelection<typeof schema, _EntityType>

type EntitySelectionFieldEntry<
	_EntityType extends EntityType<typeof schema>,
> = readonly [
	fieldName: EntitySelectionKey<_EntityType>,
	fieldSelection: EntitySelectionMeta | undefined,
]

type EntitySelectionCaseFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection,
> = (
	_Selection extends { $case?: infer _Cases } ?
		{
			[_DiscriminatorName in keyof NonNullable<_Cases>]: {
				[_DiscriminatorValue in keyof NonNullable<NonNullable<_Cases>[_DiscriminatorName]>]: Extract<
					keyof NonNullable<NonNullable<NonNullable<_Cases>[_DiscriminatorName]>[_DiscriminatorValue]>,
					EntityFieldName<_Schema, _EntityType>
				>
			}[keyof NonNullable<NonNullable<_Cases>[_DiscriminatorName]>]
		}[keyof NonNullable<_Cases>]
	:
		never
)

type EntitySelectionFieldName<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection,
> = (
	| Extract<
		Exclude<keyof _Selection, keyof EntitySelectionMeta | '$case'>,
		EntityFieldName<_Schema, _EntityType>
	>
	| EntitySelectionCaseFieldName<_Schema, _EntityType, _Selection>
)

type EntityFromSelection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection,
> = (
	& Entity<_Schema, _EntityType>
	& {
		[_FieldName in EntitySelectionFieldName<_Schema, _EntityType, _Selection>]-?: EntityFieldValue<
			_Schema,
			_EntityType,
			_FieldName
		>
	}
)


const fieldOrderDepsFingerprint = (
	fieldCollection: Collection<any>,
	orderBy: DeclarativeOrderBy<any>,
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


const entityDefinitionByEntityType = Object.fromEntries(
	schema.map((entityDefinition) => [
		entityDefinition.entityType,
		entityDefinition,
	] as const),
) as {
	[_EntityType in EntityType<typeof schema>]: EntityDefinitionForEntityType<typeof schema, _EntityType>
}

const entityFieldDefinitionsByEntityType = Object.fromEntries(
	schema.map((entityDefinition) => [
		entityDefinition.entityType,
		Object.fromEntries(
			entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
				fieldDefinition.name,
				fieldDefinition,
			] as const),
		),
	] as const),
)

const entityFieldNamesByEntityType: Record<string, readonly string[]> = Object.fromEntries(
	schema.map((entityDefinition) => [
		entityDefinition.entityType,
		entityFieldDefinitions(entityDefinition).map((fieldDefinition) => (
			fieldDefinition.name
		)),
	] as const),
)

const selectionFieldName = <
	_EntityType extends EntityType<typeof schema>,
>(
	selection: EntitySelection<typeof schema, _EntityType>,
	fieldName: string,
): fieldName is EntitySelectionKey<_EntityType> => (
	fieldName in selection
)

const entitySelectionKey = <
	_EntityType extends EntityType<typeof schema>,
>(
	entityType: _EntityType,
	fieldName: string,
): EntitySelectionKey<_EntityType> | undefined => (
	(entityFieldNamesByEntityType[entityType] ?? []).includes(fieldName) ?
		fieldName as EntitySelectionKey<_EntityType>
	:
		undefined
)

const fieldNameFromDiscriminatorCaseKey = (
	discriminatorName: string,
) => (
	discriminatorName.endsWith(']')
	&& discriminatorName.includes('[') ?
		discriminatorName.slice(0, discriminatorName.lastIndexOf('['))
	:
		discriminatorName
)

const entitySelectionFieldEntries = <
	_EntityType extends EntityType<typeof schema>,
>(
	entityType: _EntityType,
	selection: EntitySelection<typeof schema, _EntityType>,
): readonly EntitySelectionFieldEntry<_EntityType>[] => {
	const entries = new Map<EntitySelectionKey<_EntityType>, EntitySelectionMeta | undefined>()
	for (const fieldName of entityFieldNamesByEntityType[entityType] ?? []) {
		if (selectionFieldName(selection, fieldName))
			entries.set(fieldName, selection[fieldName])
	}

	for (const [discriminatorName, cases] of Object.entries(
		(selection.$case ?? {}) as Record<string, Record<string, Record<string, EntitySelectionMeta | undefined>>>,
	)) {
		const fieldName = entitySelectionKey(
			entityType,
			fieldNameFromDiscriminatorCaseKey(discriminatorName),
		)
		if (fieldName != null)
			entries.set(
				fieldName,
				selection[fieldName],
			)

		for (const caseSelection of Object.values(cases)) {
			for (const [caseFieldName, fieldSelection] of Object.entries(caseSelection)) {
				const fieldName = entitySelectionKey(entityType, caseFieldName)
				if (fieldName === undefined)
					continue

				entries.set(fieldName, fieldSelection)
			}
		}
	}

	return [...entries.entries()]
}

const entityFieldDefinitionFor = <
	_EntityType extends EntityType<typeof schema>,
>(
	entityType: _EntityType,
	fieldName: EntitySelectionKey<_EntityType>,
) => {
	const fieldDefinition = entityFieldDefinitionsByEntityType[entityType]?.[fieldName]
	if (fieldDefinition === undefined) {
		throw new Error(
			`useEntity: ${entityType} has no field ${fieldName}`,
		)
	}

	return fieldDefinition
}

export const useLiveQueryResource = <_Row>(
	queryBuilderFunction: (queryBuilder: InitialQueryBuilder) => QueryBuilder<any>,
	deps: (() => unknown)[] = [],
	options?: {
		normalize?: (data: _Row[]) => _Row[]
	},
): RemoteResource<_Row[]> => {
	const collection = $derived.by(() => {
		deps.forEach((dep) => dep())
		return createLiveQueryCollection(queryBuilderFunction)
	})

	let _collectionUpdates = $state(0)
	let _error = $state<unknown>()

	let currentUnsubscribe: (() => void) | undefined

	$effect(() => {
		untrack(() => {
			_error = undefined
		})
		currentUnsubscribe?.()

		collection.onFirstReady(() => {
			_collectionUpdates++
		})
		const subscription = collection.subscribeChanges(() => {
			_collectionUpdates++
		}, {
			includeInitialState: false,
		})
		collection.preload().catch((cause) => {
			_error = normalizeBoundaryError(cause)
			_collectionUpdates++
		})
		currentUnsubscribe = subscription.unsubscribe.bind(subscription)
		return () => {
			currentUnsubscribe?.()
			currentUnsubscribe = undefined
		}
	})

	const getCurrent = () => {
		_collectionUpdates
		const raw = Array.from(collection.values())

		if (raw.length === 0 && collection.status !== 'ready') {
			return undefined
		}
		if (options?.normalize !== undefined) {
			return options.normalize(raw)
		}
		return raw
	}

	const getStatus = () => {
		_collectionUpdates
		if (_error !== undefined) {
			return 'error'
		}
		return collection.status
	}

	const promise = $derived(
		Promise.resolve()
			.then(tick)
			.then(() => getCurrent() ?? [])
	)

	// @ts-expect-error `RemoteResource` is a discriminated getter union; readiness is computed at access time.
	return {
		get current() {
			return getCurrent()
		},
		get error() {
			return _error
		},
		get loading() {
			return getStatus() === 'loading'
		},
		get ready() {
			const s = getStatus()
			return s === 'ready'
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

export const useEntity = <
	_EntityType extends EntityType<typeof schema>,
	_Selection extends EntitySelection<typeof schema, _EntityType>,
>(
	entityType: _EntityType,
	entityId: EntityId<typeof schema, _EntityType>,
	selection: _Selection,
): RemoteResource<EntityFromSelection<typeof schema, _EntityType, _Selection>> => {
	const idKey = $derived(
		stringify(entityId),
	)
	const selectedFieldEntries = $derived(
		entitySelectionFieldEntries(
			entityType,
			selection,
		),
	)
	const fieldSourcesByName = $derived(
		partialRecordFromEntries(
			selectedFieldEntries.map(([fieldName, fieldSelection]): readonly [EntitySelectionKey<_EntityType>, Source[]] => [
				fieldName,
				[...(fieldSelection?.$ ?? selection.$ ?? [])],
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
	const entityRowsResource = useLiveQueryResource<{ entityRow: EntityCollectionItem<typeof schema, _EntityType> }>(
		(queryBuilder) => (
			queryBuilder
				.from({
					entityRow: entityCollectionFor(entityType),
				})
				.where(({ entityRow }) => (
					eq(entityRow[EntityMetaKey.IdKey], idKey)
				))
				.where(({ entityRow }) => (
					inArray(entityRow[EntityMetaKey.Source], sourcePriority)
				))
				.orderBy(({ entityRow }) => (
					sourcePriority.reduceRight<IR.BasicExpression<number> | number>(
						(fallback, source, index) => (
							caseWhen(
								eq(entityRow[EntityMetaKey.Source], source),
								index,
								fallback,
							)
						),
						sourcePriority.length,
					)
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
	const fieldParentIdKeys = $derived.by(() => {
		const parentIdKeys = new Set([
			idKey,
		])
		for (const { entityRow } of entityRowsResource.current ?? []) {
			for (const identityId of entityIdentityIdsFromFields(
				entityDefinitionByEntityType[entityType],
				entityRow[EntityMetaKey.Id],
				entityRow[EntityMetaKey.Fields] as Partial<Record<string, unknown>>,
			)) {
				parentIdKeys.add(stringify(identityId))
			}
		}
		return [...parentIdKeys]
	})
	const fieldRowsResources = $derived(
		partialRecordFromEntries(
			selectedFieldEntries.map(([fieldName, fieldSelection]) => {
				const fieldCollection = entityFieldCollectionFor(
					entityType,
					fieldName,
				)
				return [
					fieldName,
					useLiveQueryResource<{
						fieldRow: EntityFieldCollectionItem<
							typeof schema,
							_EntityType,
							EntityFieldName<typeof schema, _EntityType>
						>
					}>(
						(queryBuilder) => {
							const fieldDefinition = entityFieldDefinitionFor(entityType, fieldName)
							const base = foldOrderBySteps(
								queryBuilder
									.from({
										fieldRow: fieldCollection,
									})
									.where(({ fieldRow }) => (
										inArray(fieldRow[EntityMetaKey.ParentIdKey], fieldParentIdKeys)
									))
									.where(({ fieldRow }) => (
										inArray(fieldRow[EntityMetaKey.Source], fieldSourcesByName[fieldName] ?? [])
									)),
								fieldSelection?.$orderBy ?? selection.$orderBy ?? [],
							)
								.orderBy(({ fieldRow }) => (
									(fieldSourcesByName[fieldName] ?? []).reduceRight<IR.BasicExpression<number> | number>(
										(fallback, source, index) => (
											caseWhen(
												eq(fieldRow[EntityMetaKey.Source], source),
												index,
												fallback,
											)
										),
										(fieldSourcesByName[fieldName] ?? []).length,
									)
								), 'asc')
								.select(({ fieldRow }) => ({
									fieldRow,
								}))
							return (
								fieldDefinition.cardinality === EntityFieldCardinality.Many
								|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany ?
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
							() => stringify(fieldParentIdKeys),
							() => stringify(
								[
									fieldSourcesByName[fieldName] ?? [],
									fieldSelection?.$limit ?? selection.$limit,
									fieldOrderDepsFingerprint(
										fieldCollection,
										fieldSelection?.$orderBy ?? selection.$orderBy ?? [],
										fieldSelection?.$orderByDep ?? selection.$orderByDep,
									),
								],
							),
						],
					),
				] as const
			}),
		),
	)
	const fieldCountRowsResources = $derived(
		partialRecordFromEntries(
			selectedFieldEntries.flatMap(([fieldName, fieldSelection]) => {
				const fieldDefinition = entityFieldDefinitionFor(entityType, fieldName)
				const countCollection = entityFieldCountCollectionFor(
					entityType,
					fieldName,
				)
				return (
					fieldSelection?.$count === true
					&& (
						fieldDefinition.cardinality === EntityFieldCardinality.Many
						|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
					)
					&& countCollection !== undefined ?
						[[
							fieldName,
							useLiveQueryResource<{
								countRow: EntityFieldCountRow
							}>(
								(queryBuilder) => {
									const base = queryBuilder
										.from({
											countRow: countCollection,
										})
										.where(({ countRow }) => (
											inArray(countRow[EntityMetaKey.ParentIdKey], fieldParentIdKeys)
										))
									return (
										(fieldSourcesByName[fieldName] ?? []).length > 0 ?
											base
												.where(({ countRow }) => (
													inArray(countRow[EntityMetaKey.Source], fieldSourcesByName[fieldName] ?? [])
												))
												.orderBy(({ countRow }) => (
													(fieldSourcesByName[fieldName] ?? []).reduceRight<IR.BasicExpression<number> | number>(
														(fallback, source, index) => (
															caseWhen(
																eq(countRow[EntityMetaKey.Source], source),
																index,
																fallback,
															)
														),
														(fieldSourcesByName[fieldName] ?? []).length,
													)
												), 'asc')
										:
											base
									)
										.select(({ countRow }) => ({
											countRow,
										}))
								},
								[
									() => stringify(fieldParentIdKeys),
									() => stringify(fieldSourcesByName[fieldName] ?? []),
								],
							),
						] as const]
					:
						[]
				)
			}),
		),
	)
	const emptyAccum: {
		entityRows: { entityRow: EntityCollectionItem<typeof schema, _EntityType> }[]
		fieldRowsByField: Partial<Record<string, {
			fieldRow: EntityFieldCollectionItem<
				typeof schema,
				_EntityType,
				EntityFieldName<typeof schema, _EntityType>
			>
		}[]>>
		fieldCountByField: Partial<Record<string, number>>
	} = {
		entityRows: [],
		fieldRowsByField: {},
		fieldCountByField: {},
	}
	const mergedAccum = $derived.by(() => (
		reduce<Partial<typeof emptyAccum>, typeof emptyAccum>(
			[
				derive(
					entityRowsResource,
					(entityRows) => ({
						entityRows,
					}),
				),
				...selectedFieldEntries.flatMap(([fieldName]) => (
					fieldRowsResources[fieldName] === undefined ?
						[]
					:
						[
							derive(fieldRowsResources[fieldName], (rows) => ({
								fieldRowsByField: {
									[fieldName]: rows,
								},
							})),
						]
				)),
				...selectedFieldEntries.flatMap(([fieldName]) => (
					fieldCountRowsResources[fieldName] === undefined ?
						[]
					:
						[
							derive(fieldCountRowsResources[fieldName], (rows) => ({
								fieldCountByField: {
									[fieldName]: rows[0]?.countRow[EntityMetaKey.Value],
								},
							})),
						]
				)),
			],
			(
				acc,
				part,
			) => ({
				...acc,
				...part,
				fieldRowsByField: {
					...acc.fieldRowsByField,
					...(part.fieldRowsByField ?? {}),
				},
				fieldCountByField: {
					...acc.fieldCountByField,
					...(part.fieldCountByField ?? {}),
				},
			}),
			emptyAccum,
		)
	))

	const mergedEntity = $derived.by(() => {
		const { entityRows, fieldRowsByField, fieldCountByField } = mergedAccum.current ?? emptyAccum

		return {
			[EntityMetaKey.Id]: entityId,
			...Object.fromEntries(
				selectedFieldEntries
					.map(([fieldName]) => {
						const fieldDefinition = entityFieldDefinitionFor(entityType, fieldName)
						return [
							fieldName,
							fieldDefinition.cardinality === EntityFieldCardinality.Many
							|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany ?
								(
									(values) => (
										Object.assign(
											values,
											fieldCountByField[fieldName] !== undefined ?
												{
													totalCount: fieldCountByField[fieldName],
												}
											: (selection[fieldName]?.$count === true
												&& (selection[fieldName]?.$limit ?? selection.$limit) === undefined) ?
												{
													totalCount: values.length,
												}
											:
												{},
										)
									)
								)(dedupeEntityReferenceManyField([
									...entityRows.flatMap(({ entityRow }) => (
										Array.isArray(entityRow[EntityMetaKey.Fields][fieldName]) ?
											entityRow[EntityMetaKey.Fields][fieldName]
										:
											[]
									)),
									...(fieldRowsByField[fieldName] ?? []).map(({ fieldRow }) => (
										fieldRow[EntityMetaKey.Value]
									)),
								]))
							:
								[
									...entityRows.map(({ entityRow }) => (
										entityRow[EntityMetaKey.Fields][fieldName]
									)),
									...(fieldRowsByField[fieldName] ?? []).map(({ fieldRow }) => (
										fieldRow[EntityMetaKey.Value]
									)),
								].find((value) => value != null),
						]
					})
					.filter(([, value]) => value != null),
			),
		} as EntityFromSelection<typeof schema, _EntityType, _Selection>
	})

	const promise = $derived(
		mergedAccum
			.then(tick)
			.then(() => mergedEntity),
	)

	// @ts-expect-error `RemoteResource` is a discriminated getter union; readiness is computed at access time.
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
