import { createLiveQueryCollection, eq, inArray } from '@tanstack/db'
import type { LoadSubsetOptions } from '@tanstack/db'
import { type as arktype } from 'arktype'
import { stringify } from 'devalue'
import { tick, untrack } from 'svelte'
import { createSubscriber } from 'svelte/reactivity'

import {
	countFilterKey,
	defaultFieldOrderBySteps,
	fieldResultValueKey,
	isDeclarativeFieldOrderBy,
	isProductSingleFieldValue,
	validateResolverFieldValue,
	type DeclarativeOrderBy,
	type EntityCollectionItem,
	type EntityCollectionsContext,
	type EntityFieldCollectionItem,
} from '$/client/$client.svelte.ts'
import { parseResolverSubset } from '$/resolvers/$resolvers.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	entityFieldCardinalityIsMultiple,
	entitySelectorKey,
	entitySelectorsFromFields,
	parseEntitySelector,
	type EntityFieldCondition,
	type EntityFieldDefinition,
	type EntityFieldDefinitionByName,
	type EntityFieldName,
	type EntityFieldResolvedValue,
	type EntityFieldSingleResolvedValue,
	type EntityFieldValues,
	type EntitySelector,
	type EntityType as EntityTypeName,
	type Schema,
} from '$/schema/$schema.ts'


export type SubscribeFieldSelection<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = Omit<LoadSubsetOptions, 'orderBy'> & {
	readonly orderBy?: LoadSubsetOptions['orderBy'] | DeclarativeOrderBy<EntityFieldCollectionItem<
		_Schema,
		EntityTypeName<_Schema>,
		EntityFieldName<_Schema, EntityTypeName<_Schema>>
	>>
	readonly sources?: readonly string[]
	readonly count?: boolean
	readonly fields?: SubscribeSelectedFields<_Schema, EntityTypeName<_Schema>>
	readonly selectorSources?: readonly string[]
}

export type SubscribeSelectedFields<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = Partial<Record<string, true | SubscribeFieldSelection<_Schema, _EntityType>>> & Partial<{
	readonly [
		_FieldName in EntityFieldName<_Schema, _EntityType>
	]: true | SubscribeFieldSelection<_Schema, _EntityType>
}>

export type SubscribeSelection<
	_Schema extends Schema = Schema,
	_EntityType extends EntityTypeName<_Schema> = EntityTypeName<_Schema>,
> = Omit<LoadSubsetOptions, 'orderBy'> & {
	readonly orderBy?: LoadSubsetOptions['orderBy'] | DeclarativeOrderBy<EntityFieldCollectionItem<
		_Schema,
		EntityTypeName<_Schema>,
		EntityFieldName<_Schema, EntityTypeName<_Schema>>
	>>
	readonly sources?: readonly string[]
	readonly fields?: SubscribeSelectedFields<_Schema, _EntityType>
}

export type SubscribeError<_Schema extends Schema = Schema> = {
	readonly selectorAddress: readonly string[]
	readonly dimension: 'entity' | 'field' | 'count' | 'nested' | 'query'
	readonly entityType: EntityTypeName<_Schema>
	readonly entitySelector: object
	readonly fieldName?: string
	readonly message: string
}

type SubscribeFieldResult<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
	_FieldSelection,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
		readonly entityType: infer _ReferencedEntityType extends EntityTypeName<_Schema>
	} ?
		{
			readonly values: readonly (
				_FieldSelection extends {
					readonly fields: SubscribeSelectedFields<_Schema, _ReferencedEntityType>
				} ?
					EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
				:
					EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
			)[]
			readonly entities: _FieldSelection extends {
				readonly fields: SubscribeSelectedFields<_Schema, _ReferencedEntityType>
			} ?
					readonly SubscribeResult<_Schema, _ReferencedEntityType, {
						readonly fields: _FieldSelection['fields']
					}>[]
			:
				never
			readonly totalCount?: number
		}
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		{
			readonly values: readonly EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>[]
			readonly totalCount?: number
		}
	: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly entityType: infer _ReferencedEntityType extends EntityTypeName<_Schema>
	} ?
		_FieldSelection extends {
			readonly fields: SubscribeSelectedFields<_Schema, _ReferencedEntityType>
		} ?
			{
					readonly value: EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
					readonly entity: SubscribeResult<_Schema, _ReferencedEntityType, {
						readonly fields: _FieldSelection['fields']
					}>
			}
		:
			EntityFieldResolvedValue<_Schema, _EntityType, _FieldName>
	:
		EntityFieldResolvedValue<_Schema, _EntityType, _FieldName>
)

type UnionToIntersection<_Union> = (
	_Union extends _Union ?
		(_value: _Union) => void
	:
		never
) extends (_value: infer _Intersection) => void ?
	_Intersection
:
	never

type SubscribeResultFields<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType>,
> = (
	_Selection extends {
		readonly fields: infer _Fields extends SubscribeSelectedFields<_Schema, _EntityType>
	} ?
		& {
			readonly [
				_FieldName in keyof _Fields & EntityFieldName<_Schema, _EntityType> as (
					EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends { readonly when: EntityFieldCondition } ?
						never
					:
						_FieldName
				)
			]: SubscribeFieldResult<_Schema, _EntityType, _FieldName, NonNullable<_Fields[_FieldName]>>
		}
		& (
			{
				readonly [
					_FieldName in keyof _Fields & EntityFieldName<_Schema, _EntityType>
				]: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends { readonly when: EntityFieldCondition } ?
					(
						| {
							readonly [
								_ConditionalFieldName in _FieldName
							]: SubscribeFieldResult<_Schema, _EntityType, _FieldName, NonNullable<_Fields[_FieldName]>>
						}
						| {
							readonly [
								_ConditionalFieldName in _FieldName
							]: EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
								readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
							} ?
								SubscribeFieldResult<_Schema, _EntityType, _FieldName, NonNullable<_Fields[_FieldName]>>
							:
								undefined
						}
					)
				:
					never
			}[keyof _Fields & EntityFieldName<_Schema, _EntityType>] extends infer _ConditionalBranches ?
				[_ConditionalBranches] extends [never] ?
					object
				:
					UnionToIntersection<_ConditionalBranches>
			:
				object
		)
	:
		Partial<EntityFieldValues<_Schema, _EntityType>>
)

