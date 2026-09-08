import { describe, expect, it } from 'vitest'

import {
	evmLocalSimulationInternalOperations,
	type EvmLocalSimulationCallTrace,
} from './evmLocalSimulationInternalOperations.ts'
import {
	erc20ApprovalTopic,
	erc20TransferTopic,
	evmLocalSimulationEffects,
} from './evmLocalSimulationEffects.ts'


const hash = (byte: string) => `0x${byte.repeat(64)}` as const
const address = (byte: string) => `0x${byte.repeat(20)}` as const
const topicAddress = (byte: string) => `0x${'00'.repeat(12)}${byte.repeat(20)}` as const
const amountWord = (value: bigint) => `0x${value.toString(16).padStart(64, '0')}` as const

const nestedTrace = {
	source: {
		kind: 'anvil-local-call-trace',
		version: '1.4.0',
	},
	chainId: 1,
	stateBlockNumber: 42n,
	requestInputDataHash: hash('1'),
	root: {
		callType: 'CALL',
		fromAddress: address('11'),
		toAddress: address('22'),
		value: 3n,
		inputDataHash: hash('2'),
		outputDataHash: hash('3'),
		gasUsed: 50_000n,
		outcome: { kind: 'returned' },
		calls: [{
			callType: 'STATICCALL',
			fromAddress: address('22'),
			toAddress: address('33'),
			inputDataHash: hash('4'),
			outputDataHash: hash('5'),
			gasUsed: 1_000n,
			outcome: { kind: 'returned' },
			calls: [],
		}, {
			callType: 'CALL',
			fromAddress: address('22'),
			toAddress: address('44'),
			value: 7n,
			inputDataHash: hash('6'),
			outputDataHash: hash('7'),
			gasUsed: 4_000n,
			outcome: { kind: 'returned' },
			calls: [{
				callType: 'DELEGATECALL',
				fromAddress: address('44'),
				toAddress: address('55'),
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

const rootRevertTrace = {
	...nestedTrace,
	root: {
		...nestedTrace.root,
		outcome: {
			kind: 'reverted',
			error: 'execution reverted',
		},
	},
} as const satisfies EvmLocalSimulationCallTrace

describe('local EVM simulation effects', () => {
	it('classifies nested revert without poisoning a returned ancestor', () => {
		const result = evmLocalSimulationEffects(evmLocalSimulationInternalOperations(nestedTrace))

		expect(result.operations.map((operation) => ({
			callPath: operation.callPath,
			stateCommitted: operation.stateCommitted,
			failure: operation.failure.kind,
		}))).toEqual([{
			callPath: '0',
			stateCommitted: true,
			failure: 'none',
		}, {
			callPath: '0.0',
			stateCommitted: true,
			failure: 'none',
		}, {
			callPath: '0.1',
			stateCommitted: true,
			failure: 'none',
		}, {
			callPath: '0.1.0',
			stateCommitted: false,
			failure: 'local-revert',
		}])
	})

	it('propagates ancestor revert so descendant frames are uncommitted', () => {
		const result = evmLocalSimulationEffects(evmLocalSimulationInternalOperations(rootRevertTrace))

		expect(result.operations.map((operation) => operation.failure.kind)).toEqual([
			'local-revert',
			'ancestor-revert',
			'ancestor-revert',
			'ancestor-revert',
		])
		expect(result.operations.every((operation) => operation.stateCommitted === false)).toBe(true)
		expect(result.effects.filter((effect) => effect.kind === 'native-value').every((effect) => effect.committed === false)).toBe(true)
	})

	it('emits committed native value only for CALL/CREATE families, not DELEGATECALL or STATICCALL', () => {
		const result = evmLocalSimulationEffects(evmLocalSimulationInternalOperations(nestedTrace))

		expect(result.effects.filter((effect) => effect.kind === 'native-value')).toEqual([{
			kind: 'native-value',
			callPath: '0',
			fromAddress: address('11'),
			toAddress: address('22'),
			value: 3n,
			committed: true,
		}, {
			kind: 'native-value',
			callPath: '0.1',
			fromAddress: address('22'),
			toAddress: address('44'),
			value: 7n,
			committed: true,
		}])
	})

	it('does not turn CALLCODE value context into a native balance transfer', () => {
		const result = evmLocalSimulationEffects(evmLocalSimulationInternalOperations({
			...nestedTrace,
			root: {
				...nestedTrace.root,
				calls: [{
					callType: 'CALL',
					fromAddress: address('22'),
					toAddress: address('33'),
					value: 5n,
					outcome: { kind: 'returned' },
					calls: [],
				}, {
					callType: 'CALLCODE',
					fromAddress: address('22'),
					toAddress: address('44'),
					value: 7n,
					outcome: { kind: 'returned' },
					calls: [],
				}],
			},
		}))

		expect(result.effects.filter((effect) => effect.kind === 'native-value')).toEqual([{
			kind: 'native-value',
			callPath: '0',
			fromAddress: address('11'),
			toAddress: address('22'),
			value: 3n,
			committed: true,
		}, {
			kind: 'native-value',
			callPath: '0.0',
			fromAddress: address('22'),
			toAddress: address('33'),
			value: 5n,
			committed: true,
		}])
	})

	it('decodes canonical ERC-20 Transfer and Approval without naming the token or filling decodedEventName', () => {
		const result = evmLocalSimulationEffects(
			evmLocalSimulationInternalOperations(nestedTrace),
			[{
				logIndex: 0,
				address: address('aa'),
				topics: [erc20TransferTopic, topicAddress('11'), topicAddress('22')],
				data: amountWord(99n),
			}, {
				logIndex: 1,
				address: address('aa'),
				topics: [erc20ApprovalTopic, topicAddress('11'), topicAddress('44')],
				data: amountWord(5n),
			}]
		)

		expect(result.effects.filter((effect) => effect.kind !== 'native-value')).toEqual([{
			kind: 'erc20-transfer',
			logIndex: 0,
			tokenAddress: address('aa'),
			fromAddress: address('11'),
			toAddress: address('22'),
			amount: 99n,
			committed: true,
		}, {
			kind: 'erc20-approval',
			logIndex: 1,
			tokenAddress: address('aa'),
			ownerAddress: address('11'),
			spenderAddress: address('44'),
			amount: 5n,
			committed: true,
		}])
	})

	it('leaves four-topic Transfer and malformed indexed words unclassified', () => {
		const result = evmLocalSimulationEffects(
			evmLocalSimulationInternalOperations(nestedTrace),
			[{
				logIndex: 0,
				address: address('aa'),
				topics: [erc20TransferTopic, topicAddress('11'), topicAddress('22'), amountWord(1n)],
				data: '0x',
			}, {
				logIndex: 1,
				address: address('aa'),
				topics: [
					erc20TransferTopic,
					`0x${'ff'.repeat(12)}${'11'.repeat(20)}`,
					topicAddress('22'),
				],
				data: amountWord(1n),
			}, {
				logIndex: 2,
				address: address('aa'),
				topics: [`0x${'ab'.repeat(32)}`],
				data: amountWord(1n),
			}]
		)

		expect(result.effects.filter((effect) => effect.kind !== 'native-value')).toEqual([])
	})

	it('marks token logs uncommitted when the root call reverted', () => {
		const result = evmLocalSimulationEffects(
			evmLocalSimulationInternalOperations(rootRevertTrace),
			[{
				logIndex: 0,
				address: address('aa'),
				topics: [erc20TransferTopic, topicAddress('11'), topicAddress('22')],
				data: amountWord(1n),
			}]
		)

		expect(result.effects.find((effect) => effect.kind === 'erc20-transfer')).toMatchObject({
			committed: false,
			amount: 1n,
		})
	})
})
