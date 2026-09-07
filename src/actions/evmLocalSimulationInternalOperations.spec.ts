import { describe, expect, it } from 'vitest'

import {
	evmLocalSimulationInternalOperations,
	type EvmLocalSimulationCallTrace,
} from './evmLocalSimulationInternalOperations.ts'


const hash = (byte: string) => `0x${byte.repeat(64)}` as const

const trace = {
	source: {
		kind: 'anvil-local-call-trace',
		version: '1.4.0',
	},
	chainId: 1,
	stateBlockNumber: 42n,
	requestInputDataHash: hash('1'),
	root: {
		callType: 'CALL',
		fromAddress: `0x${'11'.repeat(20)}`,
		toAddress: `0x${'22'.repeat(20)}`,
		value: 3n,
		inputDataHash: hash('2'),
		outputDataHash: hash('3'),
		gasUsed: 50_000n,
		outcome: { kind: 'returned' },
		calls: [{
			callType: 'STATICCALL',
			fromAddress: `0x${'22'.repeat(20)}`,
			toAddress: `0x${'33'.repeat(20)}`,
			inputDataHash: hash('4'),
			outputDataHash: hash('5'),
			gasUsed: 1_000n,
			outcome: { kind: 'returned' },
			calls: [],
		}, {
			callType: 'CALL',
			fromAddress: `0x${'22'.repeat(20)}`,
			toAddress: `0x${'44'.repeat(20)}`,
			value: 7n,
			inputDataHash: hash('6'),
			outputDataHash: hash('7'),
			gasUsed: 4_000n,
			outcome: { kind: 'returned' },
			calls: [{
				callType: 'DELEGATECALL',
				fromAddress: `0x${'44'.repeat(20)}`,
				toAddress: `0x${'55'.repeat(20)}`,
				inputDataHash: hash('8'),
				gasUsed: 2_000n,
				outcome: {
					kind: 'reverted',
					error: 'execution reverted: allowance',
				},
				calls: [],
			}],
		}],
	},
} as const satisfies EvmLocalSimulationCallTrace

describe('local EVM simulation internal operations', () => {
	it('retains every nested operation in deterministic trace order', () => {
		const result = evmLocalSimulationInternalOperations(trace)

		expect(result.operations.map((operation) => ({
			callPath: operation.callPath,
			parentCallPath: operation.parentCallPath,
			depth: operation.depth,
			callIndex: operation.callIndex,
			callType: operation.callType,
		}))).toEqual([{
			callPath: '0',
			parentCallPath: undefined,
			depth: 0,
			callIndex: 0,
			callType: 'CALL',
		}, {
			callPath: '0.0',
			parentCallPath: '0',
			depth: 1,
			callIndex: 0,
			callType: 'STATICCALL',
		}, {
			callPath: '0.1',
			parentCallPath: '0',
			depth: 1,
			callIndex: 1,
			callType: 'CALL',
		}, {
			callPath: '0.1.0',
			parentCallPath: '0.1',
			depth: 2,
			callIndex: 0,
			callType: 'DELEGATECALL',
		}])
	})

	it('preserves a nested revert without promoting it to root failure', () => {
		const result = evmLocalSimulationInternalOperations(trace)

		expect(result.operations.at(-1)?.outcome).toEqual({
			kind: 'reverted',
			error: 'execution reverted: allowance',
		})
		expect(result.operations[0]?.outcome).toEqual({ kind: 'returned' })
	})

	it('binds the ordered operations to the exact local source and state basis', () => {
		const result = evmLocalSimulationInternalOperations(trace)

		expect(result).toMatchObject({
			source: {
				kind: 'anvil-local-call-trace',
				version: '1.4.0',
			},
			chainId: 1,
			stateBlockNumber: 42n,
			requestInputDataHash: hash('1'),
		})
	})
})
