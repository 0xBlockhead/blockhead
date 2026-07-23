import { base58 } from '@scure/base'

import { throwHttpError } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	CircleCctpMessage,
	CircleCctpMessageSubject,
	CircleCctpMessagesResponse,
} from '$/sources/CircleCctp/Rest/types.ts'

const unsignedIntegerPattern = /^(0|[1-9][0-9]*)$/
const hexPattern = /^0x(?:[0-9a-fA-F]{2})+$/
const hex32Pattern = /^0x[0-9a-fA-F]{64}$/
const addressHexPattern = /^0x(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{64})$/

const assertDomain = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0 || value > 0xffff_ffff)
		throw new Error(`CircleCctp_IrisApi: invalid ${label}`)
}

const assertUnsignedInteger = (
	value: string,
	label: string
) => {
	if (!unsignedIntegerPattern.test(value))
		throw new Error(`CircleCctp_IrisApi: invalid ${label}`)
}

const assertTransactionHash = (
	value: string,
	label: string
) => {
	if (hex32Pattern.test(value))
		return

	try {
		if (base58.decode(value).length === 64)
			return
	} catch {
		// Continue to the domain error below.
	}

	throw new Error(`CircleCctp_IrisApi: invalid ${label}`)
}

const assertCrosschainAddress = (
	value: string,
	label: string
) => {
	if (addressHexPattern.test(value))
		return

	try {
		if (base58.decode(value).length === 32)
			return
	} catch {
		// Continue to the domain error below.
	}

	throw new Error(`CircleCctp_IrisApi: invalid ${label}`)
}

const assertMessage = (
	message: CircleCctpMessage,
	sourceDomain: number,
	expectedNonce?: string,
	expectedDestinationDomain?: number
) => {
	if (
		message.cctpVersion !== 2
		|| !hexPattern.test(message.message)
		|| !hexPattern.test(message.decodedMessage.messageBody)
	)
		throw new Error('CircleCctp_IrisApi: malformed CCTP V2 message')

	assertUnsignedInteger(message.eventNonce, 'event nonce')
	assertUnsignedInteger(message.decodedMessage.sourceDomain, 'decoded source domain')
	assertUnsignedInteger(message.decodedMessage.destinationDomain, 'decoded destination domain')
	assertUnsignedInteger(message.decodedMessage.nonce, 'decoded nonce')
	if (Number(message.decodedMessage.sourceDomain) !== sourceDomain)
		throw new Error('CircleCctp_IrisApi: decoded source domain does not match request')
	if (
		expectedDestinationDomain != null
		&& Number(message.decodedMessage.destinationDomain) !== expectedDestinationDomain
	)
		throw new Error('CircleCctp_IrisApi: decoded destination domain does not match request')
	if (
		expectedNonce != null
		&& message.decodedMessage.nonce !== expectedNonce
		&& message.eventNonce !== expectedNonce
	)
		throw new Error('CircleCctp_IrisApi: nonce does not match request')

	assertCrosschainAddress(message.decodedMessage.sender, 'sender')
	assertCrosschainAddress(message.decodedMessage.recipient, 'recipient')
	assertCrosschainAddress(message.decodedMessage.destinationCaller, 'destination caller')
	assertCrosschainAddress(message.decodedMessage.decodedMessageBody.burnToken, 'burn token')
	assertCrosschainAddress(message.decodedMessage.decodedMessageBody.mintRecipient, 'mint recipient')
	assertCrosschainAddress(message.decodedMessage.decodedMessageBody.messageSender, 'message sender')

	assertUnsignedInteger(message.decodedMessage.decodedMessageBody.amount, 'burn amount')
	for (const [label, value] of [
		['maximum fee', message.decodedMessage.decodedMessageBody.maxFee],
		['executed fee', message.decodedMessage.decodedMessageBody.feeExecuted],
		['expiration block', message.decodedMessage.decodedMessageBody.expirationBlock],
	] as const)
		if (value != null)
			assertUnsignedInteger(value, label)

	if (
		message.decodedMessage.decodedMessageBody.maxFee != null
		&& message.decodedMessage.decodedMessageBody.feeExecuted != null
		&& BigInt(message.decodedMessage.decodedMessageBody.feeExecuted) > BigInt(message.decodedMessage.decodedMessageBody.maxFee)
	)
		throw new Error('CircleCctp_IrisApi: executed fee exceeds maximum fee')
	if (
		message.decodedMessage.decodedMessageBody.hookData != null
		&& !hexPattern.test(message.decodedMessage.decodedMessageBody.hookData)
	)
		throw new Error('CircleCctp_IrisApi: invalid hook data')

	const minimumFinality = message.decodedMessage.minFinalityThreshold
	const executedFinality = message.decodedMessage.finalityThresholdExecuted
	if (
		minimumFinality != null
		&& minimumFinality !== 1_000
		&& minimumFinality !== 2_000
	)
		throw new Error('CircleCctp_IrisApi: invalid minimum finality threshold')
	if (
		executedFinality != null
		&& executedFinality !== 1_000
		&& executedFinality !== 2_000
	)
		throw new Error('CircleCctp_IrisApi: invalid executed finality threshold')
	if (
		minimumFinality != null
		&& executedFinality != null
		&& executedFinality < minimumFinality
	)
		throw new Error('CircleCctp_IrisApi: executed finality is below requested finality')

	if (
		message.status === 'complete'
		&& (message.attestation == null || !hexPattern.test(message.attestation))
	)
		throw new Error('CircleCctp_IrisApi: completed message is missing its attestation')
	if (
		message.status === 'pending'
		&& message.attestation != null
	)
		throw new Error('CircleCctp_IrisApi: pending message unexpectedly has an attestation')
	if (message.forwardTxHash != null)
		assertTransactionHash(message.forwardTxHash, 'forward transaction hash')
}

