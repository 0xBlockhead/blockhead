import { jsonErrorHintFromResponse } from '$/lib/http.ts'
import { type as arktype } from 'arktype'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceEndpointKind,
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	getJson,
	getText,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	ArweaveBrowseResult,
	ArweaveTransactionStatus,
	ArweaveTransactionWire,
} from '$/sources/Arweave/Rest/types.ts'

const gatewayUrlLastSegment = /([^/]+)$/
const transactionOffset = arktype({
	offset: 'string',
	size: 'string',
})

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

const assertBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.Arweave_Rest
		|| binding.target.kind !== SourceTargetKind.ContentAddressScheme
		|| binding.target.key !== 'arweave'
		|| binding.apiFamily !== ApiFamily.ArweaveGateway
	)
		throw new Error('Arweave_Rest: expected canonical Arweave gateway binding')
}

const arweaveGatewayEndpoints = (binding: SourceBinding) => {
	assertBinding(binding)
	const endpoints = binding.endpoints.filter((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl
		&& endpoint.origin != null
	))
	if (endpoints.length === 0)
		throw new Error('Arweave_Rest: canonical gateway binding has no HTTP endpoints')

	return endpoints
}

const assertBase64UrlId = (
	value: string,
	label: string
) => {
	if (!/^[A-Za-z0-9_-]{43}$/.test(value))
		throw new Error(`Arweave_Rest: invalid ${label}`)
}

const assertBlockHash = (
	value: string,
	label: string
) => {
	if (!/^[A-Za-z0-9_-]{64}$/.test(value))
		throw new Error(`Arweave_Rest: invalid ${label}`)
}

