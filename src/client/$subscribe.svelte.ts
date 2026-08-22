import {
	and,
	createLiveQueryCollection,
	eq,
	inArray,
	type CollectionStatus,
	type Ref,
	type WithVirtualProps,
} from '@tanstack/db'
import { stringify } from 'devalue'

import {
	EntityMetaKey,
	type EntityFacetPath,
	type EntityFieldDefinition,
	type EntityFieldDefinitionByName,
	type EntityFieldName,
	type EntityProjectionDefinition,
	type EntitySelector,
	type EntityType,
	type Schema,
	entityFieldCardinalityIsMultiple,
	entityFieldAddressKey,
	entityFieldDefinitions,
	entityFieldFacetPath,
	entitySelectorKey,
	validateEntitySelector,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import {
	TanStackLiveQueryResource,
	type SvelteKitResource,
	type TanStackLiveQuerySnapshot,
} from '$/lib/db/queryResource.svelte.ts'
import type {
	CheckedSubscribeSelection,
	ClientContext,
	DeclarativeOrderBy,
	EntityFieldCollectionItem,
	EntityFieldCountCollectionItem,
	PersistedCollectionContinuation,
	SubscribeFieldResult,
	SubscribeFieldSingleResult,
	SubscribeResult,
	SubscribeSelection,
} from '$/client/$client.svelte.ts'
import { localMutationAuthorityKey, entityResolverSourcesForSelectorKeys } from '$/client/$client.svelte.ts'
import { resolverPartsKey } from '$/resolvers/$resolvers.ts'
import { Source } from '$/sources/Source.ts'

const observeNestedResource = (
	resource: SvelteKitResource<object>,
	update: () => void
) => {
	let active = true
	const notify = () => {
		if (active)
			update()
	}
	const stop = typeof window === 'undefined' ?
		undefined
	:
		$effect.root(() => {
			$effect(() => {
				resource.current
				resource.loading
				resource.error
				queueMicrotask(notify)
			})
		})
	if (typeof window === 'undefined')
		void resource.then(notify, notify)

	return () => {
		active = false
		stop?.()
	}
}


export type EntityResourceData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = SubscribeResult<_Schema, _EntityType, _Selection>

type EntityFieldSelectionEntityType<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
	} ?
		_ReferencedEntityType
	:
		_EntityType
)

export type EntityFieldResourceData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
	_FieldSelection = true,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		{
			entityType: _EntityType
			entitySelector: EntitySelector<_Schema, _EntityType>
			fieldName: _FieldName
			values: readonly SubscribeFieldSingleResult<_Schema, _EntityType, _FieldName, _FieldSelection>[]
			entities: readonly SubscribeFieldSingleResult<_Schema, _EntityType, _FieldName, _FieldSelection>[]
			continuation?: PersistedCollectionContinuation
		}
	:
		SubscribeFieldResult<_Schema, _EntityType, _FieldName, _FieldSelection>
)

type SharedEntityFieldResource = TanStackLiveQueryResource<EntityFieldResourceData<
	Schema,
	EntityType<Schema>,
	EntityFieldName<Schema, EntityType<Schema>>
>>
type SharedEntityResource = TanStackLiveQueryResource<EntityResourceData<
	Schema,
	EntityType<Schema>
>>

const sharedEntityFieldResourceByContext = new WeakMap<object, Map<string, SharedEntityFieldResource>>()
const sharedEntityResourceByContext = new WeakMap<object, Map<string, SharedEntityResource>>()
const clientResourcesByContext = new WeakMap<object, Set<{ destroy(): void }>>()
const destroyedClientContexts = new WeakSet<object>()

export const registerClientResource = <_Resource extends { destroy(): void }>(
	context: object,
	resource: _Resource
) => {
	if (destroyedClientContexts.has(context)) {
		resource.destroy()
		return resource
	}

	const resources = clientResourcesByContext.get(context) ?? new Set()
	resources.add(resource)
	clientResourcesByContext.set(context, resources)
	return resource
}

export const destroyClientResources = (
	context: object
) => {
	destroyedClientContexts.add(context)
	for (const resource of clientResourcesByContext.get(context) ?? [])
		resource.destroy()

	clientResourcesByContext.delete(context)
	sharedEntityFieldResourceByContext.delete(context)
	sharedEntityResourceByContext.delete(context)
}

const serializableEntityFieldResourceKey = <
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: string,
	definition: EntityFieldDefinition,
	selection: object
) => {
	try {
		return stringify([
			entityType,
			entitySelectorKey(
				context.schema,
				context.entityDefinitionByType[entityType],
				entitySelector
			),
			entityFieldAddressKey(
				entityType,
				entityFieldFacetPath(definition),
				fieldName
			),
			selection,
		])
	} catch {
		return undefined
	}
}

const serializableEquivalentEntityResourceKeys = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection: object
) => {
	const selectorKey = entitySelectorKey(
		context.schema,
		context.entityDefinitionByType[entityType],
		entitySelector
	)
	return [...(
		context.equivalentSelectorKeysByEntityTypeAndSelectorKey.get(stringify([
			entityType,
			selectorKey,
		]))
		?? [selectorKey]
	)].map((equivalentSelectorKey) => stringify([
		entityType,
		equivalentSelectorKey,
		selection,
	]))
}

const asQuerySnapshot = <Data>(
	queries: readonly {
		isError: boolean
		isLoading: boolean
		isComplete?: boolean
		isReady: boolean
		status: CollectionStatus
		error?: object | string
	}[],
	data: Data
): TanStackLiveQuerySnapshot<Data> => {
	const errorQuery = queries.find((query) => query.isError)
	if (errorQuery !== undefined)
		return {
			data,
			isLoading: false,
			isReady: false,
			isError: true,
			status: errorQuery.status,
			error: errorQuery.error ?? errorQuery.status,
		}

	return {
		data,
		isLoading: queries.some((query) => (
			query.isComplete === false
			|| (
				query.isComplete === undefined
				&& query.isLoading
			)
		)),
		isReady: queries.every((query) => (
			query.isComplete === true
			|| (
				query.isComplete !== false
				&& query.isReady
			)
		)),
		isError: false,
		status: queries.every((query) => (
			query.isComplete === true
			|| (
				query.isComplete !== false
				&& query.isReady
			)
		)) ? 'ready' : 'loading',
	}
}

