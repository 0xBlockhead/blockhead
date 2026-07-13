import type { QueryClient } from '@tanstack/query-core'
import type {
	Collection,
	LoadSubsetOptions,
	Ref,
	SyncConfig,
	UtilsRecord,
	WithVirtualProps,
} from '@tanstack/db'
import {
	BasicIndex,
	createCollection,
} from '@tanstack/db'
import {
	persistedCollectionOptions,
	type PersistedCollectionPersistence,
} from '@tanstack/db-sqlite-persistence-core'
import {
	parse,
	stringify,
} from 'devalue'

import {
	createEntityProxy,
	type EntityProxyResource,
} from '$/client/$proxy.svelte.ts'
import {
	type ResolverContext,
	type ResolverIndexes,
	type ResolveLiveFieldHandle,
	type ResolveLiveFields,
	type SourceResolverDefinition,
	type SourceResolverModule,
	indexResolvers,
	countLoadedSubsetKey,
	fieldLoadedSubsetKey,
	parseResolverSubset,
	plainLoadSubsetKeyValue,
	resolverPartsKey,
} from '$/resolvers/$resolvers.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	type EntityFacetPath,
	type EntityDefinition,
	type EntityFieldDefinition,
	type EntityFieldDefinitionByEntityTypePathAndName,
	type EntityFieldDefinitionByName,
	type EntityFieldName,
	type EntityFieldResolvedValue,
	type EntityFieldSingleResolvedValue,
	type EntityFieldValues,
	type EntityProjectionDefinition,
	type EntitySelectorDefinitionByEntityTypeAndName,
	type EntitySelector,
	type EntityType,
	type Schema,
	entityFieldCardinalityIsMultiple,
	entityFieldAddressKey,
	entityFieldDefinitions,
	entityFieldPrimitiveValueIsValid,
	entityFieldFacetPath,
	indexSchema,
	validateEntitySelector,
} from '$/schema/$schema.ts'
import {
	type SourceProviderDefinition,
	type SourcePublicEnv,
	indexSourceProviders,
} from '$/sources/$sources.ts'
import { SourceDelivery } from '$/sources/SourceBinding.ts'


export enum ClientEventType {
	CollectionLoad = 'collection-load',
}

export enum CollectionLoadDecision {
	HydratedRows = 'hydrated-rows',
	LoadedMarker = 'loaded-marker',
	Remote = 'remote',
}

export enum PersistedCollectionLoadStatus {
	Loading = 'loading',
	Completed = 'completed',
	Failed = 'failed',
	Partial = 'partial',
}

export enum PersistedCollectionSourceStatus {
	Completed = 'completed',
	Failed = 'failed',
}

export type ClientEvent = {
	type: ClientEventType
	collectionId: string
	key: string
	decision?: CollectionLoadDecision
	status?: PersistedCollectionLoadStatus
	rowCount?: number
	sourceRowCounts?: Partial<Record<string, number>>
	reason?: string
	error?: string
}

type PersistedCollectionLoadedSubset = {
	collectionId: string
	loadedKey: string
	rowCount: number
	sourceRowCounts: Partial<Record<string, number>>
}

type PersistedCollectionSourceOutcome = {
	source: string
	status: PersistedCollectionSourceStatus
	error?: string
}

type PersistedCollectionRowsLoadResult<_Row extends PersistedCollectionRow> = {
	rows: _Row[]
	outcomes: PersistedCollectionSourceOutcome[]
}

export type PersistedCollectionLoadFailure = {
	collectionId: string
	selectorKeys: readonly string[]
	parentSelectorKeys: readonly string[]
	sources: readonly string[]
	error: string
}

export type PersistedCollectionLoadFailures = {
	list: PersistedCollectionLoadFailure[]
	add(failure: PersistedCollectionLoadFailure): void
	subscribe(listener: () => void): () => void
}

type PersistedCollectionRow = {
	[EntityMetaKey.Source]: string
}

type PersistedCollectionSyncOptions<_Row extends PersistedCollectionRow> = {
	collectionId: string
	schemaVersion: number
	persistence: PersistedCollectionPersistence
	getKey(row: _Row): string | number
	loadedKey(loadSubsetOptions: LoadSubsetOptions): string
	sources(loadSubsetOptions: LoadSubsetOptions): readonly string[]
	persistedRows(loadSubsetOptions: LoadSubsetOptions, rows: readonly _Row[]): readonly _Row[]
	loadRows(loadSubsetOptions: LoadSubsetOptions, sources: readonly string[]): Promise<PersistedCollectionRowsLoadResult<_Row>>
	waitForPersistence?(collectionId: string): Promise<void>
	events: ClientEvent[]
	collectionLoadFailures: PersistedCollectionLoadFailures
	setWriteRows(writeRows: (rows: readonly _Row[]) => void): void
	setReplaceRows(replaceRows: (predicate: (row: _Row) => boolean, rows: readonly _Row[]) => void): void
	setRefreshRows(refreshRows: () => void): void
	mountLive?(loadSubsetOptions: LoadSubsetOptions): () => void
}

export type EntityCollectionItem<
	_Schema extends Schema = Schema,
	_EntityType extends EntityType<_Schema> = EntityType<_Schema>,
> = {
	[EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	[EntityMetaKey.SelectorKey]: string
	[EntityMetaKey.Source]: string
}

export type EntityFieldCollectionItem<
	_Schema extends Schema = Schema,
	_EntityType extends EntityType<_Schema> = EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType> = EntityFieldName<_Schema, _EntityType>,
> = {
	facetPath: EntityFacetPath
	facetPathKey: string
	fieldName: _FieldName
	valueKey: string
	valueIndex?: number
	[EntityMetaKey.ParentSelector]: EntitySelector<_Schema, _EntityType>
	[EntityMetaKey.ParentSelectorKey]: string
	[EntityMetaKey.Source]: string
	[EntityMetaKey.Value]: EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
}

export type EntityFieldCountCollectionItem<
	_Schema extends Schema = Schema,
	_EntityType extends EntityType<_Schema> = EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType> = EntityFieldName<_Schema, _EntityType>,
> = {
	facetPath: EntityFacetPath
	facetPathKey: string
	fieldName: _FieldName
	filterKey: string
	[EntityMetaKey.ParentSelector]: EntitySelector<_Schema, _EntityType>
	[EntityMetaKey.ParentSelectorKey]: string
	[EntityMetaKey.Source]: string
	[EntityMetaKey.Value]: number
}

export type PersistedCollectionRowCollection<
	_Row extends object,
> = Collection<
	_Row,
	string | number,
	PersistedCollectionRowCollectionUtils<_Row>
>

type PersistedCollectionRowCollectionUtils<
	_Row extends object,
> = UtilsRecord & {
	dataUpdatedAt: number
	replaceRows(predicate: (row: _Row) => boolean, rows: readonly _Row[]): void
	writeUpsert(row: _Row | readonly _Row[]): void
	refresh(): void
}

type EntityCollectionWriteSurface = {
	delete(key: string | number): void
	utils: {
		writeUpsert(row: object | object[]): void
	}
}

type ClientLiveSubscription = {
	abortController: AbortController
	cleanup?: () => void
	referenceCount: number
	stopped: boolean
}

export type EntityCollections<
	_Schema extends Schema,
> = Record<string, PersistedCollectionRowCollection<EntityCollectionItem<_Schema>>>

export type EntityFieldCollections<
	_Schema extends Schema,
> = Record<string, Record<string, PersistedCollectionRowCollection<EntityFieldCollectionItem<_Schema>>>>

export type EntityFieldCountCollections<
	_Schema extends Schema,
> = Record<string, Record<string, PersistedCollectionRowCollection<EntityFieldCountCollectionItem<_Schema>> | undefined>>

export type EntityCollectionsContext<
	_Schema extends Schema = Schema,
> = {
	entityCollections: Record<string, EntityCollectionWriteSurface>
	entityFieldCollections: Record<string, Record<string, EntityCollectionWriteSurface>>
	entityFieldCountCollections: Record<string, Record<string, EntityCollectionWriteSurface | undefined>>
}

export type ClientContext<
	_Schema extends Schema = Schema,
	_Source extends string = string,
> = {
	schema: _Schema
	entityDefinitionByType: Record<string, EntityDefinition>
	projectionDefinitionByEntityTypeAndPath: Record<string, EntityProjectionDefinition | undefined>
	entityFieldDefinitionByEntityTypePathAndName: EntityFieldDefinitionByEntityTypePathAndName<_Schema>
	entitySelectorDefinitionByEntityTypeAndName: EntitySelectorDefinitionByEntityTypeAndName<_Schema>
	entityCollections: EntityCollections<_Schema>
	entityFieldCollections: EntityFieldCollections<_Schema>
	entityFieldCountCollections: EntityFieldCountCollections<_Schema>
	liveSubscriptions: Map<string, ClientLiveSubscription>
	resolverIndexes: ResolverIndexes<_Schema, _Source, ResolverContext>
	resolverPublicEnvBySource: ReadonlyMap<string, SourcePublicEnv>
	enabledSources: ReadonlySet<_Source>
	collectionLoadFailures: PersistedCollectionLoadFailures
	queryClient: QueryClient
	events: ClientEvent[]
	schemaVersion: number
	select: <
		const _EntityType extends EntityType<_Schema>,
		>(
			entityType: _EntityType,
			entitySelector: EntitySelector<_Schema, _EntityType>,
			selection?: SubscribeSelection<_Schema, _EntityType, object>
		) => EntityProxyResource<_Schema, _EntityType>
}

export type SubscribeSelection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldRow extends object = Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema, _EntityType>>>,
> = Omit<LoadSubsetOptions, 'orderBy'> & {
	readonly sources?: readonly string[]
	readonly count?: boolean
	readonly fields?: SubscribeSelectedFields<_Schema, _EntityType>
	readonly selectorSources?: readonly string[]
	readonly orderBy?: DeclarativeOrderBy<_FieldRow>
}

export type DeclarativeOrderBy<_FieldRow extends object = object> = readonly (readonly [
	(context: { fieldRow: _FieldRow }) => string | number | bigint | undefined,
	(
		| 'asc'
		| 'desc'
		| {
			direction: 'asc' | 'desc'
		}
	),
])[]

export type SubscribeSelectedFields<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	readonly [fieldName: string]: true | SubscribeSelection<
		_Schema,
		_EntityType,
		Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema>>>
	> | undefined
}

