import bindings from '$/sources/BitcoinCore/bindings.ts'
import {
	bitcoinCoreBlock,
	bitcoinCoreBlockCount,
	bitcoinCoreBlockHash,
	bitcoinCoreBlockTemplate,
	bitcoinCoreMempoolInfo,
	bitcoinCoreMempoolEntry,
	bitcoinCoreMempoolTransactionIds,
	bitcoinCoreNetworkHashrate,
	bitcoinCoreScanTxOutSet,
	bitcoinCoreSmartFeeEstimate,
	bitcoinCoreTransaction,
	bitcoinCoreValidatedAddress,
	type BitcoinCoreScanTxOutSet,
} from '$/sources/BitcoinCore/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'

const binding = bindings[Source.BitcoinCore_JsonRpc][0]

const core = bitcoinCoreJsonRpc(binding, 1)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid ${label} response envelope`)
	}
}

const assertSafeUnsignedInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: ${label} exceeds lossless JSON integer range`)
}

const assertHash = (
	value: string,
	label: string
) => {
	if (!/^[0-9a-f]{64}$/i.test(value))
		throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid ${label}`)
}

const satoshisFromBtc = (
	value: number,
	label: string
) => {
	const satoshis = Math.round(value * 100_000_000)
	if (
		!Number.isFinite(value)
		|| value < 0
		|| !Number.isSafeInteger(satoshis)
		|| Math.abs(value - satoshis / 100_000_000) > Number.EPSILON
	)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid or lossy ${label}`)
	return BigInt(satoshis)
}

const assertBitcoinAddress = (address: string) => {
	if (!/^(?:[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{11,87})$/.test(address))
		throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid Bitcoin address`)
}

export const getBlock = async ({
	blockHash,
}: {
	blockHash: string
}) => {
	assertHash(blockHash, 'block hash')
	const block = assertEnvelope(
		'block',
		bitcoinCoreBlock,
		await core.getBlock({
			blockHash,
		})
	)
	if (block.hash.toLowerCase() !== blockHash.toLowerCase())
		throw new Error(`${Source.BitcoinCore_JsonRpc}: block hash does not match request`)
	assertSafeUnsignedInteger(block.height, 'block height')
	assertSafeUnsignedInteger(block.nTx, 'block transaction count')
	return block
}

export const getRawTransaction = async ({
	txId,
}: {
	txId: string
}) => {
	assertHash(txId, 'transaction id')
	const transaction = assertEnvelope(
		'transaction',
		bitcoinCoreTransaction,
		await core.getRawTransaction({
			txId,
		})
	)
	if (transaction.txid.toLowerCase() !== txId.toLowerCase())
		throw new Error(`${Source.BitcoinCore_JsonRpc}: transaction id does not match request`)
	assertHash(transaction.hash, 'transaction witness hash')
	const spentOutpoints = new Set<string>()
	for (const input of transaction.vin) {
		if (input.txid == null || input.vout == null)
			continue
		assertHash(input.txid, 'transaction input ID')
		if (!Number.isSafeInteger(input.vout) || input.vout < 0)
			throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid transaction input output index`)
		const spentOutpoint = `${input.txid}:${input.vout}`
		if (spentOutpoints.has(spentOutpoint))
			throw new Error(`${Source.BitcoinCore_JsonRpc}: transaction contains duplicate input outpoints`)
		spentOutpoints.add(spentOutpoint)
	}
	for (const [outputIndex, output] of transaction.vout.entries()) {
		if (output.n !== outputIndex)
			throw new Error(`${Source.BitcoinCore_JsonRpc}: transaction output index does not match its position`)
		if (!/^(?:[0-9a-f]{2})*$/i.test(output.scriptPubKey.hex))
			throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid transaction output script`)
		satoshisFromBtc(output.value, 'transaction output BTC amount')
	}
	return transaction
}

export const getBlockHash = async ({
	height,
}: {
	height: bigint
}) => {
	if (height < 0n || height > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error(`${Source.BitcoinCore_JsonRpc}: block height exceeds lossless JSON integer range`)
	const hash = assertEnvelope(
		'block hash',
		bitcoinCoreBlockHash,
		await core.getBlockHash({
			height,
		})
	)
	assertHash(hash, 'block hash')
	return hash
}

export const getBlockCount = async () => {
	const blockCount = assertEnvelope(
		'block count',
		bitcoinCoreBlockCount,
		await jsonRpc2<unknown>(binding, 'getblockcount', [])
	)
	assertSafeUnsignedInteger(blockCount, 'block count')
	return blockCount
}

export const getMempoolInfo = async () => (
	assertEnvelope(
		'mempool info',
		bitcoinCoreMempoolInfo,
		await core.getMempoolInfo()
	)
)

export const getMempoolTransactionIds = async () => {
	const transactionIds = assertEnvelope(
		'mempool transaction IDs',
		bitcoinCoreMempoolTransactionIds,
		await jsonRpc2<unknown>(binding, 'getrawmempool', [false])
	)
	for (const transactionId of transactionIds)
		assertHash(transactionId, 'mempool transaction ID')
	if (new Set(transactionIds).size !== transactionIds.length)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: duplicate mempool transaction ID`)

	return transactionIds
}

