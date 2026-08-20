import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Axelarscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { AxelarscanGmpMessage } from '$/sources/Axelarscan/Rest/types.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const { getGmpMessages } = await import('$/sources/Axelarscan/Rest/queries.ts')

const binding = bindings[Source.Axelarscan_Rest][0]

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

	it('returns bounded, filtered public messages with lossless units', async () => {
		const result = await getGmpMessages({
			size: 1,
			from: 7,
			sourceChain: 'moonbeam',
			destinationChain: 'base',
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'/gmp/searchGMP?size=1&from=7&sourceChain=moonbeam&destinationChain=base'
		)
		expect(result).toMatchObject({
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
	})

	it('filters account lists by senderAddress and rejects foreign senders', async () => {
		await getGmpMessages({
			size: 1,
			from: 0,
			senderAddress: sourceAddress,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/gmp/searchGMP?size=1&from=0&senderAddress=${encodeURIComponent(sourceAddress)}`
		)

		getJson.mockResolvedValueOnce(response())
		await expect(getGmpMessages({
			senderAddress: '0xForeign',
		})).rejects.toThrow('foreign sender message')
	})

	it('filters by messageId and destinationContractAddress', async () => {
		await getGmpMessages({
			size: 1,
			from: 0,
			messageId: `${sourceTransactionHash}-1`,
			destinationContractAddress: destinationAddress,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/gmp/searchGMP?size=1&from=0&destinationContractAddress=${encodeURIComponent(destinationAddress)}&messageId=${encodeURIComponent(`${sourceTransactionHash}-1`)}`
		)

		getJson.mockResolvedValueOnce(response())
		await expect(getGmpMessages({
			destinationContractAddress: '0xForeign',
		})).rejects.toThrow('foreign destination contract message')

		getJson.mockResolvedValueOnce(response())
		await expect(getGmpMessages({
			messageId: `${sourceTransactionHash}-99`,
		})).rejects.toThrow('foreign message identity')
	})

	it('fail-closes invalid destination native token fee prices', async () => {
		const value = structuredClone(message)
		value.fees = {
			base_fee_usd: 0.01,
			destination_native_token: {
				decimals: 18,
				token_price: {
					usd: -1,
				},
			},
		}
		getJson.mockResolvedValue(response([value]))
		await expect(getGmpMessages({
			size: 1,
		})).rejects.toThrow('invalid destination native token price')
	})

	it('accepts message ids keyed by _logIndex when logIndex differs', async () => {
		const liveStyle = structuredClone(message)
		liveStyle.call.logIndex = 519
		liveStyle.call._logIndex = 1
		liveStyle.call.id = `${sourceTransactionHash}_2_519`
		liveStyle.message_id = `${sourceTransactionHash}-1`
		liveStyle.approved.returnValues.sourceEventIndex = '519'
		liveStyle.executed.sourceTransactionLogIndex = 519
		getJson.mockResolvedValue(response([liveStyle]))

		await expect(getGmpMessages({
			size: 1,
		})).resolves.toMatchObject({
			data: [{
				message_id: `${sourceTransactionHash}-1`,
			}],
		})
	})

	it('accepts source-authoritative express executions and large hex payloads', async () => {
		const {
			executed,
			...expressMessageBase
		} = structuredClone(message)
		const expressMessage: AxelarscanGmpMessage = {
			...expressMessageBase,
			call: {
				...expressMessageBase.call,
				returnValues: {
					...expressMessageBase.call.returnValues,
					payload: `0x${'ab'.repeat(2_048)}`,
				},
			},
			express_executed: executed,
			status: 'express_executed',
		}
		getJson.mockResolvedValue(response([expressMessage]))

		await expect(getGmpMessages({
			size: 1,
		})).resolves.toMatchObject({
			data: [{
				express_executed: {
					transactionHash: executionTransactionHash,
				},
			}],
		})
	})

	it('fail-closes arktype envelopes for searchGMP pages', async () => {
		getJson.mockResolvedValueOnce({
			data: 'nope',
			total: 0,
			time_spent: 1,
		})
		await expect(getGmpMessages({
			size: 1,
		})).rejects.toThrow('invalid searchGMP response envelope')
	})

	it('omits explicitly undefined optional properties before envelope validation', async () => {
		getJson.mockResolvedValue({
			...response(),
			data: [{
				...message,
				call: {
					...message.call,
					returnValues: {
						...message.call.returnValues,
						symbol: undefined,
					},
				},
			}],
		})

		await expect(getGmpMessages({
			size: 1,
		})).resolves.toMatchObject({
			data: [{
				message_id: `${sourceTransactionHash}-1`,
			}],
		})
	})

	it('returns an empty list when searchGMP has zero messages', async () => {
		getJson.mockResolvedValue(response([]))

		await expect(getGmpMessages({
			size: 1,
		})).resolves.toEqual({
			data: [],
			total: 0,
			time_spent: 41,
		})

		getJson.mockResolvedValue(response([]))
		await expect(getGmpMessages({
			transactionHash: `0x${'9'.repeat(64)}`,
		})).resolves.toEqual({
			data: [],
			total: 0,
			time_spent: 41,
		})
	})

	it.each([
		['null response', null, 'searchGMP missing response'],
		['omitted data', { total: 0, time_spent: 1 }, 'invalid searchGMP response envelope'],
		['non-array data', { data: null, total: 0, time_spent: 1 }, 'invalid searchGMP response envelope'],
		[
			'upstream error envelope',
			{
				error: true,
				code: 400,
				message: '"size" (50) cannot be more than 25.',
				method: 'searchGMP',
			},
			'"size" (50) cannot be more than 25.',
		],
	])('hard-fails when the searchGMP envelope is %s', async (_name, body, message) => {
		getJson.mockResolvedValue(body)
		await expect(getGmpMessages({
			size: 1,
		})).rejects.toThrow(message)
	})

	it.each([
		['size', { size: 26 }],
		['offset', { from: -1 }],
	])('rejects an invalid page %s', (_name, options) => {
		expect(() => getGmpMessages({
			...options,
		})).toThrow('invalid page')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('rejects oversized and foreign filtered responses', async () => {
		getJson.mockResolvedValueOnce(response([message, message]))
		await expect(getGmpMessages({
			size: 1,
		})).rejects.toThrow('response exceeds requested size')

		getJson.mockResolvedValueOnce(response())
		await expect(getGmpMessages({
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
		['status', (value: AxelarscanGmpMessage) => {
			value.status = 'not-a-status'
		}],
		['simplified status', (value: AxelarscanGmpMessage) => {
			value.simplified_status = 'not-a-status'
		}],
	])('rejects mismatched or malformed %s', async (_name, mutate) => {
		const value = structuredClone(message)
		mutate(value)
		getJson.mockResolvedValue(response([value]))
		await expect(getGmpMessages({
		})).rejects.toThrow()
	})

	it('looks up only messages belonging to the requested transaction', async () => {
		await getGmpMessages({
			transactionHash: executionTransactionHash,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/gmp/searchGMP?txHash=${encodeURIComponent(executionTransactionHash)}&size=25`
		)

		getJson.mockResolvedValue(response())
		await expect(getGmpMessages({
			transactionHash: `0x${'9'.repeat(64)}`,
		})).rejects.toThrow('foreign transaction message')
	})
})