export type SubscribeError<_Schema extends Schema = Schema> = {
	readonly selectorAddress: readonly string[]
	readonly dimension: 'entity' | 'field' | 'count' | 'nested' | 'query'
	readonly entityType: EntityType<_Schema>
	readonly entitySelector: object
	readonly fieldName?: string
	readonly message: string
}

export type SubscribeEntityReferenceResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = {
	readonly [EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	readonly [EntityMetaKey.SelectorKey]: string
	readonly [EntityMetaKey.Source]: string
	readonly entitySelector: EntitySelector<_Schema, _EntityType>
} & Partial<EntityFieldValues<_Schema, _EntityType>>

export type SubscribeFieldSingleResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferenceEntityType extends EntityType<_Schema>
	} ?
		SubscribeEntityReferenceResult<_Schema, _ReferenceEntityType>
	:
		EntityFieldSingleResolvedValue<_Schema, _EntityType, _FieldName>
)

export type SubscribeFieldResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
> = (
	EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		{
			readonly values: readonly SubscribeFieldSingleResult<_Schema, _EntityType, _FieldName>[]
			readonly entities: readonly SubscribeFieldSingleResult<_Schema, _EntityType, _FieldName>[]
			readonly totalCount?: number
		}
	:
		EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
			readonly cardinality: EntityFieldCardinality.ZeroOrOne
		} ?
			SubscribeFieldSingleResult<_Schema, _EntityType, _FieldName> | undefined
		:
			EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends {
				readonly cardinality: EntityFieldCardinality.Zero
			} ?
				undefined
			:
				SubscribeFieldSingleResult<_Schema, _EntityType, _FieldName>
)

export type SubscribeAllResultFields<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Partial<{
	readonly [
		_FieldName in EntityFieldName<_Schema, _EntityType>
	]: SubscribeFieldResult<_Schema, _EntityType, _FieldName>
}>

type SubscribeResultFields<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType>,
> = (
	_Selection extends {
		readonly fields: infer _Fields extends SubscribeSelectedFields<_Schema, _EntityType>
	} ?
		{
			readonly [
				_FieldName in keyof _Fields & EntityFieldName<_Schema, _EntityType>
			]: SubscribeFieldResult<_Schema, _EntityType, _FieldName>
		}
		:
			SubscribeAllResultFields<_Schema, _EntityType>
	)

export type SubscribeResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = (
	& SubscribeResultFields<_Schema, _EntityType, _Selection>
	& {
		readonly entityType: _EntityType
		readonly entitySelector: EntitySelector<_Schema, _EntityType>
		readonly fields: SubscribeResultFields<_Schema, _EntityType, _Selection> & Partial<Omit<
			SubscribeAllResultFields<_Schema, _EntityType>,
			_Selection extends { readonly fields: infer _Fields extends SubscribeSelectedFields<_Schema, _EntityType> } ?
				keyof _Fields & EntityFieldName<_Schema, _EntityType>
			:
				never
			>>
		readonly fieldValuesByAddress: Readonly<Record<string, unknown>>
		readonly errors: readonly SubscribeError<_Schema>[]
	}
)

const persistedCollectionLoadedSubset = (
	value: unknown
): PersistedCollectionLoadedSubset | undefined => {
	if (
		value == null
		|| typeof value !== 'object'
		|| !('collectionId' in value)
		|| !('loadedKey' in value)
		|| !('rowCount' in value)
		|| !('sourceRowCounts' in value)
	)
		return undefined

	if (
		typeof value.collectionId !== 'string'
		|| typeof value.loadedKey !== 'string'
		|| typeof value.rowCount !== 'number'
		|| !Number.isSafeInteger(value.rowCount)
		|| value.rowCount < 0
		|| value.sourceRowCounts == null
		|| typeof value.sourceRowCounts !== 'object'
	)
		return undefined

	const sourceRowCountEntries: [string, number][] = []
	for (const source of Object.keys(value.sourceRowCounts)) {
		const count = Object.getOwnPropertyDescriptor(value.sourceRowCounts, source)?.value
		if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0)
			return undefined

		sourceRowCountEntries.push([
			source,
			count,
		])
	}
	if (sourceRowCountEntries.reduce((total, [, count]) => total + count, 0) !== value.rowCount)
		return undefined

	return {
		collectionId: value.collectionId,
		loadedKey: value.loadedKey,
		rowCount: value.rowCount,
		sourceRowCounts: Object.fromEntries(sourceRowCountEntries),
	}
}

const productSourceRowCounts = (
	rows: readonly PersistedCollectionRow[],
	sources?: readonly string[]
): Partial<Record<string, number>> => {
	const counts = new Map((sources ?? []).map((source) => [
		source,
		0,
	]))
	const sourceSet = sources === undefined ? undefined : new Set(sources)
	for (const row of rows) {
		if (sourceSet !== undefined && !sourceSet.has(row[EntityMetaKey.Source]))
			continue

		counts.set(row[EntityMetaKey.Source], (counts.get(row[EntityMetaKey.Source]) ?? 0) + 1)
	}

	return Object.fromEntries([...counts.entries()].toSorted(([left], [right]) => left.localeCompare(right)))
}

const productSubsetLoadedMissReason = (
	collectionId: string,
	loadedKey: string,
	marker: PersistedCollectionLoadedSubset | undefined,
	rows: readonly PersistedCollectionRow[],
	sources: readonly string[]
) => {
	if (marker === undefined)
		return 'missing-marker'

	if (marker.collectionId !== collectionId)
		return 'collection-id-mismatch'

	if (marker.loadedKey !== loadedKey)
		return 'loaded-key-mismatch'

	for (const source of sources) {
		if (marker.sourceRowCounts[source] === undefined)
			return `missing-source:${source}`
	}

	const expectedRowCount = sources.reduce((total, source) => total + (marker.sourceRowCounts[source] ?? 0), 0)
	if (rows.length < expectedRowCount)
		return `row-count-undercount:${expectedRowCount}:${rows.length}`

	const sourceRowCounts = productSourceRowCounts(rows, sources)
	for (const source of sources) {
		const markerSourceRowCount = marker.sourceRowCounts[source] ?? 0
		if ((sourceRowCounts[source] ?? 0) < markerSourceRowCount)
			return `source-count-undercount:${source}:${markerSourceRowCount}:${sourceRowCounts[source] ?? 0}`
	}

	return undefined
}

export const persistedCollectionHydrationPlan = (
	collectionId: string,
	loadedKey: string,
	markerValue: unknown,
	rows: readonly PersistedCollectionRow[],
	requestedSources: readonly string[]
) => {
	const marker = persistedCollectionLoadedSubset(markerValue)
	const missReason = productSubsetLoadedMissReason(
		collectionId,
		loadedKey,
		marker,
		rows,
		requestedSources
	)
	if (marker !== undefined && missReason === undefined)
		return {
			decision: rows.length === 0 ?
				CollectionLoadDecision.LoadedMarker
			:
				CollectionLoadDecision.HydratedRows,
			marker,
			remoteSources: [],
		}

	const sourceRowCounts = productSourceRowCounts(rows)
	const missingSources = marker === undefined ?
		requestedSources
	:
		requestedSources.filter((source) => (
			marker.sourceRowCounts[source] === undefined
			|| (sourceRowCounts[source] ?? 0) < marker.sourceRowCounts[source]
		))
	return {
		decision: CollectionLoadDecision.Remote,
		marker,
		missReason,
		remoteSources: (
			missingSources.length > 0
			|| requestedSources.length === 0 ?
				missingSources
			:
				requestedSources
		),
	}
}

