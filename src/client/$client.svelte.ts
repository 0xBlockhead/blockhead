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
	type PersistedTx,
	type PersistenceAdapter,
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
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import {
	type ProviderContinuation,
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
	resolverDefinitionsKey,
	resolverPartsKey,
} from '$/resolvers/$resolvers.ts'
import {
	EntityMetaKey,
	type EntityBaseFieldName,
	type EntityFacetPath,
	type EntityFacetName,
	type EntityDefinition,
	type EntityFieldDefinition,
	type EntityFieldDefinitionByEntityTypePathAndName,
	type EntityFieldDefinitionByName,
	type EntityFieldName,
	type EntityFieldDefinitionAtPathByName,
	type EntityFieldNameAtPath,
	type EntityFieldResolvedValue,
	type EntityFieldSingleResolvedValueFromDefinition,
	type EntityFieldValues,
	type EntityProjectionPath,
	type EntityProjectionDefinition,
	type EntitySelectedFields,
	type EntitySelectorDefinitionByEntityTypeAndName,
	type EntitySelector,
	type EntityType,
	type Schema,
	entityFieldCardinalityIsMultiple,
	entityFieldAddressKey,
	entityFieldDefinitions,
	entityFieldFacetPath,
	entitySelectorKey,
	entitySelectorsFromFields,
	indexSchema,
	validateEntitySelector,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import {
	type SourceProviderDefinition,
	type SourcePublicEnv,
	indexSourceProviders,
} from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
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
	sourceRowKeys: Readonly<Record<string, readonly (string | number)[]>>
	continuationBySource: Readonly<Partial<Record<string, ProviderContinuation>>>
}

type PersistedCollectionSourceOutcome = {
	source: string
	status: PersistedCollectionSourceStatus
	continuation?: ProviderContinuation
	error?: string
}

type PersistedCollectionRowsLoadResult<_Row extends PersistedCollectionRow> = {
	rows: _Row[]
	outcomes: PersistedCollectionSourceOutcome[]
}

type PersistedCollectionHydratedRows<_Row extends PersistedCollectionRow> = {
	allRows: readonly _Row[]
	retainedRows: readonly _Row[]
	rows: readonly _Row[]
	invalidSources: readonly string[]
	malformedRowKeys: readonly (string | number)[]
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
	clear(collectionId: string): void
	subscribe(listener: () => void): () => void
}

type WaitForPersistence = (
	collectionId: string
) => Promise<void>

export const trackPersistedCollectionPersistence = (
	basePersistence: PersistedCollectionPersistence
) => {
	const pendingPersistenceByCollection = new Map<string, Set<Promise<void>>>()
	const trackedAdapterByAdapter = new WeakMap<PersistenceAdapter, PersistenceAdapter>()
	const persistenceQueueByAdapter = new WeakMap<PersistenceAdapter, Promise<void>>()
	const trackPersistence = (
		persistence: PersistedCollectionPersistence
	): PersistedCollectionPersistence => {
		const trackedAdapter = trackedAdapterByAdapter.get(persistence.adapter)
		if (trackedAdapter !== undefined)
			return {
				...persistence,
				adapter: trackedAdapter,
			}

		const adapter = Object.assign(
			Object.create(persistence.adapter),
			{
				applyCommittedTx: (
					collectionId: string,
					transaction: PersistedTx
				) => {
					const pendingPersistence = (
						persistenceQueueByAdapter.get(persistence.adapter) ?? Promise.resolve()
					).then(() => (
						persistence.adapter.applyCommittedTx(
							collectionId,
							transaction
						)
					))
					persistenceQueueByAdapter.set(persistence.adapter, pendingPersistence.then(
						() => undefined,
						() => undefined
					))
					pendingPersistenceByCollection.set(
						collectionId,
						(pendingPersistenceByCollection.get(collectionId) ?? new Set())
							.add(pendingPersistence)
					)
					void pendingPersistence.then(() => {
						pendingPersistenceByCollection.get(collectionId)?.delete(pendingPersistence)
					}, () => {
						pendingPersistenceByCollection.get(collectionId)?.delete(pendingPersistence)
					})
					return pendingPersistence
				},
			}
		)
		trackedAdapterByAdapter.set(persistence.adapter, adapter)
		trackedAdapterByAdapter.set(adapter, adapter)
		return {
			...persistence,
			adapter,
		}
	}
	const resolvePersistenceForCollection = basePersistence.resolvePersistenceForCollection
	const resolvePersistenceForMode = basePersistence.resolvePersistenceForMode

	const waitForPersistence: WaitForPersistence = async (collectionId) => {
		await new Promise<void>((resolve) => setTimeout(resolve))
		await Promise.all([...(pendingPersistenceByCollection.get(collectionId) ?? [])])
	}

	return {
		persistence: {
			...trackPersistence(basePersistence),
			resolvePersistenceForCollection: resolvePersistenceForCollection === undefined ?
				undefined
			:
				(options: Parameters<typeof resolvePersistenceForCollection>[0]) => (
					trackPersistence(resolvePersistenceForCollection(options))
				),
			resolvePersistenceForMode: resolvePersistenceForMode === undefined ?
				undefined
			:
				(mode: Parameters<typeof resolvePersistenceForMode>[0]) => (
					trackPersistence(resolvePersistenceForMode(mode))
				),
		},
		waitForPersistence,
	}
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
	additionalLoadedKeys?(row: _Row, loadSubsetOptions: LoadSubsetOptions): readonly string[]
	sources(loadSubsetOptions: LoadSubsetOptions): readonly string[]
	persistedRows(
		loadSubsetOptions: LoadSubsetOptions,
		rows: readonly _Row[],
		marker: PersistedCollectionLoadedSubset | undefined
	): PersistedCollectionHydratedRows<_Row>
	localAuthoritySourceRowKeys?(
		loadSubsetOptions: LoadSubsetOptions,
		rows: readonly _Row[]
	): Readonly<Record<string, readonly (string | number)[]>>
	loadRows(
		loadSubsetOptions: LoadSubsetOptions,
		sources: readonly string[],
		forceRemote: boolean,
		providerContinuationTokenBySource?: Readonly<Record<string, string>>
	): Promise<PersistedCollectionRowsLoadResult<_Row>>
	waitForPersistence?: WaitForPersistence
	events: ClientEvent[]
	collectionLoadFailures: PersistedCollectionLoadFailures
	setWriteRows(writeRows: (
		rows: readonly _Row[],
		authority?: LocalMutationAuthorityChange
	) => void): void
	setReplaceRows(replaceRows: (
		predicate: (row: _Row) => boolean,
		rows: readonly _Row[],
		authority?: LocalMutationAuthorityChange
	) => void): void
	setRefreshRows(refreshRows: () => void): void
	setWaitForPersistence(waitForCollectionPersistence: () => Promise<void>): void
	setResolverSubsetLoading(
		isResolverSubsetLoading: (
			selectorKey: string,
			sources?: readonly string[]
		) => boolean
	): void
	setResolverSubsetResolved(
		isResolverSubsetResolved: (
			selectorKey: string,
			sources?: readonly string[]
		) => boolean
	): void
	setLocalMutationAuthority(
		hasLocalMutationAuthority: (selectorKey: string, authorityKey: string) => boolean,
		localMutationAuthorityRowCount: (selectorKey: string, authorityKey: string) => number | undefined,
		recordLocalMutationAuthority: (
			selectorKey: string,
			authorityKey: string,
			resolution: 'present' | 'resolved' | 'deleted'
		) => void,
		clearLocalMutationAuthority: (selectorKey: string) => void
	): void
	setContinuationForRows(
		continuationForRows: (
			parentSelectorKey: string,
			sourceRowKeys: Readonly<Record<string, readonly (string | number)[]>>,
			sources?: readonly string[]
		) => readonly PersistedCollectionContinuation[]
	): void
	notifyLocalMutationAuthorityChange(): void
	notifyContinuationChange(): void
	notifyResolverSubsetLoadingChange(): void
	mountLive?(loadSubsetOptions: LoadSubsetOptions): () => void
}

export type PersistedCollectionContinuation = {
	readonly source: string
	readonly metadata: ProviderContinuation
	readonly loading: boolean
	readonly loadMore: () => Promise<void>
	readonly cancel: () => void
}

