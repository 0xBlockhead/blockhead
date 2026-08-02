import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import type { components } from '$/sources/CircleCctp/OpenApi/openapi.d.ts'
import bindings from '$/sources/CircleCctp/bindings.ts'
import { getMessages } from '$/sources/CircleCctp/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://iris-api.circle.com',
	sourceFetch: vi.fn(),
}))

const binding = bindings[Source.CircleCctpIris][0]
const transactionHash = `0x${'11'.repeat(32)}`
const forwardTransactionHash = `0x${'22'.repeat(32)}`
const address = (value: string) => `0x${value.repeat(20)}`
const message = {
	message: `0x${'ab'.repeat(240)}`,
	eventNonce: '9682',
	attestation: `0x${'cd'.repeat(65)}`,
	decodedMessage: {
		sourceDomain: '0',
		destinationDomain: '5',
		nonce: '569',
		sender: address('11'),
		recipient: address('22'),
		destinationCaller: address('33'),
		minFinalityThreshold: '1000',
		finalityThresholdExecuted: '2000',
		messageBody: `0x${'ef'.repeat(200)}`,
		decodedMessageBody: {
			burnToken: address('44'),
			mintRecipient: address('55'),
			amount: '900719925474099312345',
			messageSender: address('66'),
			maxFee: '500000',
			feeExecuted: '400000',
			expirationBlock: '900719925474099312346',
			hookData: '0x0102',
		},
	},
	cctpVersion: 2,
	status: 'complete',
	forwardState: 'PENDING',
	forwardTxHash: forwardTransactionHash,
} as const satisfies components['schemas']['MessageV2']

const result = {
	messages: [message],
	sourceTxHash: transactionHash,
} satisfies components['schemas']['MessagesV2Response']

const respond = (
	responseResult: components['schemas']['MessagesV2Response'] = result
) => {
	vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify(responseResult)))
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('Circle CCTP Iris V2 messages', () => {
	it('uses the canonical binding and preserves the official message response', async () => {
		respond()

		await expect(getMessages({
			sourceDomain: 0,
			expectedDestinationDomain: 5,
			subject: {
				transactionHash,
			},
		})).resolves.toEqual(result)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://iris-api.circle.com/v2/messages/0?transactionHash=${transactionHash}`
		)
	})

	it('preserves pending and undecoded responses allowed by the official schema', async () => {
		respond({
			messages: [{
				message: '0x',
				eventNonce: '569',
				attestation: null,
				decodedMessage: null,
				cctpVersion: 2,
				status: 'pending_confirmations',
			}],
			sourceTxHash: transactionHash,
		})

		await expect(getMessages({
			sourceDomain: 0,
			subject: {
				nonce: '569',
			},
		})).resolves.toMatchObject({
			messages: [{
				attestation: null,
				decodedMessage: null,
				status: 'pending_confirmations',
			}],
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://iris-api.circle.com/v2/messages/0?nonce=569'
		)
	})

	it('represents a 404 as no response and enforces the local result bound', async () => {
		vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(null, {
			status: 404,
		}))
		await expect(getMessages({
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).resolves.toBeUndefined()

		await expect(getMessages({
			sourceDomain: 0,
			subject: {
				nonce: '569',
			},
			maximumMessages: 1_001,
		})).rejects.toThrow('message bound must be an integer')
		expect(sourceFetch).toHaveBeenCalledOnce()
	})

	it('rejects response identities that contradict the request', async () => {
		respond({
			...result,
			sourceTxHash: forwardTransactionHash,
		})
		await expect(getMessages({
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('transaction does not match')

		respond({
			...result,
			messages: [
				message,
				message,
			],
		})
		await expect(getMessages({
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('duplicate source-domain nonce')
	})
})
