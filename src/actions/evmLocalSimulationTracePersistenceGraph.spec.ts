import { QueryClient } from '@tanstack/query-core'
import type {
	PersistenceAdapter,
	PersistedCollectionMetadataMutation,
	PersistedTx,
} from '@tanstack/db-sqlite-persistence-core'
import { expect, it } from 'vitest'

import { client } from '$/client/$client.svelte.ts'
import {
	writeLocalBlockheadSessionLifecycle,
	writeLocalBlockheadSessionSimulation,
} from '$/collections/localMutations.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import localResolver from '$/resolvers/Local.ts'
import { Source } from '$/sources/Source.ts'
import { persistAnvilLocalSimulation } from '$/actions/evmLocalSimulationTracePersistence.ts'

type StoredRow = PersistedTx['mutations'][number]['value']
type StoredMetadata = PersistedCollectionMetadataMutation['value']

const hash = (digit: string) => `0x${digit.repeat(64)}` as const

const createPersistence = () => {
	const rowsByCollectionId = new Map<
		string,
		Map<
			string | number,
			StoredRow
		>
	>()
	const metadataByCollectionId = new Map<
		string,
		Map<
			string,
			StoredMetadata
		>
	>()
	const persistence: { adapter: PersistenceAdapter } = {
		adapter: {
			loadSubset: async (collectionId) => (
				[...(rowsByCollectionId.get(collectionId) ?? new Map())]
					.map(([key, value]) => ({
						key,
						value,
					}))
			),
			applyCommittedTx: async (collectionId, transaction) => {
				const rows = rowsByCollectionId.get(collectionId) ?? new Map<
					string | number,
					StoredRow
				>()
				for (const mutation of transaction.mutations) {
					if (mutation.type === 'delete')
						rows.delete(mutation.key)
					else
						rows.set(mutation.key, mutation.value)
				}
				rowsByCollectionId.set(collectionId, rows)
				const metadata = metadataByCollectionId.get(collectionId) ?? new Map<
					string,
					StoredMetadata
				>()
				for (const mutation of transaction.collectionMetadataMutations ?? []) {
					if (mutation.type === 'delete')
						metadata.delete(mutation.key)
					else
						metadata.set(mutation.key, mutation.value)
				}
				metadataByCollectionId.set(collectionId, metadata)
			},
			loadCollectionMetadata: async (collectionId) => (
				[...(metadataByCollectionId.get(collectionId) ?? new Map())]
					.map(([key, value]) => ({
						key,
						value,
					}))
			),
			ensureIndex: async () => {},
		},
	}
	return persistence
}

const createContext = (persistence: { adapter: PersistenceAdapter }) => client({
	schema,
	sourceProviders: [
		{
			provider: 'local-test',
			label: 'Local test',
			sources: {
				[Source.Local_Internal]: {
					label: 'Local',
				},
			},
			bindings: {},
		},
	],
})({
	resolvers: [localResolver],
	sourceIndex: {
		enabledBindingIds: new Set(),
		enabledSources: new Set([Source.Local_Internal]),
		resolverPublicEnvBySource: new Map([
			[
				Source.Local_Internal,
				{},
			],
		]),
	},
})({
	queryClient: new QueryClient(),
	persistence,
	schemaVersion: 1,
})

it('persists Anvil source and network provenance that a fresh client selects', async () => {
	const persistence = createPersistence()
	const writer = createContext(persistence)
	const session = {
		id: 'session-anvil-provenance',
	}
	const simulation = {
		id: 'simulation-anvil-provenance',
		status: 'succeeded',
		createdAt: 2,
		completedAt: 3,
		paramsHash: hash('1'),
		forkBlockNumber: 42n,
	}
	const legacySimulation = {
		id: 'simulation-legacy',
		status: 'succeeded',
		createdAt: 4,
		completedAt: 5,
		paramsHash: hash('2'),
	}

	let reader: ReturnType<typeof createContext> | undefined
	try {
		await writeLocalBlockheadSessionLifecycle(
			writer,
			{
				scope: '$$blockheadSessions',
			},
			{
				...session,
				name: 'Anvil provenance',
				status: BlockheadSessionStatus.Draft,
				createdAt: 1,
				updatedAt: 1,
			}
		)
		await persistAnvilLocalSimulation(writer, {
			session,
			simulation,
			acquisition: {
				kind: 'acquired',
				trace: {
					source: {
						kind: 'anvil-local-call-trace',
						version: 'anvil/v1.0.0',
					},
					chainId: 31_337,
					stateBlockNumber: 42n,
					requestInputDataHash: simulation.paramsHash,
					root: {
						callType: 'CALL',
						outcome: {
							kind: 'returned',
						},
						calls: [],
					},
				},
				operations: {
					source: {
						kind: 'anvil-local-call-trace',
						version: 'anvil/v1.0.0',
					},
					chainId: 31_337,
					stateBlockNumber: 42n,
					requestInputDataHash: simulation.paramsHash,
					operations: [
						{
							callPath: '0',
							depth: 0,
							callIndex: 0,
							callType: 'CALL',
							outcome: {
								kind: 'returned',
							},
						},
					],
				},
			},
		})
		await writeLocalBlockheadSessionSimulation(
			writer,
			session,
			legacySimulation
		)

		reader = createContext(persistence)
		const persisted = await reader.select(
			EntityType.BlockheadSessionSimulation,
			{
				id: simulation.id,
			},
			{
				sources: [Source.Local_Internal],
				fields: {
					id: true,
					executionSourceKind: true,
					executionSourceVersion: true,
					$executionNetwork: true,
				},
			}
		)
		expect(persisted.fields).toMatchObject({
			id: simulation.id,
			executionSourceKind: 'anvil-local-call-trace',
			executionSourceVersion: 'anvil/v1.0.0',
		})
		expect(persisted.$executionNetwork).toMatchObject({
			[EntityMetaKey.Selector]: {
				caip2: {
					namespace: 'eip155',
					reference: '31337',
				},
			},
		})

		const legacy = await reader.select(
			EntityType.BlockheadSessionSimulation,
			{
				id: legacySimulation.id,
			},
			{
				sources: [Source.Local_Internal],
				fields: {
					executionSourceKind: true,
					executionSourceVersion: true,
					$executionNetwork: true,
				},
			}
		)
		expect(legacy.fields).toEqual({})
	} finally {
		reader?.destroy()
		writer.destroy()
	}
})