export const persistedCollectionRemoteResult = <
	const _Row extends PersistedCollectionRow,
>({
	collectionId,
	loadedKey,
	marker,
	persistedRows,
	loaded,
	remoteSources,
	requestedSources,
	getKey,
}: {
	collectionId: string
	loadedKey: string
	marker?: PersistedCollectionLoadedSubset
	persistedRows: readonly _Row[]
	loaded: PersistedCollectionRowsLoadResult<_Row>
	remoteSources: readonly string[]
	requestedSources: readonly string[]
	getKey(row: _Row): string | number
}) => {
	const outcomes = [
		...loaded.outcomes,
		...remoteSources
			.filter((source) => !loaded.outcomes.some((outcome) => outcome.source === source))
			.map((source) => ({
				source,
				status: PersistedCollectionSourceStatus.Failed,
				error: `${collectionId} did not account for source ${source}`,
			})),
	]
	const rows = [
		...new Map(
			[
				...persistedRows,
				...loaded.rows,
			].map((row) => [
				getKey(row),
				row,
			])
		).values(),
	]
	const failedSources = new Set(outcomes.flatMap((outcome) => (
		outcome.status === PersistedCollectionSourceStatus.Failed ?
			[outcome.source]
		:
			[]
	)))
	const completedSources = [
		...new Set([
			...Object.keys(marker?.sourceRowCounts ?? {}).filter((source) => !remoteSources.includes(source)),
			...outcomes.flatMap((outcome) => (
				outcome.status === PersistedCollectionSourceStatus.Completed
				&& !failedSources.has(outcome.source) ?
					[outcome.source]
				:
					[]
			)),
		]),
	]
	const sourceRowCounts = productSourceRowCounts(rows, completedSources)
	const failedOutcomes = outcomes.filter((outcome) => (
		outcome.status === PersistedCollectionSourceStatus.Failed
	))
	return {
		rows,
		failedOutcomes,
		nextMarker: {
			collectionId,
			loadedKey,
			rowCount: completedSources.reduce((total, source) => total + (sourceRowCounts[source] ?? 0), 0),
			sourceRowCounts,
		},
		status: requestedSources.every((source) => sourceRowCounts[source] !== undefined) ?
			PersistedCollectionLoadStatus.Completed
		:
			PersistedCollectionLoadStatus.Partial,
	}
}

const persistedCollectionUtils = <
	_Row extends PersistedCollectionRow
>() => {
	let writeRows: ((rows: readonly _Row[]) => void) | undefined
	let replaceRows: ((predicate: (row: _Row) => boolean, rows: readonly _Row[]) => void) | undefined
	let refreshRows: (() => void) | undefined
	let pendingRows: _Row[] = []
	let pendingReplacements: {
		predicate: (row: _Row) => boolean
		rows: readonly _Row[]
	}[] = []
	let refreshPending = false
	const utils: PersistedCollectionRowCollectionUtils<_Row> = {
		dataUpdatedAt: 0,
		replaceRows(predicate, rows) {
			utils.dataUpdatedAt = Date.now()
			if (replaceRows === undefined)
				pendingReplacements.push({
					predicate,
					rows,
				})
			else
				replaceRows(predicate, rows)
		},
		writeUpsert(row) {
			utils.dataUpdatedAt = Date.now()
			if (writeRows === undefined)
				pendingRows.push(...(Array.isArray(row) ? row : [row]))
			else
				writeRows(Array.isArray(row) ? row : [row])
		},
		refresh() {
			if (refreshRows === undefined)
				refreshPending = true
			else
				refreshRows()
		},
	}
	return {
		utils,
		setWriteRows(nextWriteRows: (rows: readonly _Row[]) => void) {
			writeRows = nextWriteRows
			if (pendingRows.length > 0) {
				writeRows(pendingRows)
				pendingRows = []
			}
		},
		setReplaceRows(nextReplaceRows: (predicate: (row: _Row) => boolean, rows: readonly _Row[]) => void) {
			replaceRows = nextReplaceRows
			for (const pendingReplacement of pendingReplacements)
				replaceRows(pendingReplacement.predicate, pendingReplacement.rows)
			pendingReplacements = []
		},
		setRefreshRows(nextRefreshRows: () => void) {
			refreshRows = nextRefreshRows
			if (refreshPending) {
				refreshPending = false
				refreshRows()
			}
		},
	}
}

const persistedCollectionSync = <
	const _Row extends PersistedCollectionRow,
>({
	collectionId,
	schemaVersion,
	persistence,
	getKey,
	loadedKey,
	sources,
	persistedRows,
	loadRows,
	waitForPersistence,
	events,
	collectionLoadFailures,
	setWriteRows,
	setReplaceRows,
	setRefreshRows,
	mountLive,
}: PersistedCollectionSyncOptions<_Row>): SyncConfig<_Row, string | number> => {
	const inFlightLoads = new Map<string, Promise<void>>()
	const forceRemoteKeys = new Set<string>()

	return {
		sync: ({
			collection,
			begin,
			write,
			commit,
			markReady,
			metadata,
		}) => {
			const activeLoadSubsets = new Map<string, {
				count: number
				loadSubsetOptions: LoadSubsetOptions
			}>()
			const liveCleanupByLoadSubsetOptions = new WeakMap<LoadSubsetOptions, () => void>()
			setWriteRows((rows) => {
				begin({
					immediate: true,
				})
				for (const row of rows) {
					if (collection.has(getKey(row)))
						write({
							type: 'delete',
							value: row,
						})

					write({
						type: 'insert',
						value: row,
					})
				}
				commit()
			})
			setReplaceRows((predicate, rows) => {
				begin({
					immediate: true,
				})
				for (const row of collection.toArray)
					if (predicate(row))
						write({
							type: 'delete',
							value: row,
						})
				for (const row of rows)
					write({
						type: 'insert',
						value: row,
					})
				commit()
			})
			const loadSubset = async (loadSubsetOptions: LoadSubsetOptions) => {
				const key = loadedKey(loadSubsetOptions)
				const inFlightLoad = inFlightLoads.get(key)
				if (inFlightLoad !== undefined) {
					await inFlightLoad
					return
				}

				const load = (async () => {
					const requestedSources = sources(loadSubsetOptions)
					const persistedSubsetRows = persistedRows(loadSubsetOptions, collection.toArray)
					const metadataKey = `loadedSubset:${schemaVersion}:${key}`
					const persistedHydrationPlan = persistedCollectionHydrationPlan(
						collectionId,
						key,
						metadata?.collection.get(metadataKey),
						persistedSubsetRows,
						requestedSources
					)
					const hydrationPlan = forceRemoteKeys.delete(key) ? {
						...persistedHydrationPlan,
						decision: CollectionLoadDecision.Remote,
						remoteSources: requestedSources,
						missReason: 'live invalidation',
					} : persistedHydrationPlan
					if (
						hydrationPlan.decision !== CollectionLoadDecision.Remote
						&& hydrationPlan.marker !== undefined
					) {
						events.push({
							type: ClientEventType.CollectionLoad,
							collectionId,
							key,
							decision: hydrationPlan.decision,
							status: PersistedCollectionLoadStatus.Completed,
							rowCount: persistedSubsetRows.length,
							sourceRowCounts: hydrationPlan.marker.sourceRowCounts,
						})
						markReady()
						return
					}

					try {
						events.push({
							type: ClientEventType.CollectionLoad,
							collectionId,
							key,
							decision: CollectionLoadDecision.Remote,
							status: PersistedCollectionLoadStatus.Loading,
							reason: hydrationPlan.missReason,
						})
						const remoteResult = persistedCollectionRemoteResult({
							collectionId,
							loadedKey: key,
							marker: hydrationPlan.marker,
							persistedRows: persistedSubsetRows,
							loaded: await loadRows(loadSubsetOptions, hydrationPlan.remoteSources),
							remoteSources: hydrationPlan.remoteSources,
							requestedSources,
							getKey,
						})
						begin()
						for (const row of remoteResult.rows)
							write({
								type: 'update',
								value: row,
							})

						metadata?.collection.set(metadataKey, remoteResult.nextMarker)
						commit()
						await waitForPersistence?.(collectionId)
						if (persistence.adapter.loadCollectionMetadata !== undefined)
							for (let attempt = 0;;attempt++) {
								const persistedMarker = persistedCollectionLoadedSubset(
									(await persistence.adapter.loadCollectionMetadata(collectionId))
										.find(({ key: persistedKey }) => persistedKey === metadataKey)
										?.value
								)
								if (
									persistedMarker?.collectionId === remoteResult.nextMarker.collectionId
									&& persistedMarker.loadedKey === remoteResult.nextMarker.loadedKey
									&& persistedMarker.rowCount === remoteResult.nextMarker.rowCount
									&& Object.keys(persistedMarker.sourceRowCounts).length
									=== Object.keys(remoteResult.nextMarker.sourceRowCounts).length
									&& Object.entries(remoteResult.nextMarker.sourceRowCounts).every(([source, count]) => (
										persistedMarker.sourceRowCounts[source] === count
									))
								)
									break

								if (attempt === 11_999)
									throw new Error(`${collectionId} did not persist loaded marker ${metadataKey}`)

								await new Promise((resolve) => setTimeout(resolve, 10))
							}

						events.push({
							type: ClientEventType.CollectionLoad,
							collectionId,
							key,
							decision: CollectionLoadDecision.Remote,
							status: remoteResult.status,
							rowCount: remoteResult.rows.length,
							sourceRowCounts: remoteResult.nextMarker.sourceRowCounts,
							reason: hydrationPlan.missReason,
						})
						if (remoteResult.failedOutcomes.length > 0) {
							const subset = parseResolverSubset(loadSubsetOptions)
							for (const outcome of remoteResult.failedOutcomes) {
								const error = `${outcome.source}: ${outcome.error ?? 'failed'}`
								events.push({
									type: ClientEventType.CollectionLoad,
									collectionId,
									key,
									decision: CollectionLoadDecision.Remote,
									status: PersistedCollectionLoadStatus.Failed,
									error,
								})
								if (outcome.error !== 'The user aborted a request.')
									collectionLoadFailures.add({
										collectionId,
										selectorKeys: subset.selectorKeys,
										parentSelectorKeys: subset.parentSelectorKeys,
										sources: [outcome.source],
										error,
									})
							}

							if (remoteResult.status === PersistedCollectionLoadStatus.Partial)
								console.warn(`${collectionId} partially failed ${key}`, remoteResult.failedOutcomes)
						}

						markReady()
					} catch (error) {
						events.push({
							type: ClientEventType.CollectionLoad,
							collectionId,
							key,
							decision: CollectionLoadDecision.Remote,
							status: PersistedCollectionLoadStatus.Failed,
							error: error instanceof Error ? error.message : String(error),
						})
						throw error
					}
				})()
				inFlightLoads.set(key, load)
				try {
					await load
				} finally {
					inFlightLoads.delete(key)
				}
			}
			setRefreshRows(() => {
				for (const [key, activeLoadSubset] of activeLoadSubsets) {
					forceRemoteKeys.add(key)
					void loadSubset(activeLoadSubset.loadSubsetOptions)
				}
			})
			return {
				loadSubset: (loadSubsetOptions) => {
					if (!liveCleanupByLoadSubsetOptions.has(loadSubsetOptions)) {
						const key = loadedKey(loadSubsetOptions)
						const activeLoadSubset = activeLoadSubsets.get(key)
						activeLoadSubsets.set(key, {
							count: (activeLoadSubset?.count ?? 0) + 1,
							loadSubsetOptions,
						})
						liveCleanupByLoadSubsetOptions.set(
							loadSubsetOptions,
							mountLive?.(loadSubsetOptions) ?? (() => {})
						)
					}

					return loadSubset(loadSubsetOptions)
				},
				unloadSubset: (loadSubsetOptions) => {
					liveCleanupByLoadSubsetOptions.get(loadSubsetOptions)?.()
					liveCleanupByLoadSubsetOptions.delete(loadSubsetOptions)
					const key = loadedKey(loadSubsetOptions)
					const activeLoadSubset = activeLoadSubsets.get(key)
					if (activeLoadSubset == null || activeLoadSubset.count === 1)
						activeLoadSubsets.delete(key)
					else
						activeLoadSubsets.set(key, {
							...activeLoadSubset,
							count: activeLoadSubset.count - 1,
						})
				},
			}
		},
	}
}

