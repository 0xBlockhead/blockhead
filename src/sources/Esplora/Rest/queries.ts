import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Esplora/bindings.ts'
import {
	assertEsploraEnvelope,
	esploraAddressUtxoWire,
	esploraAddressWire,
	esploraAssetWire,
	esploraBlockHashWire,
	esploraBlockWire,
	esploraFeeEstimatesWire,
	esploraMempoolStatsWire,
	esploraOutspendWire,
	esploraTransactionWire,
	esploraTxIdListWire,
} from '$/sources/Esplora/Rest/envelopes.ts'
import { Source } from '$/sources/Source.ts'

type EsploraTarget = typeof bindings[Source.Esplora_Rest][number]['target']['key']

const bindingByTarget = new Map(
	bindings[Source.Esplora_Rest].map((binding) => [binding.target.key, binding] as const)
)

const getEsploraJson = async <_Response>(
	target: EsploraTarget,
	path: string
) => {
	const binding = bindingByTarget.get(target)
	if (binding == null)
		throw new Error(`Esplora_Rest: unsupported source target ${target}`)

	return sourceGetJson<_Response>(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`
	)
}

export const getBlock = async ({
	blockHash,
	target,
}: {
	blockHash: string
	target: EsploraTarget
}) => {
	const block = assertEsploraEnvelope(
		esploraBlockWire,
		await getEsploraJson(target, `/block/${encodeURIComponent(blockHash)}`),
		'block'
	)
	if (block.id.toLowerCase() !== blockHash.toLowerCase())
		throw new Error('Esplora_Rest: block response has mismatched identity')
	return block
}

export const getBlockHashByHeight = async ({
	height,
	target,
}: {
	height: bigint
	target: EsploraTarget
}) => {
	const hash = await getEsploraJson<unknown>(target, `/block-height/${height.toString()}`)
	if (!esploraBlockHashWire.allows(hash))
		throw new Error('Esplora_Rest: invalid block hash envelope')
	return hash
}

export const getBlockTransactionIds = async ({
	blockHash,
	target,
}: {
	blockHash: string
	target: EsploraTarget
}) => (
	assertEsploraEnvelope(
		esploraTxIdListWire,
		await getEsploraJson(target, `/block/${encodeURIComponent(blockHash)}/txids`),
		'block txids'
	)
)

export const getBlockTransactions = async ({
	blockHash,
	startIndex,
	target,
}: {
	blockHash: string
	startIndex: number
	target: EsploraTarget
}) => {
	if (!Number.isSafeInteger(startIndex) || startIndex < 0)
		throw new Error('Esplora_Rest: block transaction start index must be a non-negative safe integer')

	const transactions = assertEsploraEnvelope(
		esploraTransactionWire.array(),
		await getEsploraJson(target, `/block/${encodeURIComponent(blockHash)}/txs/${String(startIndex)}`),
		'block transactions'
	)
	if (transactions.some((transaction) => (
		transaction.status.block_hash?.toLowerCase() !== blockHash.toLowerCase()
	)))
		throw new Error('Esplora_Rest: block transactions contain mismatched block identity')

	return transactions
}

export const getBlocks = async ({
	startHeight,
	target,
}: {
	startHeight?: bigint
	target: EsploraTarget
}) => (
	assertEsploraEnvelope(
		esploraBlockWire.array(),
		await getEsploraJson(
			target,
			startHeight == null ?
				'/blocks'
			:
				`/blocks/${startHeight.toString()}`
		),
		'blocks'
	)
)

export const getTransaction = async ({
	target,
	txId,
}: {
	target: EsploraTarget
	txId: string
}) => {
	const transaction = assertEsploraEnvelope(
		esploraTransactionWire,
		await getEsploraJson(target, `/tx/${encodeURIComponent(txId)}`),
		'transaction'
	)
	if (transaction.txid !== txId)
		throw new Error('Esplora_Rest: transaction response has mismatched identity')
	return transaction
}

export const getOutspend = async ({
	target,
	txId,
	vout,
}: {
	target: EsploraTarget
	txId: string
	vout: number
}) => {
	if (!Number.isSafeInteger(vout) || vout < 0)
		throw new Error('Esplora_Rest: outspend output index must be a non-negative safe integer')

	const outspend = assertEsploraEnvelope(
		esploraOutspendWire,
		await getEsploraJson(target, `/tx/${encodeURIComponent(txId)}/outspend/${String(vout)}`),
		'outspend'
	)
	if (outspend.spent && (outspend.txid == null || outspend.vin == null))
		throw new Error('Esplora_Rest: spent outspend is missing spending identity')

	return outspend
}

/**
 * Extract Ordinals envelopes + Runestone from an Esplora transaction wire.
 * @see https://docs.ordinals.com/inscriptions.html
 * @see https://docs.ordinals.com/runes/specification.html
 */
export const getTransactionProtocolPayloads = async ({
	target,
	txId,
}: {
	target: EsploraTarget
	txId: string
}) => {
	const { extractEsploraProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
	return extractEsploraProtocolPayloads(
		await getTransaction({
			target,
			txId,
		})
	)
}

export const getMempoolStats = async (
	target: EsploraTarget
) => (
	assertEsploraEnvelope(
		esploraMempoolStatsWire,
		await getEsploraJson(target, '/mempool'),
		'mempool stats'
	)
)

export const getMempoolTransactionIds = async (target: EsploraTarget) => (
	assertEsploraEnvelope(
		esploraTxIdListWire,
		await getEsploraJson(target, '/mempool/txids'),
		'mempool txids'
	)
)

export const getFeeEstimates = async (
	target: EsploraTarget
) => (
	assertEsploraEnvelope(
		esploraFeeEstimatesWire,
		await getEsploraJson(target, '/fee-estimates'),
		'fee estimates'
	)
)

export const getSuggestedFeePerByteSats = async (
	target: EsploraTarget
) => {
	const estimates = await getFeeEstimates(target)
	const candidate = (
		estimates['6']
		?? estimates['3']
		?? estimates['2']
		?? estimates['1']
		?? Object.values(estimates)[0]
	)
	if (candidate == null || !Number.isFinite(candidate) || candidate < 0)
		throw new Error('Esplora_Rest: missing fee estimate')
	return Math.ceil(candidate)
}

export const getAddress = async ({
	address,
	target,
}: {
	address: string
	target: EsploraTarget
}) => {
	const addressResponse = assertEsploraEnvelope(
		esploraAddressWire,
		await getEsploraJson(target, `/address/${encodeURIComponent(address)}`),
		'address'
	)
	if (addressResponse.address !== address)
		throw new Error('Esplora_Rest: address response has mismatched identity')
	return addressResponse
}

export const getAddressUtxos = async ({
	address,
	target,
}: {
	address: string
	target: EsploraTarget
}) => {
	const addressUtxos = assertEsploraEnvelope(
		esploraAddressUtxoWire.array(),
		await getEsploraJson(target, `/address/${encodeURIComponent(address)}/utxo`),
		'address utxos'
	)
	if (target !== 'liquid' && addressUtxos.some(({ value }) => value == null))
		throw new Error('Esplora_Rest: Bitcoin address UTXO is missing value')

	return addressUtxos
}

export const getAddressTransactions = async ({
	address,
	lastSeenTransactionId,
	target,
}: {
	address: string
	lastSeenTransactionId?: string
	target: EsploraTarget
}) => (
	assertEsploraEnvelope(
		esploraTransactionWire.array(),
		await getEsploraJson(
			target,
			`/address/${encodeURIComponent(address)}/txs/chain${
				lastSeenTransactionId == null ?
					''
				:
					`/${encodeURIComponent(lastSeenTransactionId)}`
			}`
		),
		'address transactions'
	)
)

export const getAsset = async ({
	assetId,
	target,
}: {
	assetId: string
	target: EsploraTarget
}) => {
	const asset = assertEsploraEnvelope(
		esploraAssetWire,
		await getEsploraJson(target, `/asset/${encodeURIComponent(assetId)}`),
		'asset'
	)
	if (asset.asset_id !== assetId)
		throw new Error('Esplora_Rest: asset response has mismatched identity')
	return asset
}

export const listRegistryAssets = async ({
	target,
}: {
	target: EsploraTarget
}) => (
	assertEsploraEnvelope(
		esploraAssetWire.array(),
		await getEsploraJson(target, '/assets/registry'),
		'asset registry'
	)
)
