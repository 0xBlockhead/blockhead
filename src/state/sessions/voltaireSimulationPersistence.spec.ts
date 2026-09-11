import * as Hash from 'ox/Hash'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EvmInternalCallType } from '$/constants/Evm.ts'
import {
	type LocalMutationContext,
} from '$/collections/localMutations.ts'
import type { MutationCollection } from '$/client/$client.svelte.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	VoltaireLogProjectionRow,
	VoltaireSimulationPersistenceInput,
	VoltaireTraceProjectionRow,
} from './voltaireSimulationPersistence.ts'

const getTransactionByHash = vi.hoisted(() => vi.fn())
const getTransactionReceipt = vi.hoisted(() => vi.fn())
const debugTraceTransaction = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
		httpTransportsByChainId: {
			31337: [{ diagnosticLabel: 'G15 persistence fixture', getTransactionByHash, getTransactionReceipt, debugTraceTransaction }],
		},
	},
}))

const {
	persistVoltaireSimulation,
	voltaireSimulationMutationInputFromProjectionRows,
} = await import('./voltaireSimulationPersistence.ts')

const fixture = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
const from = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
const target = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const topic0 = '0x850a767d264ab988d24d1ff1a7b843b2902e6cc83a7c7a457d97796c773b2b63'
const indexed42 = '0x000000000000000000000000000000000000000000000000000000000000002a'
const dynamicLogData = '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002a'
const nestedInput = '0x14bd0a7b000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512000000000000000000000000000000000000000000000000000000000000002a'
const childInput = '0x60fe47b1000000000000000000000000000000000000000000000000000000000000002a'
const rootRevert = '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d6e6573746564206661696c656400000000000000000000000000000000000000'
const childRevert = '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d746172676574206661696c656400000000000000000000000000000000000000'
const network = { caip2: { namespace: 'eip155', reference: '31337' } }

const traceIndexField = entityFieldAddressKey(EntityType.EvmTrace, [], 'index')
const traceTypeField = entityFieldAddressKey(EntityType.EvmTrace, [], 'type')
const traceFromField = entityFieldAddressKey(EntityType.EvmTrace, [], '$from')
const traceToField = entityFieldAddressKey(EntityType.EvmTrace, [], '$to')
const traceValueField = entityFieldAddressKey(EntityType.EvmTrace, [], 'value')
const traceInputField = entityFieldAddressKey(EntityType.EvmTrace, [], 'input')
const traceOutputField = entityFieldAddressKey(EntityType.EvmTrace, [], 'output')
const traceGasUsedField = entityFieldAddressKey(EntityType.EvmTrace, [], 'gasUsed')
const traceErrorField = entityFieldAddressKey(EntityType.EvmTrace, [], 'error')
const logTopicsField = entityFieldAddressKey(EntityType.EvmLog, [], '$$topics')
const logTopic0Field = entityFieldAddressKey(EntityType.EvmLog, [], 'topic0')
const logDataField = entityFieldAddressKey(EntityType.EvmLog, [], 'data')
const logRemovedField = entityFieldAddressKey(EntityType.EvmLog, [], 'removed')
const logEmitterField = entityFieldAddressKey(EntityType.EvmLog, [], '$emitter')
const account = (address: typeof from | typeof fixture | typeof target) => ({ [EntityMetaKey.Selector]: { address } })
const emitter = (address: typeof fixture) => ({ [EntityMetaKey.Selector]: { $network: network, address } })
const topic = (hex: typeof topic0 | typeof indexed42) => ({ [EntityMetaKey.Selector]: { hex } })

type MockRow = Record<string, object | string | number | boolean | bigint | undefined>

