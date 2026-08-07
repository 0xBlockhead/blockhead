/**
 * LayerZero Scan public message reads — OpenAPI `/v1` surface.
 * @see https://docs.layerzero.network/v2/tools/layerzeroscan/api
 * @see https://scan.layerzero-api.com/v1/openapi
 */

import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/LayerZeroScan/bindings.ts'
import {
	layerZeroMessageStatusByName,
} from '$/sources/LayerZeroScan/Rest/constants.ts'
import type {
	LayerZeroDestinationTransaction,
	LayerZeroMessage,
	LayerZeroMessagesResponse,
	LayerZeroSourceTransaction,
} from '$/sources/LayerZeroScan/Rest/types.ts'
import {
	layerZeroMessagesResponseEnvelope,
} from '$/sources/LayerZeroScan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type LayerZeroMessageStatus = keyof typeof layerZeroMessageStatusByName

const guidPattern = /^0x[0-9a-fA-F]{64}$/
const integerStringPattern = /^(?:0|[1-9]\d*)$/
const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/
const binding = bindings[Source.LayerZeroScan_Rest][0]

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, entry]) => entry !== undefined)
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
		throw new Error(`LayerZeroScan_Rest: invalid ${label} response envelope`)
	}
	return value as _Value
}

const assertMessageStatus = (status: string | undefined) => {
	if (status == null || !(status in layerZeroMessageStatusByName))
		throw new Error(`LayerZeroScan_Rest: invalid message status ${status}`)
}

const assertEndpointId = (endpointId: number) => {
	if (!Number.isSafeInteger(endpointId) || endpointId < 1)
		throw new Error(`LayerZeroScan_Rest: invalid endpoint id ${endpointId}`)
}

const assertLimit = (limit: number) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error(`LayerZeroScan_Rest: invalid page limit ${limit}`)
}

const assertOpaquePathAtom = (value: string, name: string) => {
	if (value.length < 1 || value.length > 512 || value.includes('/') || value.includes('\\'))
		throw new Error(`LayerZeroScan_Rest: invalid ${name}`)
}

const assertTimestampSeconds = (value: number, name: string) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`LayerZeroScan_Rest: invalid ${name}`)
}

const assertIsoBound = (value: string, name: string) => {
	if (!isoDatePattern.test(value) || !Number.isFinite(Date.parse(value)))
		throw new Error(`LayerZeroScan_Rest: invalid ${name}`)
}

const assertSourceTransaction = (transaction: LayerZeroSourceTransaction) => {
	assertOpaquePathAtom(transaction.txHash, 'transaction hash')
	if (!integerStringPattern.test(transaction.blockNumber))
		throw new Error('LayerZeroScan_Rest: invalid block number')
	assertTimestampSeconds(transaction.blockTimestamp, 'block timestamp')
	if (transaction.readinessTimestamp != null)
		assertTimestampSeconds(transaction.readinessTimestamp, 'readiness timestamp')
	for (const value of [
		transaction.value,
		transaction.options?.lzReceive?.gas,
		transaction.options?.lzReceive?.value,
		...transaction.options?.nativeDrop?.flatMap(({ amount }) => [amount]) ?? [],
		...transaction.options?.compose?.flatMap(({ gas, value }) => [gas, value]) ?? [],
	])
		if (value != null && !integerStringPattern.test(value))
			throw new Error('LayerZeroScan_Rest: invalid lossless transaction unit')
}

const assertDestinationTransaction = (transaction: LayerZeroDestinationTransaction) => {
	assertOpaquePathAtom(transaction.txHash, 'transaction hash')
	if (!Number.isSafeInteger(transaction.blockNumber) || transaction.blockNumber < 0)
		throw new Error('LayerZeroScan_Rest: invalid destination block number')
	assertTimestampSeconds(transaction.blockTimestamp, 'block timestamp')
}

const assertMessage = (message: LayerZeroMessage) => {
	assertEndpointId(message.pathway.srcEid)
	assertEndpointId(message.pathway.dstEid)
	if (!Number.isSafeInteger(message.pathway.nonce) || message.pathway.nonce < 0)
		throw new Error('LayerZeroScan_Rest: unsafe message nonce')
	if (
		message.pathway.id !== [
			message.pathway.srcEid,
			message.pathway.dstEid,
			message.pathway.sender.address,
			message.pathway.receiver.address,
		].join('-')
	)
		throw new Error('LayerZeroScan_Rest: mismatched pathway identity')
	if (!guidPattern.test(message.guid))
		throw new Error('LayerZeroScan_Rest: invalid message GUID')
	if (
		!Number.isFinite(Date.parse(message.created))
		|| !Number.isFinite(Date.parse(message.updated))
	)
		throw new Error('LayerZeroScan_Rest: invalid lifecycle timestamp')
	if (Date.parse(message.updated) < Date.parse(message.created))
		throw new Error('LayerZeroScan_Rest: lifecycle timestamps are reversed')

	assertSourceTransaction(message.source.tx)
	if (message.destination?.tx != null)
		assertDestinationTransaction(message.destination.tx)
	assertMessageStatus(message.status.name)
}

