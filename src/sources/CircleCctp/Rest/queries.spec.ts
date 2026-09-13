import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getAttestation,
	getBurnUsdcFees,
	getFastBurnUsdcAllowance,
	getMessages,
	getPublicKeys,
} from '$/sources/CircleCctp/Rest/queries.ts'
import bindings from '$/sources/CircleCctp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://iris-api.circle.com',
	sourceFetch: vi.fn(),
}))

const binding = bindings[Source.CircleCctpIris][0]
const transactionHash = `0x${'11'.repeat(32)}`
const forwardTransactionHash = `0x${'22'.repeat(32)}`
const messageHash = `0x${'33'.repeat(32)}`
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
} as const

const result = {
	messages: [message],
	sourceTxHash: transactionHash,
} as const

const respond = (
	responseResult: unknown = result,
	{
		status = 200,
		requestId,
	}: {
		status?: number
		requestId?: string
	} = {}
) => {
	vi.mocked(sourceFetch).mockResolvedValueOnce(new Response(
		responseResult == null ? null : JSON.stringify(responseResult),
		{
			status,
			headers: {
				...(requestId != null && {
					'X-Request-Id': requestId,
				}),
			},
		}
	))
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('CircleCctpIris_Rest V2 messages', () => {
	it.each([
		['foreign pending nonce', ['570'], 'nonce does not match request'],
		['duplicate pending nonce', ['569', '569'], 'duplicate source-domain nonce'],
	] as const)('rejects %s before decoded payloads are available', async (_label, nonces, diagnostic) => {
		respond({
			sourceTxHash: transactionHash,
			messages: nonces.map(eventNonce => ({
				message: '0x',
				eventNonce,
				attestation: null,
				decodedMessage: null,
				cctpVersion: 2,
				status: 'pending_confirmations',
			})),
		})
		await expect(getMessages({ sourceDomain: 0, subject: { nonce: '569' } })).rejects.toThrow(diagnostic)
	})

	it('uses the canonical binding and preserves the official message response', async () => {
		respond(result, {
			requestId: '2adba88e-9d63-44bc-b975-9b6ae3440dde',
		})

		await expect(getMessages({
			sourceDomain: 0,
			expectedDestinationDomain: 5,
			subject: {
				transactionHash,
			},
		})).resolves.toEqual({
			body: result,
			requestId: '2adba88e-9d63-44bc-b975-9b6ae3440dde',
		})
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
			body: {
				messages: [{
					attestation: null,
					decodedMessage: null,
					status: 'pending_confirmations',
				}],
			},
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://iris-api.circle.com/v2/messages/0?nonce=569'
		)
	})

	it('represents a 404 as no response and enforces the local result bound', async () => {
		respond(null, {
			status: 404,
		})
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

	it('fail-closes malformed Iris message envelopes', async () => {
		respond({
			messages: 'nope',
			sourceTxHash: transactionHash,
		})
		await expect(getMessages({
			sourceDomain: 0,
			subject: {
				transactionHash,
			},
		})).rejects.toThrow('invalid messages response envelope')
	})
})

describe('CircleCctpIris_Rest burn fees, allowance, attestation, public keys', () => {
	it('hard-fails non-OK burn fee and allowance HTTP responses', async () => {
		respond(null, {
			status: 500,
		})
		await expect(getBurnUsdcFees({
			sourceDomain: 0,
			destinationDomain: 5,
			forward: true,
		})).rejects.toThrow('CircleCctpIris_Rest get burn USDC fees')

		respond(null, {
			status: 502,
		})
		await expect(getFastBurnUsdcAllowance()).rejects.toThrow('CircleCctpIris_Rest get fast burn USDC allowance')
	})

	it('preserves official burn fee and fast-burn allowance payloads', async () => {
		const feeRows = [
			{
				finalityThreshold: 1000,
				minimumFee: 1,
				forwardFee: {
					low: 90,
					medium: 110,
					high: 160,
				},
			},
			{
				finalityThreshold: 2000,
				minimumFee: 0,
			},
		]
		respond(feeRows)
		await expect(getBurnUsdcFees({
			sourceDomain: 0,
			destinationDomain: 5,
			forward: true,
			hyperCoreDeposit: true,
		})).resolves.toEqual({
			body: feeRows,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://iris-api.circle.com/v2/burn/USDC/fees/0/5?forward=true&hyperCoreDeposit=true'
		)

		const allowance = {
			allowance: 123999.999999,
			lastUpdated: '2025-01-23T10:00:00Z',
		}
		respond(allowance, {
			requestId: 'allowance-request',
		})
		await expect(getFastBurnUsdcAllowance()).resolves.toEqual({
			body: allowance,
			requestId: 'allowance-request',
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://iris-api.circle.com/v2/fastBurn/USDC/allowance'
		)
	})

	it('rejects hyperCoreDeposit without forward', async () => {
		await expect(getBurnUsdcFees({
			sourceDomain: 0,
			destinationDomain: 5,
			hyperCoreDeposit: true,
		})).rejects.toThrow('hyperCoreDeposit requires forward')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fail-closes malformed burn-fee and allowance envelopes', async () => {
		respond([
			{
				finalityThreshold: 'nope',
				minimumFee: 1,
			},
		])
		await expect(getBurnUsdcFees({
			sourceDomain: 0,
			destinationDomain: 5,
		})).rejects.toThrow('invalid burn USDC fees response envelope')

		respond({
			allowance: 'nope',
		})
		await expect(getFastBurnUsdcAllowance()).rejects.toThrow('invalid fast burn USDC allowance response envelope')
	})

	it('loads V1 attestation and V2 public keys through fail-closed envelopes', async () => {
		respond({
			attestation: `0x${'aa'.repeat(65)}`,
			status: 'complete',
		}, {
			requestId: 'attestation-request',
		})
		await expect(getAttestation({
			messageHash,
		})).resolves.toEqual({
			body: {
				attestation: `0x${'aa'.repeat(65)}`,
				status: 'complete',
			},
			requestId: 'attestation-request',
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			`https://iris-api.circle.com/v1/attestations/${messageHash}`
		)

		respond({
			attestation: null,
			status: 'pending_confirmations',
		}, {
			requestId: 'pending-request',
		})
		await expect(getAttestation({
			messageHash,
		})).resolves.toEqual({
			body: {
				attestation: null,
				status: 'pending_confirmations',
			},
			requestId: 'pending-request',
		})

		respond({
			publicKeys: [{
				publicKey: `0x${'04'}${'bb'.repeat(64)}`,
				cctpVersion: 2,
			}],
		})
		await expect(getPublicKeys()).resolves.toMatchObject({
			body: {
				publicKeys: [{
					cctpVersion: 2,
				}],
			},
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://iris-api.circle.com/v2/publicKeys'
		)
	})

	it('rejects invalid attestation message hashes before fetch', async () => {
		await expect(getAttestation({
			messageHash: '0xabc',
		})).rejects.toThrow('invalid message hash')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})
