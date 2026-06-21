import {
	and,
	createLiveQueryCollection,
	eq,
	inArray,
	type CollectionStatus,
} from '@tanstack/db'
import { stringify } from 'devalue'

import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	type EntityFieldDefinition,
	type EntityFieldName,
	type EntityFieldResolvedValue,
	type EntityFieldSingleResolvedValue,
	type EntitySelector,
	type EntityType,
	type Schema,
	entityFieldCardinalityIsMultiple,
	entityFieldDefinitions,
	entitySelectorKey,
} from '$/schema/$schema.ts'
import {
	TanStackLiveQueryResource,
	type TanStackLiveQuerySnapshot,
} from '$/lib/db/queryResource.svelte.ts'
import type {
	ClientContext,
	EntityFieldCollectionItem,
	EntityFieldCountCollectionItem,
	EntityCollectionItem,
	SubscribeResult,
	SubscribeSelection,
} from '$/client/$client.svelte.ts'


export type EntityResourceData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = SubscribeResult<_Schema, _EntityType, _Selection>

export type EntityFieldResourceData<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	| (
		EntityFieldResolvedValue<_Schema, _EntityType, _FieldName> extends readonly EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>[] ?
			{
				entityType: _EntityType
				entitySelector: EntitySelector<_Schema, _EntityType>
				fieldName: _FieldName
				values: readonly EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>[]
				entities: readonly EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>[]
				totalCount?: number
			}
		:
		EntityFieldResolvedValue<_Schema, _EntityType, _FieldName>
	)
	| undefined
	| null
	| object
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
				options: {
					includeInitialState: true
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
		...queries.flatMap((query) => {
		query.collection.onFirstReady(update)
		const subscription = query.collection.subscribeChanges(update, {
			includeInitialState: true,
			onStatusChange: update,
		})
		if (query.collection.status === 'idle')
			query.collection.preload().catch(update)

			return [
				subscription.unsubscribe,
			]
		}),
	]
	return () => {
		for (const subscription of subscriptions)
			subscription()
	}
}

const waitForLiveQueryCollections = (
	queries: readonly {
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
				query.collection.status === 'ready'
				&& !query.collection.isLoadingSubset
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
			query.collection.onFirstReady(complete)
			subscriptions.push(query.collection.on('loadingSubset:change', complete))
			if (query.collection.status === 'idle')
				query.collection.preload().catch(complete)
		}
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

const fieldConditionValue = <
	const _Schema extends Schema
>(
	entityRows: readonly EntityCollectionItem<_Schema>[],
	condition: NonNullable<EntityFieldDefinition['when']>
) => {
	for (const row of entityRows.toReversed()) {
		const value = row[EntityMetaKey.Fields][condition.fieldName]
		if (value === undefined)
			continue

		return (
			condition.itemIndex === undefined ?
				value
			: Array.isArray(value) ?
				value[condition.itemIndex]
			:
				undefined
		)
	}

	return undefined
}

const fieldConditionState = <
	const _Schema extends Schema
>(
	entityRows: readonly EntityCollectionItem<_Schema>[],
	definition: EntityFieldDefinition
) => {
	if (definition.when === undefined)
		return true

	const value = fieldConditionValue(entityRows, definition.when)
	return (
		value === undefined ?
			undefined
		:
			definition.when.values.some((conditionValue) => conditionValue === value)
	)
}

const fieldCanCompleteEmpty = <
	const _Schema extends Schema
>(
	entityRows: readonly EntityCollectionItem<_Schema>[],
	definition: EntityFieldDefinition
) => {
	const conditionState = fieldConditionState(entityRows, definition)
	return (
		conditionState === false
		|| definition.cardinality === EntityFieldCardinality.Zero
		|| definition.cardinality === EntityFieldCardinality.ZeroOrOne
		|| definition.cardinality === EntityFieldCardinality.Many
		|| definition.cardinality === EntityFieldCardinality.ZeroOrMany
	)
}

const fieldHasEntityRowValue = <
	const _Schema extends Schema
>(
	entityRows: readonly EntityCollectionItem<_Schema>[],
	fieldName: string
) => entityRows.some((row) => row[EntityMetaKey.Fields][fieldName] !== undefined)

const selectorFieldValue = (
	entitySelector: object,
	fieldName: string
) => Object.getOwnPropertyDescriptor(entitySelector, fieldName)?.value

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
	entityRows: readonly EntityCollectionItem<_Schema>[],
	entitySelector: object,
	definition: EntityFieldDefinition,
	rows: readonly EntityFieldCollectionItem[],
	rowsUpdated: boolean,
	sourceDisabled: boolean
) => (
	rows.length > 0
	|| selectorFieldValue(entitySelector, definition.name) !== undefined
	|| fieldHasEntityRowValue(entityRows, definition.name)
	|| sourceDisabled
	|| (
		rowsUpdated
		&& fieldCanCompleteEmpty(entityRows, definition)
	)
)

