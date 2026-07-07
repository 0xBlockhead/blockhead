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
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	type EntityFieldDefinition,
	type EntityFieldDefinitionByName,
	type EntityFieldName,
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
	DeclarativeOrderBy,
	EntityFieldCollectionItem,
	EntityFieldCountCollectionItem,
	SubscribeFieldResult,
	SubscribeFieldSingleResult,
	SubscribeResult,
	SubscribeSelection,
} from '$/client/$client.svelte.ts'


enum FieldConditionState {
	Active = 'active',
	Inactive = 'inactive',
	Unconditional = 'unconditional',
	Unknown = 'unknown',
}

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
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		{
			entityType: _EntityType
			entitySelector: EntitySelector<_Schema, _EntityType>
			fieldName: _FieldName
			values: readonly SubscribeFieldSingleResult<_Schema, _EntityType, _FieldName>[]
			entities: readonly SubscribeFieldSingleResult<_Schema, _EntityType, _FieldName>[]
			totalCount?: number
		}
	:
		SubscribeFieldResult<_Schema, _EntityType, _FieldName>
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
	]

	for (const query of queries) {
		query.collection.onFirstReady(update)
		const subscription = query.collection.subscribeChanges(update, {
			includeInitialState: true,
			onStatusChange: update,
		})
		subscriptions.push(subscription.unsubscribe)
	}

	void (async () => {
		for (const query of queries) {
			if (query.collection.status === 'idle')
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
		}
		void (async () => {
			for (const query of queries) {
				if (query.collection.status === 'idle')
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

const fieldConditionValue = <
	const _Schema extends Schema
>(
	entitySelector: object,
	rows: readonly EntityFieldCollectionItem<_Schema>[],
	condition: NonNullable<EntityFieldDefinition['when']>
) => {
	const selectorValue = selectorFieldValue(entitySelector, condition.fieldName)
	if (selectorValue !== undefined)
		return (
			condition.itemIndex === undefined ?
				selectorValue
			:
				Object(selectorValue)[condition.itemIndex]
		)

	for (const row of rows.toReversed()) {
		if (condition.itemIndex === undefined)
			return row[EntityMetaKey.Value]

		if (row.valueIndex === condition.itemIndex)
			return row[EntityMetaKey.Value]
	}

	return undefined
}

const fieldConditionState = <
	const _Schema extends Schema
>(
	entitySelector: object,
	rows: readonly EntityFieldCollectionItem<_Schema>[],
	definition: EntityFieldDefinition
) => {
	if (definition.when === undefined)
		return FieldConditionState.Unconditional

	const value = fieldConditionValue(entitySelector, rows, definition.when)
	return (
		value === undefined ?
			FieldConditionState.Unknown
		: definition.when.values.some((conditionValue) => conditionValue === value) ?
			FieldConditionState.Active
		:
			FieldConditionState.Inactive
	)
}

const fieldCanCompleteEmpty = <
	const _Schema extends Schema
>(
	entitySelector: object,
	rows: readonly EntityFieldCollectionItem<_Schema>[],
	definition: EntityFieldDefinition
) => {
	const conditionState = fieldConditionState(entitySelector, rows, definition)
	return (
		definition.cardinality === EntityFieldCardinality.Zero
		|| definition.cardinality === EntityFieldCardinality.ZeroOrOne
		|| conditionState === FieldConditionState.Inactive
		|| (
			conditionState !== FieldConditionState.Unknown
			&& (
				definition.cardinality === EntityFieldCardinality.Many
				|| definition.cardinality === EntityFieldCardinality.ZeroOrMany
			)
		)
	)
}

const fieldRowParentPredicate = <
	_Row extends {
		[EntityMetaKey.ParentSelectorKey]: string
		[EntityMetaKey.Source]: string
	}
>(
	row: _Row,
	parentSelectorKey: string,
	querySources: readonly string[] | undefined
) => (
	querySources == null ?
		eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)
	:
		and(
			eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
			inArray(row[EntityMetaKey.Source], [...querySources])
		)
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
	conditionRows: readonly EntityFieldCollectionItem[],
	rowsUpdated: boolean,
	sourceDisabled: boolean
) => (
	rows.length > 0
	|| selectorFieldValue(entitySelector, definition.name) !== undefined
	|| sourceDisabled
	|| (
		(
			rowsUpdated
			|| definition.when !== undefined
		)
		&& fieldCanCompleteEmpty(entitySelector, conditionRows, definition)
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
	count = false
) => {
	const definition = entityFieldDefinitions(context.entityDefinitionByType[entityType])
		.find((candidate) => candidate.name === fieldName)
	if (definition == null)
		throw new Error(`${entityType}.${fieldName} does not exist`)

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
	if (entityFieldCardinalityIsMultiple(definition.cardinality))
		return {
			entityType,
			entitySelector,
			fieldName,
			values,
			entities: values,
			...(countRows.length > 0 && {
				totalCount: countRows[0][EntityMetaKey.Value],
			}),
		}

	if (values[0] !== undefined)
		return values[0]

	const selectorValue = selectorFieldValue(entitySelector, fieldName)
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
	const parentSelectorKey = entitySelectorKey(
		context.schema,
		context.entityDefinitionByType[entityType],
		entitySelector
	)
	const fieldCollection = context.entityFieldCollections[entityType][fieldName]
	const rowsCollection = createLiveQueryCollection({
		startSync: true,
		query: (query) => {
			let built = query
				.from({
					row: fieldCollection,
				})
				.where(({ row }) => (
					selection.where == null ?
						querySources == null ?
							eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)
						:
							and(
								eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
								inArray(row[EntityMetaKey.Source], [...querySources])
							)
					:
						and(
							querySources == null ?
								eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)
							:
								and(
									eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
									inArray(row[EntityMetaKey.Source], [...querySources])
								),
							selection.where
						)
				))
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
			context.entityFieldCountCollections[entityType][fieldName]
		:
			undefined
	)
	const condition = definition.when
	const counts = (
		countCollection === undefined ?
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
							selection.where == null ?
								and(
									querySources == null ?
										eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)
									:
										and(
											eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
											inArray(row[EntityMetaKey.Source], [...querySources])
										),
									eq(row.filterKey, stringify({}))
								)
							:
								and(
									querySources == null ?
										eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey)
									:
										and(
											eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey),
											inArray(row[EntityMetaKey.Source], [...querySources])
										),
									eq(row.filterKey, stringify({})),
									selection.where
								)
						))
				),
			})
	)
	const conditionRows = (
		condition === undefined ?
			undefined
		:
			createLiveQueryCollection({
				startSync: true,
				query: (query) => (
					query
						.from({
							row: context.entityFieldCollections[entityType][condition.fieldName],
						})
						.where(({ row }) => eq(row[EntityMetaKey.ParentSelectorKey], parentSelectorKey))
				),
			})
	)
	return {
		rows: liveQuerySnapshot(rowsCollection),
		rowsFailure: () => collectionLoadFailure(
			context,
			`client.fields.${entityType}.${fieldName}`,
			parentSelectorKey,
			querySources
		),
		rowsCollection: fieldCollection,
		counts: counts === undefined ? undefined : liveQuerySnapshot(counts),
		conditionRows: conditionRows === undefined ? undefined : liveQuerySnapshot(conditionRows),
		countsFailure: () => collectionLoadFailure(
			context,
			`client.counts.${entityType}.${fieldName}`,
			parentSelectorKey,
			querySources
		),
		countCollection,
		sourceDisabled: selectedSourcesDisabled(context, selection.sources),
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
	selection: SubscribeSelection<
		_Schema,
		_EntityType,
		Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema>>>
	> = {}
) => {
	const definition = entityFieldDefinitions(context.entityDefinitionByType[entityType])
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
			[
				queries.rows,
				...(queries.conditionRows === undefined ? [] : [queries.conditionRows]),
			]
		:
			[
				queries.rows,
				...(queries.conditionRows === undefined ? [] : [queries.conditionRows]),
				queries.counts,
			]
	)

	return new TanStackLiveQueryResource(() => asQuerySnapshot(
		[
			{
				...queries.rows,
				isComplete: (
					queries.rowsFailure() !== undefined
					|| fieldRowsComplete(
						entitySelector,
						definition,
						queries.rows.data,
						queries.conditionRows?.data ?? [],
						queries.rows.isReady,
						queries.sourceDisabled
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
			context,
			entityType,
			entitySelector,
			fieldName,
			queries.rows.data,
			queries.counts?.data ?? [],
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
				[
					queries.rows,
					...(queries.conditionRows === undefined ? [] : [queries.conditionRows]),
				]
			:
				[
					queries.rows,
					...(queries.conditionRows === undefined ? [] : [queries.conditionRows]),
					queries.counts,
				]
		)),
	]

	return new TanStackLiveQueryResource(() => {
		const fieldValues: Record<
			string,
			EntityFieldResourceData<_Schema, _EntityType, EntityFieldName<_Schema, _EntityType>>
		> = {}
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
				fieldSelection !== true
				&& fieldSelection !== undefined
				&& fieldSelection.count === true
			)

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
									queries.conditionRows?.data ?? [],
									queries.rows.isReady,
									queries.sourceDisabled
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
										queries.conditionRows?.data ?? [],
										queries.rows.isReady,
										queries.sourceDisabled
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
