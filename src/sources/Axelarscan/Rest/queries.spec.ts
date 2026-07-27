import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import type { AxelarscanGmpMessage } from '$/sources/Axelarscan/Rest/types.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getGmpMessages,
	getGmpMessagesByTransaction,
} = await import('$/sources/Axelarscan/Rest/queries.ts')

const binding = {
	source: Source.Axelarscan_Rest,
	target: {
		kind: SourceTargetKind.Global,
		key: 'axelarscan-api',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://api.axelarscan.io',
		origin: 'https://api.axelarscan.io',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{ scope: SourceCredentialScope.None }],
} as const satisfies SourceBinding

const sourceTransactionHash = `0x${'1'.repeat(64)}`
const gasTransactionHash = `0x${'2'.repeat(64)}`
const approvalTransactionHash = `0x${'3'.repeat(64)}`
const executionTransactionHash = `0x${'4'.repeat(64)}`
const payloadHash = `0x${'5'.repeat(64)}`
const commandId = `0x${'6'.repeat(64)}`
const sourceAddress = '0xSource'
const destinationAddress = '0xDestination'

const event = (
	transactionHash: string,
	transactionIndex: number,
	logIndex: number,
	chain: string,
	blockTimestamp: number,
	eventName: string
) => ({
	chain,
	transactionHash,
	transactionIndex,
	logIndex,
	id: `${transactionHash}_${transactionIndex}_${logIndex}`,
	blockNumber: 9_007_199_254_740_991,
	block_timestamp: blockTimestamp,
	event: eventName,
	receipt: {
		gasUsed: '900719925474099312345',
		effectiveGasPrice: '123456789012345678901',
	},
})

const message = {
	call: {
		...event(sourceTransactionHash, 2, 1, 'moonbeam', 1_784_780_000, 'ContractCall'),
		returnValues: {
			sender: sourceAddress,
			destinationChain: 'base',
			destinationContractAddress: destinationAddress,
			payloadHash,
			payload: '0x1234',
		},
	},
	message_id: `${sourceTransactionHash}-1`,
	command_id: commandId,
	gas_paid: {
		...event(gasTransactionHash, 3, 2, 'moonbeam', 1_784_780_001, 'GasPaidForContractCall'),
		returnValues: {
			refundAddress: sourceAddress,
			sourceAddress,
			destinationAddress,
			gasFeeAmount: '900719925474099312345',
			payloadHash,
			destinationChain: 'base',
		},
	},
	confirm: {
		sourceChain: 'moonbeam',
		blockNumber: 9_007_199_254_740_991,
		block_timestamp: 1_784_780_002,
		sourceTransactionHash,
		transactionHash: 'COSMOS-TX',
		poll_id: '12345678901234567890',
		confirmation_txhash: 'COSMOS-CONFIRM',
	},
	approved: {
		...event(approvalTransactionHash, 4, 3, 'base', 1_784_780_003, 'ContractCallApproved'),
		returnValues: {
			sourceEventIndex: '1',
			sourceChain: 'moonbeam',
			sourceAddress,
			sourceTxHash: sourceTransactionHash,
			contractAddress: destinationAddress,
			payloadHash,
			commandId,
		},
	},
	executed: {
		...event(executionTransactionHash, 5, 4, 'base', 1_784_780_004, 'execute'),
		sourceTransactionHash,
		sourceTransactionIndex: 2,
		sourceTransactionLogIndex: 1,
		relayerAddress: '0xRelayer',
	},
	status: 'executed',
	simplified_status: 'received',
	time_spent: {
		call_confirm: 2,
		call_approved: 3,
		total: 4,
	},
} as const satisfies AxelarscanGmpMessage

const response = (data: AxelarscanGmpMessage[] = [message]) => ({
	data,
	total: data.length,
	time_spent: 41,
})

describe('Axelarscan GMP queries', () => {
	beforeEach(() => {
		getJson.mockReset()
		getJson.mockResolvedValue(response())
	})

	it('observes bounded, filtered public messages with lossless units and provenance', async () => {
		const observation = await getGmpMessages({
			binding,
			size: 1,
			from: 7,
			sourceChain: 'moonbeam',
			destinationChain: 'base',
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/gmp/searchGMP?size=1&from=7&sourceChain=moonbeam&destinationChain=base'
		)
		expect(observation).toMatchObject({
			observedBy: 'Axelarscan_Rest',
			data: [{
				message_id: `${sourceTransactionHash}-1`,
				command_id: commandId,
				gas_paid: {
					returnValues: {
						gasFeeAmount: '900719925474099312345',
					},
				},
			}],
		})
		expect(observation.resolvedAtMs).toBeTypeOf('number')
	})

	it.each([
		['size', { size: 101 }],
		['offset', { from: -1 }],
	])('rejects an invalid page %s', (_name, options) => {
		expect(() => getGmpMessages({
			binding,
			...options,
		})).toThrow('invalid page')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('rejects oversized and foreign filtered responses', async () => {
		getJson.mockResolvedValueOnce(response([message, message]))
		await expect(getGmpMessages({
			binding,
			size: 1,
		})).rejects.toThrow('response exceeds requested size')

		getJson.mockResolvedValueOnce(response())
		await expect(getGmpMessages({
			binding,
			sourceChain: 'ethereum',
		})).rejects.toThrow('foreign chain message')
	})

	it.each([
		['message identity', (value: AxelarscanGmpMessage) => {
			value.message_id = 'foreign-0'
		}],
		['event identity', (value: AxelarscanGmpMessage) => {
			value.call.id = 'foreign_0_0'
		}],
		['gas payment', (value: AxelarscanGmpMessage) => {
			value.gas_paid!.returnValues.payloadHash = `0x${'7'.repeat(64)}`
		}],
		['confirmation', (value: AxelarscanGmpMessage) => {
			value.confirm!.sourceTransactionHash = 'foreign'
		}],
		['approval', (value: AxelarscanGmpMessage) => {
			value.approved!.returnValues.commandId = `0x${'7'.repeat(64)}`
		}],
		['destination execution', (value: AxelarscanGmpMessage) => {
			value.executed!.sourceTransactionLogIndex = 9
		}],
		['lossless receipt unit', (value: AxelarscanGmpMessage) => {
			value.call.receipt!.gasUsed = '1.5'
		}],
		['lifecycle', (value: AxelarscanGmpMessage) => {
			value.executed!.block_timestamp = 1
		}],
	])('rejects mismatched or malformed %s', async (_name, mutate) => {
		const value = structuredClone(message)
		mutate(value)
		getJson.mockResolvedValue(response([value]))
		await expect(getGmpMessages({
			binding,
		})).rejects.toThrow()
	})

	it('looks up only messages belonging to the requested transaction', async () => {
		await getGmpMessagesByTransaction({
			binding,
			transactionHash: executionTransactionHash,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/gmp/searchGMP?txHash=${encodeURIComponent(executionTransactionHash)}&size=100`
		)

		await expect(getGmpMessagesByTransaction({
			binding,
			transactionHash: `0x${'9'.repeat(64)}`,
		})).rejects.toThrow('foreign transaction message')
	})

	it('does not expose the former arbitrary-path query', async () => {
		const module = await import('$/sources/Axelarscan/Rest/queries.ts')
		expect(module).not.toHaveProperty('query')
	})
})