export const getMessages = async ({
	binding,
	sourceDomain,
	subject,
	expectedDestinationDomain,
	maximumMessages = 1_000,
}: {
	binding: SourceBinding
	sourceDomain: number
	subject: CircleCctpMessageSubject
	expectedDestinationDomain?: number
	maximumMessages?: number
}) => {
	if (
		binding.source !== Source.CircleCctp_IrisApi
		|| binding.target.kind !== SourceTargetKind.Global
		|| binding.target.key !== 'circle-cctp-iris-api'
	)
		throw new Error('CircleCctp_IrisApi: expected canonical Iris API binding')
	if (firstHttpUrlForBinding(binding).includes('{'))
		throw new Error('CircleCctp_IrisApi: executable Iris API endpoint is not configured')

	assertDomain(sourceDomain, 'source domain')
	if (expectedDestinationDomain != null)
		assertDomain(expectedDestinationDomain, 'destination domain')
	if (
		!Number.isSafeInteger(maximumMessages)
		|| maximumMessages < 1
		|| maximumMessages > 1_000
	)
		throw new Error('CircleCctp_IrisApi: message bound must be an integer from 1 through 1000')

	if ('transactionHash' in subject)
		assertTransactionHash(subject.transactionHash, 'source transaction hash')
	else
		assertUnsignedInteger(subject.nonce, 'nonce')

	const url = new URL(
		`/v2/messages/${String(sourceDomain)}`,
		firstHttpUrlForBinding(binding)
	)
	if ('transactionHash' in subject)
		url.searchParams.set('transactionHash', subject.transactionHash)
	else
		url.searchParams.set('nonce', subject.nonce)

	const response = await sourceFetch(binding, url.toString())
	const resolvedAtMs = Date.now()
	if (response.status === 404)
		return {
			messages: [],
			...('transactionHash' in subject && {
				sourceTxHash: subject.transactionHash,
			}),
			sourceDomain,
			...(expectedDestinationDomain != null && {
				destinationDomain: expectedDestinationDomain,
			}),
			source: binding.source,
			resolvedAtMs,
			lifecycleStatus: 'not_observed' as const,
		}
	if (!response.ok)
		await throwHttpError('CircleCctp_IrisApi get messages', response)

	const result = await response.json<CircleCctpMessagesResponse>()
	assertTransactionHash(result.sourceTxHash, 'response source transaction hash')
	if (
		'transactionHash' in subject
		&& result.sourceTxHash !== subject.transactionHash
	)
		throw new Error('CircleCctp_IrisApi: response transaction does not match request')
	if (result.messages.length > maximumMessages)
		throw new Error('CircleCctp_IrisApi: response exceeds the requested message bound')

	const messageIdentities = new Set<string>()
	for (const message of result.messages) {
		assertMessage(
			message,
			sourceDomain,
			'nonce' in subject ? subject.nonce : undefined,
			expectedDestinationDomain
		)
		const identity = `${message.decodedMessage.sourceDomain}:${message.decodedMessage.nonce}`
		if (messageIdentities.has(identity))
			throw new Error('CircleCctp_IrisApi: duplicate source-domain nonce identity')

		messageIdentities.add(identity)
	}

	return {
		...result,
		sourceDomain,
		...(expectedDestinationDomain != null && {
			destinationDomain: expectedDestinationDomain,
		}),
		source: binding.source,
		resolvedAtMs,
		lifecycleStatus: (
			result.messages.length === 0 ?
				'observed_unprocessed'
			: result.messages.every((message) => message.status === 'complete') ?
				'attested'
			:
				'pending_confirmations'
		),
	}
}