const fieldDataFromRows = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: EntityFieldName<_Schema, _EntityType>,
	rows: readonly EntityFieldCollectionItem<_Schema>[],
	countRows: readonly EntityFieldCountCollectionItem<_Schema>[],
	entityRows: readonly EntityCollectionItem<_Schema, _EntityType>[] = [],
	sources?: readonly string[],
	count = false
) => {
	const definition = entityFieldDefinitions(context.entityDefinitionByType[entityType])
		.find((candidate) => candidate.name === fieldName)
	if (definition == null)
		throw new Error(`${entityType}.${fieldName} does not exist`)

	const values = rows.map((row) => {
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
	if (entityFieldCardinalityIsMultiple(definition.cardinality))
		return {
			entityType,
			entitySelector,
			fieldName,
			values,
			entities: values,
			...((count || countRows.length > 0) && {
				totalCount: countRows[0]?.[EntityMetaKey.Value] ?? values.length,
			}),
		}

	if (values[0] !== undefined)
		return values[0]

	const selectorValue = selectorFieldValue(entitySelector, fieldName)
	if (selectorValue !== undefined)
		return selectorValue

	for (const source of sources ?? []) {
		for (const row of entityRows.toReversed()) {
			if (
				row[EntityMetaKey.Source] === source
				&& row[EntityMetaKey.Fields][fieldName] !== undefined
			)
				return row[EntityMetaKey.Fields][fieldName]
		}
	}

	for (const row of entityRows.toReversed()) {
		if (row[EntityMetaKey.Fields][fieldName] !== undefined)
			return row[EntityMetaKey.Fields][fieldName]
	}

	return undefined
}

const fieldResourceQueries = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: EntityFieldName<_Schema, _EntityType>,
	sources: readonly string[] | undefined,
	count: boolean
) => {
	const querySources = enabledSelectionSources(context, sources)
	const parentSelectorKey = entitySelectorKey(
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
							eq(row[EntityMetaKey.SelectorKey], parentSelectorKey)
						:
							and(
								eq(row[EntityMetaKey.SelectorKey], parentSelectorKey),
								inArray(row[EntityMetaKey.Source], [...querySources])
							)
					))
			),
	})
	const rowsCollection = createLiveQueryCollection({
		startSync: true,
		query: (query) => (
			query
					.from({
						row: context.entityFieldCollections[entityType][fieldName],
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
			),
	})
	const countCollection = (
		count ?
			context.entityFieldCountCollections[entityType][fieldName]
		:
			undefined
	)
		const counts = countCollection === undefined ?
			undefined
		:
			createLiveQueryCollection({
			startSync: true,
			query: (query) => (
				query
					.from({
						row: countCollection,
					})
					.where(({ row }) => (
						querySources == null ?
							and(
								eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
								eq(row.filterKey, stringify({}))
							)
						:
							and(
								eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
								eq(row.filterKey, stringify({})),
								inArray(row[EntityMetaKey.Source], [...querySources])
							)
					))
					),
			})
		return {
			entityRows: liveQuerySnapshot(entityRowsCollection),
			entityRowsFailure: () => collectionLoadFailure(
				context,
				`client.entities.${entityType}`,
				parentSelectorKey,
				querySources
			),
			entityRowsCollection: context.entityCollections[entityType],
				rows: liveQuerySnapshot(rowsCollection),
				rowsFailure: () => collectionLoadFailure(
					context,
					`client.fields.${entityType}.${fieldName}`,
					parentSelectorKey,
					querySources
				),
				rowsCollection: context.entityFieldCollections[entityType][fieldName],
				counts: counts === undefined ? undefined : liveQuerySnapshot(counts),
				countsFailure: () => collectionLoadFailure(
					context,
					`client.counts.${entityType}.${fieldName}`,
					parentSelectorKey,
					querySources
				),
				countCollection,
				sourceDisabled: selectedSourcesDisabled(context, sources),
				sources: querySources,
			}
	}

export const subscribeEntityField = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>,
	const _FieldName extends EntityFieldName<_Schema, _EntityType>
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	fieldName: _FieldName,
	selection: SubscribeSelection<_Schema, _EntityType> = {}
) => {
	const definition = entityFieldDefinitions(context.entityDefinitionByType[entityType])
		.find((candidate) => candidate.name === fieldName)
	if (definition == null)
		throw new Error(`${entityType}.${fieldName} does not exist`)
	const sourceDisabled = selectedSourcesDisabled(context, selection.sources)

	const queries = fieldResourceQueries(
			context,
			entityType,
			entitySelector,
			fieldName,
			selection.sources,
			selection.count === true
		)

	const liveQueries = (
		queries.counts === undefined ?
			[
				queries.entityRows,
				queries.rows,
			]
		:
			[
				queries.entityRows,
				queries.rows,
				queries.counts,
			]
	)

	return new TanStackLiveQueryResource(() => asQuerySnapshot(
		queries.counts === undefined ?
			[{
						...queries.rows,
						...(queries.rowsFailure() !== undefined && {
							isComplete: true,
						}),
						isComplete: (
						fieldRowsComplete(
							queries.entityRows.data,
							entitySelector,
								definition,
								queries.rows.data,
								queries.rows.isReady,
								sourceDisabled
							)
						),
					}]
		:
			[
					{
						...queries.rows,
						...(queries.rowsFailure() !== undefined && {
							isComplete: true,
						}),
								isComplete: (
								fieldRowsComplete(
									queries.entityRows.data,
									entitySelector,
										definition,
										queries.rows.data,
										queries.rows.isReady,
										sourceDisabled
									)
								),
							},
					{
						...queries.counts,
						...(queries.countsFailure() !== undefined && {
							isComplete: true,
						}),
						isComplete: (
						queries.countCollection === undefined
						|| queries.counts.isReady
					),
				},
			],
		fieldDataFromRows(
			context,
			entityType,
			entitySelector,
			fieldName,
			queries.rows.data,
			queries.counts?.data ?? [],
			queries.entityRows.data,
			queries.sources,
			selection.count === true
		)
	), (update) => subscribeToLiveQueryCollections(
		liveQueries,
		update,
		context.collectionLoadFailures.subscribe
	), () => waitForLiveQueryCollections(liveQueries))
}

