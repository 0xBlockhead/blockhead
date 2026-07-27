import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/CircleCctp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceEndpointKind } from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { getMessages } from '$/sources/CircleCctp/Rest/queries.ts'
import type {
	CircleCctpMessage,
	CircleCctpMessagesResponse,
} from '$/sources/CircleCctp/Rest/types.ts'

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	sourceFetch: vi.fn(),
}))

const placeholderBinding = bindings[Source.CircleCctp_IrisApi]

const binding = {
	...placeholderBinding,
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://iris-api.circle.test',
		origin: 'https://iris-api.circle.test',
		corsEnabled: false,
	}],
}
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
		minFinalityThreshold: 1_000,
		finalityThresholdExecuted: 2_000,
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
	requestId: 'iris-request-1',
} as const satisfies CircleCctpMessage

const result = {
	messages: [message],
	sourceTxHash: transactionHash,
} satisfies CircleCctpMessagesResponse

const respond = (
	responseResult: CircleCctpMessagesResponse = result
) => {
	vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(JSON.stringify(responseResult)))
}

beforeEach(() => {
	vi.clearAllMocks()
	vi.spyOn(Date, 'now').mockReturnValue(1_772_323_200_000)
})

describe('Circle CCTP Iris messages', () => {
	it('preserves exact burn, mint, domain, transaction, attestation, finality, lifecycle, and provenance facts', async () => {
		respond()

		await expect(getMessages({
			binding,
			sourceDomain: 0,
			expectedDestinationDomain: 5,
			subject: {
				transactionHash,
			},
		})).resolves.toMatchObject({
			source: Source.CircleCctp_IrisApi,
			sourceDomain: 0,
			destinationDomain: 5,
			sourceTxHash: transactionHash,
			resolvedAtMs: 1_772_323_200_000,
			lifecycleStatus: 'attested',
			messages: [{
				eventNonce: '9682',
				attestation: message.attestation,
				status: 'complete',
				forwardTxHash: forwardTransactionHash,
				decodedMessage: {
					sourceDomain: '0',
					destinationDomain: '5',
					nonce: '569',
					minFinalityThreshold: 1_000,
					finalityThresholdExecuted: 2_000,
					decodedMessageBody: {
						amount: '900719925474099312345',
						maxFee: '500000',
						feeExecuted: '400000',
						expirationBlock: '900719925474099312346',
					},
				},
			}],
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://iris-api.circle.test/v2/messages/0?transactionHash=${transactionHash}`
		)
	})

	it('supports the exact nonce lookup and not-observed lifecycle without inventing pagination', async () => {
		respond()

		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				nonce: '569',
			},
			maximumMessages: 1,
		})).resolves.toMatchObject({
			messages: [{
				decodedMessage: {
					nonce: '569',
				},
			}],
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://iris-api.circle.test/v2/messages/0?nonce=569'
		)

		vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(null, {
			status: 404,
		}))
		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).resolves.toMatchObject({
			messages: [],
			sourceTxHash: transactionHash,
			lifecycleStatus: 'not_observed',
		})

		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				nonce: '569',
			},
			maximumMessages: 1_001,
		})).rejects.toThrow('message bound must be an integer')
	})

	it('rejects placeholder bindings, foreign domains, transactions, and nonce identities', async () => {
		await expect(getMessages({
			binding: placeholderBinding,
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('endpoint is not configured')

		respond({
			...result,
			messages: [{
				...message,
				decodedMessage: {
					...message.decodedMessage,
					sourceDomain: '3',
				},
			}],
		})
		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('source domain does not match')

		respond({
			...result,
			sourceTxHash: forwardTransactionHash,
		})
		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('transaction does not match')

		respond()
		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				nonce: '570',
			},
		})).rejects.toThrow('nonce does not match')
	})

	it('rejects duplicate identities, malformed lifecycle/finality, and invalid lossless units', async () => {
		respond({
			...result,
			messages: [
				message,
				message,
			],
		})
		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('duplicate source-domain nonce')

		respond({
			...result,
			messages: [{
				...message,
				status: 'pending',
			}],
		})
		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('pending message unexpectedly has an attestation')

		respond({
			...result,
			messages: [{
				...message,
				decodedMessage: {
					...message.decodedMessage,
					finalityThresholdExecuted: 500,
				},
			}],
		})
		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('invalid executed finality')

		respond({
			...result,
			messages: [{
				...message,
				decodedMessage: {
					...message.decodedMessage,
					decodedMessageBody: {
						...message.decodedMessage.decodedMessageBody,
						amount: '1.5',
					},
				},
			}],
		})
		await expect(getMessages({
			binding,
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('invalid burn amount')
	})
})
