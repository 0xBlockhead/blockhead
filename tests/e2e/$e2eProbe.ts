import type {
	ClientContext,
	ClientEvent,
} from '$/client/$client.svelte.ts'
import {
	traceE2ECollections,
	type E2ECollectionTrace,
} from './$e2eTrace.ts'
import {
	authorityDispatchGraph,
	type AuthorityDispatchGraph,
} from './authorityDispatchGraph.ts'
import { schema } from '$/schema/index.ts'
import type {
	LoadSubsetOptions,
} from '@tanstack/db'
import type {
	PersistedCollectionPersistence,
	PersistedScannedRow,
	PersistedTx,
	PersistenceAdapter,
} from '@tanstack/db-sqlite-persistence-core'


const e2eProbeEnabled = (
	import.meta.env.DEV
	|| import.meta.env.VITE_BLOCKHEAD_E2E_PROBE === '1'
)

export type PersistenceTraceEvent = {
	type: string
	collectionId: string
	mutationCount?: number
	rowMetadataMutationCount?: number
	collectionMetadataMutationCount?: number
	subsetRowCount?: number
	collectionMetadataCount?: number
	error?: string
}

export type ClientProbe = {
	events: {
		collectionLoads: ClientEvent[]
	}
	collectionSizes: () => {
		entities: Record<string, number>
		fields: Record<string, Record<string, number>>
		counts: Record<string, Record<string, number>>
	}
	queryStates: () => {
		key: string[]
		status: string
		fetchStatus: string
		error?: string
	}[]
	traceCollections: () => E2ECollectionTrace
	authorityDispatchGraph: () => Promise<AuthorityDispatchGraph>
}

declare global {
	interface Window {
		__blockheadClientProbeEnabled?: boolean
		__blockheadClientProbe?: ClientProbe
		__blockheadPersistenceTrace?: PersistenceTraceEvent[]
		__blockheadPersistedRowScanner?: (
			collectionId: string,
			schemaVersion: number
		) => Promise<PersistedScannedRow[]>
		__blockheadPersistedCollectionSchemaVersionOverride?: number
	}
}

export const e2eSchemaVersion = (
	defaultSchemaVersion: number
) => (
	typeof window !== 'undefined' ?
		window.__blockheadPersistedCollectionSchemaVersionOverride ?? defaultSchemaVersion
	:
		defaultSchemaVersion
)

const clientProbeRequested = () => (
	e2eProbeEnabled
	&& typeof window !== 'undefined'
	&& window.__blockheadClientProbeEnabled === true
)

const pushPersistenceTrace = (event: PersistenceTraceEvent) => {
	if (!clientProbeRequested()) return
	window.__blockheadPersistenceTrace ??= []
	window.__blockheadPersistenceTrace.push(event)
}

export const createE2EClientInstrumentation = <
	const _Persistence extends PersistedCollectionPersistence
