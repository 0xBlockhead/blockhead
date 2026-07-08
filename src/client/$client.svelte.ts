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
	type EntityFieldCondition,
	type EntityFieldDefinition,
	type EntityFieldDefinitionByEntityTypeAndName,
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


export enum ClientEventType {
	CollectionLoad = 'collection-load',
}

export enum CollectionLoadDecision {
	Persisted = 'persisted',
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

enum FieldConditionState {
	Active = 'active',
	Inactive = 'inactive',
	Unconditional = 'unconditional',
	Unknown = 'unknown',
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
	getKey(row: _Row): string | number
	loadedKey(loadSubsetOptions: LoadSubsetOptions): string
	sources(loadSubsetOptions: LoadSubsetOptions): readonly string[]
	persistedRows(loadSubsetOptions: LoadSubsetOptions, rows: readonly _Row[]): readonly _Row[]
	loadRows(loadSubsetOptions: LoadSubsetOptions, sources: readonly string[]): Promise<PersistedCollectionRowsLoadResult<_Row>>
	waitForPersistence?(collectionId: string): Promise<void>
	events: ClientEvent[]
	collectionLoadFailures: PersistedCollectionLoadFailures
	setWriteRows(writeRows: (rows: readonly _Row[]) => void): void
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
	writeUpsert(row: _Row | readonly _Row[]): void
}

type EntityCollectionWriteSurface = {
	delete(key: string | number): void
	utils: {
		writeUpsert(row: object | object[]): void
	}
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
	entityFieldDefinitionByEntityTypeAndName: EntityFieldDefinitionByEntityTypeAndName<_Schema>
	entityFieldDefinitionByEntityTypePathAndName: EntityFieldDefinitionByEntityTypePathAndName<_Schema>
	entitySelectorDefinitionByEntityTypeAndName: EntitySelectorDefinitionByEntityTypeAndName<_Schema>
	entityCollections: EntityCollections<_Schema>
	entityFieldCollections: EntityFieldCollections<_Schema>
	entityFieldCountCollections: EntityFieldCountCollections<_Schema>
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
		& {
			readonly [
				_FieldName in keyof _Fields & EntityFieldName<_Schema, _EntityType> as (
					EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName> extends { readonly when: EntityFieldCondition } ?
						never
					:
						_FieldName
				)
			]: SubscribeFieldResult<_Schema, _EntityType, _FieldName>
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
							]: SubscribeFieldResult<_Schema, _EntityType, _FieldName>
						}
						| {
							readonly [
								_ConditionalFieldName in _FieldName
							]: SubscribeFieldResult<_Schema, _EntityType, _FieldName> | undefined
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
			SubscribeAllResultFields<_Schema, _EntityType>
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
		|| value.sourceRowCounts == null
		|| typeof value.sourceRowCounts !== 'object'
	)
		return undefined

	const sourceRowCountEntries: [string, number][] = []
	for (const source of Object.keys(value.sourceRowCounts)) {
		const count = Object.getOwnPropertyDescriptor(value.sourceRowCounts, source)?.value
		if (typeof count === 'number')
			sourceRowCountEntries.push([
				source,
				count,
			])
	}

	return {
		collectionId: value.collectionId,
		loadedKey: value.loadedKey,
		rowCount: value.rowCount,
		sourceRowCounts: Object.fromEntries(sourceRowCountEntries),
	}
}

const productSourceRowCounts = (
	rows: readonly PersistedCollectionRow[],
	sources: readonly string[] = []
): Partial<Record<string, number>> => {
	const counts = new Map(sources.map((source) => [
		source,
		0,
	]))
	for (const row of rows)
		counts.set(row[EntityMetaKey.Source], (counts.get(row[EntityMetaKey.Source]) ?? 0) + 1)
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

	if (rows.length < marker.rowCount)
		return `row-count-undercount:${marker.rowCount}:${rows.length}`

	const sourceRowCounts = productSourceRowCounts(rows, Object.keys(marker.sourceRowCounts))
	for (const source of sources) {
		const markerSourceRowCount = marker.sourceRowCounts[source]
		if (markerSourceRowCount === undefined)
			return `missing-source:${source}`

		if ((sourceRowCounts[source] ?? 0) < markerSourceRowCount)
			return `source-count-undercount:${source}:${markerSourceRowCount}:${sourceRowCounts[source] ?? 0}`
	}

	return undefined
}

const persistedCollectionUtils = <
	_Row extends PersistedCollectionRow
