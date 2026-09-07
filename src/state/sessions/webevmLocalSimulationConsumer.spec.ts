import * as Hash from 'ox/Hash'
import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import type { SlimNode } from 'webevm'

import type { LocalMutationContext } from '$/collections/localMutations.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import {
	EvmRpcQuantity,
	Hash32,
	ZeroExHex,
} from '$/schema/ZeroExHex.ts'
import type {
	WebEvmCallSimulationInput,
	WebEvmSimulationSeed,
} from '$/state/sessions/webevmLocalSimulationConsumer.ts'
import type { WebEvmLocalNodeConfig } from '$/state/sessions/webevmLocalSimulationNode.ts'

const writeLocalBlockheadSessionSimulation = vi.hoisted(() => vi.fn())
type NodeRequest = SlimNode['request']
type NodeRequestOverride = (
	request: Parameters<NodeRequest>[0],
	original: NodeRequest
) => Promise<JsonValue>
const nodeRequestOverride = vi.hoisted((): {
	current: NodeRequestOverride | undefined
} => ({
	current: undefined,
}))

vi.mock('$/collections/localMutations.ts', () => ({
	writeLocalBlockheadSessionSimulation,
}))
vi.mock('webevm', async () => {
	const actual = await vi.importActual<typeof import('webevm')>('webevm')

	return {
		...actual,
		createNode: async (
			...parameters: Parameters<typeof actual.createNode>
		) => {
			const node = await actual.createNode(...parameters)

			return new Proxy(node, {
				get: (target, property) => {
					const override = nodeRequestOverride.current

					if (property === 'request' && override !== undefined) {
						const original: NodeRequest = (request) => target.request(request)
						return (request: Parameters<NodeRequest>[0]) => override(request, original)
					}

					// oxlint-disable no-restricted-globals -- Proxy get trap forwarding requires Reflect.get.
				// oxlint-disable no-runtime-shape-guards/guards -- Proxy get trap forwarding requires Reflect.get.
				return Reflect.get(target, property, target)
				// oxlint-enable no-restricted-globals
				// oxlint-enable no-runtime-shape-guards/guards
				},
			})
		},
	}
})

const {
	createWebEvmLocalSimulationConsumer,
	WebEvmStaleOperationError,
} = await import('$/state/sessions/webevmLocalSimulationConsumer.ts')

const sender = ZeroExHex.assert('0x19e7e376e7c213b7e7e7e46cc70a5dd086daff2a')
const recipient = ZeroExHex.assert('0x0000000000000000000000000000000000000020')
const revertTarget = ZeroExHex.assert('0x0000000000000000000000000000000000000010')
const logTarget = ZeroExHex.assert('0x0000000000000000000000000000000000000021')
const topic = Hash32.assert(`0x${'22'.repeat(32)}`)
const rawTransaction = ZeroExHex.assert('0x02f88c827a69800101830186a094000000000000000000000000000000000000002180a77f222222222222222222222222222222222222222222222222222222222222222260006000a100c001a0071cb145869539908c6b2d6478d7824e31735448cddcb060412abea4f57c6ad4a0431611c57d2d717060579bd1d64cb6adc0b82cde7642ab4f3bdf9753ef30bdd8')
const transactionInput = ZeroExHex.assert(`0x7f${'22'.repeat(32)}60006000a100`)

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
		[revertTarget]: {
			code: '0x60006000fd',
		},
		[logTarget]: {
			code: `0x7f${topic.slice(2)}60006000a100`,
		},
	},
	blockEnv: {
		coinbase: ZeroExHex.assert('0x0000000000000000000000000000000000000004'),
		baseFeePerGas: 1n,
		number: 7n,
		timestamp: 1_700_000_000n,
		gasLimit: 30_000_000n,
		prevRandao: Hash32.assert(`0x${'11'.repeat(32)}`),
	},
} as const satisfies WebEvmLocalNodeConfig

const context = {
	entityCollections: {},
	entityFieldCollections: {},
	entityFieldCountCollections: {},
} satisfies LocalMutationContext

const session = { id: 'session-1' } as const
const simulation = {
	id: 'simulation-1',
	createdAt: 1,
	completedAt: 2,
} as const satisfies WebEvmSimulationSeed

const callOperation = {
	kind: 'call',
	from: sender,
	to: recipient,
	value: 0n,
	input: ZeroExHex.assert('0x'),
	blockTag: EvmRpcQuantity.assert('0x0'),
} as const

