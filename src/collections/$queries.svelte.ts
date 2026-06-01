// Types/constants
import {
	type Collection,
	type CollectionStatus,
	type InitialQueryBuilder,
	type QueryBuilder,
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
	EntityBaseFieldName,
	EntityConditionalDiscriminatorName,
	EntityConditionalDiscriminatorValue,
	EntityConditionalFieldName,
	EntityFieldDefinition,
	EntityFieldName,
	EntityId,
	EntityType,
	Schema,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType, EntityMetaKey } from '$/schema/$EntityDefinition.ts'
// @ts-expect-error Svelte module context named exports are available at runtime.
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

const dedupeEntityReferenceManyField = <_Value>(
	values: _Value[],
): _Value[] => {
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
			(value as { [EntityMetaKey.Id]: unknown })[EntityMetaKey.Id],
		)
		if (seenIdKeys.has(idKey)) return []
		seenIdKeys.add(idKey)
		return [value]
	})
}


const ENTITY_SELECTION_META_KEYS = new Set([
	'$',
	'$case',
	'$limit',
	'$orderBy',
	'$orderByDep',
])


type EntitySelectionMeta = {
	/** Root source priority; nested field selections inherit this when their own `$` is omitted. */
	$?: readonly Source[]
	$limit?: number
	/** Same tuples as chained `.orderBy(callback, options?)` on `{ fieldRow }`. */
	$orderBy?: DeclarativeOrderBy<{ fieldRow: unknown }>
	/** When clauses aren't fingerprintable (e.g. non-field-ref expressions), set for live-query deps. */
	$orderByDep?: string
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


export const entitySelectionFieldEntries = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
>(
	selection: EntitySelection<_Schema, _EntityType>,
) => {
	const entries = new Map<string, unknown>()
	for (const [fieldName, fieldSelection] of Object.entries(selection)) {
		if (!ENTITY_SELECTION_META_KEYS.has(fieldName)) {
			entries.set(fieldName, fieldSelection)
		}
	}
	for (const [discriminatorFieldName, cases] of Object.entries(
		(selection.$case ?? {}) as Record<string, Record<string, Record<string, unknown>>>,
	)) {
		entries.set(discriminatorFieldName, selection[discriminatorFieldName as EntityBaseFieldName<_Schema, _EntityType>])
		for (const caseSelection of Object.values(cases ?? {})) {
			for (const [fieldName, fieldSelection] of Object.entries(caseSelection ?? {})) {
				entries.set(fieldName, fieldSelection)
			}
		}
	}
	return [...entries] as [
		EntityFieldName<_Schema, _EntityType>,
		EntitySelectionForField<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>> | undefined,
	][]
}


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

const entityFieldDefinitionFor = <
	_EntityType extends EntityType<typeof schema>,
>(
	entityType: _EntityType,
	fieldName: EntityFieldName<typeof schema, _EntityType>,
) => {
	const fieldDefinition = entityFieldDefinitionsByEntityType[entityType][fieldName]
	if (fieldDefinition === undefined) {
		throw new Error(
			`useEntity: ${entityType} has no field ${fieldName}`,
		)
	}
	return fieldDefinition
}

export const useLiveQueryResource = <_Data>(
	queryBuilderFunction: (queryBuilder: InitialQueryBuilder) => QueryBuilder<any>,
	deps: (() => unknown)[] = [],
	options?: {
		normalize?: (data: _Data) => _Data
	},
): RemoteResource<_Data> => {
	const collection = $derived.by(() => {
		deps.forEach((dep) => dep())
		return createLiveQueryCollection(queryBuilderFunction)
	})

	let _collectionUpdates = $state(0)
	let _error = $state<unknown>()

	let currentUnsubscribe: (() => void) | undefined

	$effect(() => {
		const coll = collection
		untrack(() => {
			_error = undefined
		})
		currentUnsubscribe?.()

		coll.onFirstReady(() => {
			_collectionUpdates++
		})
		const subscription = coll.subscribeChanges(() => {
			_collectionUpdates++
		}, {
			includeInitialState: false,
		})
		coll.preload().catch((cause) => {
			_error = normalizeBoundaryError(cause)
			_collectionUpdates++
		})
		currentUnsubscribe = subscription.unsubscribe.bind(subscription)
		return () => {
			currentUnsubscribe?.()
			currentUnsubscribe = undefined
		}
	})

	const getCurrent = (): _Data | undefined => {
		_collectionUpdates
		const coll = collection
		
		const raw = Array.from(coll.values()) as _Data
			
		if (raw === undefined) {
			return undefined
		}
		if (options?.normalize !== undefined) {
			return options.normalize(raw)
		}
		return raw
	}

	const getStatus = (): CollectionStatus | 'error' => {
		_collectionUpdates
		if (_error !== undefined) {
			return 'error'
		}
		return collection.status
	}

	const promise = $derived(
		Promise.resolve()
			.then(tick)
			.then(() => getCurrent() as _Data)
	)

	// @ts-expect-error `RemoteResource` is a discriminated getter union; readiness is computed at access time.
	return {
		get current(): _Data | undefined {
			return getCurrent()
		},
		get error(): unknown {
			return _error
		},
		get loading(): boolean {
			return getStatus() === 'loading'
		},
		get ready(): boolean {
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
		) as Record<string, readonly Source[]>,
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
				const fieldCollection = (entityFieldCollections as any)[entityType][fieldName]
				return [
					fieldName,
					useLiveQueryResource(
						(queryBuilder) => {
							const fieldDefinition = entityFieldDefinitionsByEntityType[entityType][fieldName]
							if (fieldDefinition === undefined) {
								throw new Error(
									`useEntity: ${entityType} has no field ${fieldName}`,
								)
							}
							const cardinality = fieldDefinition.cardinality
							const base = foldOrderBySteps(
								queryBuilder
									.from({
										fieldRow: fieldCollection,
									})
									.where(({ fieldRow }: { fieldRow: any }) => (
										eq(fieldRow[EntityMetaKey.ParentIdKey], idKey)
									))
										.where(({ fieldRow }: { fieldRow: any }) => (
											inArray(fieldRow[EntityMetaKey.Source], (fieldSourcesByName[fieldName] ?? []) as any)
										)),
								fieldSelection?.$orderBy ?? selection.$orderBy ?? [],
							)
								.orderBy(({ fieldRow }: { fieldRow: any }) => (
									(fieldSourcesByName[fieldName] ?? []).indexOf(fieldRow[EntityMetaKey.Source])
								), 'asc')
								.select(({ fieldRow }: { fieldRow: any }) => ({
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
										fieldCollection,
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
	const emptyAccum = {
		entityRows: [] as { entityRow: { [EntityMetaKey.Fields]: Record<string, unknown> } }[],
		fieldRowsByField: {} as Record<string, { fieldRow: { [EntityMetaKey.Value]: unknown } }[]>,
	}
	const mergedAccum = reduce<any, typeof emptyAccum>(
		[
			derive(
				entityRowsResource,
				(entityRows) => ({
					entityRows,
				}),
			),
			...selectedFieldEntries.map(([fieldName]) => (
				derive((fieldRowsResources as any)[fieldName], (rows) => ({
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
		emptyAccum,
	)

	const mergedEntity = $derived.by(() => {
		const { entityRows, fieldRowsByField } = mergedAccum.current ?? emptyAccum

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
								dedupeEntityReferenceManyField([
									...entityRows.flatMap(({ entityRow }: { entityRow: { [EntityMetaKey.Fields]: Record<string, unknown> } }) => (
										Array.isArray(entityRow[EntityMetaKey.Fields][fieldName]) ?
											entityRow[EntityMetaKey.Fields][fieldName]
										:
											[]
									)),
									...(fieldRowsByField[fieldName] ?? []).map(({ fieldRow }: { fieldRow: { [EntityMetaKey.Value]: unknown } }) => (
										fieldRow[EntityMetaKey.Value]
									)),
								])
							:
								[
									...entityRows.map(({ entityRow }: { entityRow: { [EntityMetaKey.Fields]: Record<string, unknown> } }) => (
										entityRow[EntityMetaKey.Fields][fieldName]
									)),
									...(fieldRowsByField[fieldName] ?? []).map(({ fieldRow }: { fieldRow: { [EntityMetaKey.Value]: unknown } }) => (
										fieldRow[EntityMetaKey.Value]
									)),
								].find((value) => value != null),
						]
					})
					.filter(([, value]) => value != null),
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