>(
	basePersistence: _Persistence
) => {
	const scanPersistedRows = async (
		collectionId: string,
		schemaVersion: number
	): Promise<PersistedScannedRow[]> => {
		const collectionPersistence = basePersistence.resolvePersistenceForCollection?.({
			collectionId,
			mode: 'sync-present',
			schemaVersion,
		}) ?? basePersistence
		return await collectionPersistence.adapter.scanRows?.(collectionId) ?? []
	}
	if (clientProbeRequested())
		window.__blockheadPersistedRowScanner = scanPersistedRows

	const traceAdapter = (collectionPersistence: PersistedCollectionPersistence) => {
		const scanRows = collectionPersistence.adapter.scanRows?.bind(collectionPersistence.adapter)
		const markIndexRemoved = collectionPersistence.adapter.markIndexRemoved?.bind(collectionPersistence.adapter)
		const getStreamPosition = collectionPersistence.adapter.getStreamPosition?.bind(collectionPersistence.adapter)
		return {
			...collectionPersistence,
			adapter: Object.assign(
				Object.create(collectionPersistence.adapter),
				{
					applyCommittedTx: async (collectionId: string, tx: PersistedTx) => {
						pushPersistenceTrace({
							type: 'applyCommittedTx:start',
							collectionId,
							mutationCount: tx.mutations.length,
							rowMetadataMutationCount: tx.rowMetadataMutations?.length ?? 0,
							collectionMetadataMutationCount: tx.collectionMetadataMutations?.length ?? 0,
						})
						try {
							await collectionPersistence.adapter.applyCommittedTx(collectionId, tx)
							pushPersistenceTrace({
								type: 'applyCommittedTx:done',
								collectionId,
								mutationCount: tx.mutations.length,
								rowMetadataMutationCount: tx.rowMetadataMutations?.length ?? 0,
								collectionMetadataMutationCount: tx.collectionMetadataMutations?.length ?? 0,
							})
						} catch (error) {
							pushPersistenceTrace({
								type: 'applyCommittedTx:error',
								collectionId,
								error: error instanceof Error ? error.message : String(error),
							})
							throw error
						}
					},
					loadSubset: async (
						collectionId: string,
						options: LoadSubsetOptions,
						context?: Parameters<NonNullable<PersistenceAdapter['loadSubset']>>[2]
					) => {
						const rows = await collectionPersistence.adapter.loadSubset(collectionId, options, context)
						pushPersistenceTrace({
							type: 'loadSubset',
							collectionId,
							subsetRowCount: rows.length,
						})
						return rows
					},
					loadCollectionMetadata: async (collectionId: string) => {
						const collectionMetadata = (
							await collectionPersistence.adapter.loadCollectionMetadata?.(collectionId) ?? []
						)
						pushPersistenceTrace({
							type: 'loadCollectionMetadata',
							collectionId,
							collectionMetadataCount: collectionMetadata.length,
						})
						return collectionMetadata
					},
					scanRows: scanRows == null ?
						undefined
					:
						(
							collectionId: string,
							options?: Parameters<NonNullable<PersistenceAdapter['scanRows']>>[1]
						) => scanRows(collectionId, options),
					ensureIndex: (
						collectionId: string,
						signature: string,
						spec: Parameters<PersistenceAdapter['ensureIndex']>[2]
					) => (
						collectionPersistence.adapter.ensureIndex(
							collectionId,
							signature,
							spec
						)
					),
					markIndexRemoved: markIndexRemoved == null ?
						undefined
					:
						(
							collectionId: string,
							signature: string
						) => markIndexRemoved(collectionId, signature),
					getStreamPosition: getStreamPosition == null ?
						undefined
					:
						(collectionId: string) => getStreamPosition(collectionId),
				}
			),
		}
	}
	const resolvePersistenceForCollection = basePersistence.resolvePersistenceForCollection
	const resolvePersistenceForMode = basePersistence.resolvePersistenceForMode
	return {
		persistence: (
			e2eProbeEnabled ?
				{
					...traceAdapter(basePersistence),
					resolvePersistenceForCollection: resolvePersistenceForCollection == null ?
						undefined
					:
						(options: Parameters<NonNullable<typeof resolvePersistenceForCollection>>[0]) => traceAdapter(resolvePersistenceForCollection(options)),
					resolvePersistenceForMode: resolvePersistenceForMode == null ?
						undefined
					:
						(mode: Parameters<NonNullable<typeof resolvePersistenceForMode>>[0]) => traceAdapter(resolvePersistenceForMode(mode)),
				}
			:
				basePersistence
		),
	}
}

export const installAppClientProbe = <
	const _Source extends string
>(
	appClient: ClientContext<typeof schema, _Source>
) => {
	if (!clientProbeRequested()) return
	const scanPersistedRows = window.__blockheadPersistedRowScanner
	if (scanPersistedRows === undefined)
		throw new Error('E2E persistence scanner was unavailable before the client probe installed.')

	Object.defineProperty(window, '__blockheadClientProbe', {
		value: {
			events: {
				collectionLoads: appClient.events,
			},
			collectionSizes: () => ({
				entities: Object.fromEntries(
					Object.entries(appClient.entityCollections).map(([entityType, collection]) => [
						entityType,
						collection.size,
					])
				),
				fields: Object.fromEntries(
					Object.entries(appClient.entityFieldCollections).map(([entityType, collections]) => [
						entityType,
						Object.fromEntries(
							Object.entries(collections).map(([fieldName, collection]) => [
								fieldName,
								collection.size,
							])
						),
					])
				),
				counts: Object.fromEntries(
					Object.entries(appClient.entityFieldCountCollections).map(([entityType, collections]) => [
						entityType,
						Object.fromEntries(
							Object.entries(collections).map(([fieldName, collection]) => [
								fieldName,
								collection?.size ?? 0,
							])
						),
					])
				),
			}),
			queryStates: () => (
				appClient.queryClient
					.getQueryCache()
					.getAll()
					.map((query) => ({
						key: query.queryKey.map((segment) => String(segment)),
						status: query.state.status,
						fetchStatus: query.state.fetchStatus,
						error: query.state.error == null ? undefined : String(query.state.error),
					}))
			),
			traceCollections: () => traceE2ECollections(appClient),
			authorityDispatchGraph: () => authorityDispatchGraph(appClient, scanPersistedRows),
		},
		configurable: true,
	})
}
