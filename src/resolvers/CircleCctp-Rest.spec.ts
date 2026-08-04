import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { components } from '$/sources/CircleCctp/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

const getMessages = vi.hoisted(() => vi.fn())
const getBurnUsdcFees = vi.hoisted(() => vi.fn())
const getFastBurnUsdcAllowance = vi.hoisted(() => vi.fn())

vi.mock('$/sources/CircleCctp/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/CircleCctp/Rest/queries.ts')>(),
	getMessages,
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

const messagesResponse = {
	messages: [message],
	sourceTxHash: transactionHash,
} satisfies components['schemas']['MessagesV2Response']

describe('CircleCctpIris_Rest resolvers', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		getMessages.mockReset()
		getBurnUsdcFees.mockReset()
		getFastBurnUsdcAllowance.mockReset()
	})

	it('registers Iris message, attestation, burn-fee, and allowance resolvers', () => {
		expect(circleCctpRest.source).toBe(Source.CircleCctpIris)
		expect(circleCctpRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.CctpMessage,
			EntityType.CctpAttestation_Timestamp,
			EntityType.CctpBurnFee_Timestamp,
			EntityType.CctpFastBurnAllowance_Timestamp,
		])
	})

	it('materializes schema-shaped CctpMessage fields from Iris V2 messages', async () => {
		getMessages.mockResolvedValue(messagesResponse)
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
			messageBytes: message.message,
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
	})

	it('resolves attestation observations and burn-fee / allowance timestamps', async () => {
		getMessages.mockResolvedValue(messagesResponse)
		getBurnUsdcFees.mockResolvedValue([
			{
				finalityThreshold: 1000,
				minimumFee: 1,
				forwardFee: {
					low: 90,
					medium: 110,
					high: 160,
				},
			},
		])
		getFastBurnUsdcAllowance.mockResolvedValue({
			allowance: 123999.999999,
			lastUpdated: '2025-01-23T10:00:00Z',
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
		if (attestationResolver == null || burnFeeResolver == null || allowanceResolver == null)
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
			attestation: message.attestation,
			forwardState: 'PENDING',
			forwardTxHash: forwardTransactionHash,
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
			feeRows: [{
				finalityThreshold: 1000,
				minimumFeeBps: 1,
				forwardFeeLow: 90n,
				forwardFeeMedium: 110n,
				forwardFeeHigh: 160n,
			}],
		})

		await expect(allowanceResolver.resolve.TimestampMsSource.resolve({
			timestampMs: 1_700_000_000_789,
			source: Source.CircleCctpIris,
		})).resolves.toEqual({
			timestampMs: 1_700_000_000_789,
			source: Source.CircleCctpIris,
			allowanceUsdc: 123999.999999,
			lastUpdatedMs: Date.parse('2025-01-23T10:00:00Z'),
		})
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
		await expect(allowanceResolver.resolve.TimestampMsSource.resolve({
			timestampMs: 1,
			source: 'Other',
		})).rejects.toThrow('unsupported fast burn allowance source')
	})
})