export type SubscribeResult<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = {
	readonly entityType: _EntityType
	readonly entitySelector: EntitySelector<_Schema, _EntityType>
	readonly fields: SubscribeResultFields<_Schema, _EntityType, _Selection> & Partial<Omit<
		EntityFieldValues<_Schema, _EntityType>,
		_Selection extends { readonly fields: infer _Fields extends SubscribeSelectedFields<_Schema, _EntityType> } ?
			keyof _Fields & EntityFieldName<_Schema, _EntityType>
		:
			never
	>>
	readonly errors: readonly SubscribeError<_Schema>[]
}

export type SubscribeEntityResource<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = Promise<SubscribeResult<_Schema, _EntityType, _Selection>> & {
	readonly current: SubscribeResult<_Schema, _EntityType, _Selection> | undefined
	readonly error: readonly SubscribeError<_Schema>[] | undefined
	readonly loading: boolean
	readonly ready: boolean
	subscribe: (notify: () => void) => () => void
}

type SelectedFieldQuery<
	_Schema extends Schema,
	_EntityType extends EntityTypeName<_Schema>,
> = {
	readonly fieldDefinition: EntityFieldDefinition
	readonly selection: SubscribeFieldSelection<_Schema, _EntityType>
	readonly sources: readonly string[]
	readonly loadOptions: LoadSubsetOptions
	readonly isPaged: boolean
	readonly rows: readonly {
		readonly [EntityMetaKey.ParentSelectorKey]: string
		readonly [EntityMetaKey.Source]: string
		readonly [EntityMetaKey.Value]: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>
		readonly valueKey: string
	}[]
	readonly counts: readonly {
		readonly [EntityMetaKey.ParentSelectorKey]: string
		readonly [EntityMetaKey.Source]: string
		readonly [EntityMetaKey.Value]: number
		readonly filterKey: string
	}[]
}

type FieldLiveQueryRow = {
	readonly [EntityMetaKey.ParentSelectorKey]: string
	readonly [EntityMetaKey.Source]: string
	readonly valueKey: string
}

type LiveQueryRows<_Row> = {
	readonly status: string
	readonly toArray: readonly _Row[]
	subscribeChanges: (
		callback: () => void,
		options: {
			readonly includeInitialState: true
			readonly onStatusChange?: () => void
		}
	) => {
		readonly unsubscribe: () => void
	}
}

const projectSubscribeEntity = <
	const _Schema extends Schema,
	const _EntityType extends EntityTypeName<_Schema>,
	const _Selection extends SubscribeSelection<_Schema, _EntityType>,