const createLocalMutationContext = (): LocalMutationContext => {
	const collectionByAddress = new Map<string, MutationCollection<MockRow>>()
	const collectionFor = (address: string): MutationCollection<MockRow> => {
		const existing = collectionByAddress.get(address)
		if (existing != null)
			return existing

		const rows: MockRow[] = []
		const collection: MutationCollection<MockRow> = {
			toArray: rows,
			delete: (key) => {
				const index = rows.findIndex((row) => row.key === key)
				if (index >= 0)
					rows.splice(index, 1)
			},
			startSyncImmediate: () => {},
			utils: {
				waitForPersistence: async () => {},
				replaceRows: (predicate, nextRows) => {
					for (let index = rows.length - 1; index >= 0; index -= 1)
						if (predicate(rows[index]))
							rows.splice(index, 1)
					rows.push(...nextRows)
				},
				replaceRowsWithAuthority: async (predicate, nextRows, _selectorKey, _authorityKey, _resolution, onApplied) => {
					collection.utils.replaceRows(predicate, nextRows)
					await onApplied?.()
				},
				writeUpsert: (row) => {
					for (const nextRow of row instanceof Array ? row : [row]) {
						const index = rows.findIndex((existingRow) => (
							existingRow[EntityMetaKey.Source] === nextRow[EntityMetaKey.Source]
							&& existingRow[EntityMetaKey.ParentSelectorKey] === nextRow[EntityMetaKey.ParentSelectorKey]
							&& existingRow[EntityMetaKey.SelectorKey] === nextRow[EntityMetaKey.SelectorKey]
							&& existingRow.valueKey === nextRow.valueKey
						))
						if (index >= 0)
							rows.splice(index, 1)
						rows.push(nextRow)
					}
				},
				writeUpsertWithAuthority: async (row, _selectorKey, _authorityKey, _resolution, onApplied) => {
					collection.utils.writeUpsert(row)
					await onApplied?.()
				},
				deleteSelectorRowsAndAuthority: (predicate) => {
					collection.utils.replaceRows(predicate, [])
				},
			},
		}
		collectionByAddress.set(address, collection)
		return collection
	}

	const entityCollections: LocalMutationContext['entityCollections'] = new Proxy({}, {
		get: (_target, entityType: string) => collectionFor(`entity:${entityType}`),
	})
	const entityFieldCollections: LocalMutationContext['entityFieldCollections'] = new Proxy({}, {
		get: (_target, entityType: string) => new Proxy({}, {
			get: (_fields, fieldAddress: string) => collectionFor(`field:${entityType}:${fieldAddress}`),
		}),
	})
	const entityFieldCountCollections: LocalMutationContext['entityFieldCountCollections'] = new Proxy({}, {
		get: (_target, entityType: string) => new Proxy({}, {
			get: (_fields, fieldAddress: string) => collectionFor(`count:${entityType}:${fieldAddress}`),
		}),
	})

	return {
		entityCollections,
		entityFieldCollections,
		entityFieldCountCollections,
	}
}

const rootTrace = {
	[EntityMetaKey.Selector]: { traceAddress: 'root' },
	[EntityMetaKey.Fields]: {
		[traceIndexField]: 0,
		[traceTypeField]: EvmInternalCallType.Call,
		[traceFromField]: account(from),
		[traceToField]: account(fixture),
		[traceValueField]: 0n,
		[traceInputField]: nestedInput,
		[traceOutputField]: `0x${'0'.repeat(63)}1`,
		[traceGasUsedField]: 0x7097n,
	},
} satisfies VoltaireTraceProjectionRow
const childTrace = {
	[EntityMetaKey.Selector]: { traceAddress: '0' },
	[EntityMetaKey.Fields]: {
		[traceIndexField]: 0,
		[traceTypeField]: EvmInternalCallType.Call,
		[traceFromField]: account(fixture),
		[traceToField]: account(fixture),
		[traceValueField]: 0n,
		[traceInputField]: childInput,
		[traceOutputField]: '0x',
		[traceGasUsedField]: 0x120fn,
	},
} satisfies VoltaireTraceProjectionRow
const successTraces = [rootTrace, childTrace]

