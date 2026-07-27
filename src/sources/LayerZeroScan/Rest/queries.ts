import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	LayerZeroMessage,
	LayerZeroMessagesResponse,
	LayerZeroScanObservation,
} from '$/sources/LayerZeroScan/Rest/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

const guidPattern = /^0x[0-9a-fA-F]{64}$/
const integerStringPattern = /^(?:0|[1-9]\d*)$/

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

const assertTransaction = (transaction: LayerZeroMessage['source']['tx']) => {
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
	if (!Number.isFinite(Date.parse(message.created)) || !Number.isFinite(Date.parse(message.updated)))
		throw new Error('LayerZeroScan_Rest: invalid lifecycle timestamp')
	if (Date.parse(message.updated) < Date.parse(message.created))
		throw new Error('LayerZeroScan_Rest: lifecycle timestamps are reversed')
	assertTransaction(message.source.tx)
	if (message.destination?.tx != null)
		assertTransaction(message.destination.tx)
}

const observe = async (
	binding: SourceBinding,
	path: string,
	limit?: number
): Promise<LayerZeroScanObservation> => {
	const response = await getJson<LayerZeroMessagesResponse>(binding, path)
	if (limit != null && response.data.length > limit)
		throw new Error('LayerZeroScan_Rest: response exceeds requested limit')
	for (const message of response.data)
		assertMessage(message)
	return {
		...response,
		observedBy: 'LayerZeroScan_Rest',
		resolvedAtMs: Date.now(),
	}
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
	binding,
	limit = 100,
	nextToken,
	sourceEndpointIds,
	destinationEndpointIds,
}: {
	binding: SourceBinding
	limit?: number
	nextToken?: string
	sourceEndpointIds?: number[]
	destinationEndpointIds?: number[]
}) => {
	for (const endpointId of [
		...sourceEndpointIds ?? [],
		...destinationEndpointIds ?? [],
	])
		assertEndpointId(endpointId)
	const path = paginatedPath('/v1/messages/latest', {
		limit,
		nextToken,
	})
	const response = await observe(
		binding,
		`${path}${sourceEndpointIds?.length ? `&srcChainIds=${sourceEndpointIds.join(',')}` : ''}${destinationEndpointIds?.length ? `&dstChainIds=${destinationEndpointIds.join(',')}` : ''}`,
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
	}
	return response
}

export const getMessagesByTransaction = async ({
	binding,
	transactionHash,
}: {
	binding: SourceBinding
	transactionHash: string
}) => {
	assertOpaquePathAtom(transactionHash, 'transaction hash')
	const response = await observe(
		binding,
		`/v1/messages/tx/${encodeURIComponent(transactionHash)}`
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
	binding,
	guid,
}: {
	binding: SourceBinding
	guid: string
}) => {
	if (!guidPattern.test(guid))
		throw new Error('LayerZeroScan_Rest: invalid message GUID')
	const response = await observe(binding, `/v1/messages/guid/${guid}`)
	if (response.data.some((message) => message.guid.toLowerCase() !== guid.toLowerCase()))
		throw new Error('LayerZeroScan_Rest: foreign message GUID')
	return response
}

export const getMessagesByPathway = async ({
	binding,
	pathwayId,
	limit = 100,
	nextToken,
}: {
	binding: SourceBinding
	pathwayId: string
	limit?: number
	nextToken?: string
}) => {
	assertOpaquePathAtom(pathwayId, 'pathway id')
	const response = await observe(
		binding,
		paginatedPath(`/v1/messages/pathway/${encodeURIComponent(pathwayId)}`, {
			limit,
			nextToken,
		}),
		limit
	)
	if (response.data.some((message) => message.pathway.id !== pathwayId))
		throw new Error('LayerZeroScan_Rest: foreign pathway message')
	return response
}

export const getMessagesByOApp = async ({
	binding,
	endpointId,
	address,
	limit = 100,
	nextToken,
}: {
	binding: SourceBinding
	endpointId: number
	address: string
	limit?: number
	nextToken?: string
}) => {
	assertEndpointId(endpointId)
	assertOpaquePathAtom(address, 'OApp address')
	const response = await observe(
		binding,
		paginatedPath(
			`/v1/messages/oapp/${endpointId}/${encodeURIComponent(address)}`,
			{
				limit,
				nextToken,
			}
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
