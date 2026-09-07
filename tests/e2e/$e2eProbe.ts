import type {
	ClientContext,
	ClientEvent,
	EntityCollectionItem,
	EntityFieldCollectionItem,
} from '$/client/$client.svelte.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	actionAuthorityRequestEnvelopeHash,
	authorityRequestEnvelope,
} from '$/actions/execution.ts'
import {
	traceE2ECollections,
	type E2ECollectionTrace,
} from './$e2eTrace.ts'
import type { Schema } from '$/schema/$schema.ts'
import type {
	LoadSubsetOptions,
} from '@tanstack/db'
import type {
	PersistedCollectionPersistence,
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
	g15SimulationGraph: () => Promise<G15SimulationGraph>
	authorityDispatchGraph: () => Promise<AuthorityDispatchGraph>
}

type G15Json = null | boolean | number | string | readonly G15Json[] | { readonly [key: string]: G15Json }

type G15EntityRow = {
	selector: G15Json
	selectorKey: string
	source: string
}

type G15FieldRow = {
	entityType: EntityType
	fieldName: string
	parentSelector: G15Json
	value: G15Json
}

export type G15SimulationGraph = {
	simulations: readonly G15EntityRow[]
	calls: readonly G15EntityRow[]
	logs: readonly G15EntityRow[]
	fields: readonly G15FieldRow[]
}

export type AuthorityDispatchGraph = {
	authorityRequests: readonly G15EntityRow[]
	walletRequests: readonly G15EntityRow[]
	timestamps: readonly G15EntityRow[]
	occurrences: readonly G15EntityRow[]
	fields: readonly G15FieldRow[]
	envelopeHashBindings: readonly {
		parentSelector: G15Json
		matches: boolean
	}[]
}

const authorityRequestGraphSelection = {
	sources: [Source.Local_Internal],
	fields: {
		$$blockheadAuthorityRequests: {
			sources: [Source.Local_Internal],
			fields: {
				actionRevisionBindings: true,
				envelope: true,
				envelopeHash: true,
				presentedAt: true,
				decision: true,
				$walletConnection: true,
				$account: true,
				$$dispatchOccurrences: true,
			},
		},
	},
} as const

const walletRequestGraphSelection = {
	sources: [Source.Local_Internal],
	fields: {
		$$blockheadWalletRequests: {
			sources: [Source.Local_Internal],
			fields: {
				requestKind: true,
				requestMethod: true,
				requestPayloadHash: true,
				requestedAt: true,
				submittedAt: true,
				$walletConnection: true,
				$account: true,
				$$timestamps: {
					sources: [Source.Local_Internal],
					fields: {
						$walletRequest: true,
						timestampMs: true,
						source: true,
						status: true,
						signatureHash: true,
						error: true,
					},
				},
			},
		},
	},
} as const

const dispatchOccurrenceGraphSelection = {
	sources: [Source.Local_Internal],
	fields: {
		$$blockheadDispatchOccurrences: {
			sources: [Source.Local_Internal],
			fields: {
				address: true,
				startedAt: true,
				evidence: true,
				$authorityRequest: true,
				$walletConnection: true,
			},
		},
	},
} as const

const g15SimulationSelector = {
	id: 'simulation-g15-durable',
} as const

const g15SimulationGraphSelection = {
	sources: [Source.Local_Internal],
	fields: {
		$session: true,
		$$calls: {
			sources: [Source.Local_Internal],
			fields: {
				$simulation: true,
				parentCallPath: true,
				inputDataHash: true,
				outputDataHash: true,
				error: true,
				reverted: true,
				value: true,
				gasUsed: true,
			},
		},
		$$logs: {
			sources: [Source.Local_Internal],
			fields: {
				$simulation: true,
				callPath: true,
				topic0: true,
				topics: true,
				dataHash: true,
				removed: true,
			},
		},
	},
} as const

const compareG15Strings = (left: string, right: string) => {
	if (left === right) return 0
	return left < right ? -1 : 1
}

const compareG15Values = (left: G15Json, right: G15Json) => (
	compareG15Strings(JSON.stringify(left), JSON.stringify(right))
)

const compareG15Rows = <_Row extends object>(left: _Row, right: _Row) => (
	compareG15Strings(JSON.stringify(left), JSON.stringify(right))
)

