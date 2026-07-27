import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	ZebraBlock,
	ZebraTransaction,
	ZebraTransparentAddressUtxos,
} from '$/sources/Zebra/JsonRpc/types.ts'
import bindings from '$/sources/Zebra/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Zebra_JsonRpc]

const assertTransparentAddress = (address: string) => {
	if (!/^t[13][1-9A-HJ-NP-Za-km-z]{33}$/.test(address))
		throw new Error('Zebra_JsonRpc: invalid Zcash mainnet transparent address')
}

const assertSafeUnsignedInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Zebra_JsonRpc: ${label} exceeds lossless JSON integer range`)
}

const assertHash = (
	hash: string,
	label: string
) => {
	if (!/^[0-9a-f]{64}$/.test(hash))
		throw new Error(`Zebra_JsonRpc: invalid ${label}`)
}

export const getBlockHash = ({
	height,
}: {
	height: bigint
}) => {
	return jsonRpc2<string>(binding, 'getblockhash', [Number(height)])
}

export const getBlock = ({
	blockHash,
}: {
	blockHash: string
}) => {
	return jsonRpc2<ZebraBlock>(
		binding,
		'getblock',
		[
			blockHash,
			2,
		]
	)
}

export const getRawTransaction = ({
	txId,
}: {
	txId: string
}) => {
	return jsonRpc2<ZebraTransaction>(
		binding,
		'getrawtransaction',
		[
			txId,
			true,
		]
	)
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
		throw new Error('Zebra_JsonRpc: UTXO result limit must be an integer from 0 through 10000')
	if (maxResults === 0)
		return {
			utxos: [],
			hash: '0'.repeat(64),
			height: 0,
		} satisfies ZebraTransparentAddressUtxos

	const result = await jsonRpc2<ZebraTransparentAddressUtxos>(
		binding,
		'getaddressutxos',
		[{
			addresses: [address],
			chainInfo: true,
		}]
	)
	assertHash(result.hash, 'chain-tip hash')
	assertSafeUnsignedInteger(result.height, 'chain-tip height')
	if (result.utxos.length > maxResults)
		throw new Error('Zebra_JsonRpc: UTXO response exceeds requested result limit')
	const outpoints = new Set<string>()
	for (const utxo of result.utxos) {
		if (utxo.address !== address)
			throw new Error('Zebra_JsonRpc: UTXO response contains a foreign address row')
		assertHash(utxo.txid, 'UTXO transaction ID')
		assertSafeUnsignedInteger(utxo.height, 'UTXO block height')
		assertSafeUnsignedInteger(utxo.outputIndex, 'UTXO output index')
		assertSafeUnsignedInteger(utxo.satoshis, 'UTXO zatoshi amount')
		if (!/^(?:[0-9a-f]{2})*$/.test(utxo.script))
			throw new Error('Zebra_JsonRpc: invalid UTXO script')
		const outpoint = `${utxo.txid}:${utxo.outputIndex}`
		if (outpoints.has(outpoint))
			throw new Error('Zebra_JsonRpc: duplicate UTXO outpoint')
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
		throw new Error('Zebra_JsonRpc: transaction history must cover 1 through 10000 blocks')
	if (!Number.isSafeInteger(maxResults) || maxResults < 0 || maxResults > 10_000)
		throw new Error('Zebra_JsonRpc: transaction result limit must be an integer from 0 through 10000')
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
		throw new Error('Zebra_JsonRpc: transaction response exceeds requested result limit')
	const uniqueTransactionIds = new Set<string>()
	for (const transactionId of transactionIds) {
		assertHash(transactionId, 'transparent transaction ID')
		if (uniqueTransactionIds.has(transactionId))
			throw new Error('Zebra_JsonRpc: duplicate transparent transaction ID')
		uniqueTransactionIds.add(transactionId)
	}
	return transactionIds
}
