import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Axelarscan/bindings.ts'
import {
	axelarscanGmpPageLimits,
	axelarscanGmpSimplifiedStatusBySimplifiedStatus,
	axelarscanGmpStatusByStatus,
} from '$/sources/Axelarscan/Rest/constants.ts'
import type {
	AxelarscanErrorEnvelope,
	AxelarscanEvent,
	AxelarscanGmpMessage,
	AxelarscanGmpResponse,
} from '$/sources/Axelarscan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const integerStringPattern = /^(?:0|[1-9]\d*)$/
const bytes32Pattern = /^0x[0-9a-fA-F]{64}$/

const assertOpaqueIdentity = (value: string, name: string) => {
	if (value.length < 1 || value.length > 1_024 || value.includes('/') || value.includes('\\'))
		throw new Error(`Axelarscan_Rest: invalid ${name}`)
}

const assertSafeNonnegativeInteger = (value: number, name: string) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Axelarscan_Rest: invalid ${name}`)
}

const assertEvent = (event: AxelarscanEvent) => {
	for (const [name, value] of Object.entries({
		chain: event.chain,
		'transaction hash': event.transactionHash,
		event: event.event,
	}))
		assertOpaqueIdentity(value, name)
	for (const [name, value] of Object.entries({
		'transaction index': event.transactionIndex,
		'log index': event.logIndex,
		'block number': event.blockNumber,
		'block timestamp': event.block_timestamp,
	}))
		assertSafeNonnegativeInteger(value, name)
	if (event.id !== `${event.transactionHash}_${event.transactionIndex}_${event.logIndex}`)
		throw new Error('Axelarscan_Rest: mismatched event identity')
	if (
		event.receipt != null
		&& (
			!integerStringPattern.test(event.receipt.gasUsed)
			|| !integerStringPattern.test(event.receipt.effectiveGasPrice)
		)
	)
		throw new Error('Axelarscan_Rest: invalid lossless receipt unit')
}

const sameIdentity = (left: string, right: string) => left.toLowerCase() === right.toLowerCase()

const assertMessage = (message: AxelarscanGmpMessage) => {
	assertEvent(message.call)
	for (const [name, value] of Object.entries({
		sender: message.call.returnValues.sender,
		'destination chain': message.call.returnValues.destinationChain,
		'destination address': message.call.returnValues.destinationContractAddress,
		payload: message.call.returnValues.payload,
	}))
		assertOpaqueIdentity(value, name)
	if (!bytes32Pattern.test(message.call.returnValues.payloadHash))
		throw new Error('Axelarscan_Rest: invalid payload hash')
	if (message.message_id !== `${message.call.transactionHash}-${message.call.logIndex}`)
		throw new Error('Axelarscan_Rest: mismatched message identity')
	if (message.command_id != null && !bytes32Pattern.test(message.command_id))
		throw new Error('Axelarscan_Rest: invalid command identity')
	if (axelarscanGmpStatusByStatus[message.status] == null)
		throw new Error(`Axelarscan_Rest: unknown message status ${message.status}`)
	if (axelarscanGmpSimplifiedStatusBySimplifiedStatus[message.simplified_status] == null)
		throw new Error(`Axelarscan_Rest: unknown simplified status ${message.simplified_status}`)

	if (message.gas_paid != null) {
		assertEvent(message.gas_paid)
		if (
			!integerStringPattern.test(message.gas_paid.returnValues.gasFeeAmount)
			|| !sameIdentity(message.gas_paid.chain, message.call.chain)
			|| !sameIdentity(message.gas_paid.returnValues.sourceAddress, message.call.returnValues.sender)
			|| !sameIdentity(
				message.gas_paid.returnValues.destinationChain,
				message.call.returnValues.destinationChain
			)
			|| !sameIdentity(
				message.gas_paid.returnValues.destinationAddress,
				message.call.returnValues.destinationContractAddress
			)
			|| !sameIdentity(
				message.gas_paid.returnValues.payloadHash,
				message.call.returnValues.payloadHash
			)
		)
			throw new Error('Axelarscan_Rest: mismatched gas payment')
	}

	if (message.confirm != null) {
		for (const [name, value] of Object.entries({
			'confirmation source chain': message.confirm.sourceChain,
			'confirmation source transaction': message.confirm.sourceTransactionHash,
			'confirmation transaction': message.confirm.transactionHash,
			'confirmation poll': message.confirm.poll_id,
			'confirmation transaction hash': message.confirm.confirmation_txhash,
		}))
			assertOpaqueIdentity(value, name)
		assertSafeNonnegativeInteger(message.confirm.blockNumber, 'confirmation block number')
		assertSafeNonnegativeInteger(message.confirm.block_timestamp, 'confirmation block timestamp')
		if (
			!sameIdentity(message.confirm.sourceChain, message.call.chain)
			|| !sameIdentity(message.confirm.sourceTransactionHash, message.call.transactionHash)
		)
			throw new Error('Axelarscan_Rest: mismatched confirmation')
	}

	if (message.approved != null) {
		assertEvent(message.approved)
		if (
			message.command_id == null
			|| !sameIdentity(message.approved.chain, message.call.returnValues.destinationChain)
			|| !sameIdentity(message.approved.returnValues.sourceChain, message.call.chain)
			|| !sameIdentity(message.approved.returnValues.sourceAddress, message.call.returnValues.sender)
			|| !sameIdentity(message.approved.returnValues.sourceTxHash, message.call.transactionHash)
			|| message.approved.returnValues.sourceEventIndex !== String(message.call.logIndex)
			|| !sameIdentity(
				message.approved.returnValues.contractAddress,
				message.call.returnValues.destinationContractAddress
			)
			|| !sameIdentity(
				message.approved.returnValues.payloadHash,
				message.call.returnValues.payloadHash
			)
			|| !sameIdentity(message.approved.returnValues.commandId, message.command_id)
		)
			throw new Error('Axelarscan_Rest: mismatched approval')
	}

	if (message.executed != null) {
		assertEvent(message.executed)
		if (
			!sameIdentity(message.executed.chain, message.call.returnValues.destinationChain)
			|| !sameIdentity(message.executed.sourceTransactionHash, message.call.transactionHash)
			|| message.executed.sourceTransactionIndex !== message.call.transactionIndex
			|| message.executed.sourceTransactionLogIndex !== message.call.logIndex
		)
			throw new Error('Axelarscan_Rest: mismatched destination execution')
	}

	if (
		message.simplified_status === 'received'
		&& message.executed == null
	)
		throw new Error('Axelarscan_Rest: received message has no destination execution')
	if (
		message.approved != null
		&& message.approved.block_timestamp < message.call.block_timestamp
		|| message.executed != null
		&& message.executed.block_timestamp < (message.approved?.block_timestamp ?? message.call.block_timestamp)
	)
		throw new Error('Axelarscan_Rest: reversed message lifecycle')
	for (const [name, value] of Object.entries(message.time_spent ?? {}))
		if (value != null)
			assertSafeNonnegativeInteger(value, `time spent ${name}`)
}

const assertPage = (size: number, from: number) => {
	if (!Number.isSafeInteger(size) || size < 1 || size > axelarscanGmpPageLimits.maxSize)
		throw new Error(`Axelarscan_Rest: invalid page size ${size}`)
	if (!Number.isSafeInteger(from) || from < 0 || from > axelarscanGmpPageLimits.maxFrom)
		throw new Error(`Axelarscan_Rest: invalid page offset ${from}`)
}

const assertGmpResponse = (
	response: AxelarscanGmpResponse | AxelarscanErrorEnvelope | null | undefined,
	size: number
) => {
	if (response == null)
		throw new Error('Axelarscan_Rest: searchGMP missing response')
	if ('error' in response && response.error)
		throw new Error(
			`Axelarscan_Rest: ${
				typeof response.message === 'string' && response.message.length > 0 ?
					response.message
				:
					'searchGMP failed'
			}`
		)
	if (!Array.isArray(response.data))
		throw new Error('Axelarscan_Rest: searchGMP missing data')
	assertSafeNonnegativeInteger(response.total, 'total')
	assertSafeNonnegativeInteger(response.time_spent, 'query time')
	if (response.data.length > size)
		throw new Error('Axelarscan_Rest: response exceeds requested size')
	for (const message of response.data)
		assertMessage(message)
	return response
}

/**
 * Axelarscan GMP list/detail via unique upstream `GET /gmp/searchGMP`.
 * Successful empty `data: []` is valid; missing/malformed envelopes throw.
 */
export const getGmpMessages = (query:
	| {
		destinationChain?: never
		from?: never
		size?: never
		sourceChain?: never
		transactionHash: string
	}
	| {
		destinationChain?: string
		from?: number
		size?: number
		sourceChain?: string
		transactionHash?: never
	}
) => {
	const from = query.from ?? 0
	const size = (
		query.transactionHash == null ?
			query.size ?? axelarscanGmpPageLimits.defaultSize
		:
			axelarscanGmpPageLimits.maxSize
	)
	if (query.transactionHash == null) {
		assertPage(size, from)
		if (query.sourceChain != null)
			assertOpaqueIdentity(query.sourceChain, 'source chain')
		if (query.destinationChain != null)
			assertOpaqueIdentity(query.destinationChain, 'destination chain')
	} else
		assertOpaqueIdentity(query.transactionHash, 'transaction hash')

	return getJson<AxelarscanGmpResponse | AxelarscanErrorEnvelope>(
		bindings[Source.Axelarscan_Rest][0],
		`/gmp/searchGMP?${new URLSearchParams(
			query.transactionHash == null ?
				{
					size: String(size),
					from: String(from),
					...(query.sourceChain != null && { sourceChain: query.sourceChain }),
					...(query.destinationChain != null && { destinationChain: query.destinationChain }),
				}
				:
				{
					txHash: query.transactionHash,
					size: String(size),
				}
		)}`
	).then((response) => {
		const page = assertGmpResponse(response, size)

		if (query.transactionHash != null) {
			if (
				page.data.some((message) => ![
					message.call.transactionHash,
					message.gas_paid?.transactionHash,
					message.approved?.transactionHash,
					message.executed?.transactionHash,
				].some((candidate) => candidate != null && sameIdentity(candidate, query.transactionHash)))
			)
				throw new Error('Axelarscan_Rest: foreign transaction message')
		} else
			for (const message of page.data)
				if (
					query.sourceChain != null
					&& !sameIdentity(message.call.chain, query.sourceChain)
					|| query.destinationChain != null
					&& !sameIdentity(message.call.returnValues.destinationChain, query.destinationChain)
				)
					throw new Error('Axelarscan_Rest: foreign chain message')
		return page
	})
}