export const getMempoolEntry = async ({
	txId,
}: {
	txId: string
}) => {
	assertHash(txId, 'mempool transaction ID')
	const entry = assertEnvelope(
		'mempool entry',
		bitcoinCoreMempoolEntry,
		await jsonRpc2<unknown>(binding, 'getmempoolentry', [txId])
	)
	assertHash(entry.wtxid, 'mempool transaction witness hash')
	const relatedTransactionIds = [...entry.depends, ...entry.spentby]
	for (const relatedTransactionId of relatedTransactionIds)
		assertHash(relatedTransactionId, 'mempool related transaction ID')
	if (new Set(entry.depends).size !== entry.depends.length)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: duplicate mempool ancestor transaction ID`)
	if (new Set(entry.spentby).size !== entry.spentby.length)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: duplicate mempool descendant transaction ID`)
	if (entry.depends.includes(txId) || entry.spentby.includes(txId))
		throw new Error(`${Source.BitcoinCore_JsonRpc}: mempool transaction references itself`)
	for (const [feeKind, fee] of Object.entries(entry.fees))
		satoshisFromBtc(fee, `mempool ${feeKind} fee`)

	return {
		...entry,
		observedAtMs: Date.now(),
	}
}

export const getBlockTemplate = async () => {
	const template = assertEnvelope(
		'block template',
		bitcoinCoreBlockTemplate,
		await jsonRpc2<unknown>(binding, 'getblocktemplate', [{ rules: ['segwit'] }])
	)
	assertHash(template.previousblockhash, 'block template previous block hash')
	assertHash(template.target, 'block template target')
	if (!/^[0-9a-f]{8}$/i.test(template.bits))
		throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid block template compact target`)
	if (!/^[0-9a-f]{16}$/i.test(template.noncerange))
		throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid block template nonce range`)
	assertSafeUnsignedInteger(template.height, 'block template height')
	assertSafeUnsignedInteger(template.coinbasevalue, 'block template coinbase value')
	const transactionIds = new Set<string>()
	for (const [transactionIndex, transaction] of template.transactions.entries()) {
		assertHash(transaction.txid, 'block template transaction ID')
		assertHash(transaction.hash, 'block template transaction witness hash')
		if (!/^(?:[0-9a-f]{2})+$/i.test(transaction.data))
			throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid block template transaction data`)
		if (transactionIds.has(transaction.txid))
			throw new Error(`${Source.BitcoinCore_JsonRpc}: duplicate block template transaction ID`)
		transactionIds.add(transaction.txid)
		if (transaction.depends.some((dependency) => dependency < 1 || dependency > transactionIndex))
			throw new Error(`${Source.BitcoinCore_JsonRpc}: block template transaction dependency is not an earlier transaction`)
	}

	return template
}

export const estimateSmartFee = async ({
	confirmationTarget,
}: {
	confirmationTarget: number
}) => {
	if (!Number.isSafeInteger(confirmationTarget) || confirmationTarget < 1 || confirmationTarget > 1_008)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: confirmation target must be an integer from 1 through 1008`)
	const estimate = assertEnvelope(
		'smart fee estimate',
		bitcoinCoreSmartFeeEstimate,
		await jsonRpc2<unknown>(binding, 'estimatesmartfee', [confirmationTarget, 'CONSERVATIVE'])
	)
	if (estimate.blocks < 1)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: smart fee estimate returned no confirmation horizon`)
	if (estimate.feerate != null)
		satoshisFromBtc(estimate.feerate, 'smart fee BTC/kvB rate')
	if (estimate.feerate == null && (estimate.errors == null || estimate.errors.length === 0))
		throw new Error(`${Source.BitcoinCore_JsonRpc}: smart fee estimate has neither a rate nor an explicit error`)

	return estimate
}

export const getNetworkHashrate = async ({
	blockWindow = 120,
}: {
	blockWindow?: number
} = {}) => {
	if (!Number.isSafeInteger(blockWindow) || blockWindow < 1 || blockWindow > 2_016)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: hashrate block window must be an integer from 1 through 2016`)
	const hashesPerSecond = assertEnvelope(
		'network hashrate',
		bitcoinCoreNetworkHashrate,
		await jsonRpc2<unknown>(binding, 'getnetworkhashps', [blockWindow, -1])
	)
	if (!Number.isFinite(hashesPerSecond))
		throw new Error(`${Source.BitcoinCore_JsonRpc}: network hashrate is not finite`)

	return hashesPerSecond
}