const resolverContext = <
	const _Schema extends Schema,
	const _Source extends string
>(
	context: ClientContext<_Schema, _Source>,
	source: string,
	subset: ReturnType<typeof parseResolverSubset>
): ResolverContext => ({
	...subset,
	publicEnv: context.resolverPublicEnvBySource.get(source) ?? {},
})

const resolverSnapshotSubsetKey = (
	subset: ReturnType<typeof parseResolverSubset>
) => stringify({
	filters: subset.filters.filter((filter) => (
		filter.fieldPath[0] !== EntityMetaKey.Source
		&& filter.fieldPath[0] !== EntityMetaKey.SelectorKey
		&& filter.fieldPath[0] !== EntityMetaKey.ParentSelectorKey
	)),
	sorts: subset.sorts,
	pagination: subset.pagination,
	sources: subset.sources,
})

const resolverSnapshot = async <
	const _Schema extends Schema,
	const _Source extends string
>(
	context: ClientContext<_Schema, _Source>,
	resolver: SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, ResolverContext>,
	entityDefinition: EntityDefinition,
	entitySelector: EntitySelector<_Schema, EntityType<_Schema>>,
	subset: ReturnType<typeof parseResolverSubset>
) => {
	const selectorName = validateEntitySelector(
		context.schema,
		entityDefinition,
		entitySelector
	).name
	const resolve = resolver.resolve[selectorName]
	if (resolve == null)
		return undefined

	return context.queryClient.fetchQuery({
		queryKey: [
			'client',
			'resolverSnapshot',
			String(resolver.source),
			String(resolver.entityType),
			selectorName,
			String(resolver.definitionIndex),
			stringify(entitySelector),
			resolverSnapshotSubsetKey(subset),
		],
		queryFn: async () => ({
			snapshot: await Promise.resolve(resolve(
				entitySelector,
				resolverContext(
					context,
					String(resolver.source),
					subset
				)
			)),
		}),
		staleTime: Infinity,
	}).then((result) => (
		result.snapshot
	))
}

const requestedSources = (
	subset: ReturnType<typeof parseResolverSubset>,
	defaultSources: readonly string[] | undefined,
	resolverSources: readonly string[]
) => new Set(
	subset.sources
	?? defaultSources
	?? resolverSources
)

const resolvableSources = (
	subset: ReturnType<typeof parseResolverSubset>,
	defaultSources: readonly string[] | undefined,
	resolverSources: readonly string[]
) => {
	const resolverSourceSet = new Set(resolverSources)
	return new Set([...requestedSources(
		subset,
		defaultSources,
		resolverSources
	)].filter((source) => resolverSourceSet.has(source)))
}

const parentSelectorsFromSubset = (
	subset: ReturnType<typeof parseResolverSubset>
) => subset.parentSelectorKeys.map((selectorKey) => ({
	selector: parse(selectorKey),
	selectorKey,
}))

const countFilterKeysFromSubset = (
	subset: ReturnType<typeof parseResolverSubset>
) => new Set(
	subset.filters.flatMap((filter) => {
		if (filter.fieldPath[0] !== 'filterKey')
			return []
		if (filter.operator === 'eq')
			return [String(filter.value)]
		if (Array.isArray(filter.value))
			return filter.value.map(String)
		return []
	})
)

const fieldCanCompleteEmpty = (
	definition: EntityFieldDefinition
) => (
		definition.cardinality === EntityFieldCardinality.Zero
		|| definition.cardinality === EntityFieldCardinality.ZeroOrOne
		|| definition.cardinality === EntityFieldCardinality.Many
		|| definition.cardinality === EntityFieldCardinality.ZeroOrMany
	)

const resolverFieldValueItems = (
	entityType: string,
	fieldName: string,
	source: string,
	definition: EntityFieldDefinition,
	value: unknown
) => {
	if (value === undefined)
		return []

	if (entityFieldCardinalityIsMultiple(definition.cardinality)) {
		if (!Array.isArray(value))
			throw new Error(`${entityType}.${fieldName}.${source} returned non-array value for multiple-cardinality field`)

		return value
	}

	if (
		definition.type !== EntityFieldType.Primitive
		&& Array.isArray(value)
	)
		throw new Error(`${entityType}.${fieldName}.${source} returned array value for single-cardinality field`)

	return [value]
}

const resolverEntityReferenceValueKey = <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	fieldName: string,
	source: string,
	definition: Extract<EntityFieldDefinition, {
		type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
	}>,
	value: unknown
) => {
	if (
		value == null
		|| typeof value !== 'object'
		|| !(EntityMetaKey.Selector in value)
	)
		throw new Error(`${entityType}.${fieldName}.${source} returned invalid entity reference`)

	const entityReference = Object.fromEntries(Object.entries(value))
	const selector = entityReference[EntityMetaKey.Selector]
	if (
		selector == null
		|| typeof selector !== 'object'
		|| Array.isArray(selector)
	)
		throw new Error(`${entityType}.${fieldName}.${source} returned invalid entity reference selector`)

	validateEntitySelector(
		context.schema,
		context.entityDefinitionByType[definition.entityType],
		selector
	)
	return `Entity:${stringify(
		EntityMetaKey.SelectorKey in entityReference ?
			entityReference[EntityMetaKey.SelectorKey]
		:
			entityReference[EntityMetaKey.Selector]
	)}`
}