export const subscribeToLiveQueryCollections = (
	queries: readonly {
		initialSnapshot?: boolean
		collection: {
			readonly status: CollectionStatus
			readonly isLoadingSubset: boolean
			onFirstReady(update: () => void): () => void
			on(
				event: 'loadingSubset:change',
				update: () => void
			): () => void
			preload(): Promise<void>
			subscribeChanges(
				update: () => void,
				options:
					| {
						includeInitialState: true
						onStatusChange: () => void
					}
					| {
						includeInitialState: false
						onStatusChange: () => void
					}
			): {
				unsubscribe(): void
			}
		}
	}[],
	update: () => void,
	subscribeToFailures: (update: () => void) => () => void
) => {
	let active = true
	const notify = () => {
		if (active)
			update()
	}
	const subscriptions = [
		subscribeToFailures(notify),
	]
	for (const query of queries) {
		subscriptions.push(query.collection.onFirstReady(notify))
		const subscription = (
			query.initialSnapshot === false ?
				query.collection.subscribeChanges(() => {
					queueMicrotask(notify)
				}, {
					includeInitialState: false,
					onStatusChange: () => {
						queueMicrotask(notify)
					},
				})
			:
				query.collection.subscribeChanges(notify, {
					includeInitialState: true,
					onStatusChange: notify,
				})
		)
		subscriptions.push(() => subscription.unsubscribe())
	}

	void (async () => {
		for (const query of queries) {
			if (query.initialSnapshot !== false && query.collection.status === 'idle')
				await query.collection.preload().catch(notify)
		}
	})()

	return () => {
		active = false
		for (const subscription of subscriptions)
			subscription()
	}
}

export const waitForLiveQueryCollections = (
	queries: readonly {
		initialSnapshot?: boolean
		collection: {
			readonly status: CollectionStatus
			readonly isLoadingSubset: boolean
			onFirstReady(update: () => void): () => void
			on(
				event: 'loadingSubset:change',
				update: () => void
			): () => void
			preload(): Promise<void>
		}
	}[]
) => (
	new Promise<void>((resolve) => {
		const subscriptions: (() => void)[] = []
		let settled = false
		const done = () => (
			queries.every((query) => (
				query.initialSnapshot === false
				|| (
					query.collection.status === 'ready'
					&& !query.collection.isLoadingSubset
				)
			))
		)
		const complete = () => {
			if (settled || !done())
				return

			settled = true
			for (const subscription of subscriptions)
				subscription()
			subscriptions.length = 0
			resolve()
		}
		const isSettled = () => settled

		for (const query of queries) {
			if (query.initialSnapshot === false)
				continue

			const unsubscribeFirstReady = query.collection.onFirstReady(complete)
			if (isSettled()) {
				unsubscribeFirstReady()
				continue
			}

			subscriptions.push(unsubscribeFirstReady)
			const unsubscribeLoadingSubset = query.collection.on('loadingSubset:change', complete)
			if (isSettled())
				unsubscribeLoadingSubset()
			else
				subscriptions.push(unsubscribeLoadingSubset)
		}
		void (async () => {
			for (const query of queries) {
				if (query.initialSnapshot !== false && query.collection.status === 'idle')
					await query.collection.preload().catch(complete)
			}
		})()
		queueMicrotask(complete)
	})
)

const liveQuerySnapshot = <Data>(
	collection: {
		readonly status: CollectionStatus
		readonly isLoadingSubset: boolean
		readonly toArray: readonly Data[]
		onFirstReady(update: () => void): () => void
		on(
			event: 'loadingSubset:change',
			update: () => void
		): () => void
		preload(): Promise<void>
		subscribeChanges(
			update: () => void,
			options: {
				includeInitialState: true
				onStatusChange: () => void
			}
		): {
			unsubscribe(): void
		}
	}
) => {
	const isReady = () => collection.status === 'ready'
	return {
		collection,
		get data() {
			return collection.toArray
		},
		get isError() {
			return collection.status === 'error'
		},
		get isLoading() {
			return !isReady() || collection.isLoadingSubset
		},
		get isReady() {
			return isReady() && !collection.isLoadingSubset
		},
		get status() {
			return collection.status
		},
	}
}

const selectorFieldValue = (
	entitySelector: object,
	fieldName: string
) => Object.getOwnPropertyDescriptor(entitySelector, fieldName)?.value

const fieldCanCompleteEmpty = (
	definition: EntityFieldDefinition
) => (
		definition.cardinality === EntityFieldCardinality.Zero
		|| definition.cardinality === EntityFieldCardinality.ZeroOrOne
		|| definition.cardinality === EntityFieldCardinality.Many
		|| definition.cardinality === EntityFieldCardinality.ZeroOrMany
	)

const requiredFieldResolvedEmptyError = (
	entityType: string,
	definition: EntityFieldDefinition
) => new Error(`${entityType}.${definition.name} resolved without a required value`)

const enabledSelectionSources = <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	sources: readonly string[] | undefined
) => (
	sources?.filter((source) => context.enabledSources.has(source))
)

const selectedSourcesDisabled = <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	sources: readonly string[] | undefined
) => (
	sources !== undefined
	&& sources.length > 0
	&& enabledSelectionSources(context, sources)?.length === 0
)

type UncheckedSubscribeSelection = {
	readonly fields?: Readonly<Record<string, true | UncheckedSubscribeSelection | undefined>>
}

type SubscribeMaterializedFields = Record<
	string,
	| EntityFieldResourceData<Schema, EntityType<Schema>, EntityFieldName<Schema, EntityType<Schema>>>
	| { fields: SubscribeMaterializedFields }
>

const validateSubscribeSelection = (
	context: {
		entityFieldDefinitionByEntityTypePathAndName: Record<string, Record<string, EntityFieldDefinition | undefined>>
		projectionDefinitionByEntityTypeAndPath: Record<string, EntityProjectionDefinition | undefined>
	},
	entityType: string,
	selection: UncheckedSubscribeSelection,
	facetPath: EntityFacetPath = []
) => {
	if (selection.fields === undefined)
		return

	for (const fieldOrFacetName of Object.keys(selection.fields)) {
		const nestedSelection = selection.fields[fieldOrFacetName]
		const fieldDefinition = context.entityFieldDefinitionByEntityTypePathAndName[entityType][
			entityFieldAddressKey(entityType, facetPath, fieldOrFacetName)
		]
		if (fieldDefinition !== undefined) {
			if (
				nestedSelection !== undefined
				&& nestedSelection !== true
				&& 'fields' in nestedSelection
				&& nestedSelection.fields !== undefined
			) {
				if (
					fieldDefinition.type !== EntityFieldType.EntityReference
					&& fieldDefinition.type !== EntityFieldType.EntitiesReference
				)
					throw new Error(`${entityType}.${[...facetPath, fieldOrFacetName].join('.')} does not reference an entity`)

				validateSubscribeSelection(
					context,
					fieldDefinition.entityType,
					nestedSelection
				)
			}

			continue
		}

		const nestedFacetPath = [
			...facetPath,
			fieldOrFacetName,
		]
		if (
			context.projectionDefinitionByEntityTypeAndPath[
				entityFieldAddressKey(entityType, nestedFacetPath, '')
			] === undefined
		)
			throw new Error(`${entityType}.${nestedFacetPath.join('.')} does not exist`)

		if (nestedSelection === undefined || nestedSelection === true)
			throw new Error(`${entityType}.${nestedFacetPath.join('.')} must be selected with a projection selection`)

		validateSubscribeSelection(
			context,
			entityType,
			nestedSelection,
			nestedFacetPath
		)
	}
}

