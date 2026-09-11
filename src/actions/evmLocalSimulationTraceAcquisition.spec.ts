import { describe, expect, it } from 'vitest'

import {
	acquireEvmLocalSimulationCallTrace,
	type EvmLocalSimulationTraceCall,
} from './evmLocalSimulationTraceAcquisition.ts'


const from = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
const to = '0x0000000000000000000000000000000000000001'

const request = (
	rpc: EvmLocalSimulationTraceCall['rpc']
): EvmLocalSimulationTraceCall => ({
	rpc,
	chainId: 1,
	stateBlockNumber: 42n,
	from,
	to,
	input: '0x1234',
	value: 7n,
})

const traceFrame = {
	type: 'CALL',
	from,
	to,
	input: '0x1234',
	value: '0x7',
	gasUsed: '0x5208',
	output: '0x',
	calls: [{
		type: 'CALL',
		from: to,
		to: `0x${'11'.repeat(20)}`,
		input: '0x',
		value: '0x0',
		gasUsed: '0x1',
		error: 'execution reverted',
	}],
} as const

describe('Anvil local trace acquisition', () => {
	it('acquires and normalizes a callTracer tree with exact local binding', async () => {
		const result = await acquireEvmLocalSimulationCallTrace(request(async (method) => (
			method === 'web3_clientVersion' ? 'anvil/v1.0.0'
			: method === 'eth_chainId' ? '0x1'
			: traceFrame
		)))

		expect(result.kind).toBe('acquired')
		if (result.kind !== 'acquired') return
		expect(result.trace).toMatchObject({
			source: { kind: 'anvil-local-call-trace', version: 'anvil/v1.0.0' },
			chainId: 1,
			stateBlockNumber: 42n,
		})
		expect(result.operations.operations.map(({ callPath, depth, outcome }) => ({
			callPath,
			depth,
			outcome,
		}))).toEqual([
			{ callPath: '0', depth: 0, outcome: { kind: 'returned' } },
			{ callPath: '0.0', depth: 1, outcome: { kind: 'reverted', error: 'execution reverted' } },
		])
		expect(result.trace.requestInputDataHash).toMatch(/^0x[0-9a-f]{64}$/)
	})

	it('fails closed on a malformed trace result', async () => {
		const result = await acquireEvmLocalSimulationCallTrace(request(async (method) => (
			method === 'web3_clientVersion' ? 'anvil/v1.0.0'
			: method === 'eth_chainId' ? '0x1'
			: { malformed: true }
		)))

		expect(result).toMatchObject({ kind: 'failed' })
	})

	it('fails closed when the owned RPC seam rejects', async () => {
		const result = await acquireEvmLocalSimulationCallTrace(request(async (method) => {
			throw new Error(`Anvil ${method} failed: trace unavailable`)
		}))

		expect(result).toEqual({
			kind: 'failed',
			error: 'Anvil web3_clientVersion failed: trace unavailable',
		})
	})
})
