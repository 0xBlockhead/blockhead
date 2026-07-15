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
} from '$/schema/$schema.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
} from '$/schema/EntityField.ts'
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
	SubscribeFieldResult,
	SubscribeFieldSingleResult,
	SubscribeResult,
	SubscribeSelection,
} from '$/client/$client.svelte.ts'


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
			totalCount?: number
		}
	:
		SubscribeFieldResult<_Schema, _EntityType, _FieldName, _FieldSelection>
	| undefined
)

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

const subscribeToLiveQueryCollections = (
	queries: readonly {
		initialSnapshot?: boolean
		collection: {
			readonly status: CollectionStatus
			readonly isLoadingSubset: boolean
			onFirstReady(update: () => void): void
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
	const subscriptions = [
		subscribeToFailures(update),
	]

	for (const query of queries) {
		query.collection.onFirstReady(update)
		const subscription = (
			query.initialSnapshot === false ?
				query.collection.subscribeChanges(update, {
					onStatusChange: update,
				})
			:
				query.collection.subscribeChanges(update, {
					includeInitialState: true,
					onStatusChange: update,
				})
		)
		subscriptions.push(() => subscription.unsubscribe())
	}

	void (async () => {
		for (const query of queries) {
			if (query.initialSnapshot !== false && query.collection.status === 'idle')
				await query.collection.preload().catch(update)
		}
	})()

	return () => {
		for (const subscription of subscriptions)
			subscription()
	}
}

const waitForLiveQueryCollections = (
	queries: readonly {
		initialSnapshot?: boolean
		collection: {
			readonly status: CollectionStatus
			readonly isLoadingSubset: boolean
			onFirstReady(update: () => void): void
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
			if (!done())
				return

			for (const subscription of subscriptions)
				subscription()
			resolve()
		}

		for (const query of queries) {
			if (query.initialSnapshot === false)
				continue

			query.collection.onFirstReady(complete)
			subscriptions.push(query.collection.on('loadingSubset:change', complete))
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
		onFirstReady(update: () => void): void
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
	},
	data = () => collection.toArray
) => {
	const isReady = () => collection.status === 'ready'
	return {
		collection,
		get data() {
			return data()
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
	rows.length > 0
	|| selectorFieldValue(entitySelector, definition.name) !== undefined
	|| sourceDisabled
	|| (
		rowsUpdated
		&& fieldCanCompleteEmpty(definition)
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
	countRows: readonly EntityFieldCountCollectionItem<_Schema>[],
	countSourcePriority: readonly string[]
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
			__selectorKey: (
				EntityMetaKey.SelectorKey in record ?
					record[EntityMetaKey.SelectorKey]
				:
					stringify(selector)
			),
		}
	})
	const countRow = countSourcePriority
		.map((source) => countRows.find((row) => row[EntityMetaKey.Source] === source))
		.find((row) => row !== undefined)
	if (entityFieldCardinalityIsMultiple(definition.cardinality))
		return {
			entityType,
			entitySelector,
			fieldName: definition.name,
			values,
			entities: values,
			...(countRow != null && {
				totalCount: countRow[EntityMetaKey.Value],
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
	const valueResolverParts = context.resolverIndexes.resolverValuePartsByEntityTypeAndFieldName[fieldAddressKey] ?? []
	const countSourcePriority = enabledSelectionSources(
		context,
		selection.sources ?? definition.defaultSources
	) ?? (context.resolverIndexes.resolverCountPartsByEntityTypeAndFieldName[fieldAddressKey] ?? [])
		.map((resolverPart) => String(resolverPart.source))
		.filter((source) => context.enabledSources.has(source))
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
				built = built.where(() => selection.where)

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
	const countCollection = (
		selection.count === true ?
			context.entityFieldCountCollections[entityType][fieldAddressKey]
		:
			undefined
	)
	const counts = (
		countCollection === undefined ?
			undefined
		:
			createLiveQueryCollection({
				startSync: true,
				query: (query) => {
					let built = query
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
					if (selection.where != null)
						built = built.where(() => selection.where)

					return built
				},
			})
	)
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
		counts: counts === undefined ? undefined : liveQuerySnapshot(counts),
		countsFailure: () => collectionLoadFailure(
			context,
			stringify([
				'client.counts',
				entityType,
				entityFieldFacetPath(definition),
				fieldName,
			]),
			parentSelectorKey,
			querySources
		),
		countCollection,
		sourceDisabled: selectedSourcesDisabled(context, selection.sources),
		sourceUnsupported: !valueResolverParts.some((resolverPart) => (
			querySources == null
			|| querySources.includes(String(resolverPart.source))
		)),
		sources: querySources,
		countSourcePriority,
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
	fieldDefinition?: EntityFieldDefinition
): SvelteKitResource<EntityFieldResourceData<_Schema, _EntityType, _FieldName, _Selection>>
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
	fieldDefinition?: EntityFieldDefinition
) {
	const definition = fieldDefinition ?? context.entityDefinitionByType[entityType].fields
		.find((candidate) => candidate.name === fieldName)
	if (definition == null)
		throw new Error(`${entityType}.${fieldName} does not exist`)

	const queries = fieldResourceQueries(
		context,
		entityType,
		entitySelector,
		fieldName,
		definition,
		selection
	)

	const liveQueries = (
		queries.counts === undefined ?
			[queries.rows]
		:
			[
				queries.rows,
				queries.counts,
			]
	)
	const observedQueries: Parameters<typeof subscribeToLiveQueryCollections>[0][number][] = [
		...liveQueries,
		{
			collection: queries.rowsCollection,
			initialSnapshot: false,
		},
		...(queries.countCollection === undefined ? [] : [{
			collection: queries.countCollection,
			initialSnapshot: false,
		}]),
	]
	const parentSelectorKey = entitySelectorKey(
		context.schema,
		context.entityDefinitionByType[entityType],
		entitySelector
	)
	const facetPathKey = stringify(entityFieldFacetPath(definition))

	const sourceHasUnsyncedMatches = () => {
		if (queries.rows.data.length > 0)
			return false

		return queries.sourceCollection.toArray.some((row) => (
			row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
			&& row.facetPathKey === facetPathKey
			&& (
				queries.sources == null
				|| queries.sources.includes(row[EntityMetaKey.Source])
			)
		))
	}

	return new TanStackLiveQueryResource(() => asQuerySnapshot(
		[
			{
				...queries.rows,
				isComplete: (
					queries.rowsFailure() !== undefined
					|| (
						!queries.sourceCollection.isLoadingSubset
						&& !sourceHasUnsyncedMatches()
						&& fieldRowsComplete(
							entitySelector,
							definition,
							queries.rows.data,
							queries.rows.isReady,
							queries.sourceDisabled || queries.sourceUnsupported
						)
					)
				),
			},
			...(queries.counts === undefined ? [] : [
				{
					...queries.counts,
					isComplete: (
						queries.countsFailure() !== undefined
						|| queries.counts.isReady
					),
				},
			]),
		],
		fieldDataFromRows(
			entityType,
			entitySelector,
			definition,
			queries.rows.data,
			queries.counts?.data ?? [],
			queries.countSourcePriority
		)
	), (update) => {
		const unsubscribeLive = subscribeToLiveQueryCollections(
			observedQueries,
			update,
			context.collectionLoadFailures.subscribe
		)
		const unsubscribeSourceLoading = queries.sourceCollection.on('loadingSubset:change', update)
		return () => {
			unsubscribeLive()
			unsubscribeSourceLoading()
		}
	}, () => waitForLiveQueryCollections(observedQueries))
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
): SvelteKitResource<EntityResourceData<_Schema, _EntityType, _Selection>>
export function subscribeEntity<
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection: SubscribeSelection<_Schema, _EntityType> = {}
) {
	validateSubscribeSelection(
		context,
		entityType,
		selection
	)

	const selectorSources = selection.selectorSources ?? selection.sources
	const querySources = enabledSelectionSources(context, selectorSources)
	const sourceDisabled = selectedSourcesDisabled(context, selectorSources)
	const selectorKey = entitySelectorKey(
		context.schema,
		context.entityDefinitionByType[entityType],
		entitySelector
	)
	const entityRowsCollection = createLiveQueryCollection({
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
		...fields.flatMap(({ queries }) => (
			queries.counts === undefined ?
				[queries.rows]
			:
				[
					queries.rows,
					queries.counts,
				]
		)),
	]
	const observedQueries: Parameters<typeof subscribeToLiveQueryCollections>[0][number][] = [
		...liveQueries,
		{
			collection: context.entityCollections[entityType],
			initialSnapshot: false,
		},
		...fields.flatMap(({ queries }) => [
			{
				collection: queries.rowsCollection,
				initialSnapshot: false,
			},
			...(queries.countCollection === undefined ? [] : [{
				collection: queries.countCollection,
				initialSnapshot: false,
			}]),
		]),
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
	const nestedResourceBySelectorKey = new Map<string, SvelteKitResource<EntityResourceData<Schema, EntityType<Schema>>>>()

	return new TanStackLiveQueryResource(() => {
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
				queries.rows.data,
				queries.counts?.data ?? [],
				queries.countSourcePriority
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
					const referencedEntitySelector = Object.getOwnPropertyDescriptor(reference, 'entitySelector')?.value
					const nestedResourceKey = stringify([
						definition.entityType,
						referencedEntitySelector,
						fieldSelection,
					])
					if (!nestedResourceBySelectorKey.has(nestedResourceKey))
						nestedResourceBySelectorKey.set(
							nestedResourceKey,
							subscribeEntity(
								context,
								definition.entityType,
								referencedEntitySelector,
								fieldSelection
							)
						)

					const nestedResource = nestedResourceBySelectorKey.get(nestedResourceKey)
					if (nestedResource === undefined)
						return reference

					nestedResources.push(nestedResource)
					return {
						...reference,
						...nestedResource.current?.fields,
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
					isComplete: (
						entityRowsFailure() !== undefined
						|| selection.fields !== undefined
						|| fields.length === 0
						|| entityRows.data.length > 0
						|| sourceDisabled
						|| context.entityCollections[entityType].utils.dataUpdatedAt > 0
					),
				},
				...fields.flatMap(({
					definition,
					queries,
				}) => (
					queries.counts === undefined ?
						[{
							...queries.rows,
							isComplete: (
								queries.rowsFailure() !== undefined
								|| fieldRowsComplete(
									entitySelector,
									definition,
									queries.rows.data,
									queries.rows.isReady,
									queries.sourceDisabled || queries.sourceUnsupported
								)
							),
						}]
					:
						[
							{
								...queries.rows,
								isComplete: (
									queries.rowsFailure() !== undefined
									|| fieldRowsComplete(
										entitySelector,
										definition,
										queries.rows.data,
										queries.rows.isReady,
										queries.sourceDisabled || queries.sourceUnsupported
									)
								),
							},
							{
								...queries.counts,
								isComplete: (
									queries.countsFailure() !== undefined
									|| queries.counts.isReady
								),
							},
						]
				)),
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
	}, (update) => subscribeToLiveQueryCollections(
		observedQueries,
		update,
		context.collectionLoadFailures.subscribe
	), () => waitForLiveQueryCollections(observedQueries))
}