const collectionLoadFailure = <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	collectionId: string,
	selectorKey: string,
	sources: readonly string[] | undefined
) => (
	context.collectionLoadFailures.list.find((failure) => (
		failure.collectionId === collectionId
		&& (
			failure.selectorKeys.includes(selectorKey)
			|| failure.parentSelectorKeys.includes(selectorKey)
		)
		&& (
			failure.sources.length === 0
			||
			sources === undefined
			|| sources.length === 0
			|| sources.some((source) => failure.sources.includes(source))
		)
	))
)

const fieldRowsComplete = <
	const _Schema extends Schema
>(
	entitySelector: object,
	definition: EntityFieldDefinition,
	rows: readonly EntityFieldCollectionItem[],
	rowsUpdated: boolean,
	sourceDisabled: boolean
) => (
	selectorFieldValue(entitySelector, definition.name) !== undefined
	|| sourceDisabled
	|| (
		rowsUpdated
		&& (
			rows.length > 0
			|| fieldCanCompleteEmpty(definition)
		)
	)
)

const fieldDataFromRows = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>
>(
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	definition: EntityFieldDefinition,
	rows: readonly EntityFieldCollectionItem<_Schema>[],
	continuation?: PersistedCollectionContinuation
) => {
	const values = (
		entityFieldCardinalityIsMultiple(definition.cardinality) ?
			rows.toSorted((left, right) => (left.valueIndex ?? 0) - (right.valueIndex ?? 0))
		:
			rows
	).map((row) => {
		const value = row[EntityMetaKey.Value]
		if (
			value == null
			|| typeof value !== 'object'
		)
			return value

		const record = Object.fromEntries(Object.entries(value))
		if (!(EntityMetaKey.Selector in record))
			return value

		const selector = record[EntityMetaKey.Selector]
		return {
			...record,
			entitySelector: selector,
			__selector: selector,
			[EntityMetaKey.Source]: row[EntityMetaKey.Source],
			__selectorKey: (
				EntityMetaKey.SelectorKey in record ?
					record[EntityMetaKey.SelectorKey]
				:
					stringify(selector)
			),
		}
	})
	if (entityFieldCardinalityIsMultiple(definition.cardinality))
		return {
			entityType,
			entitySelector,
			fieldName: definition.name,
			values,
			entities: values,
			...(continuation !== undefined && {
				continuation,
			}),
		}

	if (values[0] !== undefined)
		return values[0]

	const selectorValue = selectorFieldValue(entitySelector, definition.name)
	if (selectorValue !== undefined)
		return selectorValue

	return undefined
}

const fieldResourceQueries = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: string,
	definition: EntityFieldDefinition,
	selection: SubscribeSelection<
		_Schema,
		_EntityType,
		Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema>>>
	>
) => {
	const querySources = enabledSelectionSources(context, selection.sources)
	const facetPathKey = stringify(entityFieldFacetPath(definition))
	const fieldAddressKey = entityFieldAddressKey(entityType, entityFieldFacetPath(definition), fieldName)
	const selectorName = validateEntitySelector(
		context.schema,
		context.entityDefinitionByType[entityType],
		entitySelector
	).name
	const valueResolverParts = context.resolverIndexes.resolverValuePartsByEntityTypeSelectorAndFieldName[
		resolverPartsKey(
			entityType,
			selectorName,
			entityFieldFacetPath(definition),
			fieldName
		)
	] ?? []
	const parentSelectorKey = entitySelectorKey(
		context.schema,
		context.entityDefinitionByType[entityType],
		entitySelector
	)
	const fieldCollection = context.entityFieldCollections[entityType][fieldAddressKey]
	const rowsCollection = createLiveQueryCollection({
		gcTime: 1,
		startSync: true,
		query: (query) => {
			let built = query
				.from({
					row: fieldCollection,
				})
				.where(({ row }) => (
					querySources == null ?
						eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)
					:
						and(
							eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
							inArray(row[EntityMetaKey.Source], [...querySources])
						)
				))
				.where(({ row }) => eq(row.facetPathKey, facetPathKey))
			if (selection.where != null)
				built = built.where(selection.where)

			if (selection.orderBy != null)
				for (const [
					accessor,
					direction,
				] of selection.orderBy)
					built = built.orderBy(
						({ row }) => accessor({ fieldRow: row }),
						typeof direction === 'string' ?
							direction
						:
							direction.direction
					)
			else if (
				selection.limit != null
				|| selection.offset != null
				|| selection.cursor != null
			)
				built = built
					.orderBy(({ row }) => row.valueIndex, 'asc')
					.orderBy(({ row }) => row.valueKey, 'asc')

			if (selection.offset != null)
				built = built.offset(selection.offset)

			if (selection.limit != null)
				built = built.limit(selection.limit)

			return built
		},
	})
	return {
		rows: liveQuerySnapshot(rowsCollection),
		rowsFailure: () => collectionLoadFailure(
			context,
			stringify([
				'client.fields',
				entityType,
				entityFieldFacetPath(definition),
				fieldName,
			]),
			parentSelectorKey,
			querySources
		),
		rowsCollection,
		sourceCollection: fieldCollection,
		sourceHasUnsyncedMatches: () => (
			(
				selection.where == null
				&& selection.limit == null
				&& selection.offset == null
				&& selection.cursor == null
			) ?
				fieldCollection.toArray.filter((row) => (
					row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
					&& row.facetPathKey === facetPathKey
					&& (
						querySources == null
						|| querySources.includes(row[EntityMetaKey.Source])
					)
				)).length !== rowsCollection.toArray.length
			:
				(
					rowsCollection.toArray.length === 0
					&& fieldCollection.toArray.some((row) => (
						row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
						&& row.facetPathKey === facetPathKey
						&& (
							querySources == null
							|| querySources.includes(row[EntityMetaKey.Source])
						)
					))
				)
		),
		sourceDisabled: selectedSourcesDisabled(context, selection.sources),
		sourceUnsupported: (
			querySources?.includes(Source.Local_Internal) !== true
			&& !valueResolverParts.some((resolverPart) => (
				(
					querySources == null
					|| querySources.includes(String(resolverPart.source))
				)
				&& resolverPart.resolver.appliesTo(selectorName, entitySelector)
			))
		),
		localAuthorityResolvedEmpty: () => (
			selection.sources?.includes(Source.Local_Internal) === true
			&& fieldCollection.utils.localMutationAuthorityRowCount(
				parentSelectorKey,
				localMutationAuthorityKey({
					source: Source.Local_Internal,
					entityType,
					selectorKey: parentSelectorKey,
					fieldName,
					fieldAddressKey,
					facetPathKey,
				})
			) === 0
		),
		sources: querySources,
	}
}