export const getTransparentAddressUtxos = async ({
	address,
	maxResults,
}: {
	address: string
	maxResults: number
}) => {
	assertBitcoinAddress(address)
	if (!Number.isSafeInteger(maxResults) || maxResults < 0 || maxResults > 10_000)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: UTXO result limit must be an integer from 0 through 10000`)
	if (maxResults === 0)
		return {
			unspents: [] as (BitcoinCoreScanTxOutSet['unspents'][number] & {
				valueSatoshis: bigint
			})[],
			totalAmountSatoshis: 0n,
		}

	const validatedAddress = assertEnvelope(
		'validated address',
		bitcoinCoreValidatedAddress,
		await jsonRpc2<unknown>(
			binding,
			'validateaddress',
			[address]
		)
	)
	if (!validatedAddress.isvalid || validatedAddress.address !== address)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: node rejected or canonicalized the address identity`)

	const result = assertEnvelope(
		'scantxoutset',
		bitcoinCoreScanTxOutSet,
		await jsonRpc2<unknown>(
			binding,
			'scantxoutset',
			[
				'start',
				[`addr(${address})`],
			]
		)
	)
	if (result.success === false)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: UTXO scan did not complete`)
	if (result.unspents.length > maxResults)
		throw new Error(`${Source.BitcoinCore_JsonRpc}: UTXO response exceeds requested result limit`)

	const outpoints = new Set<string>()
	for (const utxo of result.unspents) {
		assertHash(utxo.txid, 'UTXO transaction ID')
		assertSafeUnsignedInteger(utxo.vout, 'UTXO output index')
		assertSafeUnsignedInteger(utxo.height, 'UTXO block height')
		if (!/^(?:[0-9a-f]{2})*$/i.test(utxo.scriptPubKey))
			throw new Error(`${Source.BitcoinCore_JsonRpc}: invalid UTXO script`)
		satoshisFromBtc(utxo.amount, 'UTXO BTC amount')
		const outpoint = `${utxo.txid}:${utxo.vout}`
		if (outpoints.has(outpoint))
			throw new Error(`${Source.BitcoinCore_JsonRpc}: duplicate UTXO outpoint`)
		outpoints.add(outpoint)
	}

	return {
		unspents: result.unspents.map((utxo) => ({
			...utxo,
			valueSatoshis: satoshisFromBtc(utxo.amount, 'UTXO BTC amount'),
		})),
		totalAmountSatoshis: satoshisFromBtc(result.total_amount, 'total BTC amount'),
	}
}

/**
 * Extract Ordinals envelopes + Runestone from a Bitcoin Core `getrawtransaction` verbose wire.
 * @see https://developer.bitcoin.org/reference/rpc/getrawtransaction.html
 * @see https://docs.ordinals.com/inscriptions.html
 * @see https://docs.ordinals.com/runes/specification.html
 */
export const getTransactionProtocolPayloads = async ({
	txId,
}: {
	txId: string
}) => {
	const { extractProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
	return extractProtocolPayloads(
		await getRawTransaction({
			txId,
		})
	)
}
