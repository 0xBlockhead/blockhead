import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/Zebra/bindings.ts'
import {
	zebraBlock,
	zebraBlockCount,
	zebraBlockHash,
	zebraMempoolInfo,
	zebraTransaction,
	zebraTransparentAddressUtxos,
	type ZebraBlock,
	type ZebraTransparentAddressUtxos,
} from '$/sources/Zebra/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Zebra_JsonRpc][0]

const core = bitcoinCoreJsonRpc<ZebraBlock>(binding, true)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.Zebra_JsonRpc}: invalid ${label} response envelope`)
	}
}

const assertTransparentAddress = (address: string) => {
	if (!/^t[13][1-9A-HJ-NP-Za-km-z]{33}$/.test(address))
		throw new Error(`${Source.Zebra_JsonRpc}: invalid Zcash mainnet transparent address`)
}

const assertSafeUnsignedInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`${Source.Zebra_JsonRpc}: ${label} exceeds lossless JSON integer range`)
}

const assertHash = (
	hash: string,
	label: string
) => {
	if (!/^[0-9a-f]{64}$/i.test(hash))
		throw new Error(`${Source.Zebra_JsonRpc}: invalid ${label}`)
}

export const getBlock = async ({
	blockHash,
}: {
	blockHash: string
}) => {
	assertHash(blockHash, 'block hash')
	const block = assertEnvelope(
		'block',
		zebraBlock,
		await core.getBlock({
			blockHash,
		})
	)
	if (block.hash.toLowerCase() !== blockHash.toLowerCase())
		throw new Error(`${Source.Zebra_JsonRpc}: block hash does not match request`)
	assertSafeUnsignedInteger(block.height, 'block height')
	assertSafeUnsignedInteger(block.nTx, 'block transaction count')
	return block
}

export const getBlockHash = async ({
	height,
}: {
	height: bigint
}) => {
	if (height < 0n || height > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error(`${Source.Zebra_JsonRpc}: block height exceeds lossless JSON integer range`)
	const hash = assertEnvelope(
		'block hash',
		zebraBlockHash,
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
		zebraBlockCount,
		await jsonRpc2<unknown>(binding, 'getblockcount', [])
	)
)

export const getMempoolInfo = async () => (
	assertEnvelope(
		'mempool info',
		zebraMempoolInfo,
		await core.getMempoolInfo()
	)
)

export const getRawTransaction = async ({
	txId,
}: {
	txId: string
}) => {
	assertHash(txId, 'transaction id')
	const transaction = assertEnvelope(
		'transaction',
		zebraTransaction,
		await core.getRawTransaction({
			txId,
		})
	)
	if (transaction.txid.toLowerCase() !== txId.toLowerCase())
		throw new Error(`${Source.Zebra_JsonRpc}: transaction id does not match request`)
	return transaction
}

export const getTransparentAddressUtxos = async (
	{
		address,
		maxResults,
	}: {
		address: string
		maxResults: number
	}
) => {
	assertTransparentAddress(address)
	if (!Number.isSafeInteger(maxResults) || maxResults < 0 || maxResults > 10_000)
		throw new Error(`${Source.Zebra_JsonRpc}: UTXO result limit must be an integer from 0 through 10000`)
	if (maxResults === 0)
		return {
			utxos: [] as ZebraTransparentAddressUtxos['utxos'],
			hash: '0'.repeat(64),
			height: 0,
		}

	const result = assertEnvelope(
		'address UTXOs',
		zebraTransparentAddressUtxos,
		await jsonRpc2<unknown>(
			binding,
			'getaddressutxos',
			[{
				addresses: [address],
				chainInfo: true,
			}]
		)
	)
	assertHash(result.hash, 'chain-tip hash')
	assertSafeUnsignedInteger(result.height, 'chain-tip height')
	if (result.utxos.length > maxResults)
		throw new Error(`${Source.Zebra_JsonRpc}: UTXO response exceeds requested result limit`)
	const outpoints = new Set<string>()
	for (const utxo of result.utxos) {
		if (utxo.address !== address)
			throw new Error(`${Source.Zebra_JsonRpc}: UTXO response contains a foreign address row`)
		assertHash(utxo.txid, 'UTXO transaction ID')
		assertSafeUnsignedInteger(utxo.height, 'UTXO block height')
		assertSafeUnsignedInteger(utxo.outputIndex, 'UTXO output index')
		assertSafeUnsignedInteger(utxo.satoshis, 'UTXO zatoshi amount')
		if (!/^(?:[0-9a-f]{2})*$/i.test(utxo.script))
			throw new Error(`${Source.Zebra_JsonRpc}: invalid UTXO script`)
		const outpoint = `${utxo.txid}:${utxo.outputIndex}`
		if (outpoints.has(outpoint))
			throw new Error(`${Source.Zebra_JsonRpc}: duplicate UTXO outpoint`)
		outpoints.add(outpoint)
	}
	return result
}

export const getTransparentAddressTransactionIds = async (
	{
		address,
		startHeight,
		endHeight,
		maxResults,
	}: {
		address: string
		startHeight: number
		endHeight: number
		maxResults: number
	}
) => {
	assertTransparentAddress(address)
	assertSafeUnsignedInteger(startHeight, 'start height')
	assertSafeUnsignedInteger(endHeight, 'end height')
	if (endHeight < startHeight || endHeight - startHeight > 9_999)
		throw new Error(`${Source.Zebra_JsonRpc}: transaction history must cover 1 through 10000 blocks`)
	if (!Number.isSafeInteger(maxResults) || maxResults < 0 || maxResults > 10_000)
		throw new Error(`${Source.Zebra_JsonRpc}: transaction result limit must be an integer from 0 through 10000`)
	if (maxResults === 0)
		return []

	const transactionIds = await jsonRpc2<string[]>(
		binding,
		'getaddresstxids',
		[{
			addresses: [address],
			start: startHeight,
			end: endHeight,
		}]
	)
	if (transactionIds.length > maxResults)
		throw new Error(`${Source.Zebra_JsonRpc}: transaction response exceeds requested result limit`)
	const uniqueTransactionIds = new Set<string>()
	for (const transactionId of transactionIds) {
		assertHash(transactionId, 'transparent transaction ID')
		if (uniqueTransactionIds.has(transactionId))
			throw new Error(`${Source.Zebra_JsonRpc}: duplicate transparent transaction ID`)
		uniqueTransactionIds.add(transactionId)
	}
	return transactionIds
}