type LocalMutationAuthorityChange =
	| {
		readonly selectorKey: string
		readonly authorityKey: string
		readonly resolution: 'present' | 'resolved' | 'deleted'
	}
	| {
		readonly selectorKey: string
		readonly clearSelector: true
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
	[EntityMetaKey.Value]: unknown
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

export type MutationCollection<
	_Row extends object,
> = Pick<
	PersistedCollectionRowCollection<_Row>,
	| 'delete'
	| 'startSyncImmediate'
	| 'toArray'
> & {
	utils: Pick<
		PersistedCollectionRowCollectionUtils<_Row>,
		| 'deleteSelectorRowsAndAuthority'
		| 'replaceRows'
		| 'replaceRowsWithAuthority'
		| 'waitForPersistence'
		| 'writeUpsert'
		| 'writeUpsertWithAuthority'
	>
}

type PersistedCollectionRowCollectionUtils<
	_Row extends object,
> = UtilsRecord & {
	dataUpdatedAt: number
	hasLocalMutationAuthority(selectorKey: string, authorityKey: string): boolean
	localMutationAuthorityRowCount(selectorKey: string, authorityKey: string): number | undefined
	subscribeLocalMutationAuthorityChanges(update: () => void): () => void
	isResolverSubsetLoading(selectorKey: string, sources?: readonly string[]): boolean
	isResolverSubsetResolved(selectorKey: string, sources?: readonly string[]): boolean
	subscribeResolverSubsetLoadingChanges(update: () => void): () => void
	waitForPersistence(): Promise<void>
	replaceRows(predicate: (row: _Row) => boolean, rows: readonly _Row[]): void
	replaceRowsWithAuthority(
		predicate: (row: _Row) => boolean,
		rows: readonly _Row[],
		selectorKey: string,
		authorityKey: string,
		resolution: 'present' | 'resolved' | 'deleted'
	): void
	writeUpsert(row: _Row | readonly _Row[]): void
	writeUpsertWithAuthority(
		row: _Row | readonly _Row[],
		selectorKey: string,
		authorityKey: string,
		resolution: 'present' | 'resolved' | 'deleted'
	): void
	deleteSelectorRowsAndAuthority(
		predicate: (row: _Row) => boolean,
		selectorKey: string
	): void
	refresh(): void
	continuationForRows(
		parentSelectorKey: string,
		sourceRowKeys: Readonly<Record<string, readonly (string | number)[]>>,
		sources?: readonly string[]
	): readonly PersistedCollectionContinuation[]
	subscribeContinuationChanges(update: () => void): () => void
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
	entityCollections: Record<string, MutationCollection<EntityCollectionItem<_Schema>>>
	entityFieldCollections: Record<string, Record<string, MutationCollection<EntityFieldCollectionItem<_Schema>>>>
	entityFieldCountCollections: Record<string, Record<string, MutationCollection<EntityFieldCountCollectionItem<_Schema>> | undefined>>
}

export const localMutationAuthorityKey = ({
	source,
	entityType,
	selectorKey,
	fieldName,
	fieldAddressKey,
	facetPathKey,
	filterKey,
	valueKey,
	valueIndex,
}: {
	source: string
	entityType: string
	selectorKey: string
	fieldName?: string
	fieldAddressKey?: string
	facetPathKey?: string
	filterKey?: string
	valueKey?: string
	valueIndex?: number
}) => stringify(
	fieldName === undefined ?
		[
			source,
			entityType,
			selectorKey,
		]
	:
		[
			source,
			entityType,
			selectorKey,
			fieldName,
			fieldAddressKey,
			facetPathKey,
			filterKey,
			valueKey,
			valueIndex,
		]
)

export type ClientContext<
	_Schema extends Schema = Schema,
	_Source extends string = string,
> = {
	schema: _Schema
	entityDefinitionByType: Record<string, EntityDefinition>
	projectionDefinitionByEntityTypeAndPath: Record<string, EntityProjectionDefinition | undefined>
	entityFieldDefinitionByEntityTypePathAndName:
		& EntityFieldDefinitionByEntityTypePathAndName<_Schema>
		& Readonly<Record<string, Readonly<Record<string, EntityFieldDefinition | undefined>>>>
	entitySelectorDefinitionByEntityTypeAndName: EntitySelectorDefinitionByEntityTypeAndName<_Schema>
	entityCollections: EntityCollections<_Schema>
	entityFieldCollections: EntityFieldCollections<_Schema>
	entityFieldCountCollections: EntityFieldCountCollections<_Schema>
	materializedReferenceEntityKeys: Set<string>
	referenceFieldValueByAddress: Map<string, unknown>
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
		const _Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
		>(
			entityType: _EntityType,
			entitySelector: EntitySelector<_Schema, _EntityType>,
			selection?: _Selection & CheckedSubscribeSelection<
				_Schema,
				_EntityType,
				_Selection
			>
		) => EntityProxyResource<_Schema, _EntityType, _Selection>
}

export type SubscribeSelection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldRow extends object = Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema, _EntityType>>>,
	_FacetPath extends EntityProjectionPath<_Schema, _EntityType> = readonly [],
> = Omit<LoadSubsetOptions, 'orderBy' | 'where'> & {
	readonly sources?: readonly string[]
	readonly fields?: SubscribeSelectedFields<_Schema, _EntityType, _FieldRow, _FacetPath>
	readonly selectorSources?: readonly string[]
	readonly where?: (context: { row: _FieldRow }) => object
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
	_FieldRow extends object = Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema, _EntityType>>>,
	_FacetPath extends EntityProjectionPath<_Schema, _EntityType> = readonly [],
> = (
	& {
		readonly [
			_FieldName in keyof EntitySelectedFields<_Schema, _EntityType, _FacetPath>
		]?: (
			| true
			| (
				EntityFieldDefinitionAtPathByName<
					_Schema,
					_EntityType,
					_FacetPath,
					Extract<_FieldName, EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath>>
				> extends {
					readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
					readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
				} ?
					SubscribeSelection<_Schema, _ReferencedEntityType>
				:
					Omit<SubscribeSelection<_Schema, _EntityType, _FieldRow, _FacetPath>, 'fields'>
			)
			| undefined
		)
	}
	& {
		readonly [
			_FacetName in EntityFacetName<_Schema, _EntityType, _FacetPath>
		]?: SubscribeSelection<
			_Schema,
			_EntityType,
			_FieldRow,
			Extract<
				readonly [..._FacetPath, _FacetName],
				EntityProjectionPath<_Schema, _EntityType>
			>
		>
	}
)

type SubscribeSelectionFieldsAreValid<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FacetPath extends EntityProjectionPath<_Schema, _EntityType>,
	_Fields,
> = (
	_Fields extends object ?
		Exclude<
			keyof _Fields,
			| keyof EntitySelectedFields<_Schema, _EntityType, _FacetPath>
			| EntityFacetName<_Schema, _EntityType, _FacetPath>
		> extends never ?
			false extends {
				readonly [_FieldOrFacetName in keyof _Fields]: (
					_FieldOrFacetName extends EntityFacetName<_Schema, _EntityType, _FacetPath> ?
						_Fields[_FieldOrFacetName] extends SubscribeSelection<
							_Schema,
							_EntityType,
							Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema, _EntityType>>>,
							Extract<
								readonly [..._FacetPath, _FieldOrFacetName],
								EntityProjectionPath<_Schema, _EntityType>
							>
						> ?
							SubscribeSelectionIsValid<
								_Schema,
								_EntityType,
								_Fields[_FieldOrFacetName],
								Extract<
									readonly [..._FacetPath, _FieldOrFacetName],
									EntityProjectionPath<_Schema, _EntityType>
								>
							>
						:
							false
					:
						_FieldOrFacetName extends EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath> ?
							EntityFieldDefinitionAtPathByName<
								_Schema,
								_EntityType,
								_FacetPath,
								_FieldOrFacetName
							> extends {
								readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
								readonly entityType: infer _ReferencedEntityType extends EntityType<_Schema>
							} ?
								_Fields[_FieldOrFacetName] extends true | undefined ?
									true
								:
									SubscribeSelectionIsValid<
										_Schema,
										_ReferencedEntityType,
										_Fields[_FieldOrFacetName]
									>
							:
								true
						:
							false
				)
			}[keyof _Fields] ?
				false
			:
				true
		:
			false
	:
		false
)

type SubscribeSelectionIsValid<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection,
	_FacetPath extends EntityProjectionPath<_Schema, _EntityType> = readonly [],
> = (
	_Selection extends SubscribeSelection<_Schema, _EntityType, object, _FacetPath> ?
		_Selection extends { readonly fields: infer _Fields } ?
			SubscribeSelectionFieldsAreValid<_Schema, _EntityType, _FacetPath, _Fields>
		:
			true
	:
		false
)

export type CheckedSubscribeSelection<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType>,
> = SubscribeSelectionIsValid<_Schema, _EntityType, _Selection> extends true ? unknown : never

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
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = {
	readonly [EntityMetaKey.Selector]: EntitySelector<_Schema, _EntityType>
	readonly [EntityMetaKey.SelectorKey]: string
	readonly [EntityMetaKey.Source]: string
	readonly entitySelector: EntitySelector<_Schema, _EntityType>
} & SubscribeResultFields<_Schema, _EntityType, _Selection>

type SubscribeFieldSingleResultFromDefinition<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
	_FieldSelection = true,
> = (
	_FieldDefinition extends {
		readonly type: EntityFieldType.EntityReference | EntityFieldType.EntitiesReference
		readonly entityType: infer _ReferenceEntityType extends EntityType<_Schema>
	} ?
		SubscribeEntityReferenceResult<
			_Schema,
			_ReferenceEntityType,
			Extract<_FieldSelection, SubscribeSelection<_Schema, _ReferenceEntityType>>
		>
	:
		EntityFieldSingleResolvedValueFromDefinition<_Schema, _FieldDefinition>
)

export type SubscribeFieldSingleResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
	_FieldSelection = true,
> = (
	SubscribeFieldSingleResultFromDefinition<
		_Schema,
		EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>,
		_FieldSelection
	>
)

type SubscribeFieldResultFromDefinition<
	_Schema extends Schema,
	_FieldDefinition extends EntityFieldDefinition,
	_FieldSelection = true,
> = (
	_FieldDefinition extends {
		readonly cardinality: EntityFieldCardinality.Many | EntityFieldCardinality.ZeroOrMany
	} ?
		{
			readonly values: readonly SubscribeFieldSingleResultFromDefinition<_Schema, _FieldDefinition, _FieldSelection>[]
			readonly entities: readonly SubscribeFieldSingleResultFromDefinition<_Schema, _FieldDefinition, _FieldSelection>[]
		}
	:
		_FieldDefinition extends {
			readonly cardinality: EntityFieldCardinality.ZeroOrOne
		} ?
			SubscribeFieldSingleResultFromDefinition<_Schema, _FieldDefinition, _FieldSelection> | undefined
		:
			_FieldDefinition extends {
				readonly cardinality: EntityFieldCardinality.Zero
			} ?
				undefined
			:
				SubscribeFieldSingleResultFromDefinition<_Schema, _FieldDefinition, _FieldSelection>
)

export type SubscribeFieldResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_FieldName extends EntityFieldName<_Schema, _EntityType>,
	_FieldSelection = true,
> = (
	SubscribeFieldResultFromDefinition<
		_Schema,
		EntityFieldDefinitionByName<_Schema, _EntityType, _FieldName>,
		_FieldSelection
	>
)

export type SubscribeAllResultFields<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
> = Partial<{
	readonly [
		_FieldName in EntityBaseFieldName<_Schema, _EntityType>
	]: SubscribeFieldResult<_Schema, _EntityType, _FieldName>
}>

type SubscribeResultFieldsAtPath<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType, Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema, _EntityType>>>, _FacetPath>,
	_FacetPath extends EntityProjectionPath<_Schema, _EntityType>,
> = (
	_Selection extends {
		readonly fields: infer _Fields extends SubscribeSelectedFields<_Schema, _EntityType, Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema, _EntityType>>>, _FacetPath>
	} ?
		{
			readonly [
				_FieldOrFacetName in keyof _Fields
			]: (
				_FieldOrFacetName extends EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath> ?
					SubscribeFieldResultFromDefinition<
						_Schema,
						EntityFieldDefinitionAtPathByName<_Schema, _EntityType, _FacetPath, _FieldOrFacetName>,
						_Fields[_FieldOrFacetName]
					>
				: _FieldOrFacetName extends EntityFacetName<_Schema, _EntityType, _FacetPath> ?
					_Fields[_FieldOrFacetName] extends SubscribeSelection<
						_Schema,
						_EntityType,
						Ref<WithVirtualProps<EntityFieldCollectionItem<_Schema, _EntityType>>>,
						Extract<readonly [..._FacetPath, _FieldOrFacetName], EntityProjectionPath<_Schema, _EntityType>>
					> ?
						{
							readonly fields: SubscribeResultFieldsAtPath<
								_Schema,
								_EntityType,
								_Fields[_FieldOrFacetName],
								Extract<readonly [..._FacetPath, _FieldOrFacetName], EntityProjectionPath<_Schema, _EntityType>>
							>
						}
					:
						never
				:
					never
			)
		}
		:
			_FacetPath extends readonly [] ?
				SubscribeAllResultFields<_Schema, _EntityType>
			:
				Partial<{
					readonly [
						_FieldName in EntityFieldNameAtPath<_Schema, _EntityType, _FacetPath>
					]: SubscribeFieldResultFromDefinition<
						_Schema,
						EntityFieldDefinitionAtPathByName<_Schema, _EntityType, _FacetPath, _FieldName>
					>
				}>
	)

type SubscribeResultFields<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType>,
> = SubscribeResultFieldsAtPath<_Schema, _EntityType, _Selection, readonly []>

export type SubscribeResult<
	_Schema extends Schema,
	_EntityType extends EntityType<_Schema>,
	_Selection extends SubscribeSelection<_Schema, _EntityType> = SubscribeSelection<_Schema, _EntityType>,
> = (
	& SubscribeResultFields<_Schema, _EntityType, _Selection>
	& {
		readonly entityType: _EntityType
		readonly entitySelector: EntitySelector<_Schema, _EntityType>
		readonly fields: SubscribeResultFields<_Schema, _EntityType, _Selection>
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
		|| !('sourceRowKeys' in value)
		|| !('continuationBySource' in value)
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
		|| value.sourceRowKeys == null
		|| typeof value.sourceRowKeys !== 'object'
		|| value.continuationBySource == null
		|| typeof value.continuationBySource !== 'object'
	)
		return undefined

	const sourceRowCountEntries: [string, number][] = []
	const sourceRowKeyEntries: [string, (string | number)[]][] = []
	for (const source of Object.keys(value.sourceRowCounts)) {
		const count = Object.getOwnPropertyDescriptor(value.sourceRowCounts, source)?.value
		if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0)
			return undefined
		const keys = Object.getOwnPropertyDescriptor(value.sourceRowKeys, source)?.value
		if (
			!Array.isArray(keys)
			|| keys.some((key) => typeof key !== 'string' && typeof key !== 'number')
			|| new Set(keys).size !== keys.length
			|| keys.length !== count
		)
			return undefined

		sourceRowCountEntries.push([
			source,
			count,
		])
		sourceRowKeyEntries.push([
			source,
			keys,
		])
	}
	if (Object.keys(value.sourceRowKeys).length !== sourceRowCountEntries.length)
		return undefined
	if (sourceRowCountEntries.reduce((total, [, count]) => total + count, 0) !== value.rowCount)
		return undefined

	const continuationBySource = Object.fromEntries(Object.keys(value.continuationBySource).flatMap((source) => {
		const continuation = Object.getOwnPropertyDescriptor(value.continuationBySource, source)?.value
		if (
			continuation == null
			|| typeof continuation !== 'object'
			|| typeof continuation.operation !== 'string'
			|| continuation.operation === ''
			|| typeof continuation.target !== 'string'
			|| continuation.target === ''
			|| (
				continuation.viewerScope !== undefined
				&& typeof continuation.viewerScope !== 'string'
			)
			|| typeof continuation.terminal !== 'boolean'
			|| (
				continuation.terminal ?
					continuation.token !== undefined
				:
					typeof continuation.token !== 'string'
					|| continuation.token === ''
			)
		)
			return []

		return [[source, continuation]]
	}))
	if (Object.keys(continuationBySource).length !== Object.keys(value.continuationBySource).length)
		return undefined

	return {
		collectionId: value.collectionId,
		continuationBySource,
		loadedKey: value.loadedKey,
		rowCount: value.rowCount,
		sourceRowCounts: Object.fromEntries(sourceRowCountEntries),
		sourceRowKeys: Object.fromEntries(sourceRowKeyEntries),
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

const productSourceRowKeys = <
	_Row extends PersistedCollectionRow
>(
	rows: readonly _Row[],
	sources: readonly string[],
	getKey: (row: _Row) => string | number
) => Object.fromEntries(sources.map((source) => [
	source,
	rows
		.filter((row) => row[EntityMetaKey.Source] === source)
		.map(getKey),
]))

const productSubsetOwnedRows = <
	_Row extends PersistedCollectionRow
>(
	marker: PersistedCollectionLoadedSubset | undefined,
	rows: readonly _Row[],
	sources: readonly string[],
	getKey: (row: _Row) => string | number
) => {
	if (marker === undefined)
		return []

	const rowKeysBySource = new Map(sources.map((source) => [
		source,
		new Set(marker.sourceRowKeys[source] ?? []),
	]))
	return rows.filter((row) => rowKeysBySource.get(row[EntityMetaKey.Source])?.has(getKey(row)) === true)
}

const entityLoadedSubsetKey = (
	loadSubsetOptions: LoadSubsetOptions,
	selectorKeys = parseResolverSubset(loadSubsetOptions).selectorKeys
) => {
	const subset = parseResolverSubset(loadSubsetOptions)
	return stringify({
		filters: subset.filters.filter((filter) => filter.fieldPath[0] !== EntityMetaKey.SelectorKey),
		sorts: subset.sorts,
		pagination: subset.pagination,
		sources: subset.sources,
		selectorKeys,
	})
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
	if (rows.length !== expectedRowCount)
		return `row-count-mismatch:${expectedRowCount}:${rows.length}`

	const sourceRowCounts = productSourceRowCounts(rows, sources)
	for (const source of sources) {
		const markerSourceRowCount = marker.sourceRowCounts[source] ?? 0
		if ((sourceRowCounts[source] ?? 0) !== markerSourceRowCount)
			return `source-count-mismatch:${source}:${markerSourceRowCount}:${sourceRowCounts[source] ?? 0}`
	}

	return undefined
}

export const persistedCollectionHydrationPlan = (
	collectionId: string,
	loadedKey: string,
	markerValue: unknown,
	rows: readonly PersistedCollectionRow[],
	requestedSources: readonly string[],
	invalidSources: readonly string[] = []
) => {
	const marker = persistedCollectionLoadedSubset(markerValue)
	const missReason = productSubsetLoadedMissReason(
		collectionId,
		loadedKey,
		marker,
		rows,
		requestedSources
	)
	if (marker !== undefined && missReason === undefined && invalidSources.length === 0)
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
			invalidSources.includes(source)
			||
			marker.sourceRowCounts[source] === undefined
			|| (sourceRowCounts[source] ?? 0) !== marker.sourceRowCounts[source]
		))
	return {
		decision: CollectionLoadDecision.Remote,
		marker,
		missReason: invalidSources.length > 0 ?
			`invalid-persisted-source:${invalidSources.join(',')}`
		:
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
	additionalLoadedKeys,
	marker,
	persistedRows,
	loaded,
	remoteSources,
	requestedSources,
	invalidSources = [],
	getKey,
}: {
	collectionId: string
	loadedKey: string
	additionalLoadedKeys?: readonly string[]
	marker?: PersistedCollectionLoadedSubset
	persistedRows: readonly _Row[]
	loaded: PersistedCollectionRowsLoadResult<_Row>
	remoteSources: readonly string[]
	requestedSources: readonly string[]
	invalidSources?: readonly string[]
	getKey(row: _Row): string | number
}) => {
	const outcomes: PersistedCollectionSourceOutcome[] = [
		...loaded.outcomes,
		...remoteSources
			.filter((source) => !loaded.outcomes.some((outcome) => outcome.source === source))
			.map((source) => ({
				source,
				status: PersistedCollectionSourceStatus.Failed,
				error: `${collectionId} did not account for source ${source}`,
			})),
	]
	const failedSources = new Set(outcomes.flatMap((outcome) => (
		outcome.status === PersistedCollectionSourceStatus.Failed ?
			[outcome.source]
		:
			[]
	)))
	const refreshedSources = new Set(outcomes.flatMap((outcome) => (
		outcome.status === PersistedCollectionSourceStatus.Completed
		&& !failedSources.has(outcome.source) ?
			[outcome.source]
		:
			[]
	)))
	const rows = [
		...new Map(
			[
				...persistedRows.filter((row) => !refreshedSources.has(row[EntityMetaKey.Source])),
				...loaded.rows.filter((row) => refreshedSources.has(row[EntityMetaKey.Source])),
			].map((row) => [
				getKey(row),
				row,
			])
		).values(),
	]
	const persistedSourceRowCounts = productSourceRowCounts(persistedRows)
	const completedSources = [
		...new Set([
			...Object.keys(marker?.sourceRowCounts ?? {}).filter((source) => (
				!invalidSources.includes(source)
				&& (
					!remoteSources.includes(source)
					|| (
						failedSources.has(source)
						&& persistedSourceRowCounts[source] === marker?.sourceRowCounts[source]
					)
				)
			)),
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
	const sourceRowKeys = productSourceRowKeys(rows, completedSources, getKey)
	const continuationBySource = Object.fromEntries([
		...Object.entries(marker?.continuationBySource ?? {}).filter(([source]) => (
			completedSources.includes(source)
			&& (
				!remoteSources.includes(source)
				|| failedSources.has(source)
			)
		)),
		...outcomes.flatMap((outcome) => (
			outcome.status === PersistedCollectionSourceStatus.Completed
			&& outcome.continuation !== undefined ?
				[[outcome.source, outcome.continuation] as const]
			:
				[]
		)),
	])
	const failedOutcomes = outcomes.filter((outcome) => (
		outcome.status === PersistedCollectionSourceStatus.Failed
	))
	return {
		rows,
		failedOutcomes,
		nextMarker: {
			collectionId,
			continuationBySource,
			loadedKey,
			rowCount: completedSources.reduce((total, source) => total + (sourceRowCounts[source] ?? 0), 0),
			sourceRowCounts,
			sourceRowKeys,
		},
		status: failedSources.size === 0
		&& requestedSources.every((source) => sourceRowCounts[source] !== undefined) ?
			PersistedCollectionLoadStatus.Completed
		:
			PersistedCollectionLoadStatus.Partial,
	}
}

export const persistedCollectionAppendResult = <
	const _Row extends PersistedCollectionRow,
>({
	collectionId,
	loadedKey,
	marker,
	persistedRows,
	loaded,
	source,
	getKey,
	getValueIdentity,
	setValueIndex,
}: {
	collectionId: string
	loadedKey: string
	marker: PersistedCollectionLoadedSubset
	persistedRows: readonly _Row[]
	loaded: PersistedCollectionRowsLoadResult<_Row>
	source: string
	getKey(row: _Row): string | number
	getValueIdentity(row: _Row): string
	setValueIndex(row: _Row, valueIndex: number): _Row
}) => {
	const continuation = marker.continuationBySource[source]
	if (continuation == null || continuation.terminal)
		throw new Error(`${collectionId} source ${source} has no executable continuation`)

	const outcomes = loaded.outcomes.filter((outcome) => outcome.source === source)
	const failed = (
		outcomes.length !== 1
		|| outcomes[0]?.status !== PersistedCollectionSourceStatus.Completed
	)
	const appendedSourceRows = failed ?
		persistedRows.filter((row) => row[EntityMetaKey.Source] === source)
	:
		[
			...new Map([
				...persistedRows.filter((row) => row[EntityMetaKey.Source] === source),
				...loaded.rows.filter((row) => row[EntityMetaKey.Source] === source),
			].map((row) => [
				getValueIdentity(row),
				row,
			])).values(),
		].map(setValueIndex)

	return persistedCollectionRemoteResult({
		collectionId,
		loadedKey,
		marker,
		persistedRows,
		loaded: {
			rows: [
				...loaded.rows.filter((row) => row[EntityMetaKey.Source] !== source),
				...appendedSourceRows,
			],
			outcomes: loaded.outcomes,
		},
		remoteSources: [source],
		requestedSources: Object.keys(marker.sourceRowCounts),
		getKey,
	})
}

const persistedCollectionUtils = <
	_Row extends PersistedCollectionRow
>() => {
	let writeRows: ((
		rows: readonly _Row[],
		authority?: LocalMutationAuthorityChange
	) => void) | undefined
	let replaceRows: ((
		predicate: (row: _Row) => boolean,
		rows: readonly _Row[],
		authority?: LocalMutationAuthorityChange
	) => void) | undefined
	let refreshRows: (() => void) | undefined
	let waitForCollectionPersistence: (() => Promise<void>) | undefined
	let resolveWaitForPersistenceReady = () => {}
	const waitForPersistenceReady = new Promise<void>((resolve) => {
		resolveWaitForPersistenceReady = resolve
	})
	let isResolverSubsetLoading = (
		_selectorKey: string,
		_sources?: readonly string[]
	) => false
	let isResolverSubsetResolved = (
		_selectorKey: string,
		_sources?: readonly string[]
	) => false
	let continuationForRows: ((
		parentSelectorKey: string,
		sourceRowKeys: Readonly<Record<string, readonly (string | number)[]>>,
		sources?: readonly string[]
	) => readonly PersistedCollectionContinuation[]) | undefined
	let hasLocalMutationAuthority = (_selectorKey: string, _authorityKey: string) => false
	let localMutationAuthorityRowCount = (_selectorKey: string, _authorityKey: string): number | undefined => undefined
	let recordLocalMutationAuthority:
		| ((
			selectorKey: string,
			authorityKey: string,
			resolution: 'present' | 'resolved' | 'deleted'
		) => void)
		| undefined
	let clearLocalMutationAuthority: ((selectorKey: string) => void) | undefined
	const continuationSubscribers = new Set<() => void>()
	const localMutationAuthoritySubscribers = new Set<() => void>()
	const resolverSubsetLoadingSubscribers = new Set<() => void>()
	let pendingWrites: {
		rows: readonly _Row[]
		authority?: LocalMutationAuthorityChange
	}[] = []
	let pendingReplacements: {
		predicate: (row: _Row) => boolean
		rows: readonly _Row[]
		authority?: LocalMutationAuthorityChange
	}[] = []
	let refreshPending = false
	const utils: PersistedCollectionRowCollectionUtils<_Row> = {
		dataUpdatedAt: 0,
		hasLocalMutationAuthority(selectorKey, authorityKey) {
			return hasLocalMutationAuthority(selectorKey, authorityKey)
		},
		localMutationAuthorityRowCount(selectorKey, authorityKey) {
			return localMutationAuthorityRowCount(selectorKey, authorityKey)
		},
		subscribeLocalMutationAuthorityChanges(update) {
			localMutationAuthoritySubscribers.add(update)
			return () => {
				localMutationAuthoritySubscribers.delete(update)
			}
		},
		isResolverSubsetLoading(selectorKey, sources) {
			return isResolverSubsetLoading(selectorKey, sources)
		},
		isResolverSubsetResolved(selectorKey, sources) {
			return isResolverSubsetResolved(selectorKey, sources)
		},
		subscribeResolverSubsetLoadingChanges(update) {
			resolverSubsetLoadingSubscribers.add(update)
			return () => {
				resolverSubsetLoadingSubscribers.delete(update)
			}
		},
		waitForPersistence() {
			return waitForPersistenceReady.then(() => waitForCollectionPersistence?.())
		},
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
		replaceRowsWithAuthority(predicate, rows, selectorKey, authorityKey, resolution) {
			utils.dataUpdatedAt = Date.now()
			const authority = {
				selectorKey,
				authorityKey,
				resolution,
			} as const
			if (replaceRows === undefined)
				pendingReplacements.push({
					predicate,
					rows,
					authority,
				})
			else
				replaceRows(
					predicate,
					rows,
					authority
				)
			if (replaceRows !== undefined)
				for (const subscriber of localMutationAuthoritySubscribers)
					subscriber()
		},
		writeUpsert(row) {
			utils.dataUpdatedAt = Date.now()
			if (writeRows === undefined)
				pendingWrites.push({
					rows: Array.isArray(row) ? row : [row],
				})
			else
				writeRows(Array.isArray(row) ? row : [row])
		},
		writeUpsertWithAuthority(row, selectorKey, authorityKey, resolution) {
			utils.dataUpdatedAt = Date.now()
			const rows = Array.isArray(row) ? row : [row]
			const authority = {
				selectorKey,
				authorityKey,
				resolution,
			} as const
			if (writeRows === undefined)
				pendingWrites.push({
					rows,
					authority,
				})
			else
				writeRows(
					rows,
					authority
				)
			if (writeRows !== undefined)
				for (const subscriber of localMutationAuthoritySubscribers)
					subscriber()
		},
		deleteSelectorRowsAndAuthority(predicate, selectorKey) {
			utils.dataUpdatedAt = Date.now()
			const authority = {
				selectorKey,
				clearSelector: true,
			} as const
			if (replaceRows === undefined)
				pendingReplacements.push({
					predicate,
					rows: [],
					authority,
				})
			else
				replaceRows(
					predicate,
					[],
					authority
				)
			if (replaceRows !== undefined)
				for (const subscriber of localMutationAuthoritySubscribers)
					subscriber()
		},
		refresh() {
			if (refreshRows === undefined)
				refreshPending = true
			else
				refreshRows()
		},
		continuationForRows(parentSelectorKey, sourceRowKeys, sources) {
			return continuationForRows?.(
				parentSelectorKey,
				sourceRowKeys,
				sources
			) ?? []
		},
		subscribeContinuationChanges(update) {
			continuationSubscribers.add(update)
			return () => {
				continuationSubscribers.delete(update)
			}
		},
	}
	return {
		utils,
		setWriteRows(nextWriteRows: (
			rows: readonly _Row[],
			authority?: LocalMutationAuthorityChange
		) => void) {
			writeRows = nextWriteRows
			for (const pendingWrite of pendingWrites) {
				writeRows(pendingWrite.rows, pendingWrite.authority)
				if (pendingWrite.authority !== undefined)
					for (const subscriber of localMutationAuthoritySubscribers)
						subscriber()
			}
			pendingWrites = []
		},
		setReplaceRows(nextReplaceRows: (
			predicate: (row: _Row) => boolean,
			rows: readonly _Row[],
			authority?: LocalMutationAuthorityChange
		) => void) {
			replaceRows = nextReplaceRows
			for (const pendingReplacement of pendingReplacements) {
				replaceRows(
					pendingReplacement.predicate,
					pendingReplacement.rows,
					pendingReplacement.authority
				)
				if (pendingReplacement.authority !== undefined)
					for (const subscriber of localMutationAuthoritySubscribers)
						subscriber()
			}
			pendingReplacements = []
		},
		setRefreshRows(nextRefreshRows: () => void) {
			refreshRows = nextRefreshRows
			if (refreshPending) {
				refreshPending = false
				refreshRows()
			}
		},
		setWaitForPersistence(nextWaitForCollectionPersistence: () => Promise<void>) {
			waitForCollectionPersistence = nextWaitForCollectionPersistence
			resolveWaitForPersistenceReady()
		},
		setResolverSubsetLoading(nextIsResolverSubsetLoading: (
			selectorKey: string,
			sources?: readonly string[]
		) => boolean
		) {
			isResolverSubsetLoading = nextIsResolverSubsetLoading
		},
		setResolverSubsetResolved(nextIsResolverSubsetResolved: (
			selectorKey: string,
			sources?: readonly string[]
		) => boolean
		) {
			isResolverSubsetResolved = nextIsResolverSubsetResolved
		},
		setContinuationForRows(nextContinuationForRows: (
			parentSelectorKey: string,
			sourceRowKeys: Readonly<Record<string, readonly (string | number)[]>>,
			sources?: readonly string[]
		) => readonly PersistedCollectionContinuation[]) {
			continuationForRows = nextContinuationForRows
		},
		setLocalMutationAuthority(
			nextHasLocalMutationAuthority: (selectorKey: string, authorityKey: string) => boolean,
			nextLocalMutationAuthorityRowCount: (selectorKey: string, authorityKey: string) => number | undefined,
			nextRecordLocalMutationAuthority: (
				selectorKey: string,
				authorityKey: string,
				resolution: 'present' | 'resolved' | 'deleted'
			) => void,
			nextClearLocalMutationAuthority: (selectorKey: string) => void
		) {
			hasLocalMutationAuthority = nextHasLocalMutationAuthority
			localMutationAuthorityRowCount = nextLocalMutationAuthorityRowCount
			recordLocalMutationAuthority = (selectorKey, authorityKey, resolution) => {
				nextRecordLocalMutationAuthority(selectorKey, authorityKey, resolution)
				for (const subscriber of localMutationAuthoritySubscribers)
					subscriber()
			}
			clearLocalMutationAuthority = (selectorKey) => {
				nextClearLocalMutationAuthority(selectorKey)
				for (const subscriber of localMutationAuthoritySubscribers)
					subscriber()
			}
		},
		notifyLocalMutationAuthorityChange() {
			for (const subscriber of localMutationAuthoritySubscribers)
				subscriber()
		},
		notifyContinuationChange() {
			for (const continuationSubscriber of continuationSubscribers)
				continuationSubscriber()
		},
		notifyResolverSubsetLoadingChange() {
			for (const resolverSubsetLoadingSubscriber of resolverSubsetLoadingSubscribers)
				resolverSubsetLoadingSubscriber()
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
	additionalLoadedKeys,
	sources,
	persistedRows,
	localAuthoritySourceRowKeys,
	loadRows,
	waitForPersistence,
	events,
	collectionLoadFailures,
	setWriteRows,
	setReplaceRows,
	setRefreshRows,
	setWaitForPersistence,
	setResolverSubsetLoading,
	setResolverSubsetResolved,
	setLocalMutationAuthority,
	setContinuationForRows,
	notifyLocalMutationAuthorityChange,
	notifyContinuationChange,
	notifyResolverSubsetLoadingChange,
	mountLive,
}: PersistedCollectionSyncOptions<_Row>): SyncConfig<_Row, string | number> => {
	const inFlightLoads = new Map<string, Promise<void>>()
	const inFlightAppendAbortControllerByKey = new Map<string, AbortController>()
	const staleSubsetKeys = new Set<string>()

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
			const resolvedLoadSubsets = new Map<string, {
				loadSubsetOptions: LoadSubsetOptions
				sources: readonly string[]
			}>()
			const liveCleanupByLoadSubsetOptions = new WeakMap<LoadSubsetOptions, () => void>()
			let latestWritePersistence = Promise.resolve()
			setResolverSubsetLoading((selectorKey, selectedSources) => (
				[...activeLoadSubsets].some(([key, { loadSubsetOptions }]) => {
					if (!inFlightLoads.has(key))
						return false

					const subset = parseResolverSubset(loadSubsetOptions)
					return (
						(
							subset.selectorKeys.includes(selectorKey)
							|| subset.parentSelectorKeys.includes(selectorKey)
						)
						&& (
							selectedSources == null
							|| subset.sources == null
							|| selectedSources.some((source) => subset.sources?.includes(source) === true)
						)
					)
				})
			))
			setResolverSubsetResolved((selectorKey, selectedSources) => (
				[...resolvedLoadSubsets.values()].some(({ loadSubsetOptions, sources: resolvedSources }) => {
					const subset = parseResolverSubset(loadSubsetOptions)
					return (
						(
							subset.selectorKeys.includes(selectorKey)
							|| subset.parentSelectorKeys.includes(selectorKey)
						)
						&& (
							selectedSources == null
							|| selectedSources.every((source) => resolvedSources.includes(source))
						)
					)
				})
			))
			const applyLocalMutationAuthority = (
				authority: LocalMutationAuthorityChange,
				rowCount?: number
			) => {
				if ('clearSelector' in authority) {
					for (const { key } of metadata?.collection.list(`localMutationAuthority:${authority.selectorKey}:`) ?? [])
						metadata?.collection.delete(key)
					return
				}

				const key = `localMutationAuthority:${authority.selectorKey}:${authority.authorityKey}`
				metadata?.collection.set(key, rowCount ?? true)
			}
			setWriteRows((rows, authority) => {
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
				if (authority !== undefined)
					applyLocalMutationAuthority(authority, rows.length)
				commit()
				latestWritePersistence = waitForPersistence?.(collectionId) ?? Promise.resolve()
				if (authority !== undefined) {
					collectionLoadFailures.clear(collectionId)
					notifyLocalMutationAuthorityChange()
				}
			})
			setReplaceRows((predicate, rows, authority) => {
				const rowsToReplace = collection.toArray.filter(predicate)
				begin({
					immediate: true,
				})
				for (const row of rowsToReplace)
					write({
						type: 'delete',
						value: row,
					})
				for (const row of rows)
					write({
						type: 'insert',
						value: row,
					})
				if (authority !== undefined)
					applyLocalMutationAuthority(authority, rows.length)
				commit()
				latestWritePersistence = waitForPersistence?.(collectionId) ?? Promise.resolve()
				if (authority !== undefined) {
					collectionLoadFailures.clear(collectionId)
					notifyLocalMutationAuthorityChange()
				}
			})
			setWaitForPersistence(() => latestWritePersistence)
			setLocalMutationAuthority(
				(selectorKey, authorityKey) => {
					const authority = metadata?.collection.get(`localMutationAuthority:${selectorKey}:${authorityKey}`)
					return authority === true || typeof authority === 'number'
				},
				(selectorKey, authorityKey) => {
					const rowCount = metadata?.collection.get(`localMutationAuthority:${selectorKey}:${authorityKey}`)
					return typeof rowCount === 'number' ? rowCount : undefined
				},
				(selectorKey, authorityKey, resolution) => {
					begin({
						immediate: true,
					})
					applyLocalMutationAuthority({
						selectorKey,
						authorityKey,
						resolution,
					})
					commit()
				},
				(selectorKey) => {
					begin({
						immediate: true,
					})
					applyLocalMutationAuthority({
						selectorKey,
						clearSelector: true,
					})
					commit()
				}
			)
			const loadSubset = async (loadSubsetOptions: LoadSubsetOptions) => {
				const key = loadedKey(loadSubsetOptions)
				const inFlightLoad = inFlightLoads.get(key)
				if (inFlightLoad !== undefined) {
					await inFlightLoad
					return
				}
				notifyLocalMutationAuthorityChange()

				const loadSubsetOnce = async () => {
					const requestedSources = sources(loadSubsetOptions)
					const forceRemote = staleSubsetKeys.delete(key)
					const metadataKey = `loadedSubset:${schemaVersion}:${key}`
					const persistedMarker = persistedCollectionLoadedSubset(metadata?.collection.get(metadataKey))
					const localSourceRowKeys = localAuthoritySourceRowKeys?.(
						loadSubsetOptions,
						collection.toArray
					) ?? {}
					const marker = (
						Object.keys(localSourceRowKeys).length === 0 ?
							persistedMarker
						:
							{
								collectionId,
								continuationBySource: persistedMarker?.continuationBySource ?? {},
								loadedKey: key,
								sourceRowCounts: {
									...persistedMarker?.sourceRowCounts,
									...Object.fromEntries(Object.entries(localSourceRowKeys).map(([source, rowKeys]) => [
										source,
										rowKeys.length,
									])),
								},
								sourceRowKeys: {
									...persistedMarker?.sourceRowKeys,
									...localSourceRowKeys,
								},
								rowCount: Object.values({
									...persistedMarker?.sourceRowCounts,
									...Object.fromEntries(Object.entries(localSourceRowKeys).map(([source, rowKeys]) => [
										source,
										rowKeys.length,
									])),
								}).reduce<number>((total, count) => total + (count ?? 0), 0),
							}
					)
					const hydratedRows = persistedRows(
						loadSubsetOptions,
						collection.toArray,
						marker?.collectionId === collectionId && marker.loadedKey === key ? marker : undefined
					)
					const persistedHydrationPlan = persistedCollectionHydrationPlan(
						collectionId,
						key,
						marker,
						hydratedRows.rows,
						requestedSources,
						hydratedRows.invalidSources
					)
					const hydrationPlan = forceRemote ? {
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
							rowCount: hydratedRows.rows.length,
							sourceRowCounts: hydrationPlan.marker.sourceRowCounts,
						})
						resolvedLoadSubsets.set(key, {
							loadSubsetOptions,
							sources: requestedSources,
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
						const loadedRows = await loadRows(
							loadSubsetOptions,
							hydrationPlan.remoteSources,
							forceRemote
						)
						const currentLocalSourceRowKeys = localAuthoritySourceRowKeys?.(
							loadSubsetOptions,
							collection.toArray
						) ?? {}
						if (Object.keys(currentLocalSourceRowKeys).length > 0) {
							collectionLoadFailures.clear(collectionId)
							resolvedLoadSubsets.set(key, {
								loadSubsetOptions,
								sources: requestedSources,
							})
							markReady()
							return
						}
						const remoteResult = persistedCollectionRemoteResult({
							collectionId,
							loadedKey: key,
							marker: hydrationPlan.marker,
							persistedRows: hydratedRows.retainedRows,
							loaded: loadedRows,
							remoteSources: hydrationPlan.remoteSources,
							requestedSources,
							invalidSources: hydratedRows.invalidSources,
							getKey,
						})
						const otherSubsetMarkers = (metadata?.collection.list() ?? []).flatMap(({
							key: otherMetadataKey,
							value,
						}) => {
							if (
								otherMetadataKey === metadataKey
								|| !otherMetadataKey.startsWith(`loadedSubset:${schemaVersion}:`)
							)
								return []

							const otherMarker = persistedCollectionLoadedSubset(value)
							return otherMarker?.collectionId === collectionId ? [{
								metadataKey: otherMetadataKey,
								marker: otherMarker,
							}]
								:
								[]
						})
						const rowKeysOwnedByOtherSubsets = new Set(
							otherSubsetMarkers.flatMap(({ marker: otherMarker }) => (
								Object.values(otherMarker.sourceRowKeys).flat()
							))
						)
						const malformedRowKeys = new Set(hydratedRows.malformedRowKeys)
						begin()
						for (const row of hydratedRows.allRows)
							if (
								malformedRowKeys.has(getKey(row))
								|| !rowKeysOwnedByOtherSubsets.has(getKey(row))
							)
							write({
								type: 'delete',
								value: row,
							})
						for (const { metadataKey: otherMetadataKey, marker: otherMarker } of otherSubsetMarkers) {
							const sourceRowKeys = Object.fromEntries(Object.entries(otherMarker.sourceRowKeys).map(([
								source,
								keys,
								]) => [
									source,
									keys.filter((rowKey) => !malformedRowKeys.has(rowKey)),
								]))
							if (Object.entries(sourceRowKeys).every(([source, keys]) => (
								keys.length === otherMarker.sourceRowKeys[source]?.length
							)))
								continue

							const sourceRowCounts = Object.fromEntries(Object.entries(sourceRowKeys).map(([
								source,
								keys,
							]) => [
								source,
								keys.length,
							]))
							metadata?.collection.set(otherMetadataKey, {
								...otherMarker,
								rowCount: Object.values(sourceRowCounts).reduce((total, count) => total + count, 0),
								sourceRowCounts,
								sourceRowKeys,
							})
						}
						for (const row of remoteResult.rows)
							write({
								type: 'insert',
								value: row,
							})

						metadata?.collection.set(metadataKey, remoteResult.nextMarker)
						if (additionalLoadedKeys !== undefined)
							for (const row of remoteResult.rows)
								for (const additionalLoadedKey of additionalLoadedKeys(row, loadSubsetOptions)) {
									if (additionalLoadedKey === key)
										continue

									const additionalRowKey = getKey(row)
									metadata?.collection.set(`loadedSubset:${schemaVersion}:${additionalLoadedKey}`, {
										collectionId,
										continuationBySource: {},
										loadedKey: additionalLoadedKey,
										rowCount: 1,
										sourceRowCounts: {
											[row[EntityMetaKey.Source]]: 1,
										},
										sourceRowKeys: {
											[row[EntityMetaKey.Source]]: [additionalRowKey],
										},
									})
								}
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
									&& Object.entries(remoteResult.nextMarker.sourceRowKeys).every(([source, keys]) => (
										persistedMarker.sourceRowKeys[source]?.length === keys.length
										&& keys.every((key) => persistedMarker.sourceRowKeys[source]?.includes(key) === true)
									))
									&& stringify(persistedMarker.continuationBySource)
									=== stringify(remoteResult.nextMarker.continuationBySource)
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
								console.error(
									`[Blockhead collection-load-failure] ${collectionId} partially failed ${key}: ${remoteResult.failedOutcomes.map(({ source, error }) => `${source}: ${error ?? 'failed'}`).join(', ')}`
								)
						}

						resolvedLoadSubsets.set(key, {
							loadSubsetOptions,
							sources: requestedSources,
						})
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
				}
				const load = (async () => {
					await loadSubsetOnce()
					if (staleSubsetKeys.has(key))
						await loadSubsetOnce()
				})()
				inFlightLoads.set(key, load)
				notifyResolverSubsetLoadingChange()
				try {
					await load
				} finally {
					inFlightLoads.delete(key)
					notifyLocalMutationAuthorityChange()
					notifyResolverSubsetLoadingChange()
				}
			}
			const appendSubset = async (
				loadSubsetOptions: LoadSubsetOptions,
				source: string,
				expectedContinuation: ProviderContinuation
			) => {
				if (expectedContinuation.terminal)
					throw new Error(`${collectionId} source ${source} continuation is terminal`)

				const key = loadedKey(loadSubsetOptions)
				const appendKey = `append:${key}:${source}`
				const inFlightLoad = inFlightLoads.get(appendKey)
				if (inFlightLoad !== undefined) {
					await inFlightLoad
					return
				}

				const load = (async () => {
					const abortController = new AbortController()
					inFlightAppendAbortControllerByKey.set(appendKey, abortController)
					const metadataKey = `loadedSubset:${schemaVersion}:${key}`
					const marker = persistedCollectionLoadedSubset(metadata?.collection.get(metadataKey))
					const currentContinuation = marker?.continuationBySource[source]
					if (
						marker?.collectionId !== collectionId
						|| marker.loadedKey !== key
						|| currentContinuation == null
						|| currentContinuation.terminal
						|| stringify(currentContinuation) !== stringify(expectedContinuation)
					)
						throw new Error(`${collectionId} source ${source} continuation changed before append`)

					const hydratedRows = persistedRows(
						loadSubsetOptions,
						collection.toArray,
						marker
					)
					const loaded = await Promise.race([
						loadRows(
							loadSubsetOptions,
							[source],
							false,
							{
								[source]: currentContinuation.token,
							}
						),
						new Promise<never>((_resolve, reject) => {
							abortController.signal.addEventListener('abort', () => {
								reject(new DOMException('The continuation request was cancelled.', 'AbortError'))
							}, {
								once: true,
							})
						}),
					])
					if (abortController.signal.aborted)
						throw new DOMException('The continuation request was cancelled.', 'AbortError')

					const appended = persistedCollectionAppendResult({
						collectionId,
						loadedKey: key,
						marker,
						persistedRows: hydratedRows.retainedRows,
						loaded,
						source,
						getKey,
						getValueIdentity: (row) => (
							'valueKey' in row ?
								String(row.valueKey)
							:
								String(getKey(row))
						),
						setValueIndex: (row, valueIndex) => (
							'valueIndex' in row ?
								{
									...row,
									valueIndex,
								}
							:
								row
						),
					})
					const latestMarker = persistedCollectionLoadedSubset(
						metadata?.collection.get(metadataKey)
					)
					if (
						!activeLoadSubsets.has(key)
						|| latestMarker?.collectionId !== collectionId
						|| latestMarker.loadedKey !== key
						|| stringify(latestMarker.continuationBySource[source])
						!== stringify(expectedContinuation)
					)
						throw new Error(`${collectionId} source ${source} continuation became stale during append`)

					const otherOwnedRowKeys = new Set(
						(metadata?.collection.list() ?? []).flatMap(({ key: otherMetadataKey, value }) => {
							if (
								otherMetadataKey === metadataKey
								|| !otherMetadataKey.startsWith(`loadedSubset:${schemaVersion}:`)
							)
								return []

							const otherMarker = persistedCollectionLoadedSubset(value)
							return (
								otherMarker?.collectionId === collectionId ?
									Object.values(otherMarker.sourceRowKeys).flat()
								:
									[]
							)
						})
					)
					begin()
					const appendedSourceRows = appended.rows.filter((row) => row[EntityMetaKey.Source] === source)
					const appendedSourceRowKeys = new Set(appendedSourceRows.map(getKey))
					for (const rowKey of marker.sourceRowKeys[source] ?? []) {
						if (
							otherOwnedRowKeys.has(rowKey)
							|| appendedSourceRowKeys.has(rowKey)
						)
							continue

						const row = collection.get(rowKey)
						if (row !== undefined)
							write({
								type: 'delete',
								value: row,
							})
					}
					for (const row of appendedSourceRows)
						write({
							type: collection.has(getKey(row)) ? 'update' : 'insert',
							value: row,
						})
					metadata?.collection.set(metadataKey, appended.nextMarker)
					commit()
					await waitForPersistence?.(collectionId)

					if (appended.failedOutcomes.length > 0) {
						for (const outcome of appended.failedOutcomes)
							collectionLoadFailures.add({
								collectionId,
								selectorKeys: parseResolverSubset(loadSubsetOptions).selectorKeys,
								parentSelectorKeys: parseResolverSubset(loadSubsetOptions).parentSelectorKeys,
								sources: [outcome.source],
								error: `${outcome.source}: ${outcome.error ?? 'continuation failed'}`,
							})
						throw new Error(appended.failedOutcomes.map((outcome) => (
							`${outcome.source}: ${outcome.error ?? 'continuation failed'}`
						)).join('; '))
					}
				})()
				inFlightLoads.set(appendKey, load)
				notifyContinuationChange()
				try {
					await load
				} finally {
					inFlightLoads.delete(appendKey)
					inFlightAppendAbortControllerByKey.delete(appendKey)
					notifyContinuationChange()
				}
			}
			setContinuationForRows((parentSelectorKey, sourceRowKeys, selectedSources) => {
				const candidates = [...activeLoadSubsets].flatMap(([key, activeLoadSubset]) => {
					const subset = parseResolverSubset(activeLoadSubset.loadSubsetOptions)
					if (!subset.parentSelectorKeys.includes(parentSelectorKey))
						return []

					const marker = persistedCollectionLoadedSubset(
						metadata?.collection.get(`loadedSubset:${schemaVersion}:${key}`)
					)
					if (marker?.collectionId !== collectionId || marker.loadedKey !== key)
						return []

					return Object.entries(marker.continuationBySource).flatMap(([source, continuation]) => {
						if (continuation === undefined)
							return []

						if (
							selectedSources != null
							&& !selectedSources.includes(source)
						)
							return []

						const expectedRowKeys = marker.sourceRowKeys[source] ?? []
						const actualRowKeys = sourceRowKeys[source] ?? []
						if (
							expectedRowKeys.length !== actualRowKeys.length
							|| expectedRowKeys.some((rowKey) => !actualRowKeys.includes(rowKey))
						)
							return []

						return [{
							key,
							loadSubsetOptions: activeLoadSubset.loadSubsetOptions,
							source,
							continuation,
						}]
					})
				})
				return candidates.flatMap((candidate) => (
					candidates.some((other) => (
						other !== candidate
						&& other.source === candidate.source
						&& other.key !== candidate.key
					)) ?
						[]
					:
						[{
							source: candidate.source,
							metadata: candidate.continuation,
							loading: inFlightLoads.has(`append:${candidate.key}:${candidate.source}`),
							loadMore: () => appendSubset(
								candidate.loadSubsetOptions,
								candidate.source,
								candidate.continuation
							),
							cancel: () => {
								inFlightAppendAbortControllerByKey
									.get(`append:${candidate.key}:${candidate.source}`)
									?.abort()
							},
						}]
				))
			})
			setRefreshRows(() => {
				for (const [key, activeLoadSubset] of activeLoadSubsets) {
					staleSubsetKeys.add(key)
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
					if (activeLoadSubset == null || activeLoadSubset.count === 1) {
						activeLoadSubsets.delete(key)
						for (const [appendKey, abortController] of inFlightAppendAbortControllerByKey)
							if (appendKey.startsWith(`append:${key}:`))
								abortController.abort()
					} else
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
	subset: ReturnType<typeof parseResolverSubset>,
	providerContinuationToken?: string
): ResolverContext => ({
	...subset,
	publicEnv: context.resolverPublicEnvBySource.get(source) ?? {},
	...(providerContinuationToken !== undefined && {
		providerContinuationToken,
	}),
})

const resolverSnapshotSubsetKey = (
	subset: ReturnType<typeof parseResolverSubset>
) => stringify({
	filters: subset.filters.filter((filter) => (
		filter.fieldPath[0] !== EntityMetaKey.Source
		&& filter.fieldPath[0] !== EntityMetaKey.SelectorKey
		&& filter.fieldPath[0] !== EntityMetaKey.ParentSelectorKey
		&& filter.fieldPath[0] !== 'facetPathKey'
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
	subset: ReturnType<typeof parseResolverSubset>,
	forceRemote: boolean,
	providerContinuationToken?: string
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
			providerContinuationToken,
		],
		queryFn: async () => ({
			snapshot: await Promise.resolve(resolve(
				entitySelector,
				resolverContext(
					context,
					String(resolver.source),
					subset,
					providerContinuationToken
				)
			)),
		}),
		staleTime: forceRemote ? 0 : Infinity,
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

const resolverAppliesToEntitySelector = <
	const _Schema extends Schema,
	const _Source extends string,
>(
	schema: _Schema,
	entityDefinition: EntityDefinition,
	resolver: SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, ResolverContext>,
	entitySelector: EntitySelector<_Schema, EntityType<_Schema>>
) => {
	const selectorName = validateEntitySelector(
		schema,
		entityDefinition,
		entitySelector
	).name
	return (
		resolver.resolve[selectorName] != null
		&& resolver.appliesTo(selectorName, entitySelector)
	)
}

const applicableResolverSources = <
	const _Schema extends Schema,
	const _Source extends string,
>(
	schema: _Schema,
	entityDefinition: EntityDefinition,
	subset: ReturnType<typeof parseResolverSubset>,
	defaultSources: readonly string[] | undefined,
	resolvers: readonly SourceResolverDefinition<_Schema, _Source, EntityType<_Schema>, ResolverContext>[],
	entitySelectors: readonly EntitySelector<_Schema, EntityType<_Schema>>[]
) => {
	const resolvable = resolvableSources(
		subset,
		defaultSources,
		resolvers.map((resolver) => String(resolver.source))
	)
	return new Set([...resolvable].filter((source) => resolvers.some((resolver) => (
		String(resolver.source) === source
		&& entitySelectors.some((entitySelector) => resolverAppliesToEntitySelector(
			schema,
			entityDefinition,
			resolver,
			entitySelector
		))
	))))
}

export const entityResolverSourcesForSelectorKeys = <
	const _Schema extends Schema,
	const _Source extends string,
>(
	schema: _Schema,
	entityDefinition: EntityDefinition,
	selectorKeys: readonly string[],
	resolvers: readonly SourceResolverDefinition<
		_Schema,
		_Source,
		EntityType<_Schema>,
		ResolverContext
	>[],
	requestedSources?: readonly string[]
) => {
	const entitySelectors = selectorKeys.map((selectorKey) => parse(selectorKey))
	const sources = new Set(requestedSources ?? entitySelectors.flatMap((entitySelector) => validateEntitySelector(
		schema,
		entityDefinition,
		entitySelector
	).fields.flatMap((fieldName) => (
		entityDefinition.fields.find((fieldDefinition) => fieldDefinition.name === fieldName)?.defaultSources
		?? []
	))))
	return [...new Set(resolvers.flatMap((resolver) => (
		sources.has(String(resolver.source))
		&& entitySelectors.some((entitySelector) => resolverAppliesToEntitySelector(
				schema,
				entityDefinition,
				resolver,
				entitySelector
			)) ?
			[String(resolver.source)]
		:
			[]
	)))]
}

const parentSelectorsFromSubset = (
	subset: ReturnType<typeof parseResolverSubset>
) => subset.parentSelectorKeys.map((selectorKey) => ({
	selector: parse(selectorKey),
	selectorKey,
}))

const resolverPartsForEntitySelectors = <
	const _Schema extends Schema,
	const _Source extends string,
>(
	schema: _Schema,
	entityDefinition: EntityDefinition,
	entitySelectors: readonly EntitySelector<_Schema, EntityType<_Schema>>[],
	resolverPartsBySelectorAndField: ResolverIndexes<_Schema, _Source>['resolverValuePartsByEntityTypeSelectorAndFieldName'],
	entityType: string,
	facetPath: EntityFacetPath,
	fieldName: string
) => [...new Set(entitySelectors.flatMap((entitySelector) => (
	resolverPartsBySelectorAndField[resolverPartsKey(
		entityType,
		validateEntitySelector(schema, entityDefinition, entitySelector).name,
		facetPath,
		fieldName
	)] ?? []
)))]

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

const cacheReferenceFields = <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	source: string,
	reference: object
) => {
	const selector = Object.getOwnPropertyDescriptor(reference, EntityMetaKey.Selector)?.value
	if (selector == null || typeof selector !== 'object' || Array.isArray(selector))
		return

	const selectorKey = entitySelectorKey(
		context.schema,
		context.entityDefinitionByType[entityType],
		selector
	)
	context.materializedReferenceEntityKeys.add(stringify([
		entityType,
		selectorKey,
		source,
	]))
	const fields = Object.getOwnPropertyDescriptor(reference, EntityMetaKey.Fields)?.value
	if (fields == null || typeof fields !== 'object' || Array.isArray(fields))
		return

	for (const [fieldAddressKey, value] of Object.entries(Object.fromEntries<unknown>(
		Object.entries(fields)
	))) {
		context.referenceFieldValueByAddress.set(stringify([
			entityType,
			selectorKey,
			fieldAddressKey,
			source,
		]), value)

		const definition = context.entityFieldDefinitionByEntityTypePathAndName[entityType][fieldAddressKey]
		if (
			definition == null
			|| definition.type === EntityFieldType.Primitive
		)
			continue

		let nestedReferences = [value]
		if (entityFieldCardinalityIsMultiple(definition.cardinality)) {
			if (!Array.isArray(value))
				continue

			nestedReferences = value
		}

		for (const nestedReference of nestedReferences) {
			if (
				nestedReference == null
				|| typeof nestedReference !== 'object'
				|| Array.isArray(nestedReference)
			)
				continue

			cacheReferenceFields(
				context,
				definition.entityType,
				source,
				nestedReference
			)
		}
	}
}

const loadEntityRows = async <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	loadSubsetOptions: LoadSubsetOptions,
	forceRemote: boolean,
	sourceNames?: readonly string[]
) => {
	const subset = parseResolverSubset(loadSubsetOptions)
	const entityDefinition = context.entityDefinitionByType[entityType]
	const entitySelectors = subset.selectorKeys.map((selectorKey) => parse(selectorKey))
	const resolvers = [...new Set(entitySelectors.flatMap((entitySelector) => (
		context.resolverIndexes.resolverDefinitionsByEntityTypeAndSelectorName[resolverDefinitionsKey(
			entityType,
			validateEntitySelector(context.schema, entityDefinition, entitySelector).name
		)] ?? []
	)))]
	const requestedEntitySources = requestedSources(
		subset,
		sourceNames,
		resolvers.map((resolver) => String(resolver.source))
	)
	const sources = applicableResolverSources(
		context.schema,
		entityDefinition,
		subset,
		sourceNames,
		resolvers,
		entitySelectors
	)
	const results = await Promise.all(subset.selectorKeys.flatMap((selectorKey) => (
		resolvers.flatMap(async (resolver) => {
			if (
				resolver.source === Source.Local_Internal
				&& requestedEntitySources.has(Source.Local_Internal)
			)
				return {
					rows: [],
					outcomes: [],
				}

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
			if (
				resolver.resolve[selectorName] == null
				|| !resolver.appliesTo(selectorName, entitySelector)
			)
				return {
					rows: [],
					outcomes: [],
				}

			if (context.materializedReferenceEntityKeys.has(stringify([
				entityType,
				selectorKey,
				String(resolver.source),
			])))
				return {
					rows: materializeResolverOutput({
						kind: ResolverOutputMaterialization.Entity,
						schema: context.schema,
						schemaIndex: context,
						entityDefinition,
						selector: entitySelector,
						selectorKey,
						source: String(resolver.source),
						snapshot: undefined,
					}),
					outcomes: [{
						source: String(resolver.source),
						status: PersistedCollectionSourceStatus.Completed,
					}],
				}

				try {
					const snapshot = await resolverSnapshot(
						context,
						resolver,
						entityDefinition,
						entitySelector,
						subset,
						forceRemote
					)
				if (snapshot === undefined)
					return {
						rows: [],
						outcomes: [{
							source: String(resolver.source),
							status: PersistedCollectionSourceStatus.Completed,
						}],
					}

					const snapshotObject = Object(snapshot)
					const resolvedSelectors = entitySelectorsFromFields(
						context.schema,
						entityDefinition,
						entitySelector,
						snapshotObject
					)

				return {
					rows: resolvedSelectors.flatMap((resolvedSelector) => materializeResolverOutput({
						kind: ResolverOutputMaterialization.Entity,
						schema: context.schema,
						schemaIndex: context,
						entityDefinition,
						selector: resolvedSelector,
							selectorKey: entitySelectorKey(context.schema, entityDefinition, resolvedSelector),
							source: String(resolver.source),
							snapshot: snapshotObject,
						})),
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
		outcomes: [
			...results.flatMap((result) => result.outcomes),
			...(requestedEntitySources.has(Source.Local_Internal) ? [{
				source: Source.Local_Internal,
				status: PersistedCollectionSourceStatus.Completed,
			}] : []),
		],
	}
}

const loadFieldRows = async <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	definition: EntityFieldDefinition,
	loadSubsetOptions: LoadSubsetOptions,
	forceRemote: boolean,
	sourceNames?: readonly string[],
	providerContinuationTokenBySource?: Readonly<Record<string, string>>
) => {
	const subset = parseResolverSubset(loadSubsetOptions)
	const entityDefinition = context.entityDefinitionByType[entityType]
	const fieldName = definition.name
	const facetPath = entityFieldFacetPath(definition)
	const parentSelectors = parentSelectorsFromSubset(subset)
	const resolverParts = resolverPartsForEntitySelectors(
		context.schema,
		entityDefinition,
		parentSelectors.map(({ selector }) => selector),
		context.resolverIndexes.resolverValuePartsByEntityTypeSelectorAndFieldName,
		entityType,
		facetPath,
		fieldName
	)
	const requestedFieldSources = requestedSources(
		subset,
		sourceNames ?? definition.defaultSources,
		resolverParts.map((resolverPart) => String(resolverPart.source))
	)
	const sources = applicableResolverSources(
		context.schema,
		entityDefinition,
		subset,
		sourceNames ?? definition.defaultSources,
		resolverParts.map((resolverPart) => resolverPart.resolver),
		parentSelectors.map(({ selector }) => selector)
	)
	const results = await Promise.all(parentSelectors.flatMap(({
		selector: parentSelector,
		selectorKey: parentSelectorKey,
	}) => {
		const selectorName = validateEntitySelector(
			context.schema,
			entityDefinition,
			parentSelector
		).name
		const fieldAddressKey = entityFieldAddressKey(entityType, facetPath, fieldName)
		const materializedFieldSources = [...requestedFieldSources].filter((source) => (
			context.referenceFieldValueByAddress.has(stringify([
				entityType,
				parentSelectorKey,
				fieldAddressKey,
				source,
			]))
		))
		if (materializedFieldSources.length > 0)
			return [...requestedFieldSources].map((source) => Promise.resolve({
				rows: (
					materializedFieldSources.includes(source) ?
						materializeResolverOutput({
							kind: ResolverOutputMaterialization.Field,
							schema: context.schema,
							schemaIndex: context,
							entityDefinition,
							parentSelector,
							parentSelectorKey,
							source,
							fieldDefinition: definition,
							value: context.referenceFieldValueByAddress.get(stringify([
								entityType,
								parentSelectorKey,
								fieldAddressKey,
								source,
							])),
						})
					:
						[]
				),
				outcomes: [{
					source,
					status: PersistedCollectionSourceStatus.Completed,
				}],
			}))

		const selectorOwnsField = (
			entityDefinition.selectors
				.find((selectorDefinition) => selectorDefinition.name === selectorName)
				?.fields
				.includes(fieldName)
			?? false
		)
		if (selectorOwnsField) {
			const selectorSources = [...requestedFieldSources].filter((source) => (
				source === Source.Local_Internal
				|| resolverParts.some((resolverPart) => (
					String(resolverPart.source) === source
					&& resolverPart.resolver.resolve[selectorName] != null
					&& resolverPart.resolver.appliesTo(selectorName, parentSelector)
				))
			))
			const selectorValue = parentSelector[fieldName]
			if (selectorValue === undefined)
				return selectorSources.map((source) => Promise.resolve({
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
			return selectorSources.map((source) => Promise.resolve({
				rows: materializeResolverOutput({
					kind: ResolverOutputMaterialization.Field,
					schema: context.schema,
					schemaIndex: context,
					entityDefinition,
					parentSelector,
					parentSelectorKey,
					source,
					fieldDefinition: definition,
					value,
				}),
				outcomes: [{
					source,
					status: PersistedCollectionSourceStatus.Completed,
				}],
			}))
		}

		return resolverParts.flatMap(async (resolverPart) => {
			if (
				resolverPart.source === Source.Local_Internal
				&& requestedFieldSources.has(Source.Local_Internal)
			)
				return {
					rows: [],
					outcomes: [],
				}

			if (!sources.has(String(resolverPart.source)))
				return {
					rows: [],
					outcomes: [],
				}

			if (
				resolverPart.resolver.resolve[selectorName] == null
				|| !resolverPart.resolver.appliesTo(selectorName, parentSelector)
			)
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
					subset,
					forceRemote,
					providerContinuationTokenBySource?.[String(resolverPart.source)]
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
						subset,
						providerContinuationTokenBySource?.[String(resolverPart.source)]
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

				const rows = materializeResolverOutput({
						kind: ResolverOutputMaterialization.Field,
						schema: context.schema,
						schemaIndex: context,
						entityDefinition,
						parentSelector,
						parentSelectorKey,
						source: String(resolverPart.source),
						fieldDefinition: definition,
						value,
				})
				if (definition.type !== EntityFieldType.Primitive) {
					let references = [value]
					if (entityFieldCardinalityIsMultiple(definition.cardinality) && Array.isArray(value))
						references = value

					for (const reference of references) {
						if (
							reference == null
							|| typeof reference !== 'object'
							|| Array.isArray(reference)
						)
							continue

						cacheReferenceFields(
							context,
							definition.entityType,
							String(resolverPart.source),
							reference
						)
					}
				}

				return {
					rows,
					outcomes: [{
						source: String(resolverPart.source),
						status: PersistedCollectionSourceStatus.Completed,
						...(resolverPart.continuation !== undefined && {
							continuation: resolverPart.continuation(
								snapshot,
								parentSelector,
								resolverContext(
									context,
									String(resolverPart.source),
									subset,
									providerContinuationTokenBySource?.[String(resolverPart.source)]
								)
							),
						}),
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
		outcomes: [
			...results.flatMap((result) => result.outcomes),
			...(requestedFieldSources.has(Source.Local_Internal) ? [{
				source: Source.Local_Internal,
				status: PersistedCollectionSourceStatus.Completed,
			}] : []),
		],
	}
}

const loadCountRows = async <
	const _Schema extends Schema
>(
	context: ClientContext<_Schema>,
	entityType: string,
	definition: EntityFieldDefinition,
	loadSubsetOptions: LoadSubsetOptions,
	forceRemote: boolean,
	sourceNames?: readonly string[]
) => {
	const subset = parseResolverSubset(loadSubsetOptions)
	const entityDefinition = context.entityDefinitionByType[entityType]
	const fieldName = definition.name
	const facetPath = entityFieldFacetPath(definition)
	const filterKeys = countFilterKeysFromSubset(subset)
	const parentSelectors = parentSelectorsFromSubset(subset)
	const resolverParts = resolverPartsForEntitySelectors(
		context.schema,
		entityDefinition,
		parentSelectors.map(({ selector }) => selector),
		context.resolverIndexes.resolverCountPartsByEntityTypeSelectorAndFieldName,
		entityType,
		facetPath,
		fieldName
	)
	const requestedCountSources = requestedSources(
		subset,
		sourceNames ?? definition.defaultSources,
		resolverParts.map((resolverPart) => String(resolverPart.source))
	)
	const sources = applicableResolverSources(
		context.schema,
		entityDefinition,
		subset,
		sourceNames ?? definition.defaultSources,
		resolverParts.map((resolverPart) => resolverPart.resolver),
		parentSelectors.map(({ selector }) => selector)
	)
	const results = await Promise.all(parentSelectors.flatMap(({
		selector: parentSelector,
		selectorKey: parentSelectorKey,
	}) => (
		resolverParts.flatMap(async (resolverPart) => {
			if (
				resolverPart.source === Source.Local_Internal
				&& requestedCountSources.has(Source.Local_Internal)
			)
				return {
					rows: [],
					outcomes: [],
				}

			if (!sources.has(String(resolverPart.source)))
				return {
					rows: [],
					outcomes: [],
				}

			const selectorName = validateEntitySelector(
				context.schema,
				entityDefinition,
				parentSelector
			).name
			if (
				resolverPart.resolver.resolve[selectorName] == null
				|| !resolverPart.resolver.appliesTo(selectorName, parentSelector)
			)
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
					subset,
					forceRemote
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
				return {
					rows: materializeResolverOutput({
						kind: ResolverOutputMaterialization.Count,
						schema: context.schema,
						schemaIndex: context,
						entityDefinition,
						parentSelector,
						parentSelectorKey,
						source: String(resolverPart.source),
						fieldDefinition: definition,
						value: count,
						filterKey: [...filterKeys][0] ?? stringify({}),
					}),
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
		outcomes: [
			...results.flatMap((result) => result.outcomes),
			...(requestedCountSources.has(Source.Local_Internal) ? [{
				source: Source.Local_Internal,
				status: PersistedCollectionSourceStatus.Completed,
			}] : []),
		],
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
	const parentSelectors = parentSelectorsFromSubset(subset)
	const fieldLiveParts = resolverPartsForEntitySelectors(
		context.schema,
		context.entityDefinitionByType[entityType],
		parentSelectors.map(({ selector }) => selector),
		context.resolverIndexes.resolverLivePartsByEntityTypeSelectorAndFieldName,
		entityType,
		facetPath,
		definition.name
	)
	const sources = applicableResolverSources(
		context.schema,
		context.entityDefinitionByType[entityType],
		subset,
		definition.defaultSources,
		[
			...rootLiveParts.map((part) => part.resolver),
			...fieldLiveParts.map((part) => part.resolver),
		],
		parentSelectors.map(({ selector }) => selector)
	)
	const releases: (() => void)[] = []
	for (const {
		selector: parentEntitySelector,
		selectorKey: parentSelectorKey,
	} of parentSelectors) {
		const selectorName = validateEntitySelector(
			context.schema,
			context.entityDefinitionByType[entityType],
			parentEntitySelector
		).name
		const fieldsForSource = (source: string, liveFacetPath: EntityFacetPath): ResolveLiveFields<_Schema, EntityType<_Schema>> & Readonly<Record<string, ResolveLiveFieldHandle<_Schema, EntityType<_Schema>, string>>> => new Proxy(Object.assign(Object.create(null), {
			invalidate: (fieldNames: readonly EntityFieldName<_Schema, EntityType<_Schema>>[]) => {
				for (const fieldName of fieldNames) {
					const liveFieldAddressKey = entityFieldAddressKey(entityType, liveFacetPath, fieldName)
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

								return materializeResolverOutput({
									kind: ResolverOutputMaterialization.Field,
									schema: context.schema,
									schemaIndex: context,
									entityDefinition: context.entityDefinitionByType[entityType],
									parentSelector: parentEntitySelector,
									parentSelectorKey,
									source,
									fieldDefinition: liveFieldDefinition,
									value: row.value,
								})
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

							for (const row of rows)
								if (row.source !== source)
									throw new Error(`${liveFieldAddressKey} live publisher cannot write ${row.source} counts from ${source}`)

							countCollection.utils.replaceRows(
								(row) => (
									row[EntityMetaKey.ParentSelectorKey] === parentSelectorKey
									&& row[EntityMetaKey.Source] === source
									&& row.facetPathKey === stringify(liveFacetPath)
									&& row.filterKey === filterKey
								),
								rows.flatMap((row) => materializeResolverOutput({
									kind: ResolverOutputMaterialization.Count,
									schema: context.schema,
									schemaIndex: context,
									entityDefinition: context.entityDefinitionByType[entityType],
									parentSelector: parentEntitySelector,
									parentSelectorKey,
									source,
									fieldDefinition: liveFieldDefinition,
									value: row.value,
									filterKey,
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
			if (
				!sources.has(String(part.source))
				|| !part.resolver.appliesTo(selectorName, parentEntitySelector)
			)
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
				|| !part.resolver.appliesTo(selectorName, parentEntitySelector)
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
	schemaIndex = indexSchema(schema),
	sourceProviders,
}: {
	schema: _Schema
	schemaIndex?: ReturnType<typeof indexSchema<_Schema>>
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
	waitForPersistence?: WaitForPersistence
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
	} = schemaIndex

	const entityCollections: EntityCollections<_Schema> = {}
	const entityFieldCollections: EntityFieldCollections<_Schema> = {}
	const entityFieldCountCollections: EntityFieldCountCollections<_Schema> = {}
	const materializedReferenceEntityKeys = new Set<string>()
	const referenceFieldValueByAddress = new Map<string, unknown>()
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
		clear(collectionId) {
			const retained = this.list.filter((failure) => failure.collectionId !== collectionId)
			if (retained.length === this.list.length)
				return

			this.list.splice(0, this.list.length, ...retained)
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
		const entityResolvers = resolverIndexes.resolverDefinitionsByEntityType[entityDefinition.entityType] ?? []
		const hasLocalEntityMutationAuthority = (loadSubsetOptions: LoadSubsetOptions) => {
			const subset = parseResolverSubset(loadSubsetOptions)

			return (
				subset.selectorKeys.length > 0
				&& subset.sources?.includes(Source.Local_Internal) === true
				&& subset.filters.every((filter) => (
					filter.fieldPath[0] === EntityMetaKey.SelectorKey
					|| filter.fieldPath[0] === EntityMetaKey.Source
				))
				&& subset.selectorKeys.every((selectorKey) => (
					entityCollectionUtils.utils.hasLocalMutationAuthority(
						selectorKey,
						localMutationAuthorityKey({
							source: Source.Local_Internal,
							entityType: entityDefinition.entityType,
							selectorKey,
						})
					)
				))
			)
		}
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
					loadedKey: entityLoadedSubsetKey,
					additionalLoadedKeys: (row, loadSubsetOptions) => [entityLoadedSubsetKey(
						loadSubsetOptions,
						[row[EntityMetaKey.SelectorKey]]
					)],
					sources: (loadSubsetOptions) => {
						const subset = parseResolverSubset(loadSubsetOptions)
						return [...new Set([
							...entityResolverSourcesForSelectorKeys(
								schema,
								entityDefinition,
								subset.selectorKeys,
								entityResolvers,
								subset.sources
							),
							...(subset.sources?.includes(Source.Local_Internal) === true ? [Source.Local_Internal] : []),
						])]
					},
					localAuthoritySourceRowKeys: (
						loadSubsetOptions,
						rows
					): Readonly<Record<string, readonly (string | number)[]>> => {
						const subset = parseResolverSubset(loadSubsetOptions)
						if (!hasLocalEntityMutationAuthority(loadSubsetOptions))
							return {}

						return {
							[Source.Local_Internal]: rows.filter((row) => (
								row[EntityMetaKey.Source] === Source.Local_Internal
								&& subset.selectorKeys.includes(row[EntityMetaKey.SelectorKey])
							)).map((row) => stringify([
								row[EntityMetaKey.Source],
								row[EntityMetaKey.SelectorKey],
							])),
						}
					},
					persistedRows: (loadSubsetOptions, rows, marker) => {
						const subset = parseResolverSubset(loadSubsetOptions)
						const sources = new Set([
							...entityResolverSourcesForSelectorKeys(
								schema,
								entityDefinition,
								subset.selectorKeys,
								entityResolvers,
								subset.sources
							),
							...(subset.sources?.includes(Source.Local_Internal) === true ? [Source.Local_Internal] : []),
						])
						const allRows = productSubsetOwnedRows(
							marker,
							rows,
							[...new Set([
								...sources,
								...Object.keys(marker?.sourceRowKeys ?? {}),
							])],
							(row) => stringify([
								row[EntityMetaKey.Source],
								row[EntityMetaKey.SelectorKey],
							])
						)
						const invalidSources = new Set<string>()
						const malformedRowKeys = new Set<string | number>()
						const materializedRows = allRows.flatMap((row) => {
							const rowKey = stringify([
								row[EntityMetaKey.Source],
								row[EntityMetaKey.SelectorKey],
							])
							if (
								!(
									row[EntityMetaKey.Source] === Source.Local_Internal
									&& marker?.sourceRowKeys[Source.Local_Internal]?.includes(rowKey) === true
								)
								&& !entityResolvers.some((resolver) => (
									String(resolver.source) === row[EntityMetaKey.Source]
									&& resolverAppliesToEntitySelector(
										schema,
										entityDefinition,
										resolver,
										row[EntityMetaKey.Selector]
									)
								))
							) {
								malformedRowKeys.add(rowKey)
								return []
							}

							try {
								return materializeResolverOutput({
									kind: ResolverOutputMaterialization.Entity,
									schema,
									schemaIndex,
									entityDefinition,
									selector: row[EntityMetaKey.Selector],
									selectorKey: row[EntityMetaKey.SelectorKey],
									source: row[EntityMetaKey.Source],
									snapshot: undefined,
								})
							} catch {
								invalidSources.add(row[EntityMetaKey.Source])
								malformedRowKeys.add(rowKey)
								return []
							}
						})
						return {
							allRows,
							retainedRows: materializedRows.filter((row) => !invalidSources.has(row[EntityMetaKey.Source])),
							rows: materializedRows.filter((row) => (
								!invalidSources.has(row[EntityMetaKey.Source])
								&& sources.has(row[EntityMetaKey.Source])
							)),
							invalidSources: [...invalidSources],
							malformedRowKeys: [...malformedRowKeys],
						}
					},
					loadRows: (loadSubsetOptions, sources, forceRemote) => loadEntityRows(
						requireContext(),
						entityDefinition.entityType,
						loadSubsetOptions,
						forceRemote,
						sources
					),
					waitForPersistence,
					events,
					collectionLoadFailures,
					setWriteRows: entityCollectionUtils.setWriteRows,
					setReplaceRows: entityCollectionUtils.setReplaceRows,
					setRefreshRows: entityCollectionUtils.setRefreshRows,
					setWaitForPersistence: entityCollectionUtils.setWaitForPersistence,
					setResolverSubsetLoading: entityCollectionUtils.setResolverSubsetLoading,
					setResolverSubsetResolved: entityCollectionUtils.setResolverSubsetResolved,
					setLocalMutationAuthority: entityCollectionUtils.setLocalMutationAuthority,
					setContinuationForRows: entityCollectionUtils.setContinuationForRows,
					notifyLocalMutationAuthorityChange: entityCollectionUtils.notifyLocalMutationAuthorityChange,
					notifyContinuationChange: entityCollectionUtils.notifyContinuationChange,
					notifyResolverSubsetLoadingChange: entityCollectionUtils.notifyResolverSubsetLoadingChange,
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
				const hasLocalFieldMutationAuthority = (loadSubsetOptions: LoadSubsetOptions) => {
					const subset = parseResolverSubset(loadSubsetOptions)

					return (
						subset.parentSelectorKeys.length > 0
							&& subset.sources?.includes(Source.Local_Internal) === true
							&& subset.parentSelectorKeys.every((selectorKey) => (
								entityFieldCardinalityIsMultiple(definition.cardinality) ?
									entityFieldCollectionUtils.utils.hasLocalMutationAuthority(
										selectorKey,
										localMutationAuthorityKey({
											source: Source.Local_Internal,
											entityType: entityDefinition.entityType,
											selectorKey,
											fieldName: definition.name,
											fieldAddressKey,
											facetPathKey: stringify(facetPath),
										})
									)
									|| entityFieldCountCollections[entityDefinition.entityType][fieldAddressKey]
										?.utils.hasLocalMutationAuthority(
											selectorKey,
											localMutationAuthorityKey({
												source: Source.Local_Internal,
												entityType: entityDefinition.entityType,
												selectorKey,
												fieldName: definition.name,
												fieldAddressKey,
												facetPathKey: stringify(facetPath),
												filterKey: stringify({}),
											})
										) === true
								:
									entityFieldCollectionUtils.utils.hasLocalMutationAuthority(
										selectorKey,
										localMutationAuthorityKey({
											source: Source.Local_Internal,
											entityType: entityDefinition.entityType,
											selectorKey,
											fieldName: definition.name,
											fieldAddressKey,
											facetPathKey: stringify(facetPath),
										})
									)
							))
					)
				}
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
								row.valueIndex,
							]),
							loadedKey: (loadSubsetOptions) => stringify(fieldLoadedSubsetKey(loadSubsetOptions)),
							sources: (loadSubsetOptions) => {
								const subset = parseResolverSubset(loadSubsetOptions)
								const resolverParts = resolverPartsForEntitySelectors(
									schema,
									entityDefinition,
									parentSelectorsFromSubset(subset).map(({ selector }) => selector),
									resolverIndexes.resolverValuePartsByEntityTypeSelectorAndFieldName,
									entityDefinition.entityType,
									facetPath,
									definition.name
								)
								return [...new Set([
									...applicableResolverSources(
										schema,
										entityDefinition,
										subset,
										definition.defaultSources,
										resolverParts.map((resolverPart) => resolverPart.resolver),
										parentSelectorsFromSubset(subset).map(({ selector }) => selector)
									),
									...(subset.sources?.includes(Source.Local_Internal) === true ? [Source.Local_Internal] : []),
								])]
							},
							localAuthoritySourceRowKeys: (
								loadSubsetOptions,
								rows
							): Readonly<Record<string, readonly (string | number)[]>> => {
								const subset = parseResolverSubset(loadSubsetOptions)
								if (!hasLocalFieldMutationAuthority(loadSubsetOptions))
									return {}

								return {
									[Source.Local_Internal]: rows.filter((row) => (
										row[EntityMetaKey.Source] === Source.Local_Internal
										&& subset.parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
										&& row.facetPathKey === stringify(facetPath)
									)).map((row) => stringify([
										row[EntityMetaKey.Source],
										row[EntityMetaKey.ParentSelectorKey],
										row.facetPathKey,
										row.valueKey,
										row.valueIndex,
									])),
								}
							},
							persistedRows: (loadSubsetOptions, rows, marker) => {
								const subset = parseResolverSubset(loadSubsetOptions)
								const resolverParts = resolverPartsForEntitySelectors(
									schema,
									entityDefinition,
									parentSelectorsFromSubset(subset).map(({ selector }) => selector),
									resolverIndexes.resolverValuePartsByEntityTypeSelectorAndFieldName,
									entityDefinition.entityType,
									facetPath,
									definition.name
								)
								const sources = new Set([
									...applicableResolverSources(
										schema,
										entityDefinition,
										subset,
										definition.defaultSources,
										resolverParts.map((resolverPart) => resolverPart.resolver),
										parentSelectorsFromSubset(subset).map(({ selector }) => selector)
									),
									...(subset.sources?.includes(Source.Local_Internal) === true ? [Source.Local_Internal] : []),
								])
								const allRows = productSubsetOwnedRows(
									marker,
									rows,
									[...new Set([
										...sources,
										...Object.keys(marker?.sourceRowKeys ?? {}),
									])],
									(row) => stringify([
										row[EntityMetaKey.Source],
										row[EntityMetaKey.ParentSelectorKey],
										row.facetPathKey,
										row.valueKey,
										row.valueIndex,
									])
								)
								const invalidSources = new Set<string>()
								const malformedRowKeys = new Set<string | number>()
								const materializedRows = allRows.flatMap((row) => {
									const rowKey = stringify([
										row[EntityMetaKey.Source],
										row[EntityMetaKey.ParentSelectorKey],
										row.facetPathKey,
										row.valueKey,
										row.valueIndex,
									])
									if (
										!(
											row[EntityMetaKey.Source] === Source.Local_Internal
											&& marker?.sourceRowKeys[Source.Local_Internal]?.includes(rowKey) === true
										)
										&& !resolverParts.some((resolverPart) => (
											String(resolverPart.source) === row[EntityMetaKey.Source]
											&& resolverPart.resolver.appliesTo(
												validateEntitySelector(
													schema,
													entityDefinition,
													row[EntityMetaKey.ParentSelector]
												).name,
												row[EntityMetaKey.ParentSelector]
											)
										))
									) {
										malformedRowKeys.add(rowKey)
										return []
									}

									try {
										const materializedRow = materializeResolverOutput({
										kind: ResolverOutputMaterialization.Field,
										schema,
										schemaIndex,
											entityDefinition,
											parentSelector: row[EntityMetaKey.ParentSelector],
											parentSelectorKey: row[EntityMetaKey.ParentSelectorKey],
											source: row[EntityMetaKey.Source],
											fieldDefinition: definition,
											value: entityFieldCardinalityIsMultiple(definition.cardinality) ?
												[row[EntityMetaKey.Value]]
											:
												row[EntityMetaKey.Value],
										})[0]
										if (
											materializedRow.facetPathKey !== row.facetPathKey
											|| materializedRow.fieldName !== row.fieldName
											|| materializedRow.valueKey !== row.valueKey
											|| (
												entityFieldCardinalityIsMultiple(definition.cardinality) ?
													!Number.isSafeInteger(row.valueIndex)
													|| Number(row.valueIndex) < 0
												:
													row.valueIndex !== undefined
											)
										)
											throw new Error(`${fieldCollectionId}: malformed persisted row`)

										return [{
											...materializedRow,
											...(row.valueIndex !== undefined && {
												valueIndex: row.valueIndex,
											}),
										}]
									} catch {
										invalidSources.add(row[EntityMetaKey.Source])
										malformedRowKeys.add(rowKey)
										return []
									}
								})
								if (entityFieldCardinalityIsMultiple(definition.cardinality)) {
									const rowKeysByValueIndex = new Map<string, (string | number)[]>()
									for (const row of materializedRows) {
										const valueIndexKey = stringify([
											row[EntityMetaKey.Source],
											row[EntityMetaKey.ParentSelectorKey],
											row.valueIndex,
										])
									const rowKey = stringify([
										row[EntityMetaKey.Source],
										row[EntityMetaKey.ParentSelectorKey],
										row.facetPathKey,
										row.valueKey,
										row.valueIndex,
									])
										const duplicateRowKeys = rowKeysByValueIndex.get(valueIndexKey)
										if (duplicateRowKeys !== undefined) {
											invalidSources.add(row[EntityMetaKey.Source])
											for (const duplicateRowKey of duplicateRowKeys)
												malformedRowKeys.add(duplicateRowKey)
											malformedRowKeys.add(rowKey)
										} else {
											rowKeysByValueIndex.set(valueIndexKey, [rowKey])
										}
									}
								}
								return {
									allRows,
									retainedRows: materializedRows.filter((row) => !invalidSources.has(row[EntityMetaKey.Source])),
									rows: materializedRows.filter((row) => (
										!invalidSources.has(row[EntityMetaKey.Source])
										&& sources.has(row[EntityMetaKey.Source])
									)),
									invalidSources: [...invalidSources],
									malformedRowKeys: [...malformedRowKeys],
								}
							},
							loadRows: (
								loadSubsetOptions,
								sources,
								forceRemote,
								providerContinuationTokenBySource
							) => loadFieldRows(
								requireContext(),
								entityDefinition.entityType,
								definition,
								loadSubsetOptions,
								forceRemote,
								sources,
								providerContinuationTokenBySource
							),
							waitForPersistence,
							events,
							collectionLoadFailures,
							setWriteRows: entityFieldCollectionUtils.setWriteRows,
							setReplaceRows: entityFieldCollectionUtils.setReplaceRows,
							setRefreshRows: entityFieldCollectionUtils.setRefreshRows,
							setWaitForPersistence: entityFieldCollectionUtils.setWaitForPersistence,
							setResolverSubsetLoading: entityFieldCollectionUtils.setResolverSubsetLoading,
							setResolverSubsetResolved: entityFieldCollectionUtils.setResolverSubsetResolved,
							setLocalMutationAuthority: entityFieldCollectionUtils.setLocalMutationAuthority,
							setContinuationForRows: entityFieldCollectionUtils.setContinuationForRows,
							notifyLocalMutationAuthorityChange:
								entityFieldCollectionUtils.notifyLocalMutationAuthorityChange,
							notifyContinuationChange: entityFieldCollectionUtils.notifyContinuationChange,
							notifyResolverSubsetLoadingChange:
								entityFieldCollectionUtils.notifyResolverSubsetLoadingChange,
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
							row.valueIndex,
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
				const hasLocalCountMutationAuthority = (loadSubsetOptions: LoadSubsetOptions) => {
					const subset = parseResolverSubset(loadSubsetOptions)

					return (
						subset.parentSelectorKeys.length > 0
						&& subset.sources?.includes(Source.Local_Internal) === true
						&& subset.parentSelectorKeys.every((selectorKey) => (
							entityFieldCountCollectionUtils.utils.hasLocalMutationAuthority(
								selectorKey,
								localMutationAuthorityKey({
									source: Source.Local_Internal,
									entityType: entityDefinition.entityType,
									selectorKey,
									fieldName: definition.name,
									fieldAddressKey,
									facetPathKey: stringify(facetPath),
									filterKey: stringify({}),
								})
							)
							|| entityFieldCollectionUtils.utils.hasLocalMutationAuthority(
								selectorKey,
								localMutationAuthorityKey({
									source: Source.Local_Internal,
									entityType: entityDefinition.entityType,
									selectorKey,
									fieldName: definition.name,
									fieldAddressKey,
									facetPathKey: stringify(facetPath),
								})
							)
						))
					)
				}
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
								const resolverParts = resolverPartsForEntitySelectors(
									schema,
									entityDefinition,
									parentSelectorsFromSubset(subset).map(({ selector }) => selector),
									resolverIndexes.resolverCountPartsByEntityTypeSelectorAndFieldName,
									entityDefinition.entityType,
									facetPath,
									definition.name
								)
								return [...new Set([
									...applicableResolverSources(
										schema,
										entityDefinition,
										subset,
										definition.defaultSources,
										resolverParts.map((resolverPart) => resolverPart.resolver),
										parentSelectorsFromSubset(subset).map(({ selector }) => selector)
									),
									...(subset.sources?.includes(Source.Local_Internal) === true ? [Source.Local_Internal] : []),
								])]
							},
							localAuthoritySourceRowKeys: (
								loadSubsetOptions,
								rows
							): Readonly<Record<string, readonly (string | number)[]>> => {
								const subset = parseResolverSubset(loadSubsetOptions)
								if (!hasLocalCountMutationAuthority(loadSubsetOptions))
									return {}

								return {
									[Source.Local_Internal]: rows.filter((row) => (
										row[EntityMetaKey.Source] === Source.Local_Internal
										&& subset.parentSelectorKeys.includes(row[EntityMetaKey.ParentSelectorKey])
										&& row.facetPathKey === stringify(facetPath)
										&& row.filterKey === stringify({})
									)).map((row) => stringify([
										row[EntityMetaKey.Source],
										row[EntityMetaKey.ParentSelectorKey],
										row.facetPathKey,
										row.filterKey,
									])),
								}
							},
							persistedRows: (loadSubsetOptions, rows, marker) => {
								const subset = parseResolverSubset(loadSubsetOptions)
								const resolverParts = resolverPartsForEntitySelectors(
									schema,
									entityDefinition,
									parentSelectorsFromSubset(subset).map(({ selector }) => selector),
									resolverIndexes.resolverCountPartsByEntityTypeSelectorAndFieldName,
									entityDefinition.entityType,
									facetPath,
									definition.name
								)
								const sources = new Set([
									...applicableResolverSources(
										schema,
										entityDefinition,
										subset,
										definition.defaultSources,
										resolverParts.map((resolverPart) => resolverPart.resolver),
										parentSelectorsFromSubset(subset).map(({ selector }) => selector)
									),
									...(subset.sources?.includes(Source.Local_Internal) === true ? [Source.Local_Internal] : []),
								])
								const allRows = productSubsetOwnedRows(
									marker,
									rows,
									[...new Set([
										...sources,
										...Object.keys(marker?.sourceRowKeys ?? {}),
									])],
									(row) => stringify([
										row[EntityMetaKey.Source],
										row[EntityMetaKey.ParentSelectorKey],
										row.facetPathKey,
										row.filterKey,
									])
								)
								const invalidSources = new Set<string>()
								const malformedRowKeys = new Set<string | number>()
								const materializedRows = allRows.flatMap((row) => {
									const rowKey = stringify([
										row[EntityMetaKey.Source],
										row[EntityMetaKey.ParentSelectorKey],
										row.facetPathKey,
										row.filterKey,
									])
									if (
										!(
											row[EntityMetaKey.Source] === Source.Local_Internal
											&& marker?.sourceRowKeys[Source.Local_Internal]?.includes(rowKey) === true
										)
										&& !resolverParts.some((resolverPart) => (
											String(resolverPart.source) === row[EntityMetaKey.Source]
											&& resolverPart.resolver.appliesTo(
												validateEntitySelector(
													schema,
													entityDefinition,
													row[EntityMetaKey.ParentSelector]
												).name,
												row[EntityMetaKey.ParentSelector]
											)
										))
									) {
										malformedRowKeys.add(rowKey)
										return []
									}

									try {
										const materializedRow = materializeResolverOutput({
										kind: ResolverOutputMaterialization.Count,
										schema,
										schemaIndex,
											entityDefinition,
											parentSelector: row[EntityMetaKey.ParentSelector],
											parentSelectorKey: row[EntityMetaKey.ParentSelectorKey],
											source: row[EntityMetaKey.Source],
											fieldDefinition: definition,
											value: row[EntityMetaKey.Value],
											filterKey: row.filterKey,
										})[0]
										if (
											materializedRow.facetPathKey !== row.facetPathKey
											|| materializedRow.fieldName !== row.fieldName
										)
											throw new Error(`${countCollectionId}: malformed persisted row`)

										return [materializedRow]
									} catch {
										invalidSources.add(row[EntityMetaKey.Source])
										malformedRowKeys.add(rowKey)
										return []
									}
								})
								return {
									allRows,
									retainedRows: materializedRows.filter((row) => !invalidSources.has(row[EntityMetaKey.Source])),
									rows: materializedRows.filter((row) => (
										!invalidSources.has(row[EntityMetaKey.Source])
										&& sources.has(row[EntityMetaKey.Source])
									)),
									invalidSources: [...invalidSources],
									malformedRowKeys: [...malformedRowKeys],
								}
							},
							loadRows: (
								loadSubsetOptions,
								sources,
								forceRemote
							) => loadCountRows(
								requireContext(),
								entityDefinition.entityType,
								definition,
								loadSubsetOptions,
								forceRemote,
								sources
							),
							waitForPersistence,
							events,
							collectionLoadFailures,
							setWriteRows: entityFieldCountCollectionUtils.setWriteRows,
							setReplaceRows: entityFieldCountCollectionUtils.setReplaceRows,
							setRefreshRows: entityFieldCountCollectionUtils.setRefreshRows,
							setWaitForPersistence: entityFieldCountCollectionUtils.setWaitForPersistence,
							setResolverSubsetLoading: entityFieldCountCollectionUtils.setResolverSubsetLoading,
							setResolverSubsetResolved: entityFieldCountCollectionUtils.setResolverSubsetResolved,
							setLocalMutationAuthority: entityFieldCountCollectionUtils.setLocalMutationAuthority,
							setContinuationForRows: entityFieldCountCollectionUtils.setContinuationForRows,
							notifyLocalMutationAuthorityChange:
								entityFieldCountCollectionUtils.notifyLocalMutationAuthorityChange,
							notifyContinuationChange: entityFieldCountCollectionUtils.notifyContinuationChange,
							notifyResolverSubsetLoadingChange:
								entityFieldCountCollectionUtils.notifyResolverSubsetLoadingChange,
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
		materializedReferenceEntityKeys,
		referenceFieldValueByAddress,
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
