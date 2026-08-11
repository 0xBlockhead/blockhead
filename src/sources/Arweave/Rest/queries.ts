/**
 * Arweave gateway REST named operations.
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api
 */
import { jsonErrorHintFromResponse, throwHttpError } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	getJson,
	getText,
	httpUrl,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import {
	arweaveBlockWire,
	arweaveNetworkInfoWire,
	arweaveTransactionOffsetWire,
	arweaveTransactionStatusWire,
	arweaveTransactionWire,
	type ArweaveBlockWire,
	type ArweaveTransactionStatus,
} from '$/sources/Arweave/Rest/types.ts'
import {
	SourceEndpointKind,
	sourceEndpointOrigin,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Arweave/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.Arweave_Rest][0]

const gatewayUrlLastSegment = /([^/]+)$/
const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

const assertEnvelope = <_Value>(
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Arweave_Rest: invalid ${label} response envelope`)
	}
}

const arweaveGatewayEndpoints = (binding: SourceBinding) => {
	const endpoints = binding.endpoints.flatMap((endpoint) => {
		if (endpoint.endpointKind !== SourceEndpointKind.HttpUrl)
			return []

		const gatewayOrigin = sourceEndpointOrigin(endpoint)
		return gatewayOrigin == null ? [] : [{
			endpoint,
			gatewayOrigin,
		}]
	})
	if (endpoints.length === 0)
		throw new Error('Arweave_Rest: canonical gateway binding has no HTTP endpoints')

	return endpoints
}

export const getGatewayOrigin = () => arweaveGatewayEndpoints(binding)[0].gatewayOrigin

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

const assertNonNegativeSafeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Arweave_Rest: invalid ${label}`)
}

const assertWinstonish = (
	value: string | number | undefined,
	label: string
) => {
	if (value == null)
		return undefined
	const asString = String(value)
	assertUnsignedDecimal(asString, label)
	return asString
}

const assertBase64Url = (
	value: string,
	label: string
) => {
	if (value === '' || !/^[A-Za-z0-9_-]+$/.test(value))
		throw new Error(`Arweave_Rest: invalid ${label}`)
}

const bytesFromBase64Url = (
	value: string,
	label: string
) => {
	assertBase64Url(value, label)
	try {
		return Uint8Array.from(
			globalThis.atob(
				value
					.replaceAll('-', '+')
					.replaceAll('_', '/')
					.padEnd(Math.ceil(value.length / 4) * 4, '=')
			),
			(character) => character.charCodeAt(0)
		)
	} catch {
		throw new Error(`Arweave_Rest: invalid ${label}`)
	}
}

const base64UrlFromBytes = (
	bytes: Uint8Array
) => (
	globalThis.btoa(String.fromCharCode(...bytes))
		.replaceAll('+', '-')
		.replaceAll('/', '_')
		.replace(/=+$/g, '')
)

/** Owner wallet address = SHA-256(owner public key bytes), base64url. */
export const ownerAddressFromOwnerKey = async (
	ownerKey: string
) => (
	base64UrlFromBytes(
		new Uint8Array(
			await globalThis.crypto.subtle.digest(
				'SHA-256',
				bytesFromBase64Url(ownerKey, 'owner key')
			)
		)
	)
)

/** Gateway REST tag name/value fields are base64url-encoded UTF-8. */
export const decodeArweaveTagField = (
	value: string,
	label: string
) => (
	new TextDecoder().decode(bytesFromBase64Url(value, label))
)