>(
	context: EntityCollectionsContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selectedFields: Partial<Record<string, true | SubscribeFieldSelection<_Schema, _EntityType>>>,
	entityRows: readonly EntityCollectionItem<_Schema, EntityTypeName<_Schema>>[],
	parentSelectorKeys: readonly string[],
	fieldQueries: readonly SelectedFieldQuery<_Schema, _EntityType>[],
	nestedEntityResource: (
		entityType: EntityTypeName<_Schema>,
		entitySelector: object,
		selection: SubscribeSelection<_Schema, EntityTypeName<_Schema>>
	) => SubscribeEntityResource<_Schema, EntityTypeName<_Schema>>
): {
	readonly pending: boolean
	readonly result: SubscribeResult<_Schema, _EntityType, _Selection>
} => {
	const errors: SubscribeError<_Schema>[] = []
	const entityDefinition = context.entityDefinitionByType[entityType]
	if (entityDefinition == null)
		throw new Error(`${entityType}: unknown entity type`)

	const relevantEntityRows = entityRows.filter((row) => (
		parentSelectorKeys.includes(row[EntityMetaKey.SelectorKey])
			|| entitySelectorsFromFields(
				context.schema,
				entityDefinition,
				row[EntityMetaKey.Selector],
				row[EntityMetaKey.Fields]
				).some((selector) => parentSelectorKeys.includes(entitySelectorKey(context.schema, entityDefinition, selector)))
	))
	const fields: SubscribeResult<_Schema, _EntityType, _Selection>['fields'] = Object.create(null)
	let pending = false
	for (const fieldName of Object.keys(selectedFields)) {
		const selectedField = selectedFields[fieldName]
		if (selectedField == null)
			continue

		const selectedFieldSelection: SubscribeFieldSelection<_Schema, _EntityType> = selectedField === true ? {} : selectedField
		const fieldQuery = fieldQueries.find((query) => query.fieldDefinition.name === fieldName)
		if (fieldQuery == null)
			throw new Error(`${entityType}.${fieldName}: missing selected field query`)

		const { fieldDefinition, sources } = fieldQuery
		const sourceRankBySource = new Map(sources.map((source, index) => [
			source,
			index,
		]))
		const fieldRows = fieldQuery.rows.filter((row) => {
			try {
				validateResolverFieldValue(
					context.schema,
					fieldDefinition,
					entityFieldCardinalityIsMultiple(fieldDefinition.cardinality) ?
						[row[EntityMetaKey.Value]]
					:
						row[EntityMetaKey.Value]
						)
				return true
			} catch (error) {
				if (selectedFieldSelection.fields != null)
					errors.push({
						selectorAddress: [
							entityType,
							fieldName,
						],
						dimension: 'nested',
						entityType,
						entitySelector,
						fieldName,
						message: `${entityType}.${fieldName}: invalid nested entity reference (${String(error)})`,
					})
				return false
			}
		})
		const bestSourceRankByValueKey = new Map<string, number>()
		for (const row of fieldRows) {
			const sourceRank = sourceRankBySource.get(row[EntityMetaKey.Source])
			if (
				sourceRank == null
				|| !parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
			)
				continue

			const rowValueKey = fieldResultValueKey(row[EntityMetaKey.Value])
			const bestSourceRank = bestSourceRankByValueKey.get(rowValueKey)
			if (bestSourceRank == null || sourceRank < bestSourceRank)
				bestSourceRankByValueKey.set(rowValueKey, sourceRank)
		}
		const rows = []
		const mergedValueKeys = new Set<string>()
		for (const row of fieldRows) {
			const rowValueKey = fieldResultValueKey(row[EntityMetaKey.Value])
			const sourceRank = sourceRankBySource.get(row[EntityMetaKey.Source])
			if (
				sourceRank == null
				|| !parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
				|| mergedValueKeys.has(rowValueKey)
				|| bestSourceRankByValueKey.get(rowValueKey) !== sourceRank
			)
				continue

			mergedValueKeys.add(rowValueKey)
			rows.push(row)
		}
		const visibleRows = entityFieldCardinalityIsMultiple(fieldDefinition.cardinality) ?
			rows.slice(
				selectedFieldSelection.offset ?? 0,
				selectedFieldSelection.limit == null ?
					undefined
				:
					(selectedFieldSelection.offset ?? 0) + selectedFieldSelection.limit
					)
		:
			rows
			const values: EntityFieldSingleResolvedValue<_Schema, EntityTypeName<_Schema>, EntityFieldName<_Schema, EntityTypeName<_Schema>>>[] = []
		if (!entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
			let resolvedScalar = false
			for (const source of sources) {
				for (const row of relevantEntityRows.toReversed()) {
					if (row[EntityMetaKey.Source] !== source)
						continue

					const value = row[EntityMetaKey.Fields][fieldDefinition.name]
					if (!isProductSingleFieldValue(value))
							continue

					values.push(value)
					resolvedScalar = true
					break
				}
				if (resolvedScalar)
					break

				for (const row of visibleRows) {
					if (
						row[EntityMetaKey.Source] !== source
						|| row[EntityMetaKey.Value] == null
					)
						continue

					values.push(row[EntityMetaKey.Value])
					resolvedScalar = true
					break
				}
				if (resolvedScalar)
					break
			}
		} else {
			const valueKeys = new Set<string>()
			for (const row of visibleRows) {
				const valueKey = fieldResultValueKey(row[EntityMetaKey.Value])
				if (valueKeys.has(valueKey))
					continue

				valueKeys.add(valueKey)
				values.push(row[EntityMetaKey.Value])
			}
		}
		let nestedEntities: (SubscribeResult<_Schema, EntityTypeName<_Schema>> | undefined)[] | undefined
		if (
			selectedFieldSelection.fields != null
			&& (
				fieldDefinition.type === EntityFieldType.EntityReference
				|| fieldDefinition.type === EntityFieldType.EntitiesReference
			)
		) {
			nestedEntities = values.map((value) => {
				try {
					if (
						value == null
						|| typeof value !== 'object'
						|| !(EntityMetaKey.Selector in value)
						|| value[EntityMetaKey.Selector] == null
						|| typeof value[EntityMetaKey.Selector] !== 'object'
					)
						throw new Error(`${entityType}.${fieldName}: invalid nested entity reference`)

					const nestedEntityDefinition = context.schema.find((candidate) => candidate.entityType === fieldDefinition.entityType)
					if (nestedEntityDefinition == null)
						throw new Error(`${entityType}.${fieldName}: unknown nested entity type`)

					const nestedEntitySelector = parseEntitySelector(context.schema, nestedEntityDefinition, value[EntityMetaKey.Selector])
					if (nestedEntitySelector instanceof arktype.errors)
						throw new Error(`${entityType}.${fieldName}: invalid nested entity reference`)

					const nestedEntity = nestedEntityResource(fieldDefinition.entityType, nestedEntitySelector, {
						sources: selectedFieldSelection.sources,
						fields: selectedFieldSelection.fields,
					})
					if (nestedEntity.error !== undefined) {
						for (const nestedError of nestedEntity.error) {
							errors.push({
								...nestedError,
								selectorAddress: [
									entityType,
									fieldName,
									...nestedError.selectorAddress,
								],
							})
						}
						return undefined
					}
					if (!nestedEntity.ready) {
						pending = true
						return undefined
					}
					return nestedEntity.current
				} catch (error) {
					errors.push({
						selectorAddress: [
							entityType,
							fieldName,
						],
						dimension: 'nested',
						entityType,
						entitySelector,
						fieldName,
						message: String(error),
					})
					return undefined
				}
			})
		}

		if (entityFieldCardinalityIsMultiple(fieldDefinition.cardinality)) {
			let totalCount: number | undefined
			if (selectedFieldSelection.count === true) {
				const selectedFieldCountFilterKey = countFilterKey(fieldQuery.loadOptions)
				const countRows = fieldQuery.counts
				let countParentSelectorKeys = parentSelectorKeys
				if (visibleRows.length > 0) {
					const rowParentSelectorKeys = new Set<string>()
					for (const row of visibleRows)
						rowParentSelectorKeys.add(row[EntityMetaKey.ParentSelectorKey])
					countParentSelectorKeys = [...rowParentSelectorKeys]
				}
				for (const source of sources) {
					for (const parentSelectorKey of countParentSelectorKeys) {
						const row = countRows.find((countRow) => (
							countRow[EntityMetaKey.Source] === source
							&& countRow[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
							&& countRow.filterKey === selectedFieldCountFilterKey
							&& (
								!fieldQuery.isPaged
								|| context.entityFieldCountCollections[entityType][fieldName]?.toArray.some((collectionRow) => (
									collectionRow[EntityMetaKey.Source] === countRow[EntityMetaKey.Source]
									&& collectionRow[EntityMetaKey.ParentSelectorKey] === countRow[EntityMetaKey.ParentSelectorKey]
									&& collectionRow.filterKey === countRow.filterKey
								)) === true
							)
						))
						if (row != null) {
							totalCount = row[EntityMetaKey.Value]
							break
						}
					}
					if (totalCount != null)
						break
				}
			}
			Object.defineProperty(fields, fieldName, {
				value: {
					values,
					...(nestedEntities != null && {
						entities: nestedEntities.filter((nestedEntity) => nestedEntity != null),
					}),
					...(totalCount != null && {
						totalCount,
					}),
				},
				enumerable: true,
			})
			continue
		}

		Object.defineProperty(fields, fieldName, {
			value: (
				nestedEntities == null ?
					values[0]
				:
					{
						value: values[0],
						entity: nestedEntities[0],
					}
			),
			enumerable: true,
		})
	}

	return {
		pending,
		result: {
			entityType,
			entitySelector,
			fields,
			errors,
		},
	}
}

export const subscribeEntity = <
	const _Schema extends Schema,
	const _EntityType extends EntityTypeName<_Schema>,
	const _Selection extends SubscribeSelection<_Schema, _EntityType>,
>(
	context: EntityCollectionsContext<_Schema>,
	entityType: _EntityType,
	entitySelector: EntitySelector<_Schema, _EntityType>,
	selection: _Selection
): SubscribeEntityResource<_Schema, _EntityType, _Selection> => {
	let current = $state.raw<SubscribeResult<_Schema, _EntityType, _Selection> | undefined>()
	let error = $state.raw<readonly SubscribeError<_Schema>[] | undefined>()
		let loading = $state(true)
		let started = false
		let startScheduled = false
		let promise = $state.raw<Promise<SubscribeResult<_Schema, _EntityType, _Selection>>>()
		let pending = false
	let resolvePromise: ((result: SubscribeResult<_Schema, _EntityType, _Selection>) => void) | undefined
	let rejectPromise: ((cause: readonly SubscribeError<_Schema>[]) => void) | undefined
	const startPending = () => {
		pending = true
		promise = new Promise<SubscribeResult<_Schema, _EntityType, _Selection>>((resolve, reject) => {
			resolvePromise = resolve
			rejectPromise = reject
		})
		promise.catch(() => {})
		return promise
	}
	const resolveResource = (
		result: SubscribeResult<_Schema, _EntityType, _Selection>
	) => {
		pending = false
		resolvePromise?.(result)
		resolvePromise = undefined
		rejectPromise = undefined
		promise = Promise.resolve(result)
	}
	const rejectResource = (
		cause: readonly SubscribeError<_Schema>[]
	) => {
		pending = false
		rejectPromise?.(cause)
		resolvePromise = undefined
		rejectPromise = undefined
		promise = Promise.reject(cause)
		promise.catch(() => {})
	}
		const resourcePromise = () => {
			return untrack(() => {
				startSoon()
				return promise ?? startPending()
			})
		}
	const listeners = new Set<() => void>()
	const subscriptions: (() => void)[] = []
	const fieldQuerySubscriptions: (() => void)[] = []
	const nestedSubscriptions = new Map<string, () => void>()
	const nestedResources = new Map<string, SubscribeEntityResource<_Schema, EntityTypeName<_Schema>, SubscribeSelection<_Schema, EntityTypeName<_Schema>>>>()
	let resourceSubscription: symbol | undefined
	const entityDefinition = context.entityDefinitionByType[entityType]
	if (entityDefinition == null)
		throw new Error(`${entityType}: unknown entity type`)

		const selectedFields: Partial<Record<string, true | SubscribeFieldSelection<_Schema, _EntityType>>> = Object.fromEntries([
			...Object.entries(selection.fields ?? {}),
			...Object.keys(selection.fields ?? {}).flatMap((fieldName) => {
				const condition = context.entityFieldDefinitionByEntityTypeAndName[entityType]?.[fieldName]?.when
				return (
					condition != null
				&& selection.fields?.[condition.fieldName] == null ?
					[[condition.fieldName, true]]
				:
					[]
				)
			}),
		])
	const requestedParentSelectorKey = entitySelectorKey(context.schema, entityDefinition, entitySelector)
	const parentSelectorKeys = [requestedParentSelectorKey]
	const loadEntityRows = selection.sources != null
	const entityRowsQuery = createLiveQueryCollection({
		query: (query) => {
			let builder = query
				.from({ entity: context.entityCollections[entityType] })
				.where(({ entity }) => eq(entity.__selectorKey, requestedParentSelectorKey))

			if (selection.sources != null) {
				const sources = [...selection.sources]
				builder = builder.where(({ entity }) => inArray(entity.__source, sources))
			}

			return builder.select(({ entity }) => ({
				[EntityMetaKey.Selector]: entity[EntityMetaKey.Selector],
				[EntityMetaKey.SelectorKey]: entity[EntityMetaKey.SelectorKey],
				[EntityMetaKey.Fields]: entity[EntityMetaKey.Fields],
				[EntityMetaKey.Source]: entity[EntityMetaKey.Source],
			}))
		},
		startSync: loadEntityRows,
	})
	const selectedFieldQueries = Object.keys(selectedFields).flatMap((fieldName) => {
		const selectedField = selectedFields[fieldName]
		if (selectedField == null)
			return []

		const fieldDefinition = context.entityFieldDefinitionByEntityTypeAndName[entityType]?.[fieldName]
		if (fieldDefinition == null)
			throw new Error(`${entityType}.${fieldName}: unknown selected field`)

		const selectedFieldSelection: SubscribeFieldSelection<_Schema, _EntityType> = selectedField === true ? {} : selectedField
		const sources: string[] = []
		for (const source of (
			selectedFieldSelection.sources
			?? fieldDefinition.defaultSources
			?? selection.sources
			?? context.resolverIndexes.resolverParts
				.filter((part) => (
					part.entityType === entityType
					&& part.fieldName === fieldDefinition.name
					&& part.select != null
				))
				.map((part) => part.source)
		))
			if (!sources.includes(source))
				sources.push(source)
		const loadOptions: LoadSubsetOptions = {
			where: selectedFieldSelection.where,
			orderBy: (
				selectedFieldSelection.orderBy == null ?
					undefined
				:
					isDeclarativeFieldOrderBy<_Schema>(selectedFieldSelection.orderBy) ?
						undefined
					:
						selectedFieldSelection.orderBy
			),
			limit: (
				selectedFieldSelection.limit != null && selectedFieldSelection.offset != null ?
					selectedFieldSelection.limit + selectedFieldSelection.offset
				:
					selectedFieldSelection.limit
			),
			offset: selectedFieldSelection.offset == null ?
				undefined
			:
				0,
			cursor: selectedFieldSelection.cursor,
		}
		return [{
			fieldDefinition,
			selection: selectedFieldSelection,
			sources,
			loadOptions,
			isPaged: (
				selectedFieldSelection.limit != null
				|| selectedFieldSelection.offset != null
				|| selectedFieldSelection.cursor != null
			),
		}]
	})
	let fieldQueryParentSelectorKey = ''
	let fieldQueries: {
		readonly fieldDefinition: EntityFieldDefinition
		readonly selection: SubscribeFieldSelection<_Schema, _EntityType>
		readonly sources: readonly string[]
		readonly loadOptions: LoadSubsetOptions
		readonly isPaged: boolean
		readonly rows: LiveQueryRows<FieldLiveQueryRow>
		readonly counts?: LiveQueryRows<SelectedFieldQuery<_Schema, _EntityType>['counts'][number]>
	}[] = []
	const notify = () => {
		for (const listener of listeners)
			listener()
	}
	const fail = (cause: readonly SubscribeError<_Schema>[]) => {
		loading = false
		error = cause
		rejectResource(cause)
		notify()
	}
	const refresh = () => {
		const entityRows: EntityCollectionItem<_Schema, EntityTypeName<_Schema>>[] = []
		for (const row of entityRowsQuery.toArray) {
			for (const entityRow of context.entityCollections[entityType].toArray) {
				if (
					entityRow[EntityMetaKey.SelectorKey] === row[EntityMetaKey.SelectorKey]
					&& entityRow[EntityMetaKey.Source] === row[EntityMetaKey.Source]
				)
					entityRows.push(entityRow)
			}
		}
		const hasRequestedEntityRows = entityRows.some((row) => {
			const rowParentSelectorKeys = entitySelectorsFromFields(
				context.schema,
				entityDefinition,
				row[EntityMetaKey.Selector],
				row[EntityMetaKey.Fields]
				).map((selector) => entitySelectorKey(context.schema, entityDefinition, selector))
			return (
				row[EntityMetaKey.SelectorKey] === requestedParentSelectorKey
				|| rowParentSelectorKeys.includes(requestedParentSelectorKey)
			)
		})
		const collectionQueries = context.queryClient.getQueryCache().getAll()
		const countQueryMissingHigherPrioritySource = (fieldQuery: (typeof fieldQueries)[number]) => {
			const firstPresentSourceIndex = Math.min(
				...fieldQuery.sources.map((source, index) => (
					context.entityFieldCountCollections[entityType][fieldQuery.fieldDefinition.name]?.toArray.some((row) => (
						parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
						&& row.filterKey === countFilterKey(fieldQuery.loadOptions)
						&& row[EntityMetaKey.Source] === source
					)) === true ?
						index
					:
						Infinity
				))
			)
			return (
				fieldQuery.counts != null
				&& fieldQuery.sources.some((source, index) => (
					index < firstPresentSourceIndex
					&& context.resolverIndexes.resolverParts.some((resolverPart) => (
						resolverPart.entityType === entityType
						&& resolverPart.fieldName === fieldQuery.fieldDefinition.name
						&& resolverPart.source === source
						&& (
							resolverPart.resolveCount != null
							|| resolverPart.select != null
						)
					))
				))
			)
		}
		const countQueryMissingAnyRow = (fieldQuery: (typeof fieldQueries)[number]) => (
			fieldQuery.counts != null
			&& context.entityFieldCountCollections[entityType][fieldQuery.fieldDefinition.name]?.toArray.some((row) => (
				parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
				&& row.filterKey === countFilterKey(fieldQuery.loadOptions)
				&& fieldQuery.sources.includes(row[EntityMetaKey.Source])
			)) !== true
		)
		const countQueryStillNeedsRows = (fieldQuery: (typeof fieldQueries)[number]) => (
			fieldQuery.counts != null
			&& (
				countQueryMissingAnyRow(fieldQuery)
				|| countQueryMissingHigherPrioritySource(fieldQuery)
			)
		)
		const fieldQueryMissingAnyRow = (fieldQuery: (typeof fieldQueries)[number]) => (
			!context.entityFieldCollections[entityType][fieldQuery.fieldDefinition.name].toArray.some((row) => (
				parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
				&& fieldQuery.sources.includes(row[EntityMetaKey.Source])
			))
		)
		const fieldCollectionQueryMatches = (
			query: (typeof collectionQueries)[number],
			fieldQuery: (typeof fieldQueries)[number]
		) => {
			if (query.queryKey[0] !== `Field:${entityType}:${fieldQuery.fieldDefinition.name}`)
				return false

			const resolverSubset = parseResolverSubset(query.meta?.loadSubsetOptions ?? {})
			const resolverSources = resolverSubset.sources
			const selectedSubset = parseResolverSubset(fieldQuery.loadOptions)
			return (
				resolverSubset.parentSelectorKeys.some((parentSelectorKey) => parentSelectorKeys.includes(parentSelectorKey))
				&& (
					resolverSources == null
					|| fieldQuery.sources.some((source) => resolverSources.includes(source))
				)
				&& stringify(resolverSubset.filters.filter((filter) => (
					filter.fieldPath[0] !== EntityMetaKey.ParentSelectorKey
					&& filter.fieldPath[0] !== EntityMetaKey.Source
				))) === stringify(selectedSubset.filters)
			)
		}
		const countCollectionQueryMatches = (
			query: (typeof collectionQueries)[number],
			fieldQuery: (typeof fieldQueries)[number]
		) => {
			if (query.queryKey[0] !== `Count:${entityType}:${fieldQuery.fieldDefinition.name}`)
				return false

			const resolverSubset = parseResolverSubset(query.meta?.loadSubsetOptions ?? {})
			const resolverSources = resolverSubset.sources
			const queriedCountFilterKey = resolverSubset.filters.find((filter) => filter.fieldPath[0] === 'filterKey')?.value ?? countFilterKey({})
			if (typeof queriedCountFilterKey !== 'string')
				throw new Error('Count query match expected string filterKey')
			return (
				resolverSubset.parentSelectorKeys.some((parentSelectorKey) => parentSelectorKeys.includes(parentSelectorKey))
				&& (
					resolverSources == null
					|| fieldQuery.sources.some((source) => resolverSources.includes(source))
				)
				&& queriedCountFilterKey === countFilterKey(fieldQuery.loadOptions)
			)
		}
		if (
			loadEntityRows
			&& entityRowsQuery.status === 'error'
			&& !hasRequestedEntityRows
		) {
			fail([{
				selectorAddress: [entityType],
				dimension: 'query',
				entityType,
				entitySelector,
				message: `${entityType}: live query failed`,
			}])
			return
		}
		for (const fieldQuery of fieldQueries) {
			if (
				fieldQuery.rows.status === 'error'
				&& fieldQueryMissingAnyRow(fieldQuery)
			) {
				fail([{
					selectorAddress: [
						entityType,
						fieldQuery.fieldDefinition.name,
					],
					dimension: 'field',
					entityType,
					entitySelector,
					fieldName: fieldQuery.fieldDefinition.name,
					message: `${entityType}.${fieldQuery.fieldDefinition.name}: live query failed`,
				}])
				return
			}
			if (
				fieldQuery.counts?.status === 'error'
				&& countQueryStillNeedsRows(fieldQuery)
			) {
				fail([{
					selectorAddress: [
						entityType,
						fieldQuery.fieldDefinition.name,
					],
					dimension: 'count',
					entityType,
					entitySelector,
					fieldName: fieldQuery.fieldDefinition.name,
					message: `${entityType}.${fieldQuery.fieldDefinition.name}: count live query failed`,
				}])
				return
			}
		}
		for (const query of collectionQueries) {
			const collectionQueryName = query.queryKey[0]
			if (query.state.error == null)
				continue
			if (
				loadEntityRows
				&& collectionQueryName === `Entity:${entityType}`
				&& !hasRequestedEntityRows
			) {
				fail([{
					selectorAddress: [entityType],
					dimension: 'query',
					entityType,
					entitySelector,
					message: String(query.state.error),
				}])
				return
			}
			for (const fieldQuery of fieldQueries) {
				if (
					fieldCollectionQueryMatches(query, fieldQuery)
					&& fieldQueryMissingAnyRow(fieldQuery)
				) {
					fail([{
						selectorAddress: [
							entityType,
							fieldQuery.fieldDefinition.name,
						],
						dimension: 'field',
						entityType,
						entitySelector,
						fieldName: fieldQuery.fieldDefinition.name,
						message: String(query.state.error),
					}])
					return
				}
				if (
					fieldQuery.counts != null
					&& countCollectionQueryMatches(query, fieldQuery)
					&& countQueryStillNeedsRows(fieldQuery)
				) {
					fail([{
						selectorAddress: [
							entityType,
							fieldQuery.fieldDefinition.name,
						],
						dimension: 'count',
						entityType,
						entitySelector,
						fieldName: fieldQuery.fieldDefinition.name,
						message: String(query.state.error),
					}])
					return
				}
			}
		}
		for (const row of entityRows) {
			const rowParentSelectorKeys = entitySelectorsFromFields(
				context.schema,
				entityDefinition,
				row[EntityMetaKey.Selector],
				row[EntityMetaKey.Fields]
				).map((selector) => entitySelectorKey(context.schema, entityDefinition, selector))
			if (
				row[EntityMetaKey.SelectorKey] !== requestedParentSelectorKey
				&& !rowParentSelectorKeys.includes(requestedParentSelectorKey)
			)
				continue

			for (const parentSelectorKey of rowParentSelectorKeys)
				if (!parentSelectorKeys.includes(parentSelectorKey))
					parentSelectorKeys.push(parentSelectorKey)
		}
		const nextFieldQueryParentSelectorKey = stringify(parentSelectorKeys)
		if (fieldQueryParentSelectorKey !== nextFieldQueryParentSelectorKey) {
			fieldQueryParentSelectorKey = nextFieldQueryParentSelectorKey
			for (const unsubscribe of fieldQuerySubscriptions.splice(0))
				unsubscribe()
			fieldQueries = selectedFieldQueries.map((fieldQuery) => {
				const parentSelectorKeysForQuery = [...parentSelectorKeys]
				const rows = createLiveQueryCollection({
					query: (query) => {
						let builder = query
							.from({ fieldRow: context.entityFieldCollections[entityType][fieldQuery.fieldDefinition.name] })
							.where(({ fieldRow }) => inArray(fieldRow[EntityMetaKey.ParentSelectorKey], parentSelectorKeysForQuery))
							.where(({ fieldRow }) => inArray(fieldRow[EntityMetaKey.Source], [...fieldQuery.sources]))

						if (fieldQuery.loadOptions.where != null) {
							const where = fieldQuery.loadOptions.where
							builder = builder.where(() => where)
						}
						for (const orderBy of (
							isDeclarativeFieldOrderBy<_Schema>(fieldQuery.selection.orderBy) ?
								fieldQuery.selection.orderBy
							:
								fieldQuery.selection.limit != null || fieldQuery.selection.offset != null ?
									defaultFieldOrderBySteps<_Schema>()
								:
									[]
						))
							builder = (
								orderBy[1] === undefined ?
									builder.orderBy(orderBy[0])
								:
									builder.orderBy(orderBy[0], orderBy[1])
							)
						if (fieldQuery.loadOptions.offset != null)
							builder = builder.offset(fieldQuery.loadOptions.offset)
						if (fieldQuery.loadOptions.limit != null)
							builder = builder.limit(fieldQuery.loadOptions.limit)
						return builder.select(({ fieldRow }) => ({
							[EntityMetaKey.ParentSelectorKey]: fieldRow[EntityMetaKey.ParentSelectorKey],
							[EntityMetaKey.Source]: fieldRow[EntityMetaKey.Source],
							valueKey: fieldRow.valueKey,
						}))
					},
					startSync: true,
				})
				const countCollection = context.entityFieldCountCollections[entityType][fieldQuery.fieldDefinition.name]
				const counts = (
					fieldQuery.selection.count === true
					&& !fieldQuery.isPaged
					&& countCollection != null ?
						createLiveQueryCollection({
							query: (query) => query
								.from({ count: countCollection })
								.where(({ count }) => inArray(count[EntityMetaKey.ParentSelectorKey], parentSelectorKeysForQuery))
								.where(({ count }) => eq(count.filterKey, countFilterKey(fieldQuery.loadOptions)))
								.where(({ count }) => inArray(count[EntityMetaKey.Source], [...fieldQuery.sources]))
								.select(({ count }) => ({
									[EntityMetaKey.ParentSelectorKey]: count[EntityMetaKey.ParentSelectorKey],
									[EntityMetaKey.Source]: count[EntityMetaKey.Source],
									[EntityMetaKey.Value]: count[EntityMetaKey.Value],
									filterKey: count.filterKey,
								})),
							startSync: (
								fieldQuery.selection.limit == null
								&& fieldQuery.selection.offset == null
								&& fieldQuery.selection.cursor == null
							),
						})
					:
						undefined
				)
				const rowsSubscription = rows.subscribeChanges(refresh, {
					includeInitialState: true,
					onStatusChange: refresh,
				})
				fieldQuerySubscriptions.push(() => rowsSubscription.unsubscribe())
				if (counts != null) {
					const countSubscription = counts.subscribeChanges(refresh, {
						includeInitialState: true,
						onStatusChange: refresh,
					})
					fieldQuerySubscriptions.push(() => countSubscription.unsubscribe())
				} else if (
					fieldQuery.selection.count === true
					&& fieldQuery.isPaged
					&& countCollection != null
				) {
					const countSubscription = countCollection.subscribeChanges(refresh)
					fieldQuerySubscriptions.push(() => countSubscription.unsubscribe())
				}
				return {
					...fieldQuery,
					rows,
					...(counts != null && {
						counts,
					}),
				}
			})
			queueMicrotask(refresh)
			if (!pending)
				startPending()
			loading = true
			notify()
			return
		}
		const hasPendingCollection = (
			(
				loadEntityRows
				&& entityRowsQuery.status !== 'ready'
			)
			|| (
				loadEntityRows
				&& !hasRequestedEntityRows
					&& !collectionQueries.some((query) => (
						query.queryKey[0] === `Entity:${entityType}`
						&& query.state.status === 'success'
					))
			)
			|| fieldQueries.length !== selectedFieldQueries.length
			|| fieldQueries.some((query) => (
				(
					fieldQueryMissingAnyRow(query)
					&& query.rows.status !== 'ready'
				)
				|| !collectionQueries.some((collectionQuery) => (
					fieldCollectionQueryMatches(collectionQuery, query)
					&& (
						collectionQuery.state.status === 'success'
						|| collectionQuery.state.status === 'error'
					)
				))
				|| (
					query.counts != null
					&& countQueryStillNeedsRows(query)
					&& (
						query.counts.status !== 'ready'
						|| !collectionQueries.some((collectionQuery) => (
							countCollectionQueryMatches(collectionQuery, query)
							&& collectionQuery.state.status === 'success'
						))
					)
				)
			))
			|| collectionQueries.some((query) => (
				query.state.status !== 'success'
				&& query.state.fetchStatus === 'fetching'
				&& (
					(
						loadEntityRows
						&& query.queryKey[0] === `Entity:${entityType}`
						&& !hasRequestedEntityRows
					)
					|| fieldQueries.some((fieldQuery) => (
						(
							fieldCollectionQueryMatches(query, fieldQuery)
						)
						|| (
							countCollectionQueryMatches(query, fieldQuery)
							&& countQueryStillNeedsRows(fieldQuery)
						)
					))
				)
			))
		)
		if (fieldQueries.length !== selectedFieldQueries.length) {
			if (!pending)
				startPending()
			loading = true
			notify()
			return
		}
		try {
			const projected = projectSubscribeEntity<_Schema, _EntityType, _Selection>(
				context,
				entityType,
				entitySelector,
				selectedFields,
				entityRows,
				parentSelectorKeys,
				fieldQueries.map<SelectedFieldQuery<_Schema, _EntityType>>((fieldQuery) => ({
					fieldDefinition: fieldQuery.fieldDefinition,
					selection: fieldQuery.selection,
					sources: fieldQuery.sources,
					loadOptions: fieldQuery.loadOptions,
					isPaged: fieldQuery.isPaged,
					rows: fieldQuery.rows.toArray.flatMap((row) => (
						context.entityFieldCollections[entityType][fieldQuery.fieldDefinition.name].toArray.filter((fieldRow) => (
							fieldRow[EntityMetaKey.ParentSelectorKey] === row[EntityMetaKey.ParentSelectorKey]
							&& fieldRow[EntityMetaKey.Source] === row[EntityMetaKey.Source]
							&& fieldRow.valueKey === row.valueKey
						))
					)),
					counts: (
						fieldQuery.isPaged ?
							context.entityFieldCountCollections[entityType][fieldQuery.fieldDefinition.name]?.toArray.filter((row) => (
								parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
								&& fieldQuery.sources.includes(row[EntityMetaKey.Source])
								&& row.filterKey === countFilterKey(fieldQuery.loadOptions)
							)) ?? []
						:
							fieldQuery.counts?.toArray ?? []
					),
				})),
				(nestedEntityType, nestedEntitySelector, nestedSelection) => {
					const nestedEntityDefinition = context.entityDefinitionByType[nestedEntityType]
					if (nestedEntityDefinition == null)
						throw new Error(`${nestedEntityType}: unknown entity type`)

					const parsedNestedEntitySelector = parseEntitySelector(context.schema, nestedEntityDefinition, nestedEntitySelector)
					if (parsedNestedEntitySelector instanceof arktype.errors)
						throw new Error(`${nestedEntityType}: invalid entity selector`)

					const key = stringify({
						entityType: nestedEntityType,
						entitySelector: parsedNestedEntitySelector,
						selection: nestedSelection,
					})
					const existing = nestedResources.get(key)
					if (existing != null)
						return existing

					const nested = subscribeEntity(
						context,
						nestedEntityType,
						parsedNestedEntitySelector,
						nestedSelection
					)
					void nested.catch(() => {})
					nestedResources.set(key, nested)
					nestedSubscriptions.set(key, nested.subscribe(refresh))
					return nested
				}
			)
			const nextError = projected.result.errors.length > 0 ? projected.result.errors : undefined
			const nextLoading = projected.result.errors.length === 0 && (
				projected.pending
				|| hasPendingCollection
			)
			if (!nextLoading)
				current = projected.result
			error = nextError
			if (nextLoading && !pending)
				startPending()
			loading = nextLoading
			if (nextError !== undefined)
				rejectResource(nextError)
			else if (!loading)
				resolveResource(projected.result)
			notify()
		} catch (cause) {
			fail([{
				selectorAddress: [entityType],
				dimension: 'query',
				entityType,
				entitySelector,
				message: String(cause),
			}])
		}
	}
		const start = () => {
			if (started)
				return
			startScheduled = false
			started = true
			resourceSubscription = Symbol()
			context.activeResourceSubscriptions.add(resourceSubscription)
		const entityRowsSubscription = entityRowsQuery.subscribeChanges(refresh, {
			includeInitialState: true,
			onStatusChange: refresh,
		})
		subscriptions.push(() => entityRowsSubscription.unsubscribe())
		subscriptions.push(context.queryClient.getQueryCache().subscribe(refresh))
		refresh()
		}
		const startSoon = () => {
			if (
				started
				|| startScheduled
			)
				return

			startScheduled = true
			void tick().then(() => {
				untrack(() => {
					startScheduled = false
					start()
				})
			})
		}
		const subscribe = (
			listener: () => void
		) => {
			startSoon()
			listeners.add(listener)
			let active = true
			return () => {
			if (!active)
				return
			active = false
			listeners.delete(listener)
			if (listeners.size === 0) {
				for (const unsubscribe of subscriptions.splice(0))
					unsubscribe()
				for (const unsubscribe of fieldQuerySubscriptions.splice(0))
					unsubscribe()
				for (const unsubscribe of nestedSubscriptions.values())
					unsubscribe()
				nestedSubscriptions.clear()
					nestedResources.clear()
					fieldQueries = []
					fieldQueryParentSelectorKey = ''
					started = false
					startScheduled = false
					if (resourceSubscription != null)
					context.activeResourceSubscriptions.delete(resourceSubscription)
				resourceSubscription = undefined
				if (context.activeResourceSubscriptions.size === 0) {
					for (const [scope, subscription] of context.liveSubscriptions) {
						subscription.abortController.abort()
						subscription.cleanup?.()
						context.events.live.push({
							action: 'cleanup',
							scope,
						})
					}
					context.liveSubscriptions.clear()
					context.startedLiveScopes.clear()
				}
			}
		}
	}
	const trackResource = createSubscriber(subscribe)
	const observeResource = () => {
		trackResource()
		startSoon()
	}
	const then = $derived.by((): SubscribeEntityResource<_Schema, _EntityType, _Selection>['then'] => {
		const promise = resourcePromise()
		current
		error
		loading
		return (onFulfilled, onRejected) => {
			const result = promise.then(tick).then(() => {
				if (current === undefined)
					throw new Error(`${entityType}: resource resolved before current value was available`)

				return current
			})

			return result.then(onFulfilled, onRejected)
		}
	})
	const resource: SubscribeEntityResource<_Schema, _EntityType, _Selection> = {
		get then() {
			observeResource()
			return then
		},
		get catch(): SubscribeEntityResource<_Schema, _EntityType, _Selection>['catch'] {
			observeResource()
			return (onRejected) => then(undefined, onRejected)
		},
		get finally(): SubscribeEntityResource<_Schema, _EntityType, _Selection>['finally'] {
			observeResource()
			return (onFinally) => then(
				(value) => {
					onFinally?.()
					return value
				},
				(reason) => {
					onFinally?.()
					throw reason
				}
			)
		},
		subscribe,
		get current() {
			observeResource()
			return current
		},
		get error() {
			observeResource()
			return error
		},
		get loading() {
			observeResource()
			return loading
		},
		get ready() {
			observeResource()
			return current !== undefined
		},
		[Symbol.toStringTag]: 'RemoteResource',
	}
	return resource
}
