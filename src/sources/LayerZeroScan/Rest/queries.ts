import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/LayerZeroScan/bindings.ts'
import type { paths } from '$/sources/LayerZeroScan/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

type LatestMessagesResponse = paths['/messages/latest']['get']['responses'][200]['content']['application/json']
type PathwayMessagesResponse = paths['/messages/pathway/{pathwayId}']['get']['responses'][200]['content']['application/json']
type TransactionMessagesResponse = paths['/messages/tx/{tx}']['get']['responses'][200]['content']['application/json']
type OAppMessagesResponse = paths['/messages/oapp/{eid}/{address}']['get']['responses'][200]['content']['application/json']
type GuidMessagesResponse = paths['/messages/guid/{guid}']['get']['responses'][200]['content']['application/json']
type LayerZeroMessage = LatestMessagesResponse['data'][number]
type LayerZeroSourceTransaction = NonNullable<NonNullable<LayerZeroMessage['source']>['tx']>
type LayerZeroDestinationTransaction = NonNullable<NonNullable<LayerZeroMessage['destination']>['tx']>

const guidPattern = /^0x[0-9a-fA-F]{64}$/
const integerStringPattern = /^(?:0|[1-9]\d*)$/
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

const paginatedPath = (
	path: string,
	{
		limit,
		nextToken,
	}: {
		limit: number
		nextToken?: string
	}
) => {
	assertLimit(limit)
	if (nextToken != null)
		assertOpaquePathAtom(nextToken, 'next token')
	return `${path}?${new URLSearchParams({
		limit: String(limit),
		...(nextToken != null && { nextToken }),
	})}`
}

export const getLatestMessages = async ({
	limit = 100,
	nextToken,
	sourceEndpointIds,
	destinationEndpointIds,
}: {
	limit?: number
	nextToken?: string
	sourceEndpointIds?: number[]
	destinationEndpointIds?: number[]
} = {}) => {
	for (const endpointId of [
		...sourceEndpointIds ?? [],
		...destinationEndpointIds ?? [],
	])
		assertEndpointId(endpointId)
	const path = paginatedPath('/v1/messages/latest', {
		limit,
		nextToken,
	})
	const response = await getJson<LatestMessagesResponse>(
		binding,
		`${path}${sourceEndpointIds?.length ? `&srcChainIds=${sourceEndpointIds.join(',')}` : ''}${destinationEndpointIds?.length ? `&dstChainIds=${destinationEndpointIds.join(',')}` : ''}`
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
}: {
	pathwayId: string
	limit?: number
	nextToken?: string
}) => {
	assertOpaquePathAtom(pathwayId, 'pathway id')
	const response = await getJson<PathwayMessagesResponse>(
		binding,
		paginatedPath(`/v1/messages/pathway/${encodeURIComponent(pathwayId)}`, {
			limit,
			nextToken,
		})
	)
	assertMessages(response.data, limit)
	if (response.data.some((message) => message.pathway.id !== pathwayId))
		throw new Error('LayerZeroScan_Rest: foreign pathway message')
	return response
}

export const getMessagesByOApp = async ({
	endpointId,
	address,
	limit = 100,
	nextToken,
}: {
	endpointId: number
	address: string
	limit?: number
	nextToken?: string
}) => {
	assertEndpointId(endpointId)
	assertOpaquePathAtom(address, 'OApp address')
	const response = await getJson<OAppMessagesResponse>(
		binding,
		paginatedPath(
			`/v1/messages/oapp/${endpointId}/${encodeURIComponent(address)}`,
			{
				limit,
				nextToken,
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