const successLog = {
	[EntityMetaKey.Selector]: { indexInTransaction: 0 },
	[EntityMetaKey.Fields]: {
		[logTopicsField]: [topic(topic0), topic(indexed42)],
		[logTopic0Field]: topic0,
		[logDataField]: dynamicLogData,
		[logRemovedField]: false,
		[logEmitterField]: emitter(fixture),
	},
} satisfies VoltaireLogProjectionRow
const successLogs = [successLog]

const persistenceInput = (
	traces: readonly VoltaireTraceProjectionRow[],
	logs: readonly VoltaireLogProjectionRow[]
): VoltaireSimulationPersistenceInput => ({
	session: { id: 'session-g15' },
	simulation: {
		id: 'simulation-g15',
		status: 'succeeded',
		createdAt: 1,
		paramsHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
	},
	traces,
	logs,
})

describe('Voltaire simulation resolver projection persistence adapter', () => {
	beforeEach(() => {
		getTransactionByHash.mockReset()
		getTransactionReceipt.mockReset()
		debugTraceTransaction.mockReset()
	})

	it('normalizes byte-faithful nested calls and receipt logs into hashed mutation inputs', () => {
		expect(voltaireSimulationMutationInputFromProjectionRows({ traces: successTraces, logs: successLogs })).toEqual({
			calls: [{
				callPath: 'root', callIndex: 0, depth: 0, callType: EvmInternalCallType.Call,
				fromAddress: from, toAddress: fixture, value: 0n,
				inputSelector: '0x14bd0a7b', inputDataHash: Hash.sha256(nestedInput),
				outputDataHash: Hash.sha256(`0x${'0'.repeat(63)}1`), gasUsed: 0x7097n,
			}, {
				callPath: '0', parentCallPath: 'root', callIndex: 0, depth: 1, callType: EvmInternalCallType.Call,
				fromAddress: fixture, toAddress: fixture, value: 0n,
				inputSelector: '0x60fe47b1', inputDataHash: Hash.sha256(childInput),
				outputDataHash: Hash.sha256('0x'), gasUsed: 0x120fn,
			}],
			logs: [{
				logIndex: 0, address: fixture, topic0, topics: [topic0, indexed42],
				dataHash: Hash.sha256(dynamicLogData), removed: false,
			}],
		})
	})

	it('retains distinct root and child revert errors and output-byte hashes', () => {
		const traces = successTraces.map((trace, index) => ({
			...trace,
			[EntityMetaKey.Fields]: {
				...trace[EntityMetaKey.Fields],
				[traceOutputField]: index === 0 ? rootRevert : childRevert,
				[traceErrorField]: index === 0 ? 'nested failed' : 'target failed',
			},
		})) satisfies VoltaireTraceProjectionRow[]
		const { calls } = voltaireSimulationMutationInputFromProjectionRows({ traces, logs: [] })
		expect(calls).toMatchObject([
			{ callPath: 'root', outputDataHash: Hash.sha256(rootRevert), error: 'nested failed', reverted: true },
			{ callPath: '0', parentCallPath: 'root', outputDataHash: Hash.sha256(childRevert), error: 'target failed', reverted: true },
		])
	})

	it('refuses duplicate trace paths before delegation', async () => {
		const context = createLocalMutationContext()
		await expect(persistVoltaireSimulation(context, persistenceInput([rootTrace, rootTrace], []))).rejects.toThrow('trace paths must be unique')
		expect(context.entityCollections[EntityType.BlockheadSessionSimulation].toArray).toHaveLength(0)
	})

	it('independently refuses duplicate receipt log indexes before delegation', async () => {
		const context = createLocalMutationContext()
		await expect(persistVoltaireSimulation(context, persistenceInput([], [successLog, successLog]))).rejects.toThrow('log indexes must be unique')
		expect(context.entityCollections[EntityType.BlockheadSessionSimulation].toArray).toHaveLength(0)
	})

	it('rejects incoherent resolver path indexes and log topic selectors before delegation', async () => {
		const context = createLocalMutationContext()
		const badTrace = {
			...childTrace,
			[EntityMetaKey.Fields]: { ...childTrace[EntityMetaKey.Fields], [traceIndexField]: 1 },
		} satisfies VoltaireTraceProjectionRow
		await expect(persistVoltaireSimulation(context, persistenceInput([rootTrace, badTrace], []))).rejects.toThrow('trace index does not match path')

		const badLog = {
			...successLog,
			[EntityMetaKey.Fields]: { ...successLog[EntityMetaKey.Fields], [logTopic0Field]: indexed42 },
		} satisfies VoltaireLogProjectionRow
		await expect(persistVoltaireSimulation(context, persistenceInput([], [badLog]))).rejects.toThrow('topic0 does not match topics[0]')
		expect(context.entityCollections[EntityType.BlockheadSessionSimulation].toArray).toHaveLength(0)
	})

	it('rejects an orphan nested call before delegation', async () => {
		const context = createLocalMutationContext()
		await expect(persistVoltaireSimulation(context, persistenceInput([childTrace], []))).rejects.toThrow('trace parent is missing')
		expect(context.entityCollections[EntityType.BlockheadSessionSimulation].toArray).toHaveLength(0)
	})

	it('accepts actual Voltaire projections and preserves nested failure identity', async () => {
		const { default: voltaireJsonRpc } = await import('$/resolvers/Voltaire-JsonRpc.ts')
		type EvmTransactionTraceResolver = Extract<
			(typeof voltaireJsonRpc)['resolvers'][number],
			{
				readonly entityType: EntityType.EvmTransaction
				readonly projections: {
					readonly $$traces: object
					readonly $$logs: object
				}
			}
		>
		const resolver = voltaireJsonRpc.resolvers.find(
			(candidate): candidate is EvmTransactionTraceResolver => (
				candidate.entityType === EntityType.EvmTransaction
				&& '$$traces' in candidate.projections
				&& '$$logs' in candidate.projections
			)
		)
		expect(resolver).toBeDefined()
		if (resolver == null) throw new Error('EvmTransaction resolver missing')

		const transactionHash = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
		getTransactionByHash.mockResolvedValue({
			hash: transactionHash,
			blockNumber: '0x4',
			from,
			to: fixture,
			type: '0x2',
			transactionIndex: '0x0',
			value: '0x0',
			nonce: '0x0',
			input: nestedInput,
			r: '0x01',
			s: '0x02',
			gas: '0x1c53',
			gasPrice: '0x1',
		})
		getTransactionReceipt.mockResolvedValue({
			status: '0x0',
			gasUsed: '0x7097',
			cumulativeGasUsed: '0x7097',
			effectiveGasPrice: '0x1',
			logs: [{
				address: fixture,
				blockHash: '0x5deb326cfb5a8e970336cdd2d4c8d2cdde47fe90ee448718bd0e6cefec70b183',
				blockNumber: '0x4',
				data: dynamicLogData,
				logIndex: '0x0',
				removed: false,
				topics: [topic0, indexed42],
			}],
			transactionHash,
		})
		debugTraceTransaction.mockResolvedValue({
			type: 'CALL',
			from,
			to: fixture,
			value: '0x0',
			input: nestedInput,
			output: rootRevert,
			error: 'execution reverted',
			revertReason: 'nested failed',
			calls: [{
				type: 'CALL',
				from: fixture,
				to: target,
				value: '0x0',
				input: childInput,
				output: childRevert,
				error: 'execution reverted',
				revertReason: 'target failed',
			}],
		})

		const row = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash: transactionHash,
		})
		const traces = resolver.projections.$$traces.select(row)
		const logs = resolver.projections.$$logs.select(row)
		const context = createLocalMutationContext()
		await persistVoltaireSimulation(context, persistenceInput(traces, logs))

		const simulationSelector = { id: 'simulation-g15' }
		const sessionSelector = { id: 'session-g15' }
		const rootCallSelector = { simulationId: 'simulation-g15', callPath: 'root' }
		const childCallSelector = { simulationId: 'simulation-g15', callPath: '0' }
		const logSelector = { simulationId: 'simulation-g15', logIndex: 0 }
		const fieldRows = (
			entityType: EntityType,
			fieldName: string
		) => context.entityFieldCollections[entityType][entityFieldAddressKey(entityType, [], fieldName)].toArray

		expect(context.entityCollections[EntityType.BlockheadSessionSimulation].toArray).toContainEqual(
			expect.objectContaining({ [EntityMetaKey.Selector]: simulationSelector })
		)
		expect(context.entityCollections[EntityType.BlockheadSessionSimulationCall].toArray).toEqual([
			expect.objectContaining({ [EntityMetaKey.Selector]: rootCallSelector }),
			expect.objectContaining({ [EntityMetaKey.Selector]: childCallSelector }),
		])
		expect(context.entityCollections[EntityType.BlockheadSessionSimulationLog].toArray).toContainEqual(
			expect.objectContaining({ [EntityMetaKey.Selector]: logSelector })
		)
		expect(fieldRows(EntityType.BlockheadSessionSimulation, '$session')).toContainEqual(
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: simulationSelector,
				[EntityMetaKey.Value]: expect.objectContaining({ [EntityMetaKey.Selector]: sessionSelector }),
			})
		)
		expect(fieldRows(EntityType.BlockheadSessionSimulation, '$$calls')).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: simulationSelector,
				[EntityMetaKey.Value]: expect.objectContaining({ [EntityMetaKey.Selector]: rootCallSelector }),
			}),
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: simulationSelector,
				[EntityMetaKey.Value]: expect.objectContaining({ [EntityMetaKey.Selector]: childCallSelector }),
			}),
		]))
		expect(fieldRows(EntityType.BlockheadSessionSimulation, '$$logs')).toContainEqual(
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: simulationSelector,
				[EntityMetaKey.Value]: expect.objectContaining({ [EntityMetaKey.Selector]: logSelector }),
			})
		)
		expect(fieldRows(EntityType.BlockheadSessionSimulationCall, 'parentCallPath')).toContainEqual(
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: childCallSelector,
				[EntityMetaKey.Value]: 'root',
			})
		)
		expect(fieldRows(EntityType.BlockheadSessionSimulationCall, 'error')).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: rootCallSelector,
				[EntityMetaKey.Value]: 'nested failed',
			}),
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: childCallSelector,
				[EntityMetaKey.Value]: 'target failed',
			}),
		]))
		expect(fieldRows(EntityType.BlockheadSessionSimulationCall, 'outputDataHash')).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: rootCallSelector,
				[EntityMetaKey.Value]: Hash.sha256(rootRevert),
			}),
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: childCallSelector,
				[EntityMetaKey.Value]: Hash.sha256(childRevert),
			}),
		]))
		expect(fieldRows(EntityType.BlockheadSessionSimulationLog, '$simulation')).toContainEqual(
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: logSelector,
				[EntityMetaKey.Value]: expect.objectContaining({ [EntityMetaKey.Selector]: simulationSelector }),
			})
		)
		expect(fieldRows(EntityType.BlockheadSessionSimulationLog, 'dataHash')).toContainEqual(
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: logSelector,
				[EntityMetaKey.Value]: Hash.sha256(dynamicLogData),
			})
		)
		expect(fieldRows(EntityType.BlockheadSession, '$latestSimulation')).toContainEqual(
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: sessionSelector,
				[EntityMetaKey.Value]: expect.objectContaining({ [EntityMetaKey.Selector]: simulationSelector }),
			})
		)
		expect(fieldRows(EntityType.BlockheadSession, 'simulationCount')).toContainEqual(
			expect.objectContaining({
				[EntityMetaKey.ParentSelector]: sessionSelector,
				[EntityMetaKey.Value]: 1,
			})
		)
	})
})
