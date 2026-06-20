import type {
	ClientContext,
	ClientEvent,
} from '$/client/$client.svelte.ts'
import type { Schema } from '$/schema/$schema.ts'
import type {
	LoadSubsetOptions,
} from '@tanstack/db'
import type {
	PersistedCollectionPersistence,
	PersistedTx,
	PersistenceAdapter,
} from '@tanstack/db-sqlite-persistence-core'


const e2eProbeEnabled = import.meta.env.VITE_BLOCKHEAD_E2E_PROBE === '1'

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
		collectionSync: []
		collectionLoads: ClientEvent[]
	}
	collectionSizes: () => object
	queryStates: () => object[]
}

declare global {
	interface Window {
		__blockheadClientProbeEnabled?: boolean
		__blockheadClientProbe?: ClientProbe
		__blockheadPersistenceTrace?: PersistenceTraceEvent[]
	}
}

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

export const createPersistenceTrace = <
	const _Persistence extends PersistedCollectionPersistence
>(
	basePersistence: _Persistence
) => {
	const pendingPersistenceByCollection = new Map<string, Set<Promise<void>>>()
	const waitForPersistence = async (collectionId: string) => {
		await new Promise((resolve) => setTimeout(resolve, 50))
		while ((pendingPersistenceByCollection.get(collectionId)?.size ?? 0) > 0)
			await Promise.all(pendingPersistenceByCollection.get(collectionId) ?? [])
	}
	const traceAdapter = (collectionPersistence: PersistedCollectionPersistence) => ({
		...collectionPersistence,
		adapter: Object.assign(
			Object.create(collectionPersistence.adapter),
			{
				applyCommittedTx: async (collectionId: string, tx: PersistedTx) => {
					const persistencePromise = (async () => {
						pushPersistenceTrace({
							type: 'applyCommittedTx:start',
							collectionId,
							mutationCount: tx.mutations.length,
							rowMetadataMutationCount: tx.rowMetadataMutations?.length ?? 0,
							collectionMetadataMutationCount: tx.collectionMetadataMutations?.length ?? 0,
						})
						await collectionPersistence.adapter.applyCommittedTx(collectionId, tx)
						pushPersistenceTrace({
							type: 'applyCommittedTx:done',
							collectionId,
							mutationCount: tx.mutations.length,
							rowMetadataMutationCount: tx.rowMetadataMutations?.length ?? 0,
							collectionMetadataMutationCount: tx.collectionMetadataMutations?.length ?? 0,
						})
					})()
					pendingPersistenceByCollection.set(
						collectionId,
						(pendingPersistenceByCollection.get(collectionId) ?? new Set()).add(persistencePromise)
					)
					try {
						await persistencePromise
					} catch (error) {
						pushPersistenceTrace({
							type: 'applyCommittedTx:error',
							collectionId,
							error: error instanceof Error ? error.message : String(error),
						})
						throw error
					} finally {
						pendingPersistenceByCollection.get(collectionId)?.delete(persistencePromise)
					}
				},
				loadSubset: async (
					collectionId: string,
					options: LoadSubsetOptions,
					context?: Parameters<PersistenceAdapter['loadSubset']>[2]
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
					const collectionMetadata = await collectionPersistence.adapter.loadCollectionMetadata?.(collectionId) ?? []
					pushPersistenceTrace({
						type: 'loadCollectionMetadata',
						collectionId,
						collectionMetadataCount: collectionMetadata.length,
					})
					return collectionMetadata
				},
			}
		),
	})
	return {
		persistence: (
			e2eProbeEnabled ?
				{
					...traceAdapter(basePersistence),
					resolvePersistenceForCollection: basePersistence.resolvePersistenceForCollection == null ?
						undefined
					:
						(options) => traceAdapter(basePersistence.resolvePersistenceForCollection(options)),
					resolvePersistenceForMode: basePersistence.resolvePersistenceForMode == null ?
						undefined
					:
						(mode) => traceAdapter(basePersistence.resolvePersistenceForMode(mode)),
				}
			:
				basePersistence
		),
		waitForPersistence,
	}
}

export const installAppClientProbe = <
	const _Schema extends Schema,
	const _Source extends string
>(
	appClient: ClientContext<_Schema, _Source>
) => {
	if (!clientProbeRequested()) return
	Object.defineProperty(window, '__blockheadClientProbe', {
		value: {
			events: {
				collectionSync: [],
				collectionLoads: appClient.events,
			},
			collectionSizes: appClient.debug.collectionSizes,
			queryStates: appClient.debug.queryStates,
		},
		configurable: true,
	})
}
