import { QueryClient } from '@tanstack/query-core'
import type {
	PersistenceAdapter,
	PersistedCollectionMetadataMutation,
	PersistedTx,
} from '@tanstack/db-sqlite-persistence-core'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import { expect, it } from 'vitest'

import { client } from '$/client/$client.svelte.ts'
import { writeLocalBlockheadSessionLifecycle } from '$/collections/localMutations.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSessionStatus.ts'
import { schema } from '$/schema/index.ts'
import localResolver from '$/resolvers/Local.ts'
import { Source } from '$/sources/Source.ts'
import {
	createWebEvmLocalSimulationConsumer,
	type WebEvmLocalSimulationConsumer,
	type WebEvmSimulationSeed,
} from '$/state/sessions/webevmLocalSimulationConsumer.ts'
import type { WebEvmLocalNodeConfig } from '$/state/sessions/webevmLocalSimulationNode.ts'

const sender = '0x19e7e376e7c213b7e7e7e46cc70a5dd086daff2a' as const
const logTarget = '0x0000000000000000000000000000000000000021' as const
const revertTarget = '0x0000000000000000000000000000000000000010' as const
const topic = `0x${'22'.repeat(32)}` as const
const rawTransaction = '0x02f88c827a69800101830186a094000000000000000000000000000000000000002180a77f222222222222222222222222222222222222222222222222222222222222222260006000a100c001a0071cb145869539908c6b2d6478d7824e31735448cddcb060412abea4f57c6ad4a0431611c57d2d717060579bd1d64cb6adc0b82cde7642ab4f3bdf9753ef30bdd8' as const
const transactionInput = `0x7f${'22'.repeat(32)}60006000a100` as const

const config = {
	chainId: 31337,
	stateMode: 'trie',
	senderMode: 'recover',
	miningConfig: {
		type: 'manual',
	},
	baseFeePerGas: 1n,
	gasPrice: 1n,
	blockGasLimit: 30_000_000n,
	initialState: {
		[sender]: {
			balance: 10n ** 18n,
		},
		[logTarget]: {
			code: `0x7f${topic.slice(2)}60006000a100`,
		},
		[revertTarget]: {
			code: '0x60006000fd',
		},
	},
	blockEnv: {
		coinbase: '0x0000000000000000000000000000000000000004',
		baseFeePerGas: 1n,
		number: 7n,
		timestamp: 1_700_000_000n,
		gasLimit: 30_000_000n,
		prevRandao: `0x${'11'.repeat(32)}`,
	},
} as const satisfies WebEvmLocalNodeConfig

type StoredRow = PersistedTx['mutations'][number]['value']
type StoredMetadata = PersistedCollectionMetadataMutation['value']

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

it('persists a WebEVM receipt graph that a fresh client selects through relations', async () => {
	const persistence = createPersistence()
	const writer = createContext(persistence)
	await writeLocalBlockheadSessionLifecycle(
		writer,
		{ scope: '$$blockheadSessions' },
		{
			id: 'session-webevm-graph',
			name: 'WebEVM graph',
			status: BlockheadSessionStatus.Draft,
			createdAt: 1,
			updatedAt: 1,
		}
	)
	const session = { id: 'session-webevm-graph' } as const
	const consumer: WebEvmLocalSimulationConsumer = await createWebEvmLocalSimulationConsumer(config)
	const simulation: WebEvmSimulationSeed = {
		id: 'simulation-webevm-graph',
		createdAt: 2,
		completedAt: 3,
	}

	let reader: ReturnType<typeof createContext> | undefined
	try {
		const result = await consumer.sendRawTransaction(writer, {
			session,
			simulation,
			request: {
				from: sender,
				to: logTarget,
				value: 0n,
				input: transactionInput,
			},
			rawTransaction,
		})
		expect(result.receipt.status).toBe('0x1')
		expect(result.receipt.logs).toHaveLength(1)
		await writer.entityCollections[EntityType.BlockheadSessionSimulation].utils.waitForPersistence()

		reader = createContext(persistence)
		const sessionSelection = reader.select(EntityType.BlockheadSession, session, {
			sources: [Source.Local_Internal],
			fields: {
				id: true,
				simulationCount: true,
			},
		})
		const sessionRow = await sessionSelection
		expect(sessionRow.fields).toMatchObject({
			id: session.id,
			simulationCount: 1,
		})

		const simulations = await sessionSelection.$$simulations({
			sources: [Source.Local_Internal],
		})({
			fields: {
				id: true,
				status: true,
				gasUsed: true,
				paramsHash: true,
				$session: true,
				$$calls: {
					fields: {
						simulationId: true,
						callPath: true,
						fromAddress: true,
						toAddress: true,
						inputDataHash: true,
						reverted: true,
						gasUsed: true,
						$simulation: true,
					},
				},
				$$logs: {
					fields: {
						simulationId: true,
						logIndex: true,
						address: true,
						topic0: true,
						topics: true,
						dataHash: true,
						$simulation: true,
					},
				},
			},
		})
		expect(simulations.values).toHaveLength(1)
		const persistedSimulation = simulations.values[0]
		if (persistedSimulation === undefined)
			throw new Error('WebEVM simulation relation was not selected')
		expect(persistedSimulation).toMatchObject({
			id: simulation.id,
			status: 'succeeded',
			gasUsed: Hex.toBigInt(result.receipt.gasUsed),
			paramsHash: result.paramsHash,
		})
		expect(persistedSimulation.$session).toMatchObject({
			[EntityMetaKey.Selector]: session,
		})
		expect(persistedSimulation.$$calls.values).toHaveLength(1)
		expect(persistedSimulation.$$calls.values[0]).toMatchObject({
			callPath: 'root',
			fromAddress: sender,
			toAddress: logTarget,
			inputDataHash: Hash.sha256(transactionInput),
			reverted: false,
			$simulation: {
				[EntityMetaKey.Selector]: {
					id: simulation.id,
				},
			},
		})
		expect(persistedSimulation.$$logs.values).toHaveLength(1)
		const persistedLog = persistedSimulation.$$logs.values[0]
		if (persistedLog === undefined)
			throw new Error('WebEVM log relation was not selected')
		expect(persistedLog).toMatchObject({
			logIndex: 0,
			address: logTarget,
			topic0: topic,
			dataHash: Hash.sha256('0x'),
			$simulation: {
				[EntityMetaKey.Selector]: {
					id: simulation.id,
				},
			},
		})
		expect(persistedLog.topics.values).toEqual([[topic]])
	} finally {
		await consumer.dispose()
		reader?.destroy()
		writer.destroy()
	}
})