const assertMessagesResponse = (
	response: unknown,
	limit?: number
) => {
	const page = assertEnvelope<LayerZeroMessagesResponse>(
		layerZeroMessagesResponseEnvelope,
		response,
		'messages'
	)
	if (limit != null && page.data.length > limit)
		throw new Error('LayerZeroScan_Rest: response exceeds requested limit')
	for (const message of page.data)
		assertMessage(message)
	return page
}

const messagesPath = (
	path: string,
	{
		limit,
		nextToken,
		start,
		end,
		ulnVersion,
		nonce,
		status,
		sourceEndpointIds,
		destinationEndpointIds,
		srcAddress,
	}: {
		limit?: number
		nextToken?: string
		start?: string
		end?: string
		ulnVersion?: string
		nonce?: number
		status?: LayerZeroMessageStatus
		sourceEndpointIds?: number[]
		destinationEndpointIds?: number[]
		srcAddress?: string
	} = {}
) => {
	if (limit != null)
		assertLimit(limit)
	if (nextToken != null)
		assertOpaquePathAtom(nextToken, 'next token')
	if (start != null)
		assertIsoBound(start, 'start bound')
	if (end != null)
		assertIsoBound(end, 'end bound')
	if (ulnVersion != null)
		assertOpaquePathAtom(ulnVersion, 'uln version')
	if (nonce != null && (!Number.isSafeInteger(nonce) || nonce < 0))
		throw new Error('LayerZeroScan_Rest: invalid pathway nonce')
	if (status != null)
		assertMessageStatus(status)
	if (srcAddress != null)
		assertOpaquePathAtom(srcAddress, 'source address')
	for (const endpointId of [
		...sourceEndpointIds ?? [],
		...destinationEndpointIds ?? [],
	])
		assertEndpointId(endpointId)

	const search = new URLSearchParams({
		...(limit != null && { limit: String(limit) }),
		...(nextToken != null && { nextToken }),
		...(start != null && { start }),
		...(end != null && { end }),
		...(ulnVersion != null && { ulnVersion }),
		...(nonce != null && { nonce: String(nonce) }),
		...(status != null && { status }),
		...(srcAddress != null && { srcAddress }),
		...(sourceEndpointIds?.length && { srcChainIds: sourceEndpointIds.join(',') }),
		...(destinationEndpointIds?.length && { dstChainIds: destinationEndpointIds.join(',') }),
	})

	return search.size === 0 ? path : `${path}?${search}`
}

export const getLatestMessages = async ({
	limit = 100,
	nextToken,
	start,
	end,
	ulnVersion,
	sourceEndpointIds,
	destinationEndpointIds,
	srcAddress,
}: {
	limit?: number
	nextToken?: string
	start?: string
	end?: string
	ulnVersion?: string
	sourceEndpointIds?: number[]
	destinationEndpointIds?: number[]
	srcAddress?: string
} = {}) => {
	const response = assertMessagesResponse(
		await getJson(
			binding,
			messagesPath('/v1/messages/latest', {
				limit,
				nextToken,
				start,
				end,
				ulnVersion,
				sourceEndpointIds,
				destinationEndpointIds,
				srcAddress,
			})
		),
		limit
	)
	for (const message of response.data) {
		if (sourceEndpointIds?.length && !sourceEndpointIds.includes(message.pathway.srcEid))
			throw new Error('LayerZeroScan_Rest: foreign source endpoint')
		if (
			destinationEndpointIds?.length
			&& !destinationEndpointIds.includes(message.pathway.dstEid)
		)
			throw new Error('LayerZeroScan_Rest: foreign destination endpoint')
		if (srcAddress != null && message.source.tx.from !== srcAddress && message.pathway.sender.address !== srcAddress)
			throw new Error('LayerZeroScan_Rest: foreign source address')
	}
	return response
}

