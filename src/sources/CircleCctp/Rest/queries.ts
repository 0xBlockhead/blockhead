import { throwHttpError } from '$/lib/http.ts'
import type { operations } from '$/sources/CircleCctp/OpenApi/openapi.d.ts'
import bindings from '$/sources/CircleCctp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.CircleCctpIris]

type GetMessagesV2 = operations['getMessagesV2']
type GetMessagesV2Query = NonNullable<GetMessagesV2['parameters']['query']>
type GetMessagesV2Response = GetMessagesV2['responses'][200]['content']['application/json']
type CircleCctpMessageSubject =
	| {
		transactionHash: NonNullable<GetMessagesV2Query['transactionHash']>
		nonce?: never
	}
	| {
		transactionHash?: never
		nonce: NonNullable<GetMessagesV2Query['nonce']>
	}

const assertDomain = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Circle CCTP Iris: invalid ${label}`)
}

export const getMessages = async ({
	sourceDomain,
	subject,
	expectedDestinationDomain,
	maximumMessages = 1_000,
}: {
	sourceDomain: GetMessagesV2['parameters']['path']['sourceDomainId']
	subject: CircleCctpMessageSubject
	expectedDestinationDomain?: GetMessagesV2['parameters']['path']['sourceDomainId']
	maximumMessages?: number
}) => {
	assertDomain(sourceDomain, 'source domain')
	if (expectedDestinationDomain != null)
		assertDomain(expectedDestinationDomain, 'destination domain')
	if (
		!Number.isSafeInteger(maximumMessages)
		|| maximumMessages < 1
		|| maximumMessages > 1_000
	)
		throw new Error('Circle CCTP Iris: message bound must be an integer from 1 through 1000')

	const url = new URL(
		`/v2/messages/${String(sourceDomain)}`,
		firstHttpUrlForBinding(binding)
	)
	if ('transactionHash' in subject)
		url.searchParams.set('transactionHash', subject.transactionHash)
	else
		url.searchParams.set('nonce', subject.nonce)

	const response = await sourceFetch(binding, url.toString())
	if (response.status === 404)
		return undefined

	if (!response.ok)
		await throwHttpError('Circle CCTP Iris get messages', response)

	const result = await response.json<GetMessagesV2Response>()
	if (
		'transactionHash' in subject
		&& result.sourceTxHash !== subject.transactionHash
	)
		throw new Error('Circle CCTP Iris: response transaction does not match request')
	if (result.messages.length > maximumMessages)
		throw new Error('Circle CCTP Iris: response exceeds the requested message bound')

	const messageIdentities = new Set<string>()
	for (const message of result.messages) {
		if (message.decodedMessage == null)
			continue

		if (
			message.decodedMessage.sourceDomain != null
			&& Number(message.decodedMessage.sourceDomain) !== sourceDomain
		)
			throw new Error('Circle CCTP Iris: decoded source domain does not match request')
		if (
			expectedDestinationDomain != null
			&& message.decodedMessage.destinationDomain != null
			&& Number(message.decodedMessage.destinationDomain) !== expectedDestinationDomain
		)
			throw new Error('Circle CCTP Iris: decoded destination domain does not match request')
		if (
			'nonce' in subject
			&& message.decodedMessage.nonce != null
			&& message.decodedMessage.nonce !== subject.nonce
			&& message.eventNonce !== subject.nonce
		)
			throw new Error('Circle CCTP Iris: nonce does not match request')
		if (
			message.decodedMessage.sourceDomain == null
			|| message.decodedMessage.nonce == null
		)
			continue

		const identity = `${message.decodedMessage.sourceDomain}:${message.decodedMessage.nonce}`
		if (messageIdentities.has(identity))
			throw new Error('Circle CCTP Iris: duplicate source-domain nonce identity')

		messageIdentities.add(identity)
	}

	return result
}