describe('WebEVM local simulation composition', () => {
	it('executes adapter reads and persists actual call, revert, receipt, and log results', async () => {
		writeLocalBlockheadSessionSimulation.mockClear()
		const consumer = await createWebEvmLocalSimulationConsumer(config)
		const genesisRoot = consumer.initialStateRoot

		expect(await consumer.capture(callOperation)).toMatchObject({ forkBlockNumber: 0n })
		expect(await consumer.simulateCall(context, {
			session,
			simulation,
			operation: callOperation,
		})).toEqual({ kind: 'success', data: '0x' })
		expect(await consumer.estimateGas(callOperation)).toBe(21_000n)

		const successfulCallWrite = writeLocalBlockheadSessionSimulation.mock.calls[0]
		expect(successfulCallWrite[2]).toMatchObject({
			status: 'succeeded',
			forkBlockNumber: 0n,
		})
		expect(successfulCallWrite[2].paramsHash).not.toBe(consumer.nodeConfigHash)
		expect(successfulCallWrite[3]).toMatchObject([{
			callPath: 'root',
			depth: 0,
			reverted: false,
		}])
		expect(successfulCallWrite[4]).toEqual([])
		expect(await consumer.currentStateRoot()).toBe(genesisRoot)

		const revert = await consumer.simulateCall(context, {
			session,
			simulation: { ...simulation, id: 'simulation-revert' },
			operation: {
				...callOperation,
				to: revertTarget,
			},
		})

		expect(revert.kind).toBe('revert')
		expect(writeLocalBlockheadSessionSimulation.mock.calls[1][2]).toMatchObject({
			status: 'failed',
			error: 'execution reverted',
		})
		expect(writeLocalBlockheadSessionSimulation.mock.calls[1][3]).toMatchObject([{
			callPath: 'root',
			depth: 0,
			reverted: true,
			error: 'execution reverted',
		}])
		expect(await consumer.currentStateRoot()).toBe(genesisRoot)

		const sent = await consumer.sendRawTransaction(context, {
			session,
			simulation: { ...simulation, id: 'simulation-receipt' },
			request: {
				from: sender,
				to: logTarget,
				value: 0n,
				input: transactionInput,
			},
			rawTransaction,
		})

		expect(sent.receipt.status).toBe('0x1')
		expect(sent.receipt.transactionHash).toMatch(/^0x[0-9a-f]{64}$/)
		expect(sent.receipt.logs).toHaveLength(1)
		expect(sent.receipt.logs[0]).toMatchObject({
		address: logTarget,
		topics: [topic],
		data: '0x',
	})
		expect(sent.paramsHash).not.toBe(consumer.nodeConfigHash)
		expect(writeLocalBlockheadSessionSimulation.mock.calls[2][2]).toMatchObject({
		status: 'succeeded',
		paramsHash: sent.paramsHash,
			forkBlockNumber: 0n,
	})
		expect(writeLocalBlockheadSessionSimulation.mock.calls[2][3]).toMatchObject([{
		callPath: 'root',
		reverted: false,
	}])
		expect(writeLocalBlockheadSessionSimulation.mock.calls[2][4]).toMatchObject([{
		logIndex: 0,
		address: logTarget,
		topic0: topic,
		topics: [topic],
		removed: false,
	}])
		expect(await consumer.currentStateRoot()).not.toBe(genesisRoot)

		const reset = await consumer.reset()
		expect(reset.initialStateRoot).toBe(genesisRoot)
		expect(reset.nodeConfigHash).toBe(consumer.nodeConfigHash)
		await Promise.all([reset.dispose(), reset.dispose()])
	})

	it('serializes concurrent operations and rejects a basis captured before a mutation', async () => {
		writeLocalBlockheadSessionSimulation.mockClear()
		const consumer = await createWebEvmLocalSimulationConsumer(config)
		try {
			let release: (() => void) | undefined
			writeLocalBlockheadSessionSimulation.mockImplementationOnce(() => new Promise<void>((resolve) => {
				release = resolve
			}))
			const first = consumer.simulateCall(context, {
				session,
				simulation: { ...simulation, id: 'simulation-concurrent-1' },
				operation: callOperation,
			})
			const mutableSecondInput = {
				session,
				simulation: { ...simulation, id: 'simulation-concurrent-2' },
				operation: {
					...callOperation,
					input: ZeroExHex.assert('0x00'),
				},
			}
			const secondInput: WebEvmCallSimulationInput = mutableSecondInput
			const second = consumer.simulateCall(context, secondInput)
			mutableSecondInput.simulation.id = 'mutated-simulation'
			mutableSecondInput.operation.input = ZeroExHex.assert('0x01')

			await vi.waitFor(() => expect(release).toBeTypeOf('function'))
			expect(writeLocalBlockheadSessionSimulation.mock.calls.map((call) => call[2].id)).toEqual([
				'simulation-concurrent-1',
			])
			release?.()
			expect((await Promise.all([first, second])).map((result) => result.kind)).toEqual(['success', 'success'])
			expect(writeLocalBlockheadSessionSimulation.mock.calls.map((call) => call[2].id)).toEqual([
				'simulation-concurrent-1',
				'simulation-concurrent-2',
			])
			expect(writeLocalBlockheadSessionSimulation.mock.calls[1][3][0].inputDataHash)
				.toBe(Hash.sha256('0x00'))

			const staleBasis = await consumer.capture(callOperation)
			await consumer.sendRawTransaction(context, {
				session,
				simulation: { ...simulation, id: 'simulation-concurrent-send' },
				request: {
					from: sender,
					to: logTarget,
					value: 0n,
					input: transactionInput,
				},
				rawTransaction,
			})

			await expect(consumer.simulateCall(context, {
				session,
				simulation: { ...simulation, id: 'simulation-stale' },
				operation: callOperation,
				expectedParamsHash: staleBasis.paramsHash,
			})).rejects.toBeInstanceOf(WebEvmStaleOperationError)
			expect(writeLocalBlockheadSessionSimulation.mock.calls.map((call) => call[2].id)).not.toContain('simulation-stale')
		}
		finally {
			await consumer.dispose()
		}
	})

	it('closes old admission before reset and waits for the queued persistence boundary', async () => {
		writeLocalBlockheadSessionSimulation.mockClear()
		const consumer = await createWebEvmLocalSimulationConsumer(config)
		let release: (() => void) | undefined
		writeLocalBlockheadSessionSimulation.mockImplementationOnce(() => new Promise<void>((resolve) => {
			release = resolve
		}))
		const pending = consumer.simulateCall(context, {
			session,
			simulation,
			operation: callOperation,
		})
		await vi.waitFor(() => expect(release).toBeTypeOf('function'))
		const reset = consumer.reset()

		await expect(consumer.simulateCall(context, {
			session,
			simulation: { ...simulation, id: 'simulation-after-reset-start' },
			operation: callOperation,
		})).rejects.toThrow('disposed')
		release?.()
		await pending
		const next = await reset
		expect(next.initialStateRoot).toBe(consumer.initialStateRoot)
		await next.dispose()
	})

	it('fails closed when durable persistence rejects after a signed mutation', async () => {
		writeLocalBlockheadSessionSimulation.mockClear()
		const consumer = await createWebEvmLocalSimulationConsumer(config)
		const persistenceFailure = new Error('persistence failed after mutation')
		writeLocalBlockheadSessionSimulation.mockRejectedValueOnce(persistenceFailure)

		await expect(consumer.sendRawTransaction(context, {
			session,
			simulation,
			request: {
				from: sender,
				to: logTarget,
				value: 0n,
				input: transactionInput,
			},
			rawTransaction,
		})).rejects.toBe(persistenceFailure)
		await expect(consumer.simulateCall(context, {
			session,
			simulation: { ...simulation, id: 'simulation-after-persistence-failure' },
			operation: callOperation,
		})).rejects.toBe(persistenceFailure)
		expect(writeLocalBlockheadSessionSimulation).toHaveBeenCalledTimes(1)

		const reset = await consumer.reset()
		expect(await reset.currentStateRoot()).toBe(reset.initialStateRoot)
		await reset.dispose()

		const undefinedFailureConsumer = await createWebEvmLocalSimulationConsumer(config)
		writeLocalBlockheadSessionSimulation.mockRejectedValueOnce(undefined)
		await expect(undefinedFailureConsumer.sendRawTransaction(context, {
			session,
			simulation: { ...simulation, id: 'simulation-undefined-persistence-failure' },
			request: {
				from: sender,
				to: logTarget,
				value: 0n,
				input: transactionInput,
			},
			rawTransaction,
		})).rejects.toThrow('failed without an error value')
		await expect(undefinedFailureConsumer.currentStateRoot())
			.rejects.toThrow('failed without an error value')
		const undefinedFailureReset = await undefinedFailureConsumer.reset()
		await undefinedFailureReset.dispose()
	})

	it('rejects request mismatch before mutation and poisons malformed results after mutation', async () => {
		writeLocalBlockheadSessionSimulation.mockClear()
		const consumer = await createWebEvmLocalSimulationConsumer(config)
		const initialRoot = await consumer.currentStateRoot()

		await expect(consumer.sendRawTransaction(context, {
			session,
			simulation,
			request: {
				from: sender,
				to: recipient,
				value: 0n,
				input: '0x',
			},
			rawTransaction,
		})).rejects.toThrow('does not match')
		expect(await consumer.currentStateRoot()).toBe(initialRoot)
		expect(writeLocalBlockheadSessionSimulation).not.toHaveBeenCalled()

		nodeRequestOverride.current = async (request, original) => {
			const result = await original(request)

			if (request.method !== 'eth_sendRawTransactionSync')
				return result

			return {
				status: '0x2',
				transactionHash: `0x${'44'.repeat(32)}`,
				gasUsed: '0x5208',
				logs: [],
			}
		}

		try {
			const malformedResult = consumer.sendRawTransaction(context, {
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
			await expect(malformedResult).rejects.toThrow('unsupported status')
			await expect(consumer.simulateCall(context, {
				session,
				simulation: { ...simulation, id: 'simulation-after-malformed-receipt' },
				operation: callOperation,
			})).rejects.toThrow('unsupported status')
			expect(writeLocalBlockheadSessionSimulation).not.toHaveBeenCalled()
		}
		finally {
			nodeRequestOverride.current = undefined
			const reset = await consumer.reset()
			await reset.dispose()
		}
	})
})
