import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import type { MutationCollection } from '$/client/$client.svelte.ts'
import type { LocalMutationContext } from '$/collections/localMutations.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'

const writeLocalBlockheadSessionSimulation = vi.hoisted(() => (
	vi.fn(async () => ({ id: 'simulation-anvil' }))
))

vi.mock('$/collections/localMutations.ts', () => ({
	writeLocalBlockheadSessionSimulation,
}))

const {
	anvilSimulationMutationInputFromOperations,
	persistAnvilLocalSimulation,
} = await import('$/actions/evmLocalSimulationTracePersistence.ts')

const hash = (digit: string) => `0x${digit.repeat(64)}` as const
const source = {
	kind: 'anvil-local-call-trace',
	version: 'anvil/v1.0.0',
} as const
const operations = {
	source,
	chainId: 1,
	stateBlockNumber: 42n,
	requestInputDataHash: hash('1'),
	operations: [
		{
			callPath: '0',
			depth: 0,
			callIndex: 0,
			callType: 'CALL',
			fromAddress: `0x${'11'.repeat(20)}`,
			toAddress: `0x${'22'.repeat(20)}`,
			value: 3n,
			inputDataHash: hash('2'),
			outputDataHash: hash('3'),
			gasUsed: 50_000n,
			outcome: { kind: 'returned' },
		},
		{
			callPath: '0.0',
			parentCallPath: '0',
			depth: 1,
			callIndex: 0,
			callType: 'STATICCALL',
			fromAddress: `0x${'22'.repeat(20)}`,
			toAddress: `0x${'33'.repeat(20)}`,
			inputDataHash: hash('4'),
			outputDataHash: hash('5'),
			gasUsed: 1_000n,
			outcome: {
				kind: 'reverted',
				error: 'execution reverted: allowance',
			},
		},
	],
} as const

const acquired = {
	kind: 'acquired',
	trace: {
		source,
		chainId: operations.chainId,
		stateBlockNumber: operations.stateBlockNumber,
		requestInputDataHash: operations.requestInputDataHash,
		root: {
			callType: 'CALL',
			outcome: { kind: 'returned' },
			calls: [],
		},
	},
	operations,
} as const

const input = {
	session: { id: 'session-anvil' },
	simulation: {
		id: 'simulation-anvil',
		status: 'succeeded',
		createdAt: 1,
		paramsHash: operations.requestInputDataHash,
		forkBlockNumber: operations.stateBlockNumber,
	},
	acquisition: acquired,
} as const

type MockRow = Record<string, object | string | number | boolean | bigint | undefined>

const createContext = (): LocalMutationContext => {
	const collection: MutationCollection<MockRow> = {
		toArray: [],
		delete: () => {},
		startSyncImmediate: () => {},
		utils: {
			deleteSelectorRowsAndAuthority: () => {},
			replaceRows: () => {},
			replaceRowsWithAuthority: async () => {},
			waitForPersistence: async () => {},
			writeUpsert: () => {},
			writeUpsertWithAuthority: async () => {},
		},
	}
	return {
		entityCollections: new Proxy({}, {
			get: () => collection,
		}),
		entityFieldCollections: new Proxy({}, {
			get: () => new Proxy({}, {
				get: () => collection,
			}),
		}),
		entityFieldCountCollections: new Proxy({}, {
			get: () => new Proxy({}, {
				get: () => collection,
			}),
		}),
	}
}

describe('Anvil local trace persistence composition', () => {
	beforeEach(() => writeLocalBlockheadSessionSimulation.mockClear())

	it('maps ordered root and child operations while retaining nested revert fields', () => {
		expect(anvilSimulationMutationInputFromOperations(operations)).toEqual([
			expect.objectContaining({
				callPath: '0',
				depth: 0,
				callIndex: 0,
				toAddress: `0x${'22'.repeat(20)}`,
			}),
			expect.objectContaining({
				callPath: '0.0',
				parentCallPath: '0',
				depth: 1,
				callIndex: 0,
				reverted: true,
				error: 'execution reverted: allowance',
			}),
		])
	})

	it('writes only an acquired graph and returns exact source identity binding', async () => {
		await expect(persistAnvilLocalSimulation(createContext(), input)).resolves.toEqual({
			entitySelector: { id: 'simulation-anvil' },
			source,
			chainId: 1,
			stateBlockNumber: 42n,
			requestInputDataHash: hash('1'),
		})
		expect(writeLocalBlockheadSessionSimulation).toHaveBeenCalledOnce()
		expect(writeLocalBlockheadSessionSimulation.mock.calls[0]?.[2]).toMatchObject({
			executionSourceKind: source.kind,
			executionSourceVersion: source.version,
			$executionNetwork: {
				[EntityMetaKey.Selector]: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
			},
		})
		expect(writeLocalBlockheadSessionSimulation.mock.calls[0]?.[3]).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					callPath: '0.0',
					parentCallPath: '0',
					reverted: true,
				}),
			])
		)
	})

	it('fails closed before the writer for rejected acquisition and malformed graph', async () => {
		await expect(persistAnvilLocalSimulation(createContext(), {
			...input,
			acquisition: {
				kind: 'failed',
				error: 'trace unavailable',
			},
		})).rejects.toThrow('trace unavailable')
		const malformed = {
			...operations,
			operations: [
				operations.operations[0],
				{
					...operations.operations[1],
					parentCallPath: '0.1',
				},
			],
		}
		await expect(persistAnvilLocalSimulation(createContext(), {
			...input,
			acquisition: {
				...acquired,
				operations: malformed,
			},
		})).rejects.toThrow('position does not match path')
		const secondRoot = {
			...operations,
			operations: [
				operations.operations[0],
				{
					...operations.operations[1],
					callPath: '1',
					parentCallPath: undefined,
					depth: 0,
					callIndex: 1,
				},
			],
		}
		await expect(persistAnvilLocalSimulation(createContext(), {
			...input,
			acquisition: {
				...acquired,
				operations: secondRoot,
			},
		})).rejects.toThrow('parent must precede child')
		await expect(persistAnvilLocalSimulation(createContext(), {
			...input,
			simulation: {
				...input.simulation,
				paramsHash: hash('9'),
			},
		})).rejects.toThrow('params hash does not match')
		expect(writeLocalBlockheadSessionSimulation).not.toHaveBeenCalled()
	})
})