export function subscribeEntityField<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _FieldName extends EntityFieldName<_Schema, _EntityType>,
	const _Selection extends SubscribeSelection<
		_Schema,
		EntityFieldSelectionEntityType<_Schema, _EntityType, _FieldName>
	> = SubscribeSelection<
		_Schema,
		EntityFieldSelectionEntityType<_Schema, _EntityType, _FieldName>
	>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: _FieldName,
	selection?: _Selection & (
		Schema extends _Schema ?
			_Selection
		:
			CheckedSubscribeSelection<
				_Schema,
				EntityFieldSelectionEntityType<_Schema, _EntityType, _FieldName>,
				_Selection
			>
	),
	fieldDefinition?: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
): TanStackLiveQueryResource<EntityFieldResourceData<_Schema, _EntityType, _FieldName, _Selection>>
export function subscribeEntityField<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _FieldName extends EntityFieldName<_Schema, _EntityType>
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: _FieldName,
	selection: SubscribeSelection<
		_Schema,
		_EntityType,
		Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema>>>
	> = {},
	fieldDefinition?: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>
) {
	const definition = fieldDefinition ?? context.entityDefinitionByType[entityType].fields
		.find((candidate) => candidate.name === fieldName)
	if (definition == null)
		throw new Error(`${entityType}.${fieldName} does not exist`)

	const effectiveSelection = selection.sources != null || definition.defaultSources == null ?
		selection
	:
		{
			...selection,
			sources: definition.defaultSources,
		}
	const sharedResourceKey = serializableEntityFieldResourceKey(
		context,
		entityType,
		entitySelector,
		fieldName,
		definition,
		effectiveSelection
	)
	const sharedResource = (
		sharedResourceKey === undefined ?
			undefined
		:
			sharedEntityFieldResourceByContext.get(context)?.get(sharedResourceKey)
	)
	if (sharedResource !== undefined)
		return sharedResource

	const queries = fieldResourceQueries(
		context,
		entityType,
		entitySelector,
		fieldName,
		definition,
		effectiveSelection
	)

	const observedQueries: Parameters<typeof subscribeToLiveQueryCollections>[0][number][] = [
		queries.rows,
		{
			collection: queries.rowsCollection,
			initialSnapshot: false,
		},
	]
	const parentSelectorKey = entitySelectorKey(
		context.schema,
		context.entityDefinitionByType[entityType],
		entitySelector
	)
	const nestedResourceBySelectorKey = new Map<string, SharedEntityResource>()
	const unsubscribeByNestedResource = new Map<SharedEntityResource, () => void>()
	const pendingNestedResourceSubscriptions = new Set<SharedEntityResource>()
	let nestedResourceUpdate: (() => void) | undefined
	const resource = registerClientResource(context, new TanStackLiveQueryResource(() => {
		const rowsFailure = queries.rowsFailure()
		const rowsFailed = (
			rowsFailure !== undefined
			&& queries.rows.data.length === 0
		)
		const requiredFieldResolvedEmpty = (
			queries.localAuthorityResolvedEmpty()
			&& !fieldCanCompleteEmpty(definition)
		)
		let fieldData = fieldDataFromRows(
			entityType,
			entitySelector,
			definition,
			queries.rows.data,
			queries.sourceCollection.utils.continuationForRows(
				parentSelectorKey,
				Object.fromEntries(Object.keys(Object.groupBy(
					queries.rows.data,
					(row) => row[EntityMetaKey.Source]
				)).map((source) => [
					source,
					queries.rows.data
						.filter((row) => row[EntityMetaKey.Source] === source)
						.map((row) => stringify([
							row[EntityMetaKey.Source],
							row[EntityMetaKey.ParentSelectorKey],
							row.facetPathKey,
							row.valueKey,
							row.valueIndex,
						])),
				])),
				queries.sources
			).find((continuation) => !continuation.metadata.terminal)
		)
		const nestedResources: SharedEntityResource[] = []
		if (
			(
				definition.type === EntityFieldType.EntityReference
				|| definition.type === EntityFieldType.EntitiesReference
			)
			&& effectiveSelection.fields !== undefined
		) {
			const selectedReference = (reference: object) => {
				const referencedEntitySelector = (
					Object.getOwnPropertyDescriptor(reference, EntityMetaKey.Selector)?.value
					?? reference
				)

				const nestedResourceKey = stringify([
					entitySelectorKey(
						context.schema,
						context.entityDefinitionByType[definition.entityType],
						referencedEntitySelector
					),
					Object.getOwnPropertyDescriptor(reference, EntityMetaKey.Source)?.value,
				])
				if (!nestedResourceBySelectorKey.has(nestedResourceKey))
					nestedResourceBySelectorKey.set(
						nestedResourceKey,
						subscribeEntitySelection(
							context,
							definition.entityType,
							referencedEntitySelector,
							{
								fields: effectiveSelection.fields,
								sources: (
									effectiveSelection.sources?.length === 1 ?
										effectiveSelection.sources
									:
										[Object.getOwnPropertyDescriptor(
											reference,
											EntityMetaKey.Source
										)?.value]
								),
								selectorSources: effectiveSelection.selectorSources,
							}
						)
					)

				const nestedResource = nestedResourceBySelectorKey.get(nestedResourceKey)
				if (nestedResource === undefined)
					return reference
				if (
					nestedResourceUpdate !== undefined
					&& !unsubscribeByNestedResource.has(nestedResource)
					&& !pendingNestedResourceSubscriptions.has(nestedResource)
				) {
					pendingNestedResourceSubscriptions.add(nestedResource)
					queueMicrotask(() => {
						pendingNestedResourceSubscriptions.delete(nestedResource)
						if (
							nestedResourceUpdate === undefined
							|| unsubscribeByNestedResource.has(nestedResource)
						)
							return

						unsubscribeByNestedResource.set(
							nestedResource,
							observeNestedResource(nestedResource, nestedResourceUpdate)
						)
						nestedResourceUpdate()
					})
				}

				nestedResources.push(nestedResource)
				return {
					...reference,
					...nestedResource.current?.fields,
					[EntityMetaKey.Selector]: referencedEntitySelector,
				}
			}

			if (
				fieldData !== undefined
				&& fieldData !== null
				&& typeof fieldData === 'object'
				&& 'values' in fieldData
				&& Array.isArray(fieldData.values)
			)
				fieldData = {
					...fieldData,
					values: fieldData.values.map(selectedReference),
					entities: fieldData.values.map(selectedReference),
				}
			else if (fieldData !== undefined && fieldData !== null && typeof fieldData === 'object')
				fieldData = selectedReference(fieldData)
		}
		return asQuerySnapshot(
			[{
				...queries.rows,
				isError: rowsFailed || requiredFieldResolvedEmpty,
				error: (
					rowsFailed ?
						new Error(rowsFailure.error)
					: requiredFieldResolvedEmpty ?
						requiredFieldResolvedEmptyError(entityType, definition)
					:
						undefined
				),
				isComplete: (
					rowsFailed
					|| requiredFieldResolvedEmpty
					|| (
						!queries.sourceHasUnsyncedMatches()
						&& (
							queries.localAuthorityResolvedEmpty()
							|| queries.sourceCollection.utils.isResolverSubsetResolved(
								parentSelectorKey,
								queries.sources
							)
							|| (
								(
									queries.rows.data.length > 0
									|| !queries.sourceCollection.isLoadingSubset
								)
								&& !queries.sourceCollection.utils.isResolverSubsetLoading(
									parentSelectorKey,
									queries.sources
								)
								&& fieldRowsComplete(
									entitySelector,
									definition,
									queries.rows.data,
									queries.rows.isReady,
									queries.sourceDisabled || queries.sourceUnsupported
								)
							)
						)
					)
				),
			}, ...nestedResources.map((nestedResource) => ({
				isError: nestedResource.error !== undefined,
				isLoading: nestedResource.loading,
				isReady: nestedResource.ready,
				status: (nestedResource.ready ? 'ready' : 'loading') satisfies CollectionStatus,
				error: nestedResource.error,
			} satisfies {
				isError: boolean
				isLoading: boolean
				isReady: boolean
				status: CollectionStatus
				error?: object | string
			}))],
			fieldData
		)
	}, (update) => {
		nestedResourceUpdate = update
		const unsubscribeLive = subscribeToLiveQueryCollections(
			observedQueries,
			update,
			context.collectionLoadFailures.subscribe
		)
		const unsubscribeSourceLoading = queries.sourceCollection.on('loadingSubset:change', update)
		const unsubscribeContinuationChanges = queries.sourceCollection.utils.subscribeContinuationChanges(update)
		const unsubscribeLocalMutationAuthorityChanges =
			queries.sourceCollection.utils.subscribeLocalMutationAuthorityChanges(update)
		const unsubscribeResolverSubsetLoadingChanges =
			queries.sourceCollection.utils.subscribeResolverSubsetLoadingChanges(update)
		const unsubscribeRowChanges = queries.sourceCollection.utils.subscribeRowChanges(update)
		return () => {
			nestedResourceUpdate = undefined
			pendingNestedResourceSubscriptions.clear()
			for (const unsubscribe of unsubscribeByNestedResource.values())
				unsubscribe()
			unsubscribeByNestedResource.clear()
			unsubscribeLive()
			unsubscribeSourceLoading()
			unsubscribeContinuationChanges()
			unsubscribeLocalMutationAuthorityChanges()
			unsubscribeResolverSubsetLoadingChanges()
			unsubscribeRowChanges()
		}
	}, () => waitForLiveQueryCollections(observedQueries)))
	if (sharedResourceKey !== undefined) {
		const resources = (
			sharedEntityFieldResourceByContext.get(context)
			?? new Map<string, SharedEntityFieldResource>()
		)
		resources.set(sharedResourceKey, resource)
		sharedEntityFieldResourceByContext.set(context, resources)
	}
	return resource
}

