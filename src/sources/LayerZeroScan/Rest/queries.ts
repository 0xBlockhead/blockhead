/**
 * LayerZero Scan public message reads — OpenAPI `/v1` surface.
 * @see https://docs.layerzero.network/v2/tools/layerzeroscan/api
 * @see https://scan.layerzero-api.com/v1/openapi
 */

import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/LayerZeroScan/bindings.ts'
import type { paths } from '$/sources/LayerZeroScan/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

type LatestMessagesResponse = paths['/messages/latest']['get']['responses'][200]['content']['application/json']
type PathwayMessagesResponse = paths['/messages/pathway/{pathwayId}']['get']['responses'][200]['content']['application/json']
type TransactionMessagesResponse = paths['/messages/tx/{tx}']['get']['responses'][200]['content']['application/json']
type OAppMessagesResponse = paths['/messages/oapp/{eid}/{address}']['get']['responses'][200]['content']['application/json']
type GuidMessagesResponse = paths['/messages/guid/{guid}']['get']['responses'][200]['content']['application/json']
type StatusMessagesResponse = paths['/messages/status/{status}']['get']['responses'][200]['content']['application/json']
type WalletMessagesResponse = paths['/messages/wallet/{srcAddress}']['get']['responses'][200]['content']['application/json']
type LayerZeroMessage = LatestMessagesResponse['data'][number]
type LayerZeroSourceTransaction = NonNullable<NonNullable<LayerZeroMessage['source']>['tx']>
type LayerZeroDestinationTransaction = NonNullable<NonNullable<LayerZeroMessage['destination']>['tx']>
type LayerZeroMessageStatus = NonNullable<paths['/messages/status/{status}']['get']['parameters']['path']>['status']

const guidPattern = /^0x[0-9a-fA-F]{64}$/
const integerStringPattern = /^(?:0|[1-9]\d*)$/
const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/
const messageStatuses = [
	'INFLIGHT',
	'CONFIRMING',
	'FAILED',
	'DELIVERED',
	'BLOCKED',
	'PAYLOAD_STORED',
	'APPLICATION_BURNED',
	'APPLICATION_SKIPPED',
	'UNRESOLVABLE_COMMAND',
	'MALFORMED_COMMAND',
] as const satisfies readonly LayerZeroMessageStatus[]
const binding = bindings[Source.LayerZeroScan_Rest][0]

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
	if (transaction.txHash == null)
		throw new Error('LayerZeroScan_Rest: missing source transaction hash')

	assertOpaquePathAtom(transaction.txHash, 'transaction hash')
	if (transaction.blockNumber == null || !integerStringPattern.test(transaction.blockNumber))
		throw new Error('LayerZeroScan_Rest: invalid block number')
	if (transaction.blockTimestamp == null)
		throw new Error('LayerZeroScan_Rest: missing block timestamp')

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
	if (transaction.txHash == null)
		throw new Error('LayerZeroScan_Rest: missing destination transaction hash')

	assertOpaquePathAtom(transaction.txHash, 'transaction hash')
	if (transaction.blockNumber == null || !Number.isSafeInteger(transaction.blockNumber) || transaction.blockNumber < 0)
		throw new Error('LayerZeroScan_Rest: invalid destination block number')
	if (transaction.blockTimestamp == null)
		throw new Error('LayerZeroScan_Rest: missing destination block timestamp')

	assertTimestampSeconds(transaction.blockTimestamp, 'block timestamp')
}

const assertMessage = (message: LayerZeroMessage) => {
	if (
		message.pathway?.srcEid == null
		|| message.pathway.dstEid == null
		|| message.pathway.sender?.address == null
		|| message.pathway.receiver?.address == null
		|| message.pathway.id == null
		|| message.pathway.nonce == null
	)
		throw new Error('LayerZeroScan_Rest: incomplete pathway identity')

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
	if (message.guid == null || !guidPattern.test(message.guid))
		throw new Error('LayerZeroScan_Rest: invalid message GUID')
	if (
		!Number.isFinite(Date.parse(message.created))
		|| !Number.isFinite(Date.parse(message.updated))
	)
		throw new Error('LayerZeroScan_Rest: invalid lifecycle timestamp')
	if (Date.parse(message.updated) < Date.parse(message.created))
		throw new Error('LayerZeroScan_Rest: lifecycle timestamps are reversed')
	if (message.source?.tx == null)
		throw new Error('LayerZeroScan_Rest: missing source transaction')

	assertSourceTransaction(message.source.tx)
	if (message.destination?.tx != null)
		assertDestinationTransaction(message.destination.tx)
}

const assertMessages = (
	messages: LayerZeroMessage[],
	limit?: number
) => {
	if (limit != null && messages.length > limit)
		throw new Error('LayerZeroScan_Rest: response exceeds requested limit')
	for (const message of messages)
		assertMessage(message)
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
	if (status != null && !(messageStatuses as readonly string[]).includes(status))
		throw new Error(`LayerZeroScan_Rest: invalid message status ${status}`)
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
	const response = await getJson<LatestMessagesResponse>(
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
	)
	assertMessages(response.data, limit)
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
	const response = await getJson<TransactionMessagesResponse>(
		binding,
		`/v1/messages/tx/${encodeURIComponent(transactionHash)}`
	)
	assertMessages(response.data)
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
	const response = await getJson<GuidMessagesResponse>(binding, `/v1/messages/guid/${guid}`)
	assertMessages(response.data)
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
	const response = await getJson<PathwayMessagesResponse>(
		binding,
		messagesPath(`/v1/messages/pathway/${encodeURIComponent(pathwayId)}`, {
			limit,
			nextToken,
			start,
			end,
			nonce,
			status,
		})
	)
	assertMessages(response.data, limit)
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
	const response = await getJson<OAppMessagesResponse>(
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
	)
	assertMessages(response.data, limit)
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
	if (!(messageStatuses as readonly string[]).includes(status))
		throw new Error(`LayerZeroScan_Rest: invalid message status ${status}`)
	const response = await getJson<StatusMessagesResponse>(
		binding,
		messagesPath(`/v1/messages/status/${encodeURIComponent(status)}`, {
			limit,
			nextToken,
			start,
			end,
		})
	)
	assertMessages(response.data, limit)
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
	const response = await getJson<WalletMessagesResponse>(
		binding,
		messagesPath(`/v1/messages/wallet/${encodeURIComponent(srcAddress)}`, {
			limit,
			nextToken,
			start,
			end,
		})
	)
	assertMessages(response.data, limit)
	if (
		response.data.some((message) => (
			message.source.tx.from !== srcAddress
			&& message.pathway.sender.address !== srcAddress
		))
	)
		throw new Error('LayerZeroScan_Rest: foreign wallet message')
	return response
}