it('persists a failed WebEVM call graph through reset without mutating state', async () => {
	const persistence = createPersistence()
	const writer = createContext(persistence)
	const session = { id: 'session-webevm-failed-reset' } as const
	const simulation = {
		id: 'simulation-webevm-failed-reset',
		createdAt: 2,
		completedAt: 3,
	} as const
	await writeLocalBlockheadSessionLifecycle(
		writer,
		{ scope: '$$blockheadSessions' },
		{
			id: session.id,
			name: 'WebEVM failed reset',
			status: BlockheadSessionStatus.Draft,
			createdAt: 1,
			updatedAt: 1,
		}
	)

	const consumer = await createWebEvmLocalSimulationConsumer(config)
	let reader: ReturnType<typeof createContext> | undefined
	let reset: WebEvmLocalSimulationConsumer | undefined
	try {
		const initialRoot = await consumer.currentStateRoot()
		const result = await consumer.simulateCall(writer, {
			session,
			simulation,
			operation: {
				kind: 'call',
				from: sender,
				to: revertTarget,
				value: 0n,
				input: '0x',
				blockTag: '0x0',
			},
		})
		expect(result).toMatchObject({
			kind: 'revert',
			data: '0x',
		})
		expect(await consumer.currentStateRoot()).toBe(initialRoot)

		reset = await consumer.reset()
		expect(reset.initialStateRoot).toBe(initialRoot)
		expect(reset.nodeConfigHash).toBe(consumer.nodeConfigHash)
		expect(await reset.currentStateRoot()).toBe(initialRoot)

		await writer.entityCollections[EntityType.BlockheadSessionSimulation].utils.waitForPersistence()
		reader = createContext(persistence)
		const selection = reader.select(EntityType.BlockheadSession, session, {
			sources: [Source.Local_Internal],
			fields: {
				id: true,
				simulationCount: true,
			},
		})
		expect((await selection).fields).toMatchObject({
			id: session.id,
			simulationCount: 1,
		})

		const simulations = await (
			selection.$$simulations({
				sources: [Source.Local_Internal],
			})({
				fields: {
					id: true,
					status: true,
					error: true,
					resultPayloadHash: true,
					$session: true,
					$$calls: {
						fields: {
							callPath: true,
							toAddress: true,
							reverted: true,
							error: true,
							outputDataHash: true,
							$simulation: true,
						},
					},
					$$logs: {
						fields: {
							logIndex: true,
							$simulation: true,
						},
					},
				},
			})
		)
		expect(simulations.values).toHaveLength(1)
		const persisted = simulations.values[0]
		if (persisted === undefined)
			throw new Error('failed WebEVM simulation relation was not selected')

		expect(persisted).toMatchObject({
			id: simulation.id,
			status: 'failed',
			error: 'execution reverted',
			resultPayloadHash: Hash.sha256(
				Hex.fromString(JSON.stringify([
					'revert',
					'0x',
					null,
				]))
			),
			$session: { [EntityMetaKey.Selector]: session },
		})
		expect(persisted.$$calls.values).toHaveLength(1)
		expect(persisted.$$calls.values[0]).toMatchObject({
			callPath: 'root',
			toAddress: revertTarget,
			reverted: true,
			error: 'execution reverted',
			outputDataHash: Hash.sha256('0x'),
			$simulation: {
				[EntityMetaKey.Selector]: { id: simulation.id },
			},
		})
		expect(persisted.$$logs.values).toEqual([])
	} finally {
		await consumer.dispose()
		if (reset !== undefined)
			await reset.dispose()

		reader?.destroy()
		writer.destroy()
	}
})
