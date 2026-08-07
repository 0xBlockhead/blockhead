import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/CircleCctp/bindings.ts'
import {
	circleCctpAttestationV1ResponseWire,
	circleCctpBurnFeesResponseWire,
	circleCctpFastBurnAllowanceResponseWire,
	circleCctpMessagesV2ResponseWire,
	circleCctpPublicKeysV2ResponseWire,
	circleCctpReattestationResponseWire,
	type CircleCctpAttestationV1Response,
	type CircleCctpBurnFeesResponse,
	type CircleCctpFastBurnAllowanceResponse,
	type CircleCctpIrisResult,
	type CircleCctpMessagesV2Response,
	type CircleCctpPublicKeysV2Response,
	type CircleCctpReattestationResponse,
} from '$/sources/CircleCctp/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.CircleCctpIris][0]

type CircleCctpMessageSubject =
	| {
		transactionHash: string
		nonce?: never
	}
	| {
		transactionHash?: never
		nonce: string
	}

const assertDomain = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`CircleCctpIris_Rest: invalid ${label}`)
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`CircleCctpIris_Rest: invalid ${label} response envelope`)
	}
}

const optionalRequestId = (
	response: Response
) => (
	response.headers.get('X-Request-Id')
	?? response.headers.get('x-request-id')
	?? undefined
)

const irisResult = <_Body>(
	body: _Body,
	response: Response
): CircleCctpIrisResult<_Body> => {
	const requestId = optionalRequestId(response)
	return {
		body,
		...(requestId != null && {
			requestId,
		}),
	}
}

export const getMessages = async ({
	sourceDomain,
	subject,
	expectedDestinationDomain,
	maximumMessages = 1_000,
}: {
	sourceDomain: number
	subject: CircleCctpMessageSubject
	expectedDestinationDomain?: number
	maximumMessages?: number
}): Promise<CircleCctpIrisResult<CircleCctpMessagesV2Response> | undefined> => {
	assertDomain(sourceDomain, 'source domain')
	if (expectedDestinationDomain != null)
		assertDomain(expectedDestinationDomain, 'destination domain')
	if (
		!Number.isSafeInteger(maximumMessages)
		|| maximumMessages < 1
		|| maximumMessages > 1_000
	)
		throw new Error('CircleCctpIris_Rest: message bound must be an integer from 1 through 1000')

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
		await throwHttpError('CircleCctpIris_Rest get messages', response)

	const result = assertEnvelope(
		'messages',
		circleCctpMessagesV2ResponseWire,
		await response.json()
	)
	if (
		'transactionHash' in subject
		&& result.sourceTxHash !== subject.transactionHash
	)
		throw new Error('CircleCctpIris_Rest: response transaction does not match request')
	if (result.messages.length > maximumMessages)
		throw new Error('CircleCctpIris_Rest: response exceeds the requested message bound')

	const messageIdentities = new Set<string>()
	for (const message of result.messages) {
		if (message.decodedMessage == null)
			continue

		if (
			message.decodedMessage.sourceDomain != null
			&& Number(message.decodedMessage.sourceDomain) !== sourceDomain
		)
			throw new Error('CircleCctpIris_Rest: decoded source domain does not match request')
		if (
			expectedDestinationDomain != null
			&& message.decodedMessage.destinationDomain != null
			&& Number(message.decodedMessage.destinationDomain) !== expectedDestinationDomain
		)
			throw new Error('CircleCctpIris_Rest: decoded destination domain does not match request')
		if (
			'nonce' in subject
			&& message.decodedMessage.nonce != null
			&& message.decodedMessage.nonce !== subject.nonce
			&& message.eventNonce !== subject.nonce
		)
			throw new Error('CircleCctpIris_Rest: nonce does not match request')
		if (
			message.decodedMessage.sourceDomain == null
			|| message.decodedMessage.nonce == null
		)
			continue

		const identity = `${message.decodedMessage.sourceDomain}:${message.decodedMessage.nonce}`
		if (messageIdentities.has(identity))
			throw new Error('CircleCctpIris_Rest: duplicate source-domain nonce identity')

		messageIdentities.add(identity)
	}

	return irisResult(result, response)
}

