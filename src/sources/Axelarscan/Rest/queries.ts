import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Axelarscan/bindings.ts'
import { Source } from '$/sources/Source.ts'
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
import {
	axelarscanErrorEnvelope,
	axelarscanGmpResponseEnvelope,
} from '$/sources/Axelarscan/Rest/types.ts'

const binding = bindings[Source.Axelarscan_Rest][0]

const integerStringPattern = /^(?:0|[1-9]\d*)$/
const bytes32Pattern = /^0x[0-9a-fA-F]{64}$/
const hexDataPattern = /^0x(?:[0-9a-fA-F]{2})*$/
const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, entry]: [string, unknown]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(omitUndefinedJson(value))
	} catch {
		throw new Error(`Axelarscan_Rest: invalid ${label} response envelope`)
	}
	return value as _Value
}

const assertOpaqueIdentity = (value: string, name: string) => {
	if (value.length < 1 || value.length > 1_024 || value.includes('/') || value.includes('\\'))
		throw new Error(`Axelarscan_Rest: invalid ${name}`)
}

const assertSafeNonnegativeInteger = (value: number, name: string) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Axelarscan_Rest: invalid ${name}`)
}

const sameIdentity = (left: string, right: string) => left.toLowerCase() === right.toLowerCase()

/** Axelarscan message ids key off `_logIndex` when present (explorer event index), else `logIndex`. */
export const axelarscanMessageLogIndex = (event: Pick<AxelarscanEvent, '_logIndex' | 'logIndex'>) => (
	event._logIndex ?? event.logIndex
)

const assertEvent = (event: AxelarscanEvent, role: string) => {
	for (const [name, value] of Object.entries({
		[`${role} chain`]: event.chain,
		[`${role} transaction hash`]: event.transactionHash,
		[`${role} event`]: event.event,
	}))
		assertOpaqueIdentity(value, name)
	assertSafeNonnegativeInteger(event.block_timestamp, `${role} block timestamp`)
	if (event.transactionIndex != null)
		assertSafeNonnegativeInteger(event.transactionIndex, `${role} transaction index`)
	if (event.logIndex != null)
		assertSafeNonnegativeInteger(event.logIndex, `${role} log index`)
	if (event._logIndex != null)
		assertSafeNonnegativeInteger(event._logIndex, `${role} message log index`)
	if (
		event.id != null
		&& event.transactionIndex != null
		&& event.logIndex != null
		&& event.id !== `${event.transactionHash}_${event.transactionIndex}_${event.logIndex}`
	)
		throw new Error(`Axelarscan_Rest: mismatched ${role} event identity`)
	if (
		event.receipt?.gasUsed != null
		&& !integerStringPattern.test(event.receipt.gasUsed)
		|| event.receipt?.effectiveGasPrice != null
		&& !integerStringPattern.test(event.receipt.effectiveGasPrice)
	)
		throw new Error(`Axelarscan_Rest: invalid lossless ${role} receipt unit`)
}

const assertMessage = (message: AxelarscanGmpMessage) => {
	const destinationExecution = message.executed ?? message.express_executed
	assertEvent(message.call, 'call')
	for (const [name, value] of Object.entries({
		sender: message.call.returnValues.sender,
		'destination chain': message.call.returnValues.destinationChain,
		'destination address': message.call.returnValues.destinationContractAddress,
	}))
		assertOpaqueIdentity(value, name)
	if (!bytes32Pattern.test(message.call.returnValues.payloadHash))
		throw new Error('Axelarscan_Rest: invalid payload hash')
	if (
		message.call.returnValues.payload != null
		&& !hexDataPattern.test(message.call.returnValues.payload)
	)
		throw new Error('Axelarscan_Rest: invalid payload')

	const messageLogIndex = axelarscanMessageLogIndex(message.call)
	if (messageLogIndex == null)
		throw new Error('Axelarscan_Rest: call missing message log index')
	if (message.message_id !== `${message.call.transactionHash}-${messageLogIndex}`)
		throw new Error('Axelarscan_Rest: mismatched message identity')
	if (message.command_id != null && !bytes32Pattern.test(message.command_id))
		throw new Error('Axelarscan_Rest: invalid command identity')
	if (axelarscanGmpStatusByStatus[message.status] == null)
		throw new Error(`Axelarscan_Rest: unknown message status ${message.status}`)
	if (axelarscanGmpSimplifiedStatusBySimplifiedStatus[message.simplified_status] == null)
		throw new Error(`Axelarscan_Rest: unknown simplified status ${message.simplified_status}`)

	if (message.gas_paid != null) {
		assertEvent(message.gas_paid, 'gas payment')
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
		assertEvent(message.approved, 'approval')
		const sourceEventIndex = String(message.approved.returnValues.sourceEventIndex)
		if (
			message.command_id == null
			|| !sameIdentity(message.approved.chain, message.call.returnValues.destinationChain)
			|| !sameIdentity(message.approved.returnValues.sourceChain, message.call.chain)
			|| !sameIdentity(message.approved.returnValues.sourceAddress, message.call.returnValues.sender)
			|| !sameIdentity(message.approved.returnValues.sourceTxHash, message.call.transactionHash)
			|| (
				message.call.logIndex != null
				&& sourceEventIndex !== String(message.call.logIndex)
				&& sourceEventIndex !== String(messageLogIndex)
			)
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

	for (const execution of [
		message.express_executed,
		message.executed,
	]) {
		if (execution == null)
			continue

		assertEvent(execution, 'execution')
		if (
			!sameIdentity(execution.chain, message.call.returnValues.destinationChain)
			|| !sameIdentity(execution.sourceTransactionHash, message.call.transactionHash)
		)
			throw new Error('Axelarscan_Rest: mismatched destination execution')
		if (
			execution.sourceTransactionIndex != null
			&& message.call.transactionIndex != null
			&& execution.sourceTransactionIndex !== message.call.transactionIndex
		)
			throw new Error('Axelarscan_Rest: mismatched destination execution')
		if (
			execution.sourceTransactionLogIndex != null
			&& message.call.logIndex != null
			&& execution.sourceTransactionLogIndex !== message.call.logIndex
			&& execution.sourceTransactionLogIndex !== messageLogIndex
		)
			throw new Error('Axelarscan_Rest: mismatched destination execution')
	}

	if (
		message.simplified_status === 'received'
		&& destinationExecution == null
	)
		throw new Error('Axelarscan_Rest: received message has no destination execution')
	if (
		message.approved != null
		&& message.approved.block_timestamp < message.call.block_timestamp
		|| destinationExecution != null
		&& destinationExecution.block_timestamp < (message.approved?.block_timestamp ?? message.call.block_timestamp)
	)
		throw new Error('Axelarscan_Rest: reversed message lifecycle')
	for (const [name, value] of Object.entries(message.time_spent ?? {}))
		if (value != null)
			assertSafeNonnegativeInteger(value, `time spent ${name}`)
	if (message.fees?.destination_native_token != null) {
		const {
			decimals,
			token_price: tokenPrice,
		} = message.fees.destination_native_token
		if (decimals != null)
			assertSafeNonnegativeInteger(decimals, 'destination native token decimals')
		if (
			tokenPrice != null
			&& (
				!Number.isFinite(tokenPrice.usd)
				|| tokenPrice.usd < 0
			)
		)
			throw new Error('Axelarscan_Rest: invalid destination native token price')
	}
	if (message.error != null) {
		const detail = message.error.error.message ?? message.error.error.reason
		if (detail != null)
			assertOpaqueIdentity(detail, 'execution error')
	}
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
	if ('error' in response) {
		assertEnvelope(axelarscanErrorEnvelope, response, 'searchGMP error')
		throw new Error(
			`Axelarscan_Rest: ${
				typeof response.message === 'string' && response.message.length > 0 ?
					response.message
				:
					'searchGMP failed'
			}`
		)
	}
	const page = assertEnvelope<AxelarscanGmpResponse>(
		axelarscanGmpResponseEnvelope,
		response,
		'searchGMP'
	)
	if (page.data.length > size)
		throw new Error('Axelarscan_Rest: response exceeds requested size')
	for (const message of page.data)
		assertMessage(message)
	return page
}

export type AxelarscanGmpSearchQuery =
	| {
		destinationChain?: never
		destinationContractAddress?: never
		from?: never
		messageId?: never
		senderAddress?: never
		size?: never
		sourceChain?: never
		transactionHash: string
	}
	| {
		destinationChain?: string
		destinationContractAddress?: string
		from?: number
		messageId?: string
		senderAddress?: string
		size?: number
		sourceChain?: string
		transactionHash?: never
	}

/**
 * Axelarscan GMP list/detail via unique upstream `GET /gmp/searchGMP`.
 * Successful empty `data: []` is valid; missing/malformed envelopes throw.
 * Account lists use `senderAddress` (alias of Axelarscan `sourceAddress` / `sender`).
 */
export const getGmpMessages = (query: AxelarscanGmpSearchQuery) => {
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
		if (query.senderAddress != null)
			assertOpaqueIdentity(query.senderAddress, 'sender address')
		if (query.destinationContractAddress != null)
			assertOpaqueIdentity(query.destinationContractAddress, 'destination contract address')
		if (query.messageId != null)
			assertOpaqueIdentity(query.messageId, 'message id')
	} else
		assertOpaqueIdentity(query.transactionHash, 'transaction hash')

	return getJson<AxelarscanGmpResponse | AxelarscanErrorEnvelope>(
		binding,
		`/gmp/searchGMP?${new URLSearchParams(
			query.transactionHash == null ?
				{
					size: String(size),
					from: String(from),
					...(query.sourceChain != null && { sourceChain: query.sourceChain }),
					...(query.destinationChain != null && { destinationChain: query.destinationChain }),
					...(query.senderAddress != null && { senderAddress: query.senderAddress }),
					...(query.destinationContractAddress != null && {
						destinationContractAddress: query.destinationContractAddress,
					}),
					...(query.messageId != null && { messageId: query.messageId }),
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
					message.express_executed?.transactionHash,
				].some((candidate) => candidate != null && sameIdentity(candidate, query.transactionHash)))
			)
				throw new Error('Axelarscan_Rest: foreign transaction message')
		} else {
			for (const message of page.data) {
				if (
					query.sourceChain != null
					&& !sameIdentity(message.call.chain, query.sourceChain)
					|| query.destinationChain != null
					&& !sameIdentity(message.call.returnValues.destinationChain, query.destinationChain)
				)
					throw new Error('Axelarscan_Rest: foreign chain message')
				if (
					query.senderAddress != null
					&& !sameIdentity(message.call.returnValues.sender, query.senderAddress)
				)
					throw new Error('Axelarscan_Rest: foreign sender message')
				if (
					query.destinationContractAddress != null
					&& !sameIdentity(
						message.call.returnValues.destinationContractAddress,
						query.destinationContractAddress
					)
				)
					throw new Error('Axelarscan_Rest: foreign destination contract message')
				if (
					query.messageId != null
					&& !sameIdentity(message.message_id, query.messageId)
				)
					throw new Error('Axelarscan_Rest: foreign message identity')
			}
		}
		return page
	})
}