const assertBlockWire = (
	block: ArweaveBlockWire,
	{
		expectedHeight,
		expectedIndepHash,
	}: {
		expectedHeight?: number
		expectedIndepHash?: string
	} = {}
) => {
	if (block.previous_block !== '')
		assertBlockHash(block.previous_block, 'previous_block')
	if (expectedHeight != null && block.height !== expectedHeight)
		throw new Error(`Arweave_Rest: block height mismatch ${block.height} !== ${expectedHeight}`)
	if (expectedIndepHash != null && block.indep_hash !== expectedIndepHash)
		throw new Error('Arweave_Rest: block response has mismatched identity')
	if (new Set(block.txs).size !== block.txs.length)
		throw new Error('Arweave_Rest: block txs contains duplicate transaction IDs')
	if (block.tx_root != null && block.tx_root !== '' && !/^[A-Za-z0-9_-]+$/.test(block.tx_root))
		throw new Error('Arweave_Rest: invalid tx_root')
	if (block.wallet_list != null && block.wallet_list !== '' && !/^[A-Za-z0-9_-]+$/.test(block.wallet_list))
		throw new Error('Arweave_Rest: invalid wallet_list')
	if (block.hash_list_merkle != null && block.hash_list_merkle !== '' && !/^[A-Za-z0-9_-]+$/.test(block.hash_list_merkle))
		throw new Error('Arweave_Rest: invalid hash_list_merkle')
	if (
		block.reward_addr != null
		&& block.reward_addr !== ''
		&& block.reward_addr !== 'unclaimed'
		&& !/^[A-Za-z0-9_-]{43}$/.test(block.reward_addr)
	)
		throw new Error('Arweave_Rest: invalid reward_addr')
	assertWinstonish(block.reward_pool, 'reward_pool')
	assertWinstonish(block.weave_size, 'weave_size')
	assertWinstonish(block.block_size, 'block_size')
	assertWinstonish(block.cumulative_diff, 'cumulative_diff')
	return block
}

const fetchBlockJson = async (
	binding: SourceBinding, path: string
) => {
	const response = await sourceFetch(
		binding,
		httpUrl(binding, path),
		{
			headers: {
				Accept: 'application/json',
				'X-Block-Format': '2',
			},
		}
	)
	if (!response.ok)
		await throwHttpError(`${Source.Arweave_Rest} ${path}`, response)

	return assertEnvelope(
		'block',
		arweaveBlockWire,
		await response.json()
	)
}

/** @see https://docs.arweave.org/developers/arweave-node-server/http-api#network-info */
export const getNetworkInfo = async () => {
	const info = assertEnvelope(
		'network-info',
		arweaveNetworkInfoWire,
		await getJson(
			binding,
			'/info'
		)
	)
	if (info.network.trim() === '')
		throw new Error('Arweave_Rest: network id missing')
	return info
}

/**
 * Active peer host:port list from the contacted gateway.
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-nodes-peer-list
 */
export const getPeers = async () => {
	const peers = assertEnvelope(
		'peers',
		arktype('string > 0').array(),
		await getJson(
			binding,
			'/peers'
		)
	)
	const peerEndpoints = new Set<string>()
	for (const peer of peers) {
		if (peer.includes('://') || peer.includes(' '))
			throw new Error('Arweave_Rest: invalid peer endpoint')
		if (peerEndpoints.has(peer))
			throw new Error('Arweave_Rest: duplicate peer endpoint')
		peerEndpoints.add(peer)
	}
	return peers
}

/**
 * Current transaction anchor (recent block indep hash).
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-transaction-anchor
 */
export const getTxAnchor = async () => {
	const anchor = (await getText(
		binding,
		'/tx_anchor'
	)).trim()
	assertBlockHash(anchor, 'tx_anchor')
	return anchor
}

/**
 * Minimum fee in winstons to store `byteSize` bytes (optionally targeting a wallet).
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-estimated-transaction-price
 */
export const getPrice = async ({
	byteSize,
	target,
}: {
	byteSize: number
	target?: string
}) => {
	assertNonNegativeSafeInteger(byteSize, 'byte size')
	if (target != null)
		assertBase64UrlId(target, 'price target')
	const priceWinston = (await getText(
		binding,
		target == null ?
			`/price/${byteSize.toString()}`
		:
			`/price/${byteSize.toString()}/${encodeURIComponent(target)}`
	)).trim()
	assertUnsignedDecimal(priceWinston, 'price')
	return priceWinston
}

/** @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-block-by-hash-id */
export const getBlockByHash = async (
	indepHash: string
) => {
	assertBlockHash(indepHash, 'block indep_hash')
	return assertBlockWire(
		await fetchBlockJson(binding, `/block/hash/${encodeURIComponent(indepHash)}`),
		{
			expectedIndepHash: indepHash,
		}
	)
}