export const subscribeEntityFieldCount = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _FieldName extends EntityFieldName<_Schema, _EntityType>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: _FieldName,
	selection: {
		readonly sources?: readonly string[]
	} = {},
	fieldDefinition?: EntityFieldDefinition
): SvelteKitResource<number> => {
	const definition = fieldDefinition ?? context.entityDefinitionByType[entityType].fields
		.find((candidate) => candidate.name === fieldName)
	if (definition == null)
		throw new Error(`${entityType}.${fieldName} does not exist`)
	if (!entityFieldCardinalityIsMultiple(definition.cardinality))
		throw new Error(`${entityType}.${fieldName} does not have an independent count`)

	const facetPath = entityFieldFacetPath(definition)
	const facetPathKey = stringify(facetPath)
	const fieldAddressKey = entityFieldAddressKey(entityType, facetPath, fieldName)
	const countCollection = context.entityFieldCountCollections[entityType][fieldAddressKey]
	if (countCollection === undefined)
		throw new Error(`${entityType}.${fieldName} count collection does not exist`)

	const querySources = enabledSelectionSources(
		context,
		selection.sources ?? definition.defaultSources
	)
	const parentSelectorKey = entitySelectorKey(
		context.schema,
		context.entityDefinitionByType[entityType],
		entitySelector
	)
	const countSourcePriority = querySources ?? (
		context.resolverIndexes.resolverCountPartsByEntityTypeAndFieldName[fieldAddressKey] ?? []
	)
		.map((resolverPart) => String(resolverPart.source))
		.filter((source) => context.enabledSources.has(source))
	const countsCollection = createLiveQueryCollection({
		gcTime: 1,
		startSync: true,
		query: (query) => (
			query
				.from({
					row: countCollection,
				})
				.where(({ row }) => (
					querySources == null ?
						eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)
					:
						and(
							eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
							inArray(row[EntityMetaKey.Source], [...querySources])
						)
				))
				.where(({ row }) => eq(row.facetPathKey, facetPathKey))
				.where(({ row }) => eq(row.filterKey, stringify({})))
		),
	})
	const counts = liveQuerySnapshot(countsCollection)
	const observedQueries: Parameters<typeof subscribeToLiveQueryCollections>[0][number][] = [
		counts,
		{
			collection: countCollection,
			initialSnapshot: false,
		},
	]
	const localCountAuthorityKey = localMutationAuthorityKey({
		source: Source.Local_Internal,
		entityType,
		selectorKey: parentSelectorKey,
		fieldName,
		fieldAddressKey,
		facetPathKey,
		filterKey: stringify({}),
	})

	return registerClientResource(context, new TanStackLiveQueryResource(() => asQuerySnapshot(
		[{
			...counts,
			isComplete: (
				collectionLoadFailure(
					context,
					stringify([
						'client.counts',
						entityType,
						facetPath,
						fieldName,
					]),
					parentSelectorKey,
					querySources
				) !== undefined
				|| (
					!countCollection.utils.isResolverSubsetLoading(
						parentSelectorKey,
						querySources
					)
					&& (
						counts.isReady
						|| (
							(querySources == null || querySources.includes(Source.Local_Internal))
							&& countCollection.utils.hasLocalMutationAuthority(
								parentSelectorKey,
								localCountAuthorityKey
							)
						)
					)
				)
			),
		}],
		countSourcePriority
			.map((source) => counts.data.find((row) => row[EntityMetaKey.Source] === source))
			.find((row) => row !== undefined)?.[EntityMetaKey.Value] ?? 0
	), (update) => {
		const unsubscribeLive = subscribeToLiveQueryCollections(
			observedQueries,
			update,
			context.collectionLoadFailures.subscribe
		)
		const unsubscribeLocalMutationAuthority =
			countCollection.utils.subscribeLocalMutationAuthorityChanges(update)
		const unsubscribeResolverSubsetLoading =
			countCollection.utils.subscribeResolverSubsetLoadingChanges(update)
		return () => {
			unsubscribeLive()
			unsubscribeLocalMutationAuthority()
			unsubscribeResolverSubsetLoading()
		}
	}, () => waitForLiveQueryCollections(observedQueries)))
}

