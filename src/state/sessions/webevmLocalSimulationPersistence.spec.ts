import * as Hash from 'ox/Hash'
import { describe, expect, it, vi } from 'vitest'

import type { LocalMutationContext } from '$/collections/localMutations.ts'
import type {
	WebEvmCallResult,
	WebEvmReceipt,
	WebEvmRequest,
	WebEvmSimulationInput,
} from './webevmLocalSimulationPersistence.ts'

const writeLocalBlockheadSessionSimulation = vi.hoisted(() => vi.fn())

vi.mock('$/collections/localMutations.ts', () => ({
	writeLocalBlockheadSessionSimulation,
}))

const { webEvmSimulationInput, persistWebEvmSimulation } = await import('./webevmLocalSimulationPersistence.ts')

const from = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
const to = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
const contract = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const input = '0x14bd0a7b000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512000000000000000000000000000000000000000000000000000000000000002a'
const returnData = '0x000000000000000000000000000000000000000000000000000000000000002a'
const revertData = '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d746172676574206661696c656400000000000000000000000000000000000000'
const topic0 = '0x850a767d264ab988d24d1ff1a7b843b2902e6cc83a7c7a457d97796c773b2b63'
const topic1 = '0x000000000000000000000000000000000000000000000000000000000000002a'
const logData = '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002a'

const baseSimulation = {
	id: 'sim-1',
	createdAt: 1,
	completedAt: 2,
	paramsHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
} as const

const session = { id: 'session-1' } as const

const callInput = (
	call: WebEvmCallResult,
	request: WebEvmRequest = { from, to, value: 1000n, input }
): WebEvmSimulationInput => ({
	session,
	simulation: baseSimulation,
	request,
	kind: 'call' as const,
	call,
})

const receiptInput = (
	receipt: WebEvmReceipt,
	request: WebEvmRequest = { from, to, value: 1000n, input }
): WebEvmSimulationInput => ({
	session,
	simulation: baseSimulation,
	request,
	kind: 'receipt' as const,
	receipt,
})

