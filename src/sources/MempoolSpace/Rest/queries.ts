import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	assertEsploraEnvelope,
	esploraAddressUtxoWire,
	esploraAddressWire,
	esploraBlockHashWire,
	esploraBlockWire,
	esploraMempoolStatsWire,
	esploraTransactionWire,
	esploraTxIdWire,
	esploraTxIdListWire,
	mempoolSpaceRecommendedFeesWire,
} from '$/sources/Esplora/Rest/envelopes.ts'
import bindings from '$/sources/MempoolSpace/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.MempoolSpace_Rest][0]
const sourceLabel = 'MempoolSpace_Rest'

const mempoolSpaceRestUrl = (
	path: string
) => new URL(
	path,
	`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/`
).toString()

const getMempoolSpaceJson = <_Response>(
	path: string
) => sourceGetJson<_Response>(
	binding,
	mempoolSpaceRestUrl(path)
)

const assertBlockHash = (blockHash: string) => {
	if (!esploraBlockHashWire.allows(blockHash))
		throw new Error(`${sourceLabel}: invalid block hash`)
}

const assertTransactionId = (transactionId: string) => {
	if (!esploraTxIdWire.allows(transactionId))
		throw new Error(`${sourceLabel}: invalid transaction ID`)
}

const assertAddress = (address: string) => {
	if (address.length === 0)
		throw new Error(`${sourceLabel}: address is empty`)
}

export const getBlock = async (
	blockHash: string
) => {
	assertBlockHash(blockHash)
	const block = assertEsploraEnvelope(
		esploraBlockWire,
		await getMempoolSpaceJson(`block/${encodeURIComponent(blockHash)}`),
		'block',
		sourceLabel
	)
	if (block.id.toLowerCase() !== blockHash.toLowerCase())
		throw new Error(`${sourceLabel}: block response has mismatched identity`)
	return block
}

export const getBlockHashByHeight = async (
	height: bigint
) => {
	if (height < 0n)
		throw new Error(`${sourceLabel}: block height must be non-negative`)
	const hash = await getMempoolSpaceJson<unknown>(`block-height/${height.toString()}`)
	if (!esploraBlockHashWire.allows(hash))
		throw new Error(`${sourceLabel}: invalid block hash envelope`)
	return hash
}

export const getBlockTransactionIds = async (
	blockHash: string
) => {
	assertBlockHash(blockHash)
	return assertEsploraEnvelope(
		esploraTxIdListWire,
		await getMempoolSpaceJson(`block/${encodeURIComponent(blockHash)}/txids`),
		'block txids',
		sourceLabel
	)
}

export const getTransaction = async (
	txId: string
) => {
	assertTransactionId(txId)
	const transaction = assertEsploraEnvelope(
		esploraTransactionWire,
		await getMempoolSpaceJson(`tx/${encodeURIComponent(txId)}`),
		'transaction',
		sourceLabel
	)
	if (transaction.txid !== txId)
		throw new Error(`${sourceLabel}: transaction response has mismatched identity`)
	return transaction
}

/**
 * Extract Ordinals envelopes + Runestone from a mempool.space (Esplora-compatible) transaction.
 * @see https://mempool.space/docs/api/rest
 * @see https://docs.ordinals.com/inscriptions.html
 * @see https://docs.ordinals.com/runes/specification.html
 */
export const getTransactionProtocolPayloads = async (
	txId: string
) => {
	const { extractEsploraProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
	return extractEsploraProtocolPayloads(
		await getTransaction(txId)
	)
}

export const getBlocks = async (
	startHeight?: bigint
) => {
	if (startHeight != null && startHeight < 0n)
		throw new Error(`${sourceLabel}: block height must be non-negative`)
	return assertEsploraEnvelope(
		esploraBlockWire.array(),
		await getMempoolSpaceJson(
			startHeight == null ?
				'v1/blocks'
			:
				`v1/blocks/${startHeight.toString()}`
		),
		'blocks',
		sourceLabel
	)
}

export const getMempoolStats = async () => (
	assertEsploraEnvelope(
		esploraMempoolStatsWire,
		await getMempoolSpaceJson('mempool'),
		'mempool stats',
		sourceLabel
	)
)

export const getMempoolTxids = async () => (
	assertEsploraEnvelope(
		esploraTxIdListWire,
		await getMempoolSpaceJson('mempool/txids'),
		'mempool txids',
		sourceLabel
	)
)

export const getAddress = async (
	address: string
) => {
	assertAddress(address)
	const addressResponse = assertEsploraEnvelope(
		esploraAddressWire,
		await getMempoolSpaceJson(`address/${encodeURIComponent(address)}`),
		'address',
		sourceLabel
	)
	if (addressResponse.address !== address)
		throw new Error(`${sourceLabel}: address response has mismatched identity`)
	return addressResponse
}

export const getAddressUtxos = async (
	address: string
) => {
	assertAddress(address)
	return assertEsploraEnvelope(
		esploraAddressUtxoWire.array(),
		await getMempoolSpaceJson(`address/${encodeURIComponent(address)}/utxo`),
		'address utxos',
		sourceLabel
	)
}

export const getAddressTransactions = async (
	address: string,
	lastSeenTransactionId?: string
) => {
	assertAddress(address)
	if (lastSeenTransactionId != null)
		assertTransactionId(lastSeenTransactionId)
	return assertEsploraEnvelope(
		esploraTransactionWire.array(),
		await getMempoolSpaceJson(
			`address/${encodeURIComponent(address)}/txs/chain${
				lastSeenTransactionId == null ?
					''
				:
					`/${encodeURIComponent(lastSeenTransactionId)}`
			}`
		),
		'address transactions',
		sourceLabel
	)
}

export const getRecommendedFees = async () => (
	assertEsploraEnvelope(
		mempoolSpaceRecommendedFeesWire,
		await getMempoolSpaceJson('v1/fees/recommended'),
		'recommended fees',
		sourceLabel
	)
)