// oxlint-disable typescript/no-restricted-types, no-runtime-shape-guards/guards -- This narrow boundary serializes canonical typed collection values across Playwright; Set and bigint retain explicit representations, while unsupported values fail loudly.
const g15Json = (value: unknown): G15Json => {
	if (value === undefined || typeof value === 'function')
		throw new Error('G15 Playwright graph contains an unsupported value')
	if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string')
		return value
	if (typeof value === 'bigint') return `${value}n`
	if (value instanceof Set) return {
		$set: [...value].map(g15Json).sort(compareG15Values),
	}
	if (value instanceof Array) return value.map(g15Json)
	if (typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.sort(([left], [right]) => compareG15Strings(left, right))
				.map(([key, nested]) => [key, g15Json(nested)])
		)
	throw new Error('G15 Playwright graph contains an unsupported value')
}
// oxlint-enable typescript/no-restricted-types, no-runtime-shape-guards/guards

const g15EntityRows = (
	rows: readonly EntityCollectionItem[]
): G15EntityRow[] => (
	rows
		.map((row) => ({
			selector: g15Json(row[EntityMetaKey.Selector]),
			selectorKey: row[EntityMetaKey.SelectorKey],
			source: row[EntityMetaKey.Source],
		}))
		.sort(compareG15Rows)
)

const g15FieldRows = (
	entityType: EntityType,
	fieldName: string,
	rows: readonly EntityFieldCollectionItem[]
): G15FieldRow[] => (
	rows
		.map((row) => ({
			entityType,
			fieldName,
			parentSelector: g15Json(row[EntityMetaKey.ParentSelector]),
			value: g15Json(row[EntityMetaKey.Value]),
		}))
		.sort(compareG15Rows)
)

