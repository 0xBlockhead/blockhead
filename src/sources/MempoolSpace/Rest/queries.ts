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
	esploraOutspendWire,
	esploraTransactionWire,
	esploraTxIdWire,
	esploraTxIdListWire,
	mempoolSpaceRecommendedFeesWire,
} from '$/sources/Esplora/Rest/envelopes.ts'
import bindings from '$/sources/MempoolSpace/bindings.ts'
import {
	mempoolSpaceDifficultyAdjustmentWire,
	mempoolSpaceMiningHashrateWire,
	mempoolSpaceMiningPoolWire,
	mempoolSpaceMiningPoolsWire,
	mempoolSpaceTipHeightWire,
} from '$/sources/MempoolSpace/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type MempoolSpaceTarget = typeof bindings[Source.MempoolSpace_Rest][number]['target']['key']

const bindingByTarget = new Map(
	bindings[Source.MempoolSpace_Rest].map((binding) => [binding.target.key, binding] as const)
)

const sourceLabel = 'MempoolSpace_Rest'

const mempoolSpaceRestUrl = (
	target: MempoolSpaceTarget,
	path: string
) => {
	const binding = bindingByTarget.get(target)
	if (binding == null)
		throw new Error(`${sourceLabel}: unsupported source target ${target}`)

	return new URL(
		path,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/`
	).toString()
}

const getMempoolSpaceJson = <_Response>(
	target: MempoolSpaceTarget,
	path: string
) => {
	const binding = bindingByTarget.get(target)
	if (binding == null)
		throw new Error(`${sourceLabel}: unsupported source target ${target}`)

	return sourceGetJson<_Response>(
		binding,
		mempoolSpaceRestUrl(target, path)
	)
}

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

export const getBlock = async ({
	blockHash,
	target,
}: {
	blockHash: string
	target: MempoolSpaceTarget
}) => {
	assertBlockHash(blockHash)
	const block = assertEsploraEnvelope(
		esploraBlockWire,
		await getMempoolSpaceJson(target, `block/${encodeURIComponent(blockHash)}`),
		'block',
		sourceLabel
	)
	if (block.id.toLowerCase() !== blockHash.toLowerCase())
		throw new Error(`${sourceLabel}: block response has mismatched identity`)
	return block
}

export const getBlockHashByHeight = async ({
	height,
	target,
}: {
	height: bigint
	target: MempoolSpaceTarget
}) => {
	if (height < 0n)
		throw new Error(`${sourceLabel}: block height must be non-negative`)
	const hash = await getMempoolSpaceJson<unknown>(target, `block-height/${height.toString()}`)
	if (!esploraBlockHashWire.allows(hash))
		throw new Error(`${sourceLabel}: invalid block hash envelope`)
	return hash
}

export const getBlockTransactionIds = async ({
	blockHash,
	target,
}: {
	blockHash: string
	target: MempoolSpaceTarget
}) => {
	assertBlockHash(blockHash)
	return assertEsploraEnvelope(
		esploraTxIdListWire,
		await getMempoolSpaceJson(target, `block/${encodeURIComponent(blockHash)}/txids`),
		'block txids',
		sourceLabel
	)
}

export const getBlockTransactions = async ({
	blockHash,
	startIndex,
	target,
}: {
	blockHash: string
	startIndex: number
	target: MempoolSpaceTarget
}) => {
	assertBlockHash(blockHash)
	if (!Number.isSafeInteger(startIndex) || startIndex < 0)
		throw new Error(`${sourceLabel}: block transaction start index must be a non-negative safe integer`)

	const transactions = assertEsploraEnvelope(
		esploraTransactionWire.array(),
		await getMempoolSpaceJson(target, `block/${encodeURIComponent(blockHash)}/txs/${String(startIndex)}`),
		'block transactions',
		sourceLabel
	)
	if (transactions.some((transaction) => (
		transaction.status.block_hash?.toLowerCase() !== blockHash.toLowerCase()
	)))
		throw new Error(`${sourceLabel}: block transactions contain mismatched block identity`)

	return transactions
}

export const getTransaction = async (
	txId: string,
	target: MempoolSpaceTarget
) => {
	assertTransactionId(txId)
	const transaction = assertEsploraEnvelope(
		esploraTransactionWire,
		await getMempoolSpaceJson(target, `tx/${encodeURIComponent(txId)}`),
		'transaction',
		sourceLabel
	)
	if (transaction.txid !== txId)
		throw new Error(`${sourceLabel}: transaction response has mismatched identity`)
	return transaction
}

export const getOutspend = async ({
	txId,
	vout,
	target,
}: {
	txId: string
	vout: number
	target: MempoolSpaceTarget
}) => {
	assertTransactionId(txId)
	if (!Number.isSafeInteger(vout) || vout < 0)
		throw new Error(`${sourceLabel}: outspend output index must be a non-negative safe integer`)

	const outspend = assertEsploraEnvelope(
		esploraOutspendWire,
		await getMempoolSpaceJson(target, `tx/${encodeURIComponent(txId)}/outspend/${String(vout)}`),
		'outspend',
		sourceLabel
	)
	if (outspend.spent && (outspend.txid == null || outspend.vin == null))
		throw new Error(`${sourceLabel}: spent outspend is missing spending identity`)

	return outspend
}

/**
 * Extract Ordinals envelopes + Runestone from a mempool.space (Esplora-compatible) transaction.
 * @see https://mempool.space/docs/api/rest
 * @see https://docs.ordinals.com/inscriptions.html
 * @see https://docs.ordinals.com/runes/specification.html
 */
export const getTransactionProtocolPayloads = async ({
	txId,
	target,
}: {
	txId: string
	target: MempoolSpaceTarget
}) => {
	const { extractEsploraProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
	return extractEsploraProtocolPayloads(
		await getTransaction(txId, target)
	)
}

export const getBlocks = async ({
	target,
	startHeight,
}: {
	target: MempoolSpaceTarget
	startHeight?: bigint
}) => {
	if (startHeight != null && startHeight < 0n)
		throw new Error(`${sourceLabel}: block height must be non-negative`)
	return assertEsploraEnvelope(
		esploraBlockWire.array(),
		await getMempoolSpaceJson(
			target,
			startHeight == null ?
				'v1/blocks'
			:
				`v1/blocks/${startHeight.toString()}`
		),
		'blocks',
		sourceLabel
	)
}

export const getMempoolStats = async ({
	target,
}: {
	target: MempoolSpaceTarget
}) => (
	assertEsploraEnvelope(
		esploraMempoolStatsWire,
		await getMempoolSpaceJson(target, 'mempool'),
		'mempool stats',
		sourceLabel
	)
)

export const getMempoolTxids = async ({
	target,
}: {
	target: MempoolSpaceTarget
}) => (
	assertEsploraEnvelope(
		esploraTxIdListWire,
		await getMempoolSpaceJson(target, 'mempool/txids'),
		'mempool txids',
		sourceLabel
	)
)

export const getAddress = async ({
	address,
	target,
}: {
	address: string
	target: MempoolSpaceTarget
}) => {
	assertAddress(address)
	const addressResponse = assertEsploraEnvelope(
		esploraAddressWire,
		await getMempoolSpaceJson(target, `address/${encodeURIComponent(address)}`),
		'address',
		sourceLabel
	)
	if (addressResponse.address !== address)
		throw new Error(`${sourceLabel}: address response has mismatched identity`)
	return addressResponse
}

export const getAddressUtxos = async ({
	address,
	target,
}: {
	address: string
	target: MempoolSpaceTarget
}) => {
	assertAddress(address)
	const addressUtxos = assertEsploraEnvelope(
		esploraAddressUtxoWire.array(),
		await getMempoolSpaceJson(target, `address/${encodeURIComponent(address)}/utxo`),
		'address utxos',
		sourceLabel
	)
	if (addressUtxos.some(({ value }) => value == null))
		throw new Error(`${sourceLabel}: Bitcoin address UTXO is missing value`)

	return addressUtxos
}

export const getAddressTransactions = async ({
	address,
	target,
	lastSeenTransactionId,
}: {
	address: string
	target: MempoolSpaceTarget
	lastSeenTransactionId?: string
}) => {
	assertAddress(address)
	if (lastSeenTransactionId != null)
		assertTransactionId(lastSeenTransactionId)
	return assertEsploraEnvelope(
		esploraTransactionWire.array(),
		await getMempoolSpaceJson(
			target,
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

export const getRecommendedFees = async ({
	target,
}: {
	target: MempoolSpaceTarget
}) => (
	assertEsploraEnvelope(
		mempoolSpaceRecommendedFeesWire,
		await getMempoolSpaceJson(target, 'v1/fees/recommended'),
		'recommended fees',
		sourceLabel
	)
)

export const getMiningHashrate = async ({
	target,
}: {
	target: MempoolSpaceTarget
}) => {
	const miningHashrate = assertEsploraEnvelope(
		mempoolSpaceMiningHashrateWire,
		await getMempoolSpaceJson(target, 'v1/mining/hashrate/3d'),
		'mining hashrate',
		sourceLabel
	)
	if (new Set(miningHashrate.hashrates.map(({ timestamp }) => timestamp)).size !== miningHashrate.hashrates.length)
		throw new Error(`${sourceLabel}: mining hashrate contains duplicate observation timestamps`)

	return miningHashrate
}

export const getDifficultyAdjustment = async ({
	target,
}: {
	target: MempoolSpaceTarget
}) => (
	assertEsploraEnvelope(
		mempoolSpaceDifficultyAdjustmentWire,
		await getMempoolSpaceJson(target, 'v1/difficulty-adjustment'),
		'difficulty adjustment',
		sourceLabel
	)
)

export const getMiningPools = async ({
	target,
}: {
	target: MempoolSpaceTarget
}) => {
	const miningPools = assertEsploraEnvelope(
		mempoolSpaceMiningPoolsWire,
		await getMempoolSpaceJson(target, 'v1/mining/pools'),
		'mining pools',
		sourceLabel
	)
	if (new Set(miningPools.map(({ unique_id: uniqueId }) => uniqueId)).size !== miningPools.length)
		throw new Error(`${sourceLabel}: mining pools contain duplicate catalog ids`)

	return miningPools
}

export const getMiningPool = async ({
	slug,
	target,
}: {
	slug: string
	target: MempoolSpaceTarget
}) => {
	if (slug.length === 0)
		throw new Error(`${sourceLabel}: mining pool slug is empty`)
	const miningPool = assertEsploraEnvelope(
		mempoolSpaceMiningPoolWire,
		await getMempoolSpaceJson(target, `v1/mining/pool/${encodeURIComponent(slug)}`),
		'mining pool',
		sourceLabel
	)
	if (miningPool.pool.slug !== slug)
		throw new Error(`${sourceLabel}: mining pool response has mismatched identity`)
	return miningPool
}

export const getTipHeight = async ({
	target,
}: {
	target: MempoolSpaceTarget
}) => {
	const height = await getMempoolSpaceJson<unknown>(target, 'blocks/tip/height')
	if (!mempoolSpaceTipHeightWire.allows(height))
		throw new Error(`${sourceLabel}: invalid tip height`)

	return height
}
