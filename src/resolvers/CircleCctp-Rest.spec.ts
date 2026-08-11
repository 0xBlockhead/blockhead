import { keccak256, toHex } from '@tevm/voltaire/Hash'
import { toBytes } from '@tevm/voltaire/Hex'
import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import { Source } from '$/sources/Source.ts'

const getMessages = vi.hoisted(() => vi.fn())
const getAttestation = vi.hoisted(() => vi.fn())
const getBurnUsdcFees = vi.hoisted(() => vi.fn())
const getFastBurnUsdcAllowance = vi.hoisted(() => vi.fn())

vi.mock('$/sources/CircleCctp/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/CircleCctp/Rest/queries.ts')>(),
	getMessages,
	getAttestation,
	getBurnUsdcFees,
	getFastBurnUsdcAllowance,
}))

const { default: circleCctpRest } = await import('$/resolvers/CircleCctp-Rest.ts')

const transactionHash = `0x${'11'.repeat(32)}`
const forwardTransactionHash = `0x${'22'.repeat(32)}`
const address = (value: string) => `0x${value.repeat(20)}`
const messageId = {
	sourceDomain: 0,
	nonce: '569',
}
const messageBytes = `0x${'ab'.repeat(240)}`
const message = {
	message: messageBytes,
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

const messagesResponse = {
	messages: [message],
	sourceTxHash: transactionHash,
} as const

describe('CircleCctpIris_Rest resolvers', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		getMessages.mockReset()
		getAttestation.mockReset()
		getBurnUsdcFees.mockReset()
		getFastBurnUsdcAllowance.mockReset()
	})

	it('registers Iris message, attestation, burn-fee, and allowance resolvers', () => {
		expect(circleCctpRest.source).toBe(Source.CircleCctpIris)
		expect(circleCctpRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.CctpAllowance,
			EntityType.CctpMessage,
			EntityType.CctpAttestation_Timestamp,
			EntityType.CctpBurnFee_Timestamp,
			EntityType.CctpFastBurnAllowance_Timestamp,
		])
	})

	it('loads the Iris lifecycle resolver through the canonical registry', async () => {
		await expect(loadResolvers(new Set([
			Source.CircleCctpIris,
		]))).resolves.toEqual([
			circleCctpRest,
		])
	})

	it('materializes schema-shaped CctpMessage fields including keccak messageHash', async () => {
		getMessages.mockResolvedValue({
			body: messagesResponse,
			requestId: 'message-request',
		})
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
		const resolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpMessage
		))
		if (resolver == null)
			throw new Error('missing CctpMessage resolver')

		const snapshot = await resolver.resolve.SourceDomainNonce.resolve(messageId)

		expect(getMessages).toHaveBeenCalledWith({
			sourceDomain: 0,
			subject: {
				nonce: '569',
			},
		})
		expect(snapshot).toMatchObject({
			sourceDomain: 0,
			nonce: '569',
			cctpVersion: 2,
			messageHash: toHex(keccak256(toBytes(messageBytes))),
			messageBytes,
			sourceTransactionHash: transactionHash,
			destinationDomain: 5,
			sender: address('11'),
			recipient: address('22'),
			burnToken: address('44'),
			mintRecipient: address('55'),
			amount: 900719925474099312345n,
			maxFee: 500000n,
			feeExecuted: 400000n,
			expirationBlock: 900719925474099312346n,
			hookData: '0x0102',
			minFinalityThreshold: 1000,
			finalityThresholdExecuted: 2000,
			$sourceDomain: {
				[EntityMetaKey.Selector]: {
					cctpVersion: 2,
					domainId: 0,
				},
			},
			$destinationDomain: {
				[EntityMetaKey.Selector]: {
					cctpVersion: 2,
					domainId: 5,
				},
			},
		})
		expect(resolver.projections.$$attestationTimestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$message: messageId,
				timestampMs: 1_700_000_000_000,
				source: Source.CircleCctpIris,
			},
		}])
		expect(snapshot.attestationObservation.requestId).toBe('message-request')
	})

	it('resolves attestation observations and burn-fee / allowance timestamps', async () => {
		getMessages.mockResolvedValue({
			body: messagesResponse,
			requestId: 'message-request',
		})
		getAttestation.mockResolvedValue({
			body: {
				status: 'complete',
				attestation: `0x${'ef'.repeat(65)}`,
			},
			requestId: 'attestation-request',
		})
		getBurnUsdcFees.mockResolvedValue({
			body: [
				{
					finalityThreshold: 1000,
					minimumFee: 1,
					forwardFee: {
						low: 90,
						medium: 110,
						high: 160,
					},
				},
			],
		})
		getFastBurnUsdcAllowance.mockResolvedValue({
			body: {
				allowance: 123999.999999,
				lastUpdated: '2025-01-23T10:00:00Z',
			},
			requestId: 'allowance-request',
		})

		const attestationResolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpAttestation_Timestamp
		))
		const burnFeeResolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpBurnFee_Timestamp
		))
		const allowanceResolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpFastBurnAllowance_Timestamp
		))
		const allowanceParentResolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpAllowance
		))
		if (attestationResolver == null || burnFeeResolver == null || allowanceResolver == null || allowanceParentResolver == null)
			throw new Error('missing Circle CCTP timestamp resolvers')

		await expect(attestationResolver.resolve.MessageTimestampMsSource.resolve({
			$message: messageId,
			timestampMs: 1_700_000_000_123,
			source: Source.CircleCctpIris,
		})).resolves.toMatchObject({
			$message: {
				[EntityMetaKey.Selector]: messageId,
			},
			timestampMs: 1_700_000_000_123,
			source: Source.CircleCctpIris,
			status: 'complete',
			attestation: `0x${'ef'.repeat(65)}`,
			forwardState: 'PENDING',
			forwardTxHash: forwardTransactionHash,
			requestId: 'attestation-request',
		})
		expect(getAttestation).toHaveBeenCalledWith({
			messageHash: toHex(keccak256(toBytes(messageBytes))),
		})

		const sourceDomain = {
			cctpVersion: 2,
			domainId: 0,
		}
		const destinationDomain = {
			cctpVersion: 2,
			domainId: 5,
		}
		const burnFee = await burnFeeResolver.resolve.SourceDomainDestinationDomainTimestampMsSource.resolve({
			$sourceDomain: sourceDomain,
			$destinationDomain: destinationDomain,
			timestampMs: 1_700_000_000_456,
			source: Source.CircleCctpIris,
		})
		expect(getBurnUsdcFees).toHaveBeenCalledWith({
			sourceDomain: 0,
			destinationDomain: 5,
			forward: true,
			hyperCoreDeposit: false,
		})
		expect(burnFee).toEqual({
			$sourceDomain: {
				[EntityMetaKey.Selector]: sourceDomain,
			},
			$destinationDomain: {
				[EntityMetaKey.Selector]: destinationDomain,
			},
			timestampMs: 1_700_000_000_456,
			source: Source.CircleCctpIris,
			forward: true,
			hyperCoreDeposit: false,
			feeRows: [{
				finalityThreshold: 1000,
				minimumFeeBps: 1,
				forwardFeeLow: 90n,
				forwardFeeMedium: 110n,
				forwardFeeHigh: 160n,
			}],
		})

		await expect(allowanceParentResolver.resolve.Token.resolve({
			token: 'USDC',
		})).resolves.toEqual({
			token: 'USDC',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$allowance: {
						token: 'USDC',
					},
					timestampMs: Date.parse('2025-01-23T10:00:00Z'),
					source: Source.CircleCctpIris,
				},
				allowanceUsdc: 123999.999999,
				requestId: 'allowance-request',
			}],
		})

		await expect(allowanceResolver.resolve.AllowanceTimestampMsSource.resolve({
			$allowance: {
				token: 'USDC',
			},
			timestampMs: Date.parse('2025-01-23T10:00:00Z'),
			source: Source.CircleCctpIris,
		})).resolves.toEqual({
			$allowance: {
				[EntityMetaKey.Selector]: {
					token: 'USDC',
				},
			},
			timestampMs: Date.parse('2025-01-23T10:00:00Z'),
			source: Source.CircleCctpIris,
			allowanceUsdc: 123999.999999,
			requestId: 'allowance-request',
		})
	})

	it('does not retain stale message attestation fields while Iris is pending', async () => {
		getMessages.mockResolvedValue({
			body: messagesResponse,
			requestId: 'message-request',
		})
		getAttestation.mockResolvedValue({
			body: {
				status: 'pending_confirmations',
				attestation: null,
			},
		})
		const resolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpAttestation_Timestamp
		))
		if (resolver == null)
			throw new Error('missing CctpAttestation_Timestamp resolver')

		const observation = await resolver.resolve.MessageTimestampMsSource.resolve({
			$message: messageId,
			timestampMs: 1_700_000_000_123,
			source: Source.CircleCctpIris,
		})
		expect(observation).toMatchObject({
			status: 'pending_confirmations',
		})
		expect(observation).not.toHaveProperty('attestation')
		expect(observation).not.toHaveProperty('requestId')
	})

	it('rejects attestation lookup when the selected message has no hashable bytes', async () => {
		getMessages.mockResolvedValue({
			body: {
				...messagesResponse,
				messages: [{
					...message,
					message: undefined,
				}],
			},
		})
		const resolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpAttestation_Timestamp
		))
		if (resolver == null)
			throw new Error('missing CctpAttestation_Timestamp resolver')

		await expect(resolver.resolve.MessageTimestampMsSource.resolve({
			$message: messageId,
			timestampMs: 1_700_000_000_123,
			source: Source.CircleCctpIris,
		})).rejects.toThrow('message bytes required for attestation lookup')
		expect(getAttestation).not.toHaveBeenCalled()
	})

	it('hard-fails missing messages and non-Iris timestamp sources', async () => {
		getMessages.mockResolvedValue(undefined)
		const messageResolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpMessage
		))
		const allowanceResolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpFastBurnAllowance_Timestamp
		))
		if (messageResolver == null || allowanceResolver == null)
			throw new Error('missing Circle CCTP resolvers')

		await expect(messageResolver.resolve.SourceDomainNonce.resolve(messageId))
			.rejects.toThrow('message not found')
		await expect(allowanceResolver.resolve.AllowanceTimestampMsSource.resolve({
			$allowance: {
				token: 'USDC',
			},
			timestampMs: 1,
			source: 'Other',
		})).rejects.toThrow('unsupported fast burn allowance source')
	})

	it('rejects a status-only row that cannot prove the requested source-domain nonce', async () => {
		getMessages.mockResolvedValue({
			body: {
				...messagesResponse,
				messages: [{
					...message,
					eventNonce: messageId.nonce,
					decodedMessage: null,
				}],
			},
		})
		const resolver = circleCctpRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CctpMessage
		))
		if (resolver == null)
			throw new Error('missing CctpMessage resolver')

		await expect(resolver.resolve.SourceDomainNonce.resolve(messageId))
			.rejects.toThrow(`expected one decoded message for ${messageId.sourceDomain}:${messageId.nonce}`)
	})
})