declare global {
	interface Window {
		__blockheadClientProbeEnabled?: boolean
		__blockheadClientProbe?: ClientProbe
		__blockheadPersistenceTrace?: PersistenceTraceEvent[]
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
	const _Schema extends Schema,
	const _Source extends string
>(
	appClient: ClientContext<_Schema, _Source>
) => {
	if (!clientProbeRequested()) return
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
			g15SimulationGraph: async () => {
				await appClient.select(
					EntityType.BlockheadSessionSimulation,
					g15SimulationSelector,
					g15SimulationGraphSelection
				)
				return {
					simulations: g15EntityRows(appClient.entityCollections[EntityType.BlockheadSessionSimulation].toArray),
					calls: g15EntityRows(appClient.entityCollections[EntityType.BlockheadSessionSimulationCall].toArray),
					logs: g15EntityRows(appClient.entityCollections[EntityType.BlockheadSessionSimulationLog].toArray),
					fields: [
						...g15FieldRows(EntityType.BlockheadSessionSimulation, '$session', appClient.entityFieldCollections[EntityType.BlockheadSessionSimulation][entityFieldAddressKey(EntityType.BlockheadSessionSimulation, [], '$session')].toArray),
						...g15FieldRows(EntityType.BlockheadSessionSimulation, '$$calls', appClient.entityFieldCollections[EntityType.BlockheadSessionSimulation][entityFieldAddressKey(EntityType.BlockheadSessionSimulation, [], '$$calls')].toArray),
						...g15FieldRows(EntityType.BlockheadSessionSimulation, '$$logs', appClient.entityFieldCollections[EntityType.BlockheadSessionSimulation][entityFieldAddressKey(EntityType.BlockheadSessionSimulation, [], '$$logs')].toArray),
						...g15FieldRows(EntityType.BlockheadSessionSimulationCall, '$simulation', appClient.entityFieldCollections[EntityType.BlockheadSessionSimulationCall][entityFieldAddressKey(EntityType.BlockheadSessionSimulationCall, [], '$simulation')].toArray),
						...['parentCallPath', 'inputDataHash', 'outputDataHash', 'error', 'reverted', 'value', 'gasUsed'].flatMap((fieldName) => g15FieldRows(EntityType.BlockheadSessionSimulationCall, fieldName, appClient.entityFieldCollections[EntityType.BlockheadSessionSimulationCall][entityFieldAddressKey(EntityType.BlockheadSessionSimulationCall, [], fieldName)].toArray)),
						...g15FieldRows(EntityType.BlockheadSessionSimulationLog, '$simulation', appClient.entityFieldCollections[EntityType.BlockheadSessionSimulationLog][entityFieldAddressKey(EntityType.BlockheadSessionSimulationLog, [], '$simulation')].toArray),
						...['callPath', 'topic0', 'topics', 'dataHash', 'removed'].flatMap((fieldName) => g15FieldRows(EntityType.BlockheadSessionSimulationLog, fieldName, appClient.entityFieldCollections[EntityType.BlockheadSessionSimulationLog][entityFieldAddressKey(EntityType.BlockheadSessionSimulationLog, [], fieldName)].toArray)),
					],
				}
			},
			authorityDispatchGraph: async () => {
				await Promise.all([
					appClient.select(EntityType._Global, { scope: '$$blockheadAuthorityRequests' }, authorityRequestGraphSelection),
					appClient.select(EntityType._Global, { scope: '$$blockheadWalletRequests' }, walletRequestGraphSelection),
					appClient.select(EntityType._Global, { scope: '$$blockheadDispatchOccurrences' }, dispatchOccurrenceGraphSelection),
				])
				const authorityEnvelopeRows = appClient.entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(EntityType.BlockheadActionAuthorityRequest, [], 'envelope')].toArray
				const authorityEnvelopeHashRows = appClient.entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(EntityType.BlockheadActionAuthorityRequest, [], 'envelopeHash')].toArray
				return {
					authorityRequests: g15EntityRows(appClient.entityCollections[EntityType.BlockheadActionAuthorityRequest].toArray),
					walletRequests: g15EntityRows(appClient.entityCollections[EntityType.BlockheadWalletRequest].toArray),
					timestamps: g15EntityRows(appClient.entityCollections[EntityType.BlockheadWalletRequest_Timestamp].toArray),
					occurrences: g15EntityRows(appClient.entityCollections[EntityType.BlockheadActionDispatchOccurrence].toArray),
					fields: [
						...['actionRevisionBindings', 'envelope', 'envelopeHash', 'presentedAt', 'decision', '$walletConnection', '$account', '$$dispatchOccurrences'].flatMap((fieldName) => g15FieldRows(EntityType.BlockheadActionAuthorityRequest, fieldName, appClient.entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][entityFieldAddressKey(EntityType.BlockheadActionAuthorityRequest, [], fieldName)].toArray)),
						...['requestKind', 'requestMethod', 'requestPayloadHash', 'requestedAt', 'submittedAt', '$walletConnection', '$account', '$$timestamps'].flatMap((fieldName) => g15FieldRows(EntityType.BlockheadWalletRequest, fieldName, appClient.entityFieldCollections[EntityType.BlockheadWalletRequest][entityFieldAddressKey(EntityType.BlockheadWalletRequest, [], fieldName)].toArray)),
						...['$walletRequest', 'timestampMs', 'source', 'status', 'signatureHash', 'error'].flatMap((fieldName) => g15FieldRows(EntityType.BlockheadWalletRequest_Timestamp, fieldName, appClient.entityFieldCollections[EntityType.BlockheadWalletRequest_Timestamp][entityFieldAddressKey(EntityType.BlockheadWalletRequest_Timestamp, [], fieldName)].toArray)),
						...['address', 'startedAt', 'evidence', '$authorityRequest', '$walletConnection'].flatMap((fieldName) => g15FieldRows(EntityType.BlockheadActionDispatchOccurrence, fieldName, appClient.entityFieldCollections[EntityType.BlockheadActionDispatchOccurrence][entityFieldAddressKey(EntityType.BlockheadActionDispatchOccurrence, [], fieldName)].toArray)),
					],
					envelopeHashBindings: authorityEnvelopeRows.map((envelopeRow) => ({
						parentSelector: g15Json(envelopeRow[EntityMetaKey.ParentSelector]),
						matches: authorityEnvelopeHashRows.some((hashRow) => (
							compareG15Values(g15Json(hashRow[EntityMetaKey.ParentSelector]), g15Json(envelopeRow[EntityMetaKey.ParentSelector])) === 0
							&& hashRow[EntityMetaKey.Value] === actionAuthorityRequestEnvelopeHash(authorityRequestEnvelope.assert(envelopeRow[EntityMetaKey.Value]))
						)),
					})).sort(compareG15Rows),
				}
			},
		},
		configurable: true,
	})
}
