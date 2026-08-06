import bindings from '$/sources/BitcoinCore/bindings.ts'
import {
	bitcoinCoreBlock,
	bitcoinCoreBlockCount,
	bitcoinCoreBlockHash,
	bitcoinCoreMempoolInfo,
	bitcoinCoreScanTxOutSet,
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

export const getBlockCount = async () => (
	assertEnvelope(
		'block count',
		bitcoinCoreBlockCount,
		await jsonRpc2<unknown>(binding, 'getblockcount', [])
	)
)

export const getMempoolInfo = async () => (
	assertEnvelope(
		'mempool info',
		bitcoinCoreMempoolInfo,
		await core.getMempoolInfo()
	)
)

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