export function subscribeEntity<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection?: _Selection & (
		Schema extends _Schema ?
			_Selection
		:
			CheckedSubscribeSelection<_Schema, _EntityType, _Selection>
	)
): TanStackLiveQueryResource<EntityResourceData<_Schema, _EntityType, _Selection>>
export function subscribeEntity<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection: SubscribeSelection<_Schema, _EntityType> = {}
) {
	return subscribeEntitySelection(
		context,
		entityType,
		entitySelector,
		selection
	)
}

const subscribeEntitySelection = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection: SubscribeSelection<_Schema, _EntityType> = {}
) => {
	validateSubscribeSelection(
		context,
		entityType,
		selection
	)
	const sharedResourceKeys = (() => {
		try {
			return serializableEquivalentEntityResourceKeys(
				context,
				entityType,
				entitySelector,
				selection
			)
		} catch {
			return []
		}
	})()
	const sharedResource = sharedResourceKeys
		.map((sharedResourceKey) => sharedEntityResourceByContext.get(context)?.get(sharedResourceKey))
		.find((candidate) => candidate !== undefined)
	if (sharedResource !== undefined)
		return sharedResource

	const selectorSources = selection.selectorSources ?? selection.sources
	const querySources = enabledSelectionSources(context, selectorSources)
	const sourceDisabled = selectedSourcesDisabled(context, selectorSources)
	const selectorKey = entitySelectorKey(
		context.schema,
		context.entityDefinitionByType[entityType],
		entitySelector
	)
	const localEntityAuthorityKey = localMutationAuthorityKey({
		source: Source.Local_Internal,
		entityType,
		selectorKey,
	})
	const selectorIdentitySources = entityResolverSourcesForSelectorKeys(
		context.schema,
		context.entityDefinitionByType[entityType],
		[selectorKey],
		context.resolverIndexes.resolverDefinitionsByEntityType[entityType] ?? []
	)
	const entityRowsCollection = createLiveQueryCollection({
		gcTime: 1,
		startSync: true,
		query: (query) => (
			query
				.from({
					row: context.entityCollections[entityType],
				})
				.where(({ row }) => (
					querySources == null ?
						eq(row[EntityMetaKey.SelectorKey], selectorKey)
					:
						and(
							eq(row[EntityMetaKey.SelectorKey], selectorKey),
							inArray(row[EntityMetaKey.Source], [...querySources])
						)
				))
		),
	})
	const entityRows = liveQuerySnapshot(entityRowsCollection)
	const entityRowsFailure = () => collectionLoadFailure(
		context,
		`client.entities.${entityType}`,
		selectorKey,
		querySources
	)
	const localEntityResolvedEmpty = () => (
		(querySources == null || querySources.includes(Source.Local_Internal))
		&& context.entityCollections[entityType].utils.localMutationAuthorityRowCount(
			selectorKey,
			localEntityAuthorityKey
		) === 0
	)
	const selectedFields = (
		selection.fields === undefined ?
			entityFieldDefinitions(context.entityDefinitionByType[entityType])
				.map((definition) => ({
					fieldName: definition.name,
					definition,
					fieldSelection: undefined,
				}))
		:
			entityFieldDefinitions(context.entityDefinitionByType[entityType])
				.map((definition) => ({
					definition,
					fieldSelection: entityFieldFacetPath(definition).reduce<UncheckedSubscribeSelection>(
						(fields, facetName) => {
							const facetSelection = Object.getOwnPropertyDescriptor(
								fields.fields ?? {},
								facetName
							)?.value
							return facetSelection === true || facetSelection === undefined ? {} : facetSelection
						},
						{
							fields: selection.fields,
						}
					),
				}))
					.filter(({ definition, fieldSelection }) => Object.getOwnPropertyDescriptor(
						fieldSelection.fields ?? {},
						definition.name
					)?.value !== undefined)
					.map((definition) => ({
						fieldName: definition.definition.name,
						definition: definition.definition,
						fieldSelection: Object.getOwnPropertyDescriptor(
							definition.fieldSelection.fields ?? {},
							definition.definition.name
						)?.value,
					}))
	)
	const fields = selectedFields.map(({
		fieldName,
		definition,
		fieldSelection,
	}) => ({
		fieldName,
		definition,
		fieldSelection,
		queries: fieldResourceQueries(
			context,
			entityType,
			entitySelector,
			fieldName,
			definition,
			fieldSelection === true || fieldSelection === undefined ?
				{
					sources: selection.sources,
				}
			:
				{
					...fieldSelection,
					sources: fieldSelection.sources ?? selection.sources,
				}
		),
	}))

	const liveQueries = [
		entityRows,
		...fields.map(({ queries }) => queries.rows),
	]
	const observedQueries: Parameters<typeof subscribeToLiveQueryCollections>[0][number][] = [
		...liveQueries,
		{
			collection: context.entityCollections[entityType],
			initialSnapshot: false,
		},
		...fields.map(({
			queries,
		}): Parameters<typeof subscribeToLiveQueryCollections>[0][number] => ({
			collection: queries.rowsCollection,
			initialSnapshot: false,
		})),
	]
	const observedNestedCollections = new Set<object>()
	const nestedSelections: {
		entityType: EntityType<_Schema>
		facetPath: EntityFacetPath
		selection: UncheckedSubscribeSelection
	}[] = fields.flatMap(({
		definition,
		fieldSelection,
	}) => (
		(
			definition.type === EntityFieldType.EntityReference
			|| definition.type === EntityFieldType.EntitiesReference
		)
		&& fieldSelection !== undefined
		&& fieldSelection !== true ?
			[{
				entityType: definition.entityType,
				facetPath: [],
				selection: fieldSelection,
			}]
		:
			[]
	))
	for (let nestedSelection = nestedSelections.pop(); nestedSelection !== undefined; nestedSelection = nestedSelections.pop()) {
		const entityCollection = context.entityCollections[nestedSelection.entityType]
		if (!observedNestedCollections.has(entityCollection)) {
			observedNestedCollections.add(entityCollection)
			observedQueries.push({
				collection: entityCollection,
				initialSnapshot: false,
			})
		}

		for (const fieldOrFacetName of Object.keys(nestedSelection.selection.fields ?? {})) {
			const childSelection = Object.getOwnPropertyDescriptor(
				nestedSelection.selection.fields ?? {},
				fieldOrFacetName
			)?.value
			const nestedFieldAddressKey = entityFieldAddressKey(
				nestedSelection.entityType,
				nestedSelection.facetPath,
				fieldOrFacetName
			)
			const nestedFieldDefinition = context.entityFieldDefinitionByEntityTypePathAndName[nestedSelection.entityType][
				nestedFieldAddressKey
			]
			if (nestedFieldDefinition !== undefined) {
				const nestedFieldCollection = context.entityFieldCollections[nestedSelection.entityType][
					nestedFieldAddressKey
				]
				if (!observedNestedCollections.has(nestedFieldCollection)) {
					observedNestedCollections.add(nestedFieldCollection)
					observedQueries.push({
						collection: nestedFieldCollection,
						initialSnapshot: false,
					})
				}
				if (
					(
						nestedFieldDefinition.type === EntityFieldType.EntityReference
						|| nestedFieldDefinition.type === EntityFieldType.EntitiesReference
					)
					&& childSelection !== undefined
					&& childSelection !== true
				)
					nestedSelections.push({
						entityType: nestedFieldDefinition.entityType,
						facetPath: [],
						selection: childSelection,
					})

				continue
			}

			if (childSelection !== undefined && childSelection !== true)
				nestedSelections.push({
					entityType: nestedSelection.entityType,
					facetPath: [
						...nestedSelection.facetPath,
						fieldOrFacetName,
					],
					selection: childSelection,
				})
		}
	}
	const nestedResourceBySelection = new Map<object, Map<string, TanStackLiveQueryResource<EntityResourceData<Schema, EntityType<Schema>>>>>()
	const unsubscribeByNestedResource = new Map<SharedEntityResource, () => void>()
	const pendingNestedResourceSubscriptions = new Set<SharedEntityResource>()
	let nestedResourceUpdate: (() => void) | undefined

	const resource = registerClientResource(context, new TanStackLiveQueryResource(() => {
		const rowsFailure = entityRowsFailure()
		const rowsFailed = (
			rowsFailure !== undefined
			&& entityRows.data.length === 0
		)
		const entityMissing = (
			entityRows.data.length === 0
			&& localEntityResolvedEmpty()
		)
		const fieldValues: SubscribeMaterializedFields = {}
		const fieldValuesByAddress: Record<
			string,
			EntityFieldResourceData<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>
		> = {}
		const nestedResources: SvelteKitResource<EntityResourceData<Schema, EntityType<Schema>>>[] = []
		for (const {
			fieldName,
			definition,
			fieldSelection,
			queries,
		} of fields) {
			let fieldData = fieldDataFromRows(
				entityType,
				entitySelector,
				definition,
				queries.rows.data
			)
			if (
				(
					definition.type === EntityFieldType.EntityReference
					|| definition.type === EntityFieldType.EntitiesReference
				)
				&& fieldSelection !== undefined
				&& fieldSelection !== true
				) {
					const selectedReference = (reference: object) => {
						const referencedEntitySelector = (
							Object.getOwnPropertyDescriptor(reference, EntityMetaKey.Selector)?.value
							?? reference
						)

						const referencedEntitySelectorKey = entitySelectorKey(
							context.schema,
							context.entityDefinitionByType[definition.entityType],
							referencedEntitySelector
						)
						const nestedResourceKey = stringify([
							definition.entityType,
							referencedEntitySelectorKey,
							Object.getOwnPropertyDescriptor(reference, EntityMetaKey.Source)?.value,
						])
						if (!nestedResourceBySelection.has(fieldSelection))
							nestedResourceBySelection.set(fieldSelection, new Map())

						const nestedResourceBySelectorKey = nestedResourceBySelection.get(fieldSelection)
						if (nestedResourceBySelectorKey === undefined)
							return reference
						if (!nestedResourceBySelectorKey.has(nestedResourceKey))
							nestedResourceBySelectorKey.set(
								nestedResourceKey,
								subscribeEntity(
									context,
									definition.entityType,
									referencedEntitySelector,
									{
										...fieldSelection,
										sources: (
											fieldSelection.sources
											?? [Object.getOwnPropertyDescriptor(
												reference,
												EntityMetaKey.Source
											)?.value]
										),
									}
								)
							)

						const nestedResource = nestedResourceBySelectorKey.get(nestedResourceKey)
						if (nestedResource === undefined)
							return reference
						if (
							nestedResourceUpdate !== undefined
							&& !unsubscribeByNestedResource.has(nestedResource)
							&& !pendingNestedResourceSubscriptions.has(nestedResource)
						) {
							pendingNestedResourceSubscriptions.add(nestedResource)
							queueMicrotask(() => {
								pendingNestedResourceSubscriptions.delete(nestedResource)
								if (
									nestedResourceUpdate === undefined
									|| unsubscribeByNestedResource.has(nestedResource)
								)
									return

								unsubscribeByNestedResource.set(
									nestedResource,
									observeNestedResource(nestedResource, nestedResourceUpdate)
								)
								nestedResourceUpdate()
							})
						}

						nestedResources.push(nestedResource)
						return {
							...reference,
							...nestedResource.current?.fields,
							[EntityMetaKey.Selector]: referencedEntitySelector,
						}
				}
				if (
					fieldData !== undefined
					&& fieldData !== null
					&& typeof fieldData === 'object'
					&& 'values' in fieldData
					&& Array.isArray(fieldData.values)
				)
				{
					const selectedReferences = fieldData.values.map(selectedReference)
					fieldData = {
						...fieldData,
						values: selectedReferences,
						entities: selectedReferences,
					}
				}
				else if (fieldData !== undefined && fieldData !== null && typeof fieldData === 'object')
					fieldData = selectedReference(fieldData)
			}
			const facetPath = entityFieldFacetPath(definition)
			if (facetPath.length === 0)
				fieldValues[fieldName] = fieldData
			else {
				let fieldsAtPath = fieldValues
				for (const facetName of facetPath) {
					const facetResult: { fields: SubscribeMaterializedFields } = Object.getOwnPropertyDescriptor(
						fieldsAtPath,
						facetName
					)?.value ?? {
						fields: {},
					}
					fieldsAtPath[facetName] = facetResult
					fieldsAtPath = facetResult.fields
				}
				fieldsAtPath[fieldName] = fieldData
			}

			fieldValuesByAddress[entityFieldAddressKey(entityType, facetPath, fieldName)] = fieldData
		}

		return asQuerySnapshot(
			[
				{
					...entityRows,
					isError: rowsFailed || entityMissing,
					error: (
						rowsFailed ?
							new Error(rowsFailure.error)
						: entityMissing ?
							new Error(`${entityType} ${selectorKey} does not exist`)
						:
							undefined
					),
					isComplete: (
						rowsFailed
						|| entityMissing
						|| (
							fields.length > 0
							&& querySources?.includes(Source.Local_Internal) !== true
							&& selectorIdentitySources.length === 0
						)
						|| (
							!context.entityCollections[entityType].utils.isResolverSubsetLoading(
								selectorKey,
								querySources
							)
							&& (
								entityRows.data.length > 0
								|| sourceDisabled
								|| (
									(querySources == null || querySources.includes(Source.Local_Internal))
									&& context.entityCollections[entityType].utils.hasLocalMutationAuthority(
										selectorKey,
										localEntityAuthorityKey
									)
								)
								|| context.entityCollections[entityType].utils.isResolverSubsetResolved(
									selectorKey,
									querySources
								)
							)
						)
					),
				},
				...fields.map(({
					definition,
					queries,
				}) => {
					const fieldRowsFailure = queries.rowsFailure()
					const fieldRowsFailed = (
						fieldRowsFailure !== undefined
						&& queries.rows.data.length === 0
					)
					const requiredFieldResolvedEmpty = (
						queries.localAuthorityResolvedEmpty()
						&& !fieldCanCompleteEmpty(definition)
					)
					return {
						...queries.rows,
						isError: fieldRowsFailed || requiredFieldResolvedEmpty,
						error: (
							fieldRowsFailed ?
								new Error(fieldRowsFailure.error)
							: requiredFieldResolvedEmpty ?
								requiredFieldResolvedEmptyError(entityType, definition)
							:
								undefined
						),
						isComplete: (
							fieldRowsFailed
							|| requiredFieldResolvedEmpty
							|| (
								!queries.sourceHasUnsyncedMatches()
								&& (
									queries.localAuthorityResolvedEmpty()
									|| queries.sourceCollection.utils.isResolverSubsetResolved(
										selectorKey,
										queries.sources
									)
									|| (
										(
											queries.rows.data.length > 0
											|| !queries.sourceCollection.isLoadingSubset
										)
										&& !queries.sourceCollection.utils.isResolverSubsetLoading(
											selectorKey,
											queries.sources
										)
										&& fieldRowsComplete(
											entitySelector,
											definition,
											queries.rows.data,
											queries.rows.isReady,
											queries.sourceDisabled || queries.sourceUnsupported
										)
									)
								)
							)
						),
					}
				}),
				...nestedResources.map((nestedResource): {
					isError: boolean
					isLoading: boolean
					isReady: boolean
					status: CollectionStatus
					error: object | string | undefined
				} => ({
					isError: nestedResource.error !== undefined,
					isLoading: nestedResource.loading,
					isReady: nestedResource.ready,
					status: (nestedResource.ready ? 'ready' : 'loading') satisfies CollectionStatus,
					error: nestedResource.error,
				})),
			],
			{
				entityType,
				entitySelector,
				fields: fieldValues,
				fieldValuesByAddress,
				errors: [],
				...fieldValues,
			}
		)
	}, (update) => {
		nestedResourceUpdate = update
		const unsubscribeLive = subscribeToLiveQueryCollections(
			observedQueries,
			update,
			context.collectionLoadFailures.subscribe
		)
		const unsubscribeResolverSubsetLoadingChanges = [
			context.entityCollections[entityType],
			...fields.map(({ queries }) => queries.sourceCollection),
		].map((collection) => collection.utils.subscribeResolverSubsetLoadingChanges(update))
		const unsubscribeRowChanges = [
			context.entityCollections[entityType],
			...fields.map(({ queries }) => queries.sourceCollection),
		].map((collection) => collection.utils.subscribeRowChanges(update))
		const unsubscribeSourceLoadingChanges = fields.map(({ queries }) => (
			queries.sourceCollection.on('loadingSubset:change', update)
		))
		const unsubscribeLocalMutationAuthorities = [
			context.entityCollections[entityType],
			...fields.map(({ queries }) => queries.sourceCollection),
		].map((collection) => collection.utils.subscribeLocalMutationAuthorityChanges(update))
		return () => {
			nestedResourceUpdate = undefined
			pendingNestedResourceSubscriptions.clear()
			for (const unsubscribe of unsubscribeByNestedResource.values())
				unsubscribe()
			unsubscribeByNestedResource.clear()
			unsubscribeLive()
			for (const unsubscribe of unsubscribeLocalMutationAuthorities)
				unsubscribe()
			for (const unsubscribe of unsubscribeResolverSubsetLoadingChanges)
				unsubscribe()
			for (const unsubscribe of unsubscribeRowChanges)
				unsubscribe()
			for (const unsubscribe of unsubscribeSourceLoadingChanges)
				unsubscribe()
		}
	}, () => waitForLiveQueryCollections(observedQueries)))
	if (sharedResourceKeys.length > 0) {
		const resources = (
			sharedEntityResourceByContext.get(context)
			?? new Map<string, SharedEntityResource>()
		)
		for (const sharedResourceKey of sharedResourceKeys)
			resources.set(sharedResourceKey, resource)
		sharedEntityResourceByContext.set(context, resources)
	}
	return resource
}