const resolverFieldValueKey = <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	fieldName: string,
	source: string,
	definition: EntityFieldDefinition,
	value: unknown
) => {
	if (
		definition.type === EntityFieldType.EntityReference
		|| definition.type === EntityFieldType.EntitiesReference
	)
		return resolverEntityReferenceValueKey(
			context,
			entityType,
			fieldName,
			source,
			definition,
			value
		)

	if (!entityFieldPrimitiveValueIsValid(definition, value))
		throw new Error(`${entityType}.${fieldName}.${source} returned invalid primitive value`)

	return `Value:${stringify(value)}`
}

const loadEntityRows = async <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	loadSubsetOptions: LoadSubsetOptions,
	sourceNames?: readonly string[]
) => {
	const subset = parseResolverSubset(loadSubsetOptions)
	const entityDefinition = context.entityDefinitionByType[entityType]
	const resolvers = context.resolverIndexes.resolverDefinitionsByEntityType[entityType] ?? []
	const sources = new Set(sourceNames ?? resolvableSources(
		subset,
		undefined,
		resolvers.map((resolver) => String(resolver.source))
	))
	const results = await Promise.all(subset.selectorKeys.flatMap((selectorKey) => (
		resolvers.flatMap(async (resolver) => {
			if (!sources.has(String(resolver.source)))
				return {
					rows: [],
					outcomes: [],
				}

			const entitySelector = parse(selectorKey)
			const selectorName = validateEntitySelector(
				context.schema,
				entityDefinition,
				entitySelector
			).name
			if (resolver.resolve[selectorName] == null)
				return {
					rows: [],
					outcomes: [],
				}

			try {
				if (await resolverSnapshot(
					context,
					resolver,
					entityDefinition,
					entitySelector,
					subset
				) === undefined)
					return {
						rows: [],
						outcomes: [{
							source: String(resolver.source),
							status: PersistedCollectionSourceStatus.Completed,
						}],
					}

				return {
					rows: [{
						[EntityMetaKey.Selector]: entitySelector,
						[EntityMetaKey.SelectorKey]: selectorKey,
						[EntityMetaKey.Source]: String(resolver.source),
					}],
					outcomes: [{
						source: String(resolver.source),
						status: PersistedCollectionSourceStatus.Completed,
					}],
				}
			} catch (error) {
				return {
					rows: [],
					outcomes: [{
						source: String(resolver.source),
						status: PersistedCollectionSourceStatus.Failed,
						error: error instanceof Error ? error.message : String(error),
					}],
				}
			}
		})
	)))

	return {
		rows: results.flatMap((result) => result.rows),
		outcomes: results.flatMap((result) => result.outcomes),
	}
}