describe('webEvmSimulationInput', () => {
	it('rejects a completion timestamp before creation', () => {
		expect(() => webEvmSimulationInput({
			...callInput({ kind: 'success', data: returnData }),
			simulation: { ...baseSimulation, completedAt: 0 },
		})).toThrow('completion must not precede creation')
	})

	it('maps a successful eth_call to a succeeded simulation with one root call and no logs', () => {
		const result = webEvmSimulationInput(callInput({
			kind: 'success',
			data: returnData,
			gasUsed: 21000n,
		}))

		expect(result.simulation).toMatchObject({
			status: 'succeeded',
			createdAt: 1,
			completedAt: 2,
			paramsHash: baseSimulation.paramsHash,
			actionCount: 1,
			gasUsed: 21000n,
		})
		expect(result.simulation.error).toBeUndefined()
		expect(result.simulation.forkRpcOrigin).toBeUndefined()
		expect(result.simulation.resultPayloadHash).toMatch(/^0x[0-9a-fA-F]{64}$/)

		expect(result.calls).toMatchObject([{
			callPath: 'root',
			depth: 0,
			callIndex: 0,
			callType: 'CALL',
			reverted: false,
			fromAddress: from,
			toAddress: to,
			value: 1000n,
			inputSelector: '0x14bd0a7b',
			inputDataHash: Hash.sha256(input),
			outputDataHash: Hash.sha256(returnData),
			gasUsed: 21000n,
		}])
		expect(result.logs).toEqual([])
	})

	it('maps a code-3 eth_call revert to a failed simulation and preserves revert output hash', () => {
		const result = webEvmSimulationInput(callInput({
			kind: 'revert',
			data: revertData,
		}))

		expect(result.simulation).toMatchObject({
			status: 'failed',
			actionCount: 1,
			error: 'execution reverted',
		})
		expect(result.simulation.gasUsed).toBeUndefined()
		expect(result.simulation.resultPayloadHash).toMatch(/^0x[0-9a-fA-F]{64}$/)

		expect(result.calls).toMatchObject([{
			callPath: 'root',
			reverted: true,
			error: 'execution reverted',
			outputDataHash: Hash.sha256(revertData),
		}])
		expect(result.calls[0]).not.toHaveProperty('gasUsed')
		expect(result.logs).toEqual([])
	})

	it('maps a status-0x1 receipt to a succeeded simulation with receipt-derived logs', () => {
		const receipt: WebEvmReceipt = {
			status: '0x1',
			gasUsed: '0x5208',
			logs: [{
				address: contract,
				topics: [topic0, topic1],
				data: logData,
			}],
		}

		const result = webEvmSimulationInput(receiptInput(receipt))

		expect(result.simulation).toMatchObject({
			status: 'succeeded',
			actionCount: 1,
			gasUsed: 21000n,
		})
		expect(result.simulation.error).toBeUndefined()
		expect(result.simulation.resultPayloadHash).toMatch(/^0x[0-9a-fA-F]{64}$/)

		expect(result.calls).toMatchObject([{
			callPath: 'root',
			reverted: false,
			callType: 'CALL',
			gasUsed: 21000n,
		}])

		expect(result.logs).toEqual([{
			logIndex: 0,
			address: contract,
			topic0,
			topics: [topic0, topic1],
			dataHash: Hash.sha256(logData),
			removed: false,
		}])
		expect(result.logs[0]).not.toHaveProperty('callPath')
	})

	it('maps a status-0x0 receipt to a failed simulation with no output data hash', () => {
		const receipt: WebEvmReceipt = {
			status: '0x0',
			gasUsed: '0x5208',
			logs: [],
		}

		const result = webEvmSimulationInput(receiptInput(receipt))

		expect(result.simulation).toMatchObject({
			status: 'failed',
			actionCount: 1,
			gasUsed: 21000n,
			error: 'transaction reverted',
		})
		expect(result.simulation.resultPayloadHash).toMatch(/^0x[0-9a-fA-F]{64}$/)

		expect(result.calls).toMatchObject([{
			callPath: 'root',
			reverted: true,
			error: 'transaction reverted',
			gasUsed: 21000n,
		}])
		expect(result.calls[0]).not.toHaveProperty('outputDataHash')
	})

	it('keeps code-3 eth_call revert distinct from mined receipt status 0x0', () => {
		const callRevert = webEvmSimulationInput(callInput({
			kind: 'revert',
			data: revertData,
		}))
		const txRevert = webEvmSimulationInput(receiptInput({
			status: '0x0',
			gasUsed: '0x5208',
			logs: [],
		}))

		expect(callRevert.simulation.error).toBe('execution reverted')
		expect(txRevert.simulation.error).toBe('transaction reverted')
		expect(callRevert.calls[0]?.outputDataHash).toBe(Hash.sha256(revertData))
		expect(txRevert.calls[0]).not.toHaveProperty('outputDataHash')
	})

	it('sets callType to CREATE when request.to is null and omits toAddress', () => {
		const receipt: WebEvmReceipt = {
			status: '0x1',
			gasUsed: '0x5208',
			logs: [],
		}
		const result = webEvmSimulationInput(receiptInput(receipt, { from, to: null, value: 0n, input: '0x' }))

		expect(result.calls[0]).toMatchObject({
			callPath: 'root',
			callType: 'CREATE',
		})
		expect(result.calls[0]).not.toHaveProperty('toAddress')
		expect(result.calls[0]).toMatchObject({
			value: 0n,
			inputDataHash: Hash.sha256('0x'),
		})
	})

	it('uses transaction-local log indexes from the receipt array position', () => {
		const receipt: WebEvmReceipt = {
			status: '0x1',
			gasUsed: '0x5208',
			logs: [
				{ address: contract, topics: [topic0], data: logData },
				{ address: contract, topics: [topic0], data: '0x' },
			],
		}

		const result = webEvmSimulationInput(receiptInput(receipt))

		expect(result.logs.map((log) => log.logIndex)).toEqual([0, 1])
	})

	it('binds the fallback receipt result hash to address, topics, and data', () => {
		const first = webEvmSimulationInput(receiptInput({
			status: '0x1',
			gasUsed: '0x5208',
			logs: [{ address: contract, topics: [topic0], data: logData }],
		}))
		const second = webEvmSimulationInput(receiptInput({
			status: '0x1',
			gasUsed: '0x5208',
			logs: [{ address: contract, topics: [topic1], data: logData }],
		}))

		expect(first.simulation.resultPayloadHash).not.toBe(second.simulation.resultPayloadHash)
	})

	it('converts hex request value and receipt gasUsed to bigint', () => {
		const call = webEvmSimulationInput(callInput({
			kind: 'success',
			data: returnData,
			gasUsed: 21000n,
		}, { from, to, value: '0x3e8', input }))
		const receipt: WebEvmReceipt = {
			status: '0x1',
			gasUsed: '0x5208',
			logs: [],
		}
		const tx = webEvmSimulationInput(receiptInput(receipt))

		expect(call.calls[0]).toMatchObject({ value: 1000n })
		expect(tx.simulation.gasUsed).toBe(21000n)
		expect(tx.calls[0]).toMatchObject({ gasUsed: 21000n })
	})

	it('passes through forkBlockNumber and caller-supplied resultPayloadHash', () => {
		const result = webEvmSimulationInput(callInput({
			kind: 'success',
			data: returnData,
			gasUsed: 21000n,
		}))

		expect(result.simulation.forkBlockNumber).toBeUndefined()

		const providedHash = '0x2222222222222222222222222222222222222222222222222222222222222222'
		const withProvenance = webEvmSimulationInput({
			session,
			simulation: { ...baseSimulation, forkBlockNumber: 5n, resultPayloadHash: providedHash },
			request: { from, to, value: 1000n, input },
			kind: 'call',
			call: { kind: 'success', data: returnData, gasUsed: 21000n },
		})

		expect(withProvenance.simulation.forkBlockNumber).toBe(5n)
		expect(withProvenance.simulation.resultPayloadHash).toBe(providedHash)

		const revertedCall = webEvmSimulationInput({
			...callInput({ kind: 'revert', data: revertData }),
			simulation: { ...baseSimulation, resultPayloadHash: providedHash },
		})
		const revertedReceipt = webEvmSimulationInput({
			...receiptInput({ status: '0x0', gasUsed: '0x5208', logs: [] }),
			simulation: { ...baseSimulation, resultPayloadHash: providedHash },
		})
		expect(revertedCall.simulation.resultPayloadHash).toBe(providedHash)
		expect(revertedReceipt.simulation.resultPayloadHash).toBe(providedHash)
	})
})

describe('persistWebEvmSimulation', () => {
	it('writes the mapped input to writeLocalBlockheadSessionSimulation', async () => {
		const context = {
			entityCollections: {},
			entityFieldCollections: {},
			entityFieldCountCollections: {},
		} satisfies LocalMutationContext
		const input = callInput({
			kind: 'success',
			data: returnData,
			gasUsed: 21000n,
		})
		const expected = webEvmSimulationInput(input)

		await persistWebEvmSimulation(context, input)

		expect(writeLocalBlockheadSessionSimulation).toHaveBeenCalledTimes(1)
		expect(writeLocalBlockheadSessionSimulation).toHaveBeenCalledWith(
			context,
			expected.session,
			expected.simulation,
			expected.calls,
			expected.logs
		)
	})
})