export const getAttestation = async ({
	messageHash,
}: {
	messageHash: string
}): Promise<CircleCctpIrisResult<CircleCctpAttestationV1Response>> => {
	if (!/^0x[0-9a-fA-F]{64}$/.test(messageHash))
		throw new Error(`CircleCctpIris_Rest: invalid message hash ${messageHash}`)

	const url = new URL(
		`/v1/attestations/${messageHash}`,
		firstHttpUrlForBinding(binding)
	)
	const response = await sourceFetch(binding, url.toString())
	if (!response.ok)
		await throwHttpError('CircleCctpIris_Rest get attestation', response)

	return irisResult(
		assertEnvelope(
			'attestation',
			circleCctpAttestationV1ResponseWire,
			await response.json()
		),
		response
	)
}

export const getPublicKeys = async (): Promise<CircleCctpIrisResult<CircleCctpPublicKeysV2Response>> => {
	const url = new URL(
		'/v2/publicKeys',
		firstHttpUrlForBinding(binding)
	)
	const response = await sourceFetch(binding, url.toString())
	if (!response.ok)
		await throwHttpError('CircleCctpIris_Rest get public keys', response)

	return irisResult(
		assertEnvelope(
			'public keys',
			circleCctpPublicKeysV2ResponseWire,
			await response.json()
		),
		response
	)
}

export const getBurnUsdcFees = async ({
	sourceDomain,
	destinationDomain,
	forward,
	hyperCoreDeposit,
}: {
	sourceDomain: number
	destinationDomain: number
	forward?: boolean
	hyperCoreDeposit?: boolean
}): Promise<CircleCctpIrisResult<CircleCctpBurnFeesResponse>> => {
	assertDomain(sourceDomain, 'source domain')
	assertDomain(destinationDomain, 'destination domain')
	if (hyperCoreDeposit === true && forward !== true)
		throw new Error('CircleCctpIris_Rest: hyperCoreDeposit requires forward')

	const url = new URL(
		`/v2/burn/USDC/fees/${String(sourceDomain)}/${String(destinationDomain)}`,
		firstHttpUrlForBinding(binding)
	)
	if (forward != null)
		url.searchParams.set('forward', String(forward))
	if (hyperCoreDeposit != null)
		url.searchParams.set('hyperCoreDeposit', String(hyperCoreDeposit))

	const response = await sourceFetch(binding, url.toString())
	if (!response.ok)
		await throwHttpError('CircleCctpIris_Rest get burn USDC fees', response)

	return irisResult(
		assertEnvelope(
			'burn USDC fees',
			circleCctpBurnFeesResponseWire,
			await response.json()
		),
		response
	)
}

export const getFastBurnUsdcAllowance = async (): Promise<CircleCctpIrisResult<CircleCctpFastBurnAllowanceResponse>> => {
	const url = new URL(
		'/v2/fastBurn/USDC/allowance',
		firstHttpUrlForBinding(binding)
	)
	const response = await sourceFetch(binding, url.toString())
	if (!response.ok)
		await throwHttpError('CircleCctpIris_Rest get fast burn USDC allowance', response)

	return irisResult(
		assertEnvelope(
			'fast burn USDC allowance',
			circleCctpFastBurnAllowanceResponseWire,
			await response.json()
		),
		response
	)
}

export const reattestMessage = async ({
	nonce,
}: {
	nonce: string
}): Promise<CircleCctpIrisResult<CircleCctpReattestationResponse>> => {
	if (nonce === '')
		throw new Error('CircleCctpIris_Rest: invalid nonce')

	const url = new URL(
		`/v2/reattest/${nonce}`,
		firstHttpUrlForBinding(binding)
	)
	const response = await sourceFetch(binding, url.toString(), {
		method: 'POST',
	})
	if (!response.ok)
		await throwHttpError('CircleCctpIris_Rest reattest message', response)

	return irisResult(
		assertEnvelope(
			'reattest',
			circleCctpReattestationResponseWire,
			await response.json()
		),
		response
	)
}