const loadFieldRows = async <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	definition: EntityFieldDefinition,
	loadSubsetOptions: LoadSubsetOptions,
	sourceNames?: readonly string[]
) => {
	const subset = parseResolverSubset(loadSubsetOptions)
	const entityDefinition = context.entityDefinitionByType[entityType]
	const fieldName = definition.name
	const facetPath = entityFieldFacetPath(definition)
	const facetPathKey = stringify(facetPath)
	const resolverParts = context.resolverIndexes.resolverValuePartsByEntityTypeAndFieldName[
		resolverPartsKey(entityType, facetPath, fieldName)
	] ?? []
	const sources = new Set(sourceNames ?? resolvableSources(
		subset,
		definition.defaultSources,
		resolverParts.map((resolverPart) => String(resolverPart.source))
	))
	const parentSelectors = parentSelectorsFromSubset(subset)
	const results = await Promise.all(parentSelectors.flatMap(({
		selector: parentSelector,
		selectorKey: parentSelectorKey,
	}) => {
		const selectorName = validateEntitySelector(
			context.schema,
			entityDefinition,
			parentSelector
		).name
		const selectorOwnsField = (
			entityDefinition.selectors
				.find((selectorDefinition) => selectorDefinition.name === selectorName)
				?.fields
				.includes(fieldName)
			?? false
		)
		if (selectorOwnsField) {
			const selectorValue = parentSelector[fieldName]
			if (selectorValue === undefined)
				return [...sources].map((source) => Promise.resolve({
					rows: [],
					outcomes: [{
						source,
						status: PersistedCollectionSourceStatus.Failed,
						error: `${entityType}.${fieldName}.${source} selector ${selectorName} is missing ${fieldName}`,
					}],
				}))

			const value = (
				definition.type === EntityFieldType.EntityReference ?
					{ [EntityMetaKey.Selector]: selectorValue }
				:
					selectorValue
			)
			return [...sources].map((source) => Promise.resolve({
				rows: resolverFieldValueItems(
					entityType,
					fieldName,
					source,
					definition,
					value
				).map((item, valueIndex) => ({
					facetPath,
					facetPathKey,
					fieldName,
					...(entityFieldCardinalityIsMultiple(definition.cardinality) && {
						valueIndex,
					}),
					[EntityMetaKey.ParentSelector]: parentSelector,
					[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
					[EntityMetaKey.Source]: source,
					[EntityMetaKey.Value]: item,
					valueKey: resolverFieldValueKey(
						context,
						entityType,
						fieldName,
						source,
						definition,
						item
					),
				})),
				outcomes: [{
					source,
					status: PersistedCollectionSourceStatus.Completed,
				}],
			}))
		}

		return resolverParts.flatMap(async (resolverPart) => {
			if (!sources.has(String(resolverPart.source)))
				return {
					rows: [],
					outcomes: [],
				}

			if (resolverPart.resolver.resolve[selectorName] == null)
				return {
					rows: [],
					outcomes: [],
				}

			try {
				const snapshot = await resolverSnapshot(
					context,
					resolverPart.resolver,
					entityDefinition,
					parentSelector,
					subset
				)
				if (snapshot === undefined)
					return fieldCanCompleteEmpty(definition) ?
						{
							rows: [],
							outcomes: [{
								source: String(resolverPart.source),
								status: PersistedCollectionSourceStatus.Completed,
							}],
						}
					:
						{
							rows: [],
							outcomes: [{
								source: String(resolverPart.source),
								status: PersistedCollectionSourceStatus.Failed,
								error: `${entityType}.${fieldName}.${String(resolverPart.source)} returned undefined snapshot for required field`,
							}],
						}

				if (resolverPart.select == null)
					return {
						rows: [],
						outcomes: [{
							source: String(resolverPart.source),
							status: PersistedCollectionSourceStatus.Failed,
							error: `${entityType}.${fieldName}.${String(resolverPart.source)} does not support values`,
						}],
					}

				const value = resolverPart.select(
					snapshot,
					parentSelector,
					resolverContext(
						context,
						String(resolverPart.source),
						subset
					)
				)
				if (
					value === undefined
					&& !fieldCanCompleteEmpty(definition)
				)
					return {
						rows: [],
						outcomes: [{
							source: String(resolverPart.source),
							status: PersistedCollectionSourceStatus.Failed,
							error: `${entityType}.${fieldName}.${String(resolverPart.source)} returned no value for required field`,
						}],
					}

				return {
					rows: resolverFieldValueItems(
						entityType,
						fieldName,
						String(resolverPart.source),
						definition,
						value
					).map((item, valueIndex) => ({
						facetPath,
						facetPathKey,
						fieldName,
						...(entityFieldCardinalityIsMultiple(definition.cardinality) && {
							valueIndex,
						}),
						[EntityMetaKey.ParentSelector]: parentSelector,
						[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
						[EntityMetaKey.Source]: String(resolverPart.source),
						[EntityMetaKey.Value]: item,
						valueKey: resolverFieldValueKey(
							context,
							entityType,
							fieldName,
							String(resolverPart.source),
							definition,
							item
						),
					})),
					outcomes: [{
						source: String(resolverPart.source),
						status: PersistedCollectionSourceStatus.Completed,
					}],
				}
			} catch (error) {
				return {
					rows: [],
					outcomes: [{
						source: String(resolverPart.source),
						status: PersistedCollectionSourceStatus.Failed,
						error: error instanceof Error ? error.message : String(error),
					}],
				}
			}
		})
	}))

	return {
		rows: results.flatMap((result) => result.rows),
		outcomes: results.flatMap((result) => result.outcomes),
	}
}

const loadCountRows = async <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	definition: EntityFieldDefinition,
	loadSubsetOptions: LoadSubsetOptions,
	sourceNames?: readonly string[]
) => {
	const subset = parseResolverSubset(loadSubsetOptions)
	const entityDefinition = context.entityDefinitionByType[entityType]
	const fieldName = definition.name
	const facetPath = entityFieldFacetPath(definition)
	const facetPathKey = stringify(facetPath)
	const filterKeys = countFilterKeysFromSubset(subset)
	const resolverParts = context.resolverIndexes.resolverCountPartsByEntityTypeAndFieldName[
		resolverPartsKey(entityType, facetPath, fieldName)
	] ?? []
	const sources = new Set(sourceNames ?? resolvableSources(
		subset,
		definition.defaultSources,
		resolverParts.map((resolverPart) => String(resolverPart.source))
	))
	const parentSelectors = parentSelectorsFromSubset(subset)
	const results = await Promise.all(parentSelectors.flatMap(({
		selector: parentSelector,
		selectorKey: parentSelectorKey,
	}) => (
		resolverParts.flatMap(async (resolverPart) => {
			if (!sources.has(String(resolverPart.source)))
				return {
					rows: [],
					outcomes: [],
				}

			if (resolverPart.resolver.resolve[validateEntitySelector(
				context.schema,
				entityDefinition,
				parentSelector
			).name] == null)
				return {
					rows: [],
					outcomes: [],
				}

			try {
				const snapshot = await resolverSnapshot(
					context,
					resolverPart.resolver,
					entityDefinition,
					parentSelector,
					subset
				)
				if (snapshot === undefined)
					return fieldCanCompleteEmpty(definition) ?
						{
							rows: [],
							outcomes: [{
								source: String(resolverPart.source),
								status: PersistedCollectionSourceStatus.Completed,
							}],
						}
						:
							{
								rows: [],
								outcomes: [{
									source: String(resolverPart.source),
									status: PersistedCollectionSourceStatus.Failed,
									error: `${entityType}.${fieldName}.${String(resolverPart.source)} returned undefined snapshot for required count`,
								}],
							}

				if (resolverPart.resolveCount == null)
					return {
						rows: [],
						outcomes: [{
							source: String(resolverPart.source),
							status: PersistedCollectionSourceStatus.Failed,
							error: `${entityType}.${fieldName}.${String(resolverPart.source)} does not support counts`,
							}],
						}

				const count = resolverPart.resolveCount(
					snapshot,
					parentSelector,
					resolverContext(
						context,
						String(resolverPart.source),
						subset
					)
				)
				if (!Number.isSafeInteger(count) || count < 0)
					throw new Error(`${entityType}.${fieldName}.${String(resolverPart.source)} returned invalid count ${String(count)}`)

				return {
					rows: [{
						facetPath,
						facetPathKey,
						fieldName,
						[EntityMetaKey.ParentSelector]: parentSelector,
						[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
						[EntityMetaKey.Source]: String(resolverPart.source),
						[EntityMetaKey.Value]: count,
						filterKey: [...filterKeys][0] ?? stringify({}),
					}],
					outcomes: [{
						source: String(resolverPart.source),
						status: PersistedCollectionSourceStatus.Completed,
					}],
				}
			} catch (error) {
				return {
					rows: [],
					outcomes: [{
						source: String(resolverPart.source),
						status: PersistedCollectionSourceStatus.Failed,
						error: error instanceof Error ? error.message : String(error),
					}],
				}
			}
		})
	)))

	return {
		rows: results.flatMap((result) => result.rows),
		outcomes: results.flatMap((result) => result.outcomes),
	}
}

const mountFieldLive = <
	const _Schema extends Schema,
	const _Source extends string,
>(
	context: ClientContext<_Schema, _Source>,
	entityType: EntityType<_Schema>,
	definition: EntityFieldDefinition,
	loadSubsetOptions: LoadSubsetOptions
) => {
	const subset = parseResolverSubset(loadSubsetOptions)
	const facetPath = entityFieldFacetPath(definition)
	const fieldAddressKey = entityFieldAddressKey(entityType, facetPath, definition.name)
	const rootLiveParts = (context.resolverIndexes.resolverRootLivePartsByEntityType[entityType] ?? [])
		.filter((part) => (
			part.publisher.publishes[definition.name] === true
			&& part.facetPath.length === facetPath.length
			&& part.facetPath.every((facetName, index) => facetName === facetPath[index])
		))
	const fieldLiveParts = context.resolverIndexes.resolverLivePartsByEntityTypeAndFieldName[fieldAddressKey] ?? []
	const sources = resolvableSources(
		subset,
		definition.defaultSources,
		[
			...rootLiveParts.map((part) => String(part.source)),
			...fieldLiveParts.map((part) => String(part.source)),
		]
	)
	const releases: (() => void)[] = []
	for (const {
		selector: parentEntitySelector,
		selectorKey: parentSelectorKey,
	} of parentSelectorsFromSubset(subset)) {
		const selectorName = validateEntitySelector(
			context.schema,
			context.entityDefinitionByType[entityType],
			parentEntitySelector
		).name
		const fieldsForSource = (source: string, liveFacetPath: EntityFacetPath): ResolveLiveFields<_Schema, EntityType<_Schema>> & Readonly<Record<string, ResolveLiveFieldHandle<_Schema, EntityType<_Schema>, string>>> => new Proxy(Object.assign(Object.create(null), {
			invalidate: (fieldNames: readonly EntityFieldName<_Schema, EntityType<_Schema>>[]) => {
				for (const fieldName of fieldNames) {
					const liveFieldAddressKey = entityFieldAddressKey(entityType, liveFacetPath, fieldName)
					context.queryClient.removeQueries({
						predicate: (query) => (
							query.queryKey[0] === 'client'
							&& query.queryKey[1] === 'resolverSnapshot'
							&& query.queryKey[2] === source
							&& query.queryKey[3] === entityType
							&& query.queryKey[6] === stringify(parentEntitySelector)
						),
					})
					context.entityFieldCollections[entityType][liveFieldAddressKey]?.utils.refresh()
				}
			},
		}), {
			get: (target, property) => {
				if (property === 'invalidate')
					return target.invalidate

				const fieldName = String(property)
				const liveFieldAddressKey = entityFieldAddressKey(entityType, liveFacetPath, fieldName)
				const liveFieldDefinition = context.entityFieldDefinitionByEntityTypePathAndName[entityType][liveFieldAddressKey]
				if (liveFieldDefinition == null)
					throw new Error(`${liveFieldAddressKey}: unknown live field`)

				const invalidate = () => {
					target.invalidate([fieldName])
				}
				return {
					replaceRows: (rows: readonly {
						source: string
						value: unknown
					}[]) => {
						const collection = context.entityFieldCollections[entityType][liveFieldAddressKey]
						collection.utils.replaceRows(
							(row) => (
								row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
								&& row[EntityMetaKey.Source] === source
							),
							rows.flatMap((row) => {
								if (row.source !== source)
									throw new Error(`${liveFieldAddressKey} live publisher cannot write ${row.source} rows from ${source}`)

								return resolverFieldValueItems(
									entityType,
									fieldName,
									source,
									liveFieldDefinition,
									row.value
								).map((value, valueIndex) => ({
									facetPath: liveFacetPath,
									facetPathKey: stringify(liveFacetPath),
									fieldName,
									...(entityFieldCardinalityIsMultiple(liveFieldDefinition.cardinality) && {
										valueIndex,
									}),
									[EntityMetaKey.ParentSelector]: parentEntitySelector,
									[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
									[EntityMetaKey.Source]: source,
									[EntityMetaKey.Value]: value,
									valueKey: resolverFieldValueKey(
										context,
										entityType,
										fieldName,
										source,
										liveFieldDefinition,
										value
									),
								}))
							})
						)
					},
					invalidate,
					count: {
						replaceRows: (rows: readonly {
							source: string
							value: number
						}[]) => {
							const countCollection = context.entityFieldCountCollections[entityType][liveFieldAddressKey]
							if (countCollection == null)
								throw new Error(`${liveFieldAddressKey}: missing count collection`)

							const filterKey = [...countFilterKeysFromSubset(subset)][0] ?? stringify({})

							for (const row of rows) {
								if (row.source !== source)
									throw new Error(`${liveFieldAddressKey} live publisher cannot write ${row.source} counts from ${source}`)

								if (!Number.isSafeInteger(row.value) || row.value < 0)
									throw new Error(`${liveFieldAddressKey} live publisher returned invalid count ${String(row.value)}`)
							}
							countCollection.utils.replaceRows(
								(row) => (
									row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
									&& row[EntityMetaKey.Source] === source
									&& row.facetPathKey === stringify(liveFacetPath)
									&& row.filterKey === filterKey
								),
								rows.map((row) => ({
									facetPath: liveFacetPath,
									facetPathKey: stringify(liveFacetPath),
									fieldName,
									filterKey,
									[EntityMetaKey.ParentSelector]: parentEntitySelector,
									[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
									[EntityMetaKey.Source]: source,
									[EntityMetaKey.Value]: row.value,
								}))
							)
						},
						invalidate: () => {
							context.entityFieldCountCollections[entityType][liveFieldAddressKey]?.utils.refresh()
						},
					},
				}
			},
		})
		const acquire = (
			scope: string,
			start: (abortController: AbortController) => void | (() => void) | Promise<void | (() => void)>
		) => {
			const active = context.liveSubscriptions.get(scope)
			if (active != null) {
				active.referenceCount += 1
				return () => {
					active.referenceCount -= 1
					if (active.referenceCount === 0) {
						active.stopped = true
						active.abortController.abort()
						active.cleanup?.()
						context.liveSubscriptions.delete(scope)
					}
				}
			}

			const abortController = new AbortController()
			const subscription: ClientLiveSubscription = {
				abortController,
				referenceCount: 1,
				stopped: false,
			}
			context.liveSubscriptions.set(scope, subscription)
			void Promise.resolve(start(abortController)).then((cleanup) => {
				if (cleanup == null)
					return
				if (subscription.stopped)
					cleanup()
				else
					Object.assign(subscription, {
						cleanup,
					})
			})
			return () => {
				subscription.referenceCount -= 1
				if (subscription.referenceCount === 0) {
					subscription.stopped = true
					subscription.abortController.abort()
					subscription.cleanup?.()
					context.liveSubscriptions.delete(scope)
				}
			}
		}

		for (const part of rootLiveParts) {
			if (!sources.has(String(part.source)))
				continue

			const source = String(part.source)
			releases.push(acquire(stringify([
				'root',
				source,
				part.resolver.definitionIndex,
				part.publisherName,
				entityType,
				facetPath,
				parentSelectorKey,
			]), (abortController) => part.publisher.start({
				parentEntitySelector,
				queryClient: context.queryClient,
				signal: abortController.signal,
				trigger: {
					...resolverContext(context, source, subset),
					fieldName: definition.name,
					sources: [...sources],
				},
				fields: fieldsForSource(source, part.facetPath),
			})))
		}
		for (const part of fieldLiveParts) {
			if (
				!sources.has(String(part.source))
				|| !(part.parentSelectors ?? Object.keys(part.resolver.resolve)).includes(selectorName)
				|| part.resolveLive == null
			)
				continue

			const source = String(part.source)
			const fields = fieldsForSource(source, part.facetPath)
			const resolveLive = part.resolveLive
			releases.push(acquire(stringify([
				'field',
				source,
				part.resolver.definitionIndex,
				part.partIndex,
				entityType,
				facetPath,
				definition.name,
				parentSelectorKey,
			]), (abortController) => resolveLive.start({
				parentEntitySelector,
				queryClient: context.queryClient,
				signal: abortController.signal,
				trigger: {
					...resolverContext(context, source, subset),
					fieldName: definition.name,
					sources: [...sources],
				},
				fields,
				field: fields[definition.name],
			})))
		}
	}

	return () => {
		for (const release of releases)
			release()
	}
}

export const client = <
	const _Schema extends Schema,
	const _SourceProvider extends PropertyKey,
	const _Source extends string,
>({
	schema,
	sourceProviders,
}: {
	schema: _Schema
	sourceProviders: readonly SourceProviderDefinition<_SourceProvider, _Source>[]
}) => ({
	resolvers,
	env,
}: {
	resolvers: readonly SourceResolverModule<_Schema, _Source, ResolverContext>[]
	env: Record<string, string | undefined>
}) => ({
	queryClient,
	persistence,
	schemaVersion,
	waitForPersistence,
}: {
	queryClient: QueryClient
	persistence: PersistedCollectionPersistence
	schemaVersion: number
	waitForPersistence?: (collectionId: string) => Promise<void>
}) => {
	let context: ClientContext<_Schema, _Source> | undefined
	const requireContext = () => {
		if (context === undefined)
			throw new Error('Client context was read before construction completed')

		return context
	}
	const {
		enabledSources,
		resolverPublicEnvBySource,
	} = indexSourceProviders(
		sourceProviders,
		env
	)
	const {
		resolverIndexes,
	} = indexResolvers(
		schema,
		resolvers,
		enabledSources
	)
	const sourceBindingsBySource = Object.groupBy(
		sourceProviders.flatMap((sourceProvider) => sourceProvider.bindings ?? []),
		(sourceBinding) => String(sourceBinding.source)
	)
	for (const liveSource of new Set([
		...Object.keys(resolverIndexes.resolverRootLivePartsByEntityType).flatMap((key) => (
			resolverIndexes.resolverRootLivePartsByEntityType[key] ?? []
		)),
		...Object.keys(resolverIndexes.resolverLivePartsByEntityTypeAndFieldName).flatMap((key) => (
			resolverIndexes.resolverLivePartsByEntityTypeAndFieldName[key] ?? []
		)),
	].map((part) => String(part.source)))) {
		const sourceBindings = sourceBindingsBySource[liveSource] ?? []
		if (
			sourceBindings.length > 0
			&& !sourceBindings.some((sourceBinding) => sourceBinding.delivery === SourceDelivery.RemoteLive)
		)
			throw new Error(`${liveSource} declares resolveLive without a RemoteLive source binding`)
	}
	const {
		entityDefinitionByType,
		projectionDefinitionByEntityTypeAndPath,
		entityFieldDefinitionByEntityTypePathAndName,
		entitySelectorDefinitionByEntityTypeAndName,
	} = indexSchema(schema)

	const entityCollections: EntityCollections<_Schema> = {}
	const entityFieldCollections: EntityFieldCollections<_Schema> = {}
	const entityFieldCountCollections: EntityFieldCountCollections<_Schema> = {}
	const liveSubscriptions = new Map<string, ClientLiveSubscription>()
	const events: ClientEvent[] = []
	const collectionLoadFailureListeners = new Set<() => void>()
	const collectionLoadFailures: PersistedCollectionLoadFailures = {
		list: [],
		add(failure) {
			this.list.push(failure)
			for (const listener of collectionLoadFailureListeners)
				listener()
		},
		subscribe(listener) {
			collectionLoadFailureListeners.add(listener)
			return () => {
				collectionLoadFailureListeners.delete(listener)
			}
		},
	}
	for (const entityDefinition of schema) {
		const entityCollectionUtils = persistedCollectionUtils<EntityCollectionItem<_Schema>>()
		entityCollections[entityDefinition.entityType] = createCollection<
			EntityCollectionItem<_Schema>,
			string | number,
			PersistedCollectionRowCollectionUtils<EntityCollectionItem<_Schema>>
		>(
			persistedCollectionOptions<
				EntityCollectionItem<_Schema>,
				string | number,
				never,
				PersistedCollectionRowCollectionUtils<EntityCollectionItem<_Schema>>
			>({
				id: `client.entities.${entityDefinition.entityType}`,
				syncMode: 'on-demand',
				sync: persistedCollectionSync({
					collectionId: `client.entities.${entityDefinition.entityType}`,
					schemaVersion,
					persistence,
					getKey: (row) => stringify([
						row[EntityMetaKey.Source],
						row[EntityMetaKey.SelectorKey],
					]),
					loadedKey: (loadSubsetOptions) => stringify(plainLoadSubsetKeyValue({
						where: loadSubsetOptions.where,
						orderBy: loadSubsetOptions.orderBy,
						limit: loadSubsetOptions.limit,
						cursor: loadSubsetOptions.cursor,
						offset: loadSubsetOptions.offset,
					})),
					sources: (loadSubsetOptions) => {
						const subset = parseResolverSubset(loadSubsetOptions)
						const resolvers = resolverIndexes.resolverDefinitionsByEntityType[entityDefinition.entityType] ?? []
						return [
							...resolvableSources(
								subset,
								undefined,
								resolvers.map((resolver) => String(resolver.source))
							),
						]
					},
					persistedRows: (loadSubsetOptions, rows) => {
						const subset = parseResolverSubset(loadSubsetOptions)
						const sources = resolvableSources(
							subset,
							undefined,
							(resolverIndexes.resolverDefinitionsByEntityType[entityDefinition.entityType] ?? [])
								.map((resolver) => String(resolver.source))
						)
						return rows.filter((row) => (
							sources.has(row[EntityMetaKey.Source])
							&& subset.selectorKeys.includes(row[EntityMetaKey.SelectorKey])
						))
					},
					loadRows: (loadSubsetOptions, sources) => loadEntityRows(
						requireContext(),
						entityDefinition.entityType,
						loadSubsetOptions,
						sources
					),
					waitForPersistence,
					events,
					collectionLoadFailures,
					setWriteRows: entityCollectionUtils.setWriteRows,
					setReplaceRows: entityCollectionUtils.setReplaceRows,
					setRefreshRows: entityCollectionUtils.setRefreshRows,
				}),
				getKey: (row) => stringify([
					row[EntityMetaKey.Source],
					row[EntityMetaKey.SelectorKey],
				]),
				persistence,
				schemaVersion,
				utils: entityCollectionUtils.utils,
				onDelete: async () => {},
			})
			)
			entityFieldCollections[entityDefinition.entityType] = {}
			entityFieldCountCollections[entityDefinition.entityType] = {}
			for (const definition of entityFieldDefinitions(entityDefinition)) {
				const facetPath = entityFieldFacetPath(definition)
				const facetPathKey = stringify(facetPath)
				const fieldAddressKey = entityFieldAddressKey(entityDefinition.entityType, facetPath, definition.name)
				const fieldCollectionId = stringify([
					'client.fields',
					entityDefinition.entityType,
					facetPath,
					definition.name,
				])
				const countCollectionId = stringify([
					'client.counts',
					entityDefinition.entityType,
					facetPath,
					definition.name,
				])
				const entityFieldCollectionUtils = persistedCollectionUtils<EntityFieldCollectionItem<
					_Schema,
					typeof entityDefinition.entityType,
					typeof definition.name
				>>()
				entityFieldCollections[entityDefinition.entityType][fieldAddressKey] = createCollection<
					EntityFieldCollectionItem<
						_Schema,
						typeof entityDefinition.entityType,
						typeof definition.name
					>,
					string | number,
					PersistedCollectionRowCollectionUtils<EntityFieldCollectionItem<
						_Schema,
						typeof entityDefinition.entityType,
						typeof definition.name
					>>
				>(
					persistedCollectionOptions<
						EntityFieldCollectionItem<
							_Schema,
							typeof entityDefinition.entityType,
							typeof definition.name
						>,
						string | number,
						never,
						PersistedCollectionRowCollectionUtils<EntityFieldCollectionItem<
							_Schema,
							typeof entityDefinition.entityType,
							typeof definition.name
						>>
					>({
						id: fieldCollectionId,
						syncMode: 'on-demand',
						sync: persistedCollectionSync({
							collectionId: fieldCollectionId,
							schemaVersion,
							persistence,
							getKey: (row) => stringify([
								row[EntityMetaKey.Source],
								row[EntityMetaKey.ParentSelectorKey],
								row.facetPathKey,
								row.valueKey,
							]),
							loadedKey: (loadSubsetOptions) => stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
							sources: (loadSubsetOptions) => {
								const subset = parseResolverSubset(loadSubsetOptions)
								const resolverParts = resolverIndexes.resolverValuePartsByEntityTypeAndFieldName[
									resolverPartsKey(entityDefinition.entityType, facetPath, definition.name)
								] ?? []
								return [
									...resolvableSources(
										subset,
										definition.defaultSources,
										resolverParts.map((resolverPart) => String(resolverPart.source))
									),
								]
							},
							persistedRows: (loadSubsetOptions, rows) => {
								const subset = parseResolverSubset(loadSubsetOptions)
								const sources = resolvableSources(
									subset,
									definition.defaultSources,
									(resolverIndexes.resolverValuePartsByEntityTypeAndFieldName[
										resolverPartsKey(entityDefinition.entityType, facetPath, definition.name)
									] ?? []).map((resolverPart) => String(resolverPart.source))
								)
								return rows.filter((row) => (
									sources.has(row[EntityMetaKey.Source])
									&& row.facetPathKey === facetPathKey
									&& subset.parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
								))
							},
							loadRows: (loadSubsetOptions, sources) => loadFieldRows(
								requireContext(),
								entityDefinition.entityType,
								definition,
								loadSubsetOptions,
								sources
							),
							waitForPersistence,
							events,
							collectionLoadFailures,
							setWriteRows: entityFieldCollectionUtils.setWriteRows,
							setReplaceRows: entityFieldCollectionUtils.setReplaceRows,
							setRefreshRows: entityFieldCollectionUtils.setRefreshRows,
							mountLive: (loadSubsetOptions) => mountFieldLive(
								requireContext(),
								entityDefinition.entityType,
								definition,
								loadSubsetOptions
							),
						}),
						getKey: (row) => stringify([
							row[EntityMetaKey.Source],
							row[EntityMetaKey.ParentSelectorKey],
							row.facetPathKey,
							row.valueKey,
						]),
						persistence,
						schemaVersion,
						autoIndex: 'eager',
						defaultIndexType: BasicIndex,
						utils: entityFieldCollectionUtils.utils,
						onDelete: async () => {},
					})
				)
				entityFieldCollections[entityDefinition.entityType][fieldAddressKey].createIndex(
					(row) => row.valueIndex,
					{
						indexType: BasicIndex,
					}
				)
			if (
				definition.type === EntityFieldType.EntitiesReference
				|| definition.cardinality === EntityFieldCardinality.Many
				|| definition.cardinality === EntityFieldCardinality.ZeroOrMany
			) {
				const entityFieldCountCollectionUtils = persistedCollectionUtils<EntityFieldCountCollectionItem<_Schema>>()
				entityFieldCountCollections[entityDefinition.entityType][fieldAddressKey] = createCollection<
					EntityFieldCountCollectionItem<_Schema>,
					string | number,
					PersistedCollectionRowCollectionUtils<EntityFieldCountCollectionItem<_Schema>>
				>(
					persistedCollectionOptions<
						EntityFieldCountCollectionItem<_Schema>,
						string | number,
						never,
						PersistedCollectionRowCollectionUtils<EntityFieldCountCollectionItem<_Schema>>
					>({
						id: countCollectionId,
						syncMode: 'on-demand',
						sync: persistedCollectionSync({
							collectionId: countCollectionId,
							schemaVersion,
							persistence,
							getKey: (row) => stringify([
								row[EntityMetaKey.Source],
								row[EntityMetaKey.ParentSelectorKey],
								row.facetPathKey,
								row.filterKey,
							]),
							loadedKey: (loadSubsetOptions) => stringify(countLoadedSubsetKey(loadSubsetOptions)),
							sources: (loadSubsetOptions) => {
								const subset = parseResolverSubset(loadSubsetOptions)
								const resolverParts = resolverIndexes.resolverCountPartsByEntityTypeAndFieldName[
									resolverPartsKey(entityDefinition.entityType, facetPath, definition.name)
								] ?? []
								return [
									...resolvableSources(
										subset,
										definition.defaultSources,
										resolverParts.map((resolverPart) => String(resolverPart.source))
									),
								]
							},
							persistedRows: (loadSubsetOptions, rows) => {
								const subset = parseResolverSubset(loadSubsetOptions)
								const filterKeys = countFilterKeysFromSubset(subset)
								const sources = resolvableSources(
									subset,
									definition.defaultSources,
									(resolverIndexes.resolverCountPartsByEntityTypeAndFieldName[
										resolverPartsKey(entityDefinition.entityType, facetPath, definition.name)
									] ?? []).map((resolverPart) => String(resolverPart.source))
								)
								return rows.filter((row) => (
									sources.has(row[EntityMetaKey.Source])
									&& row.facetPathKey === facetPathKey
									&& subset.parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
									&& (filterKeys.size === 0 || filterKeys.has(row.filterKey))
								))
							},
							loadRows: (loadSubsetOptions, sources) => loadCountRows(
								requireContext(),
								entityDefinition.entityType,
								definition,
								loadSubsetOptions,
								sources
							),
							waitForPersistence,
							events,
							collectionLoadFailures,
							setWriteRows: entityFieldCountCollectionUtils.setWriteRows,
							setReplaceRows: entityFieldCountCollectionUtils.setReplaceRows,
							setRefreshRows: entityFieldCountCollectionUtils.setRefreshRows,
						}),
						getKey: (row) => stringify([
							row[EntityMetaKey.Source],
							row[EntityMetaKey.ParentSelectorKey],
							row.facetPathKey,
							row.filterKey,
						]),
						persistence,
						schemaVersion,
						utils: entityFieldCountCollectionUtils.utils,
						onDelete: async () => {},
					})
				)
			}
		}
	}

	context = {
		schema,
		entityDefinitionByType,
		projectionDefinitionByEntityTypeAndPath,
		entityFieldDefinitionByEntityTypePathAndName,
		entitySelectorDefinitionByEntityTypeAndName,
		resolverIndexes,
		resolverPublicEnvBySource,
		enabledSources,
		collectionLoadFailures,
		queryClient,
		events,
		schemaVersion,
		entityCollections,
		entityFieldCollections,
		entityFieldCountCollections,
		liveSubscriptions,
		select: (
			entityType,
			entitySelector,
			selection
		) => createEntityProxy(
			requireContext(),
			entityType,
			entitySelector,
			selection
		),
	}

	return context
}

export { subscribeEntity } from '$/client/$subscribe.svelte.ts'