export const subscribeEntity = <
	const _Schema extends Schema,
	const _EntityType extends EntityType<_Schema>
>(
	context: ClientContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection: SubscribeSelection<_Schema, _EntityType> = {}
	) => {
		const querySources = enabledSelectionSources(context, selection.sources)
		const sourceDisabled = selectedSourcesDisabled(context, selection.sources)
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
	const selectedFields: {
		fieldName: EntityFieldName<_Schema, _EntityType>
		definition: EntityFieldDefinition
		fieldSelection: true | SubscribeSelection<_Schema, _EntityType> | undefined
	}[] = (
		selection.fields === undefined ?
				entityFieldDefinitions(context.entityDefinitionByType[entityType])
					.map((definition) => ({
						fieldName: definition.name,
						definition,
						fieldSelection: undefined,
					}))
		:
				entityFieldDefinitions(context.entityDefinitionByType[entityType])
					.filter((definition) => selection.fields?.[definition.name] !== undefined)
					.map((definition) => ({
						fieldName: definition.name,
						definition,
						fieldSelection: selection.fields?.[definition.name],
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
				fieldSelection === true || fieldSelection === undefined ?
					selection.sources
				:
					fieldSelection.sources ?? selection.sources,
				fieldSelection !== true
				&& fieldSelection !== undefined
				&& fieldSelection.count === true
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

	return new TanStackLiveQueryResource(() => {
		const fieldValues: EntityCollectionItem<_Schema, _EntityType>[typeof EntityMetaKey.Fields] = {}
		for (const {
			fieldName,
			fieldSelection,
			queries,
		} of fields)
			fieldValues[fieldName] = fieldDataFromRows(
				context,
				entityType,
				entitySelector,
				fieldName,
					queries.rows.data,
					queries.counts?.data ?? [],
					entityRows.data,
					queries.sources,
					fieldSelection !== true
					&& fieldSelection !== undefined
					&& fieldSelection.count === true
				)

		return asQuerySnapshot(
			[
					{
						...entityRows,
						...(entityRowsFailure() !== undefined && {
							isComplete: true,
						}),
						isComplete: (
								selection.fields !== undefined
							|| fields.length === 0
							|| entityRows.data.length > 0
							|| sourceDisabled
							|| context.entityCollections[entityType].utils.dataUpdatedAt > 0
					),
				},
				...fields.flatMap(({
					fieldName,
					definition,
					queries,
				}) => (
					queries.counts === undefined ?
							[{
								...queries.rows,
								...(queries.rowsFailure() !== undefined && {
									isComplete: true,
								}),
									isComplete: fieldRowsComplete(
									entityRows.data,
									entitySelector,
										definition,
										queries.rows.data,
										queries.rows.isReady,
										queries.sourceDisabled
									),
								}]
					:
						[
								{
									...queries.rows,
									...(queries.rowsFailure() !== undefined && {
										isComplete: true,
									}),
									isComplete: fieldRowsComplete(
									entityRows.data,
									entitySelector,
									definition,
									queries.rows.data,
									queries.rows.isReady,
									queries.sourceDisabled
								),
							},
								{
									...queries.counts,
									...(queries.countsFailure() !== undefined && {
										isComplete: true,
									}),
									isComplete: (
									queries.countCollection === undefined
									|| queries.counts.isReady
								),
							},
						]
				)),
			],
			{
				entityType,
				entitySelector,
				fields: fieldValues,
				errors: [],
				...fieldValues,
			}
		)
	}, (update) => subscribeToLiveQueryCollections(
		liveQueries,
		update,
		context.collectionLoadFailures.subscribe
	), () => waitForLiveQueryCollections(liveQueries))
}