/** @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-block-by-height */
export const getBlockByHeight = async (
	height: number
) => {
	assertNonNegativeSafeInteger(height, 'block height')
	return assertBlockWire(
		await fetchBlockJson(binding, `/block/height/${height.toString()}`),
		{
			expectedHeight: height,
		}
	)
}

export const getWalletBalance = async (
	address: string
) => {
	assertBase64UrlId(address, 'wallet address')
	const balanceWinston = (await getText(
		binding,
		`/wallet/${encodeURIComponent(address)}/balance`
	)).trim()
	assertUnsignedDecimal(balanceWinston, 'wallet balance')
	return balanceWinston
}

export const getTransaction = async (
	transactionId: string
) => {
	assertBase64UrlId(transactionId, 'transaction ID')
	const transaction = assertEnvelope(
		'transaction',
		arweaveTransactionWire,
		await getJson(
			binding,
			`/tx/${encodeURIComponent(transactionId)}`
		)
	)
	if (transaction.id !== transactionId)
		throw new Error('Arweave_Rest: transaction response has mismatched identity')
	if (transaction.target !== '')
		assertBase64UrlId(transaction.target, 'transaction target')
	if (
		transaction.last_tx !== ''
		&& !/^[A-Za-z0-9_-]{43}$/.test(transaction.last_tx)
		&& !/^[A-Za-z0-9_-]{64}$/.test(transaction.last_tx)
	)
		throw new Error('Arweave_Rest: invalid transaction anchor')
	if (transaction.data_root !== '')
		assertBase64Url(transaction.data_root, 'data_root')
	return transaction
}

export const getTransactionStatus = async (
	transactionId: string
) => {
	assertBase64UrlId(transactionId, 'transaction ID')
	const status = await getJson<ArweaveTransactionStatus | 'Pending'>(
		binding,
		`/tx/${encodeURIComponent(transactionId)}/status`
	)
	if (status === 'Pending')
		return undefined
	return assertEnvelope(
		'transaction-status',
		arweaveTransactionStatusWire,
		status
	)
}

/**
 * Weave byte offset + size for a confirmed transaction's data.
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-transaction-offset
 */
export const getTransactionOffset = async (
	transactionId: string
) => {
	assertBase64UrlId(transactionId, 'transaction ID')
	return assertEnvelope(
		'transaction-offset',
		arweaveTransactionOffsetWire,
		await getJson(
			binding,
			`/tx/${encodeURIComponent(transactionId)}/offset`
		)
	)
}

export const getGatewayUrl = ({
	transactionId,
	contentPath,
	gatewayOrigin,
}: {
	transactionId: string
	contentPath?: string
	gatewayOrigin: string
}) => {
	const trimmedTransactionId = trimSlashes(transactionId.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	return `${gatewayOrigin}/${trimmedTransactionId}${trimmedPath ? `/${trimmedPath}` : ''}`
}

export const fetchBrowseResult = async ({
	transactionId,
	contentPath,
	maxContentBytes = 1_048_576,
	signal,
}: {
	transactionId: string
	contentPath?: string
	maxContentBytes?: number
	signal?: AbortSignal
}) => {
	const trimmedTransactionId = trimSlashes(transactionId.trim())
	const trimmedPath = trimSlashes(contentPath?.trim() ?? '')
	assertBase64UrlId(trimmedTransactionId, 'transaction ID')
	if (!Number.isSafeInteger(maxContentBytes) || maxContentBytes < 0 || maxContentBytes > 5_242_880)
		throw new Error('Arweave_Rest: content inspection limit must be from 0 through 5242880 bytes')
	const failures: string[] = []

	for (const { endpoint, gatewayOrigin } of arweaveGatewayEndpoints(binding)) {
		const gatewayUrl = getGatewayUrl({
			transactionId: trimmedTransactionId,
			contentPath: trimmedPath,
			gatewayOrigin,
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
				const metadata = arweaveTransactionOffsetWire.assert(await metadataResponse.json())
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
		for (;;) {
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
			gatewayOrigin,
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