const assertUnsignedDecimal = (
	value: string,
	label: string
) => {
	if (!/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error(`Arweave_Rest: invalid ${label}`)
}

export const getWalletBalance = async (
	binding: SourceBinding,
	address: string
) => {
	assertBinding(binding)
	assertBase64UrlId(address, 'wallet address')
	const balanceWinston = (await getText(
		binding,
		`/wallet/${encodeURIComponent(address)}/balance`
	)).trim()
	assertUnsignedDecimal(balanceWinston, 'wallet balance')
	return balanceWinston
}

export const getTransaction = async (
	binding: SourceBinding,
	transactionId: string
) => {
	assertBinding(binding)
	assertBase64UrlId(transactionId, 'transaction ID')
	const transaction = await getJson<ArweaveTransactionWire>(
		binding,
		`/tx/${encodeURIComponent(transactionId)}`
	)
	if (transaction.id !== transactionId)
		throw new Error('Arweave_Rest: transaction response has mismatched identity')
	assertUnsignedDecimal(transaction.quantity, 'transaction quantity')
	assertUnsignedDecimal(transaction.reward, 'transaction reward')
	assertUnsignedDecimal(transaction.data_size, 'transaction data size')
	if (transaction.target !== '')
		assertBase64UrlId(transaction.target, 'transaction target')
	if (
		transaction.last_tx !== ''
		&& !/^[A-Za-z0-9_-]{43}$/.test(transaction.last_tx)
		&& !/^[A-Za-z0-9_-]{64}$/.test(transaction.last_tx)
	)
		throw new Error('Arweave_Rest: invalid transaction anchor')
	return transaction
}

export const getTransactionStatus = async (
	binding: SourceBinding,
	transactionId: string
) => {
	assertBinding(binding)
	assertBase64UrlId(transactionId, 'transaction ID')
	const status = await getJson<ArweaveTransactionStatus>(
		binding,
		`/tx/${encodeURIComponent(transactionId)}/status`
	)
	if (
		!Number.isSafeInteger(status.block_height)
		|| status.block_height < 0
		|| !Number.isSafeInteger(status.number_of_confirmations)
		|| status.number_of_confirmations < 0
	)
		throw new Error('Arweave_Rest: invalid transaction status')
	assertBlockHash(status.block_indep_hash, 'status block hash')
	return status
}

export const getGatewayUrl = ({
	transactionId,
	contentPath,
	gatewayOrigin,
}: {
	transactionId: string
	contentPath?: string
	gatewayOrigin: string
}): string => {
	const trimmedTransactionId = trimSlashes(transactionId.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	return `${gatewayOrigin}/${trimmedTransactionId}${trimmedPath ? `/${trimmedPath}` : ''}`
}

export const fetchBrowseResult = async ({
	binding,
	transactionId,
	contentPath,
	maxContentBytes = 1_048_576,
	signal,
}: {
	binding: SourceBinding
	transactionId: string
	contentPath?: string
	maxContentBytes?: number
	signal?: AbortSignal
}): Promise<ArweaveBrowseResult> => {
	const trimmedTransactionId = trimSlashes(transactionId.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	assertBase64UrlId(trimmedTransactionId, 'transaction ID')
	if (!Number.isSafeInteger(maxContentBytes) || maxContentBytes < 0 || maxContentBytes > 5_242_880)
		throw new Error('Arweave_Rest: content inspection limit must be from 0 through 5242880 bytes')
	const failures: string[] = []

	for (const endpoint of arweaveGatewayEndpoints(binding)) {
		const gatewayUrl = getGatewayUrl({
			transactionId: trimmedTransactionId,
			contentPath: trimmedPath,
			gatewayOrigin: endpoint.locator,
		})

		let contentLength: bigint | undefined
		if (trimmedPath === '') {
			const metadataResponse = await sourceFetch(
				binding,
				`${endpoint.locator}/tx/${encodeURIComponent(trimmedTransactionId)}/offset`,
				{
					signal,
				}
			)
			if (!metadataResponse.ok) {
				const hint = await jsonErrorHintFromResponse(metadataResponse)
				failures.push(
					hint ?
						`${endpoint.locator} (${metadataResponse.status}): ${hint}`
					:
						`${endpoint.locator} (${metadataResponse.status} ${metadataResponse.statusText})`
				)
				continue
			}
			try {
				const metadata = transactionOffset.assert(await metadataResponse.json())
				assertUnsignedDecimal(metadata.offset, 'transaction offset')
				assertUnsignedDecimal(metadata.size, 'transaction offset size')
				contentLength = BigInt(metadata.size)
			} catch {
				failures.push(`${endpoint.locator}: invalid transaction offset size`)
				continue
			}
			if (contentLength > BigInt(maxContentBytes)) {
				failures.push(`${endpoint.locator}: content exceeds ${maxContentBytes} byte inspection limit`)
				continue
			}
		}
		const response = await sourceFetch(binding, gatewayUrl, { signal })
		if (!response.ok) {
			const hint = await jsonErrorHintFromResponse(response)
			failures.push(
				hint ?
					`${endpoint.locator} (${response.status}): ${hint}`
				:
					`${endpoint.locator} (${response.status} ${response.statusText})`
			)
			continue
		}
		if (response.body == null) {
			failures.push(`${endpoint.locator}: content response has no body`)
			continue
		}
		const reader = response.body.getReader()
		const chunks: Uint8Array[] = []
		let receivedBytes = 0
		let exceedsLimit = false
		while (true) {
			const chunk = await reader.read()
			if (chunk.done)
				break
			receivedBytes += chunk.value.byteLength
			if (
				receivedBytes > maxContentBytes
				|| (
					contentLength != null
					&& BigInt(receivedBytes) > contentLength
				)
			) {
				exceedsLimit = true
				await reader.cancel()
				break
			}
			chunks.push(chunk.value)
		}
		if (exceedsLimit) {
			failures.push(`${endpoint.locator}: content body exceeds declared or configured size`)
			continue
		}
		const bytes = new Uint8Array(receivedBytes)
		let byteOffset = 0
		for (const chunk of chunks) {
			bytes.set(chunk, byteOffset)
			byteOffset += chunk.byteLength
		}

		const { parseContentResponse } = await import('$/sources/contentResponse.ts')
		const parsedContent = await parseContentResponse({
			response: new Response(bytes, {
				headers: response.headers,
			}),
			fileName: (
				trimmedPath !== '' ?
					trimmedPath.split('/').at(-1)
				:
					gatewayUrlLastSegment.exec(gatewayUrl)?.[1]
			),
		})

		return {
			transactionId: trimmedTransactionId,
			contentPath: trimmedPath,
			gatewayOrigin: endpoint.origin,
			gatewayUrl,
			fileName: parsedContent.fileName,
			extension: parsedContent.extension,
			contentType: parsedContent.contentType,
			contentLength: receivedBytes,
			displayType: parsedContent.displayType,
			isContentTypeInferred: parsedContent.isContentTypeInferred,
			text: parsedContent.text,
		}
	}

	throw new Error(
		`Unable to load ar://${trimmedTransactionId}${trimmedPath ? `/${trimmedPath}` : ''} from public gateways: ${failures.join('; ')}`
	)
}