>() => {
	let writeRows: (rows: readonly _Row[]) => void = (_rows) => {
		throw new Error('Persisted collection sync was written before it started')
	}
	const utils: PersistedCollectionRowCollectionUtils<_Row> = {
		dataUpdatedAt: 0,
		writeUpsert(row) {
			utils.dataUpdatedAt = Date.now()
			writeRows(Array.isArray(row) ? row : [row])
		},
	}
	return {
		utils,
		setWriteRows(nextWriteRows: (rows: readonly _Row[]) => void) {
			writeRows = nextWriteRows
		},
	}
}

const persistedCollectionSync = <
	const _Row extends PersistedCollectionRow,
>({
	collectionId,
	schemaVersion,
	getKey,
	loadedKey,
	sources,
	persistedRows,
	loadRows,
	waitForPersistence,
	events,
	collectionLoadFailures,
	setWriteRows,
}: PersistedCollectionSyncOptions<_Row>): SyncConfig<_Row, string | number> => {
	const inFlightLoads = new Map<string, Promise<void>>()

	return {
		sync: ({
			collection,
			begin,
			write,
			commit,
			markReady,
			metadata,
		}) => {
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
			return {
			loadSubset: async (loadSubsetOptions) => {
				const key = loadedKey(loadSubsetOptions)
				const inFlightLoad = inFlightLoads.get(key)
				if (inFlightLoad !== undefined) {
					await inFlightLoad
					return
				}

					const load = (async () => {
						const requestedSources = sources(loadSubsetOptions)
						const rows = persistedRows(loadSubsetOptions, collection.toArray)
						const metadataKey = `loadedSubset:${schemaVersion}:${key}`
						const marker = persistedCollectionLoadedSubset(metadata?.collection.get(metadataKey))
					const missReason = productSubsetLoadedMissReason(
						collectionId,
						key,
						marker,
						rows,
						requestedSources
					)
					const sourceRowCounts = productSourceRowCounts(rows)
					const remoteSources = (
						marker === undefined ?
							requestedSources
						:
							requestedSources.filter((source) => (
								marker.sourceRowCounts[source] === undefined
								|| (sourceRowCounts[source] ?? 0) < marker.sourceRowCounts[source]
							))
					)
					if (marker !== undefined && missReason === undefined) {
						events.push({
							type: ClientEventType.CollectionLoad,
							collectionId,
							key,
							decision: CollectionLoadDecision.Persisted,
							status: PersistedCollectionLoadStatus.Completed,
							rowCount: marker.rowCount,
							sourceRowCounts: marker.sourceRowCounts,
						})
						markReady()
						return
					}

					try {
							if (remoteSources.length === 0) {
								const subset = parseResolverSubset(loadSubsetOptions)
								collectionLoadFailures.add({
									collectionId,
									selectorKeys: subset.selectorKeys,
									parentSelectorKeys: subset.parentSelectorKeys,
									sources: requestedSources,
									error: missReason ?? `${collectionId} has no remote sources for ${key}`,
								})
								events.push({
									type: ClientEventType.CollectionLoad,
								collectionId,
								key,
								decision: CollectionLoadDecision.Remote,
								status: PersistedCollectionLoadStatus.Failed,
								error: missReason,
							})
							markReady()
							return
						}

							events.push({
								type: ClientEventType.CollectionLoad,
								collectionId,
								key,
								decision: CollectionLoadDecision.Remote,
								status: PersistedCollectionLoadStatus.Loading,
								reason: missReason,
							})
							const loaded = await loadRows(loadSubsetOptions, remoteSources)
						const rows = [
							...new Map(
								[
									...persistedRows(loadSubsetOptions, collection.toArray),
									...loaded.rows,
								]
									.map((row) => [
										getKey(row),
										row,
									])
							).values(),
						]
						const sourceRowCounts = productSourceRowCounts(rows, [
							...new Set([
								...Object.keys(marker?.sourceRowCounts ?? {}),
								...loaded.outcomes.flatMap((outcome) => (
									outcome.status === PersistedCollectionSourceStatus.Completed ?
										[outcome.source]
									:
										[]
								)),
							]),
						])
						const nextMarker = {
							collectionId,
							loadedKey: key,
							rowCount: rows.length,
							sourceRowCounts,
						}
							begin()
							for (const row of rows)
								write({
									type: 'update',
									value: row,
								})

						metadata?.collection.set(metadataKey, nextMarker)
						commit()

						events.push({
							type: ClientEventType.CollectionLoad,
							collectionId,
							key,
							decision: CollectionLoadDecision.Remote,
							status: requestedSources.every((source) => sourceRowCounts[source] !== undefined) ?
								PersistedCollectionLoadStatus.Completed
							:
								PersistedCollectionLoadStatus.Partial,
							rowCount: rows.length,
							sourceRowCounts,
							reason: missReason,
						})
						const failedOutcomes = loaded.outcomes.filter((outcome) => (
							outcome.status === PersistedCollectionSourceStatus.Failed
						))
						if (
							failedOutcomes.length > 0
							&& loaded.outcomes.some((outcome) => (
								outcome.status === PersistedCollectionSourceStatus.Completed
							))
						)
							console.warn(`${collectionId} partially failed ${key}`, failedOutcomes)

						for (const outcome of failedOutcomes)
							events.push({
								type: ClientEventType.CollectionLoad,
								collectionId,
								key,
								decision: CollectionLoadDecision.Remote,
								status: PersistedCollectionLoadStatus.Failed,
								error: `${outcome.source}: ${outcome.error ?? 'failed'}`,
							})

						if (
							rows.length === 0
							&& requestedSources.length > 0
							&& failedOutcomes.length > 0
							&& !loaded.outcomes.some((outcome) => (
								outcome.status === PersistedCollectionSourceStatus.Completed
							))
							) {
								const subset = parseResolverSubset(loadSubsetOptions)
								const error = `${collectionId} failed every requested source for ${key}`
								if (failedOutcomes.every((outcome) => outcome.error === 'The user aborted a request.'))
									console.warn(error, failedOutcomes)
								else {
									console.error(error, failedOutcomes)
									collectionLoadFailures.add({
										collectionId,
										selectorKeys: subset.selectorKeys,
										parentSelectorKeys: subset.parentSelectorKeys,
										sources: requestedSources,
										error,
									})
								}
								markReady()
								return
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

const fieldConditionValue = <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	parentSelector: Record<string, { readonly [index: number]: unknown } | undefined>,
	parentSelectorKey: string,
	condition: EntityFieldCondition
) => {
	const selectorValue = parentSelector[condition.fieldName]
	if (selectorValue !== undefined)
		return (
			condition.itemIndex === undefined ?
				selectorValue
			:
				selectorValue[condition.itemIndex]
		)

	for (const row of context.entityFieldCollections[entityType][
		entityFieldAddressKey(entityType, [], condition.fieldName)
	].toArray.toReversed()) {
		if (row[EntityMetaKey.ParentSelectorKey] !== parentSelectorKey)
			continue

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
	context: ClientContext<_Schema>,
	entityType: string,
	parentSelector: Record<string, { readonly [index: number]: unknown } | undefined>,
	parentSelectorKey: string,
	definition: EntityFieldDefinition
) => {
	if (definition.when === undefined)
		return FieldConditionState.Unconditional

	const value = fieldConditionValue(
		context,
		entityType,
		parentSelector,
		parentSelectorKey,
		definition.when
	)
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
	context: ClientContext<_Schema>,
	entityType: string,
	parentSelector: Record<string, { readonly [index: number]: unknown } | undefined>,
	parentSelectorKey: string,
	definition: EntityFieldDefinition
) => {
	const conditionState = fieldConditionState(
		context,
		entityType,
		parentSelector,
		parentSelectorKey,
		definition
	)
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

const fieldDefinition = (
	entityDefinition: EntityDefinition,
	fieldName: string
) => {
	const definition = entityFieldDefinitions(entityDefinition)
		.find((candidate) => candidate.name === fieldName)
	if (definition == null)
		throw new Error(`${entityDefinition.entityType}.${fieldName} does not exist`)

	return definition
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
	if (entityDefinition.selectors.some((selectorDefinition) => selectorDefinition.fields.includes(fieldName))) {
		const results = parentSelectorsFromSubset(subset).flatMap(({
			selector: parentSelector,
			selectorKey: parentSelectorKey,
		}) => {
			const selectorValue = parentSelector[fieldName]
			if (selectorValue === undefined)
				return []

			return [...sources].map((source) => {
				const value = (
					definition.type === EntityFieldType.EntityReference ?
						{ [EntityMetaKey.Selector]: selectorValue }
					:
						selectorValue
				)
				return {
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
				}
			})
		})

		return {
			rows: results.flatMap((result) => result.rows),
			outcomes: results.flatMap((result) => result.outcomes),
		}
	}
	const results = await Promise.all(parentSelectorsFromSubset(subset).flatMap(({
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
					return fieldCanCompleteEmpty(
						context,
						entityType,
						parentSelector,
						parentSelectorKey,
						definition
					) ?
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
					&& !fieldCanCompleteEmpty(
						context,
						entityType,
						parentSelector,
						parentSelectorKey,
						definition
					)
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
					if (fieldCanCompleteEmpty(
						context,
						entityType,
						parentSelector,
						parentSelectorKey,
						definition
					))
						return {
							rows: [],
							outcomes: [{
								source: String(resolverPart.source),
								status: PersistedCollectionSourceStatus.Completed,
							}],
						}

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
	const results = await Promise.all(parentSelectorsFromSubset(subset).flatMap(({
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
					return fieldCanCompleteEmpty(
						context,
						entityType,
						parentSelector,
						parentSelectorKey,
						definition
					) ?
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

				return {
					rows: [{
						facetPath,
						facetPathKey,
						fieldName,
						[EntityMetaKey.ParentSelector]: parentSelector,
						[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
						[EntityMetaKey.Source]: String(resolverPart.source),
						[EntityMetaKey.Value]: resolverPart.resolveCount(
							snapshot,
							parentSelector,
							resolverContext(
								context,
								String(resolverPart.source),
								subset
							)
						),
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
	const {
		entityDefinitionByType,
		projectionDefinitionByEntityTypeAndPath,
		entityFieldDefinitionByEntityTypeAndName,
		entityFieldDefinitionByEntityTypePathAndName,
		entitySelectorDefinitionByEntityTypeAndName,
	} = indexSchema(schema)

	const entityCollections: EntityCollections<_Schema> = {}
		const entityFieldCollections: EntityFieldCollections<_Schema> = {}
		const entityFieldCountCollections: EntityFieldCountCollections<_Schema> = {}
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
						}),
						getKey: (row) => stringify([
							row[EntityMetaKey.Source],
							row[EntityMetaKey.ParentSelectorKey],
							row.facetPathKey,
							row.valueKey,
						]),
						persistence,
						schemaVersion,
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
				if (definition.type === EntityFieldType.EntitiesReference && definition.entityType in entityDefinitionByType) {
					entityFieldCollections[entityDefinition.entityType][fieldAddressKey].createIndex(
						(row) => row[EntityMetaKey.Value].timestampMs,
						{
							indexType: BasicIndex,
						}
					)
					entityFieldCollections[entityDefinition.entityType][fieldAddressKey].createIndex(
						(row) => row[EntityMetaKey.Value].blockNumber,
						{
							indexType: BasicIndex,
						}
					)
					entityFieldCollections[entityDefinition.entityType][fieldAddressKey].createIndex(
						(row) => row[EntityMetaKey.Value].slot,
						{
							indexType: BasicIndex,
						}
					)
					entityFieldCollections[entityDefinition.entityType][fieldAddressKey].createIndex(
						(row) => row[EntityMetaKey.Value].height,
						{
							indexType: BasicIndex,
						}
					)
					entityFieldCollections[entityDefinition.entityType][fieldAddressKey].createIndex(
						(row) => row[EntityMetaKey.Value].activationBlock,
						{
							indexType: BasicIndex,
						}
					)
					entityFieldCollections[entityDefinition.entityType][fieldAddressKey].createIndex(
						(row) => row[EntityMetaKey.Value].activationTimestampMs,
						{
							indexType: BasicIndex,
						}
					)
					entityFieldCollections[entityDefinition.entityType][fieldAddressKey].createIndex(
						(row) => row[EntityMetaKey.Value].sourceOrder,
						{
							indexType: BasicIndex,
						}
					)
					for (const selectorDefinition of entityDefinitionByType[definition.entityType].selectors) {
						for (const selectorFieldName of selectorDefinition.fields) {
							if (
								entityFieldDefinitions(entityDefinitionByType[definition.entityType]).some((fieldDefinition) => (
									fieldDefinition.name === selectorFieldName
									&& fieldDefinition.type === EntityFieldType.Primitive
								))
							)
								entityFieldCollections[entityDefinition.entityType][fieldAddressKey].createIndex(
									(row) => (
										((row[EntityMetaKey.Value] as object) as {
											[EntityMetaKey.Selector]: Ref<Record<string, string | number>>
										})[EntityMetaKey.Selector][selectorFieldName]
									),
									{
										indexType: BasicIndex,
									}
								)
						}
					}
				}
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
		entityFieldDefinitionByEntityTypeAndName,
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