export const getMessagesByTransaction = async ({
	transactionHash,
}: {
	transactionHash: string
}) => {
	assertOpaquePathAtom(transactionHash, 'transaction hash')
	const response = assertMessagesResponse(
		await getJson(
			binding,
			`/v1/messages/tx/${encodeURIComponent(transactionHash)}`
		)
	)
	if (
		response.data.some((message) => (
			message.source.tx.txHash !== transactionHash
			&& message.destination?.tx?.txHash !== transactionHash
		))
	)
		throw new Error('LayerZeroScan_Rest: foreign transaction message')
	return response
}

export const getMessageByGuid = async ({
	guid,
}: {
	guid: string
}) => {
	if (!guidPattern.test(guid))
		throw new Error('LayerZeroScan_Rest: invalid message GUID')
	const response = assertMessagesResponse(
		await getJson(binding, `/v1/messages/guid/${guid}`)
	)
	if (response.data.some((message) => message.guid.toLowerCase() !== guid.toLowerCase()))
		throw new Error('LayerZeroScan_Rest: foreign message GUID')
	return response
}

export const getMessagesByPathway = async ({
	pathwayId,
	limit = 100,
	nextToken,
	start,
	end,
	nonce,
	status,
}: {
	pathwayId: string
	limit?: number
	nextToken?: string
	start?: string
	end?: string
	nonce?: number
	status?: LayerZeroMessageStatus
}) => {
	assertOpaquePathAtom(pathwayId, 'pathway id')
	const response = assertMessagesResponse(
		await getJson(
			binding,
			messagesPath(`/v1/messages/pathway/${encodeURIComponent(pathwayId)}`, {
				limit,
				nextToken,
				start,
				end,
				nonce,
				status,
			})
		),
		limit
	)
	if (response.data.some((message) => message.pathway.id !== pathwayId))
		throw new Error('LayerZeroScan_Rest: foreign pathway message')
	if (nonce != null && response.data.some((message) => message.pathway.nonce !== nonce))
		throw new Error('LayerZeroScan_Rest: foreign pathway nonce')
	if (status != null && response.data.some((message) => message.status.name !== status))
		throw new Error('LayerZeroScan_Rest: foreign pathway status')
	return response
}

export const getMessagesByOApp = async ({
	endpointId,
	address,
	limit = 100,
	nextToken,
	start,
	end,
}: {
	endpointId: number
	address: string
	limit?: number
	nextToken?: string
	start?: string
	end?: string
}) => {
	assertEndpointId(endpointId)
	assertOpaquePathAtom(address, 'OApp address')
	const response = assertMessagesResponse(
		await getJson(
			binding,
			messagesPath(
				`/v1/messages/oapp/${endpointId}/${encodeURIComponent(address)}`,
				{
					limit,
					nextToken,
					start,
					end,
				}
			)
		),
		limit
	)
	if (
		response.data.some(({ pathway }) => !(
			(pathway.srcEid === endpointId && pathway.sender.address === address)
			|| (pathway.dstEid === endpointId && pathway.receiver.address === address)
		))
	)
		throw new Error('LayerZeroScan_Rest: foreign OApp message')
	return response
}

export const getMessagesByStatus = async ({
	status,
	limit = 100,
	nextToken,
	start,
	end,
}: {
	status: LayerZeroMessageStatus
	limit?: number
	nextToken?: string
	start?: string
	end?: string
}) => {
	assertMessageStatus(status)
	const response = assertMessagesResponse(
		await getJson(
			binding,
			messagesPath(`/v1/messages/status/${encodeURIComponent(status)}`, {
				limit,
				nextToken,
				start,
				end,
			})
		),
		limit
	)
	if (response.data.some((message) => message.status.name !== status))
		throw new Error('LayerZeroScan_Rest: foreign status message')
	return response
}

export const getMessagesByWallet = async ({
	srcAddress,
	limit = 100,
	nextToken,
	start,
	end,
}: {
	srcAddress: string
	limit?: number
	nextToken?: string
	start?: string
	end?: string
}) => {
	assertOpaquePathAtom(srcAddress, 'wallet address')
	const response = assertMessagesResponse(
		await getJson(
			binding,
			messagesPath(`/v1/messages/wallet/${encodeURIComponent(srcAddress)}`, {
				limit,
				nextToken,
				start,
				end,
			})
		),
		limit
	)
	if (
		response.data.some((message) => (
			message.source.tx.from !== srcAddress
			&& message.pathway.sender.address !== srcAddress
		))
	)
		throw new Error('LayerZeroScan_Rest: foreign wallet message')
	return response
}
