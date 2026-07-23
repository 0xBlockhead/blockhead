import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { utxoJsonRpcOrigins } from '$/sources/_shared/interfaces/UtxoJsonRpc/localOrigins.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	ZebraBlock,
	ZebraTransaction,
	ZebraTransparentAddressUtxos,
} from '$/sources/Zebra/JsonRpc/types.ts'

type JsonRpcResponse<_Result> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

const zebraJsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: utxoJsonRpcOrigins,
		init: {
			method: 'POST',
			headers: jsonRpcHeaders,
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		},
	})
	if (!response.ok) await throwHttpError(`Zebra ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`Zebra ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Zebra ${method}: missing result`)
	return json.result
}

const assertBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.Zebra_JsonRpc
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== 'bip122:00040fe8ec8471911baa1db1266ea15'
	)
		throw new Error('Zebra_JsonRpc: expected canonical Zcash mainnet binding')
}

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
	rpcUrl,
	height,
}: {
	rpcUrl: string
	height: bigint
}) => (
	zebraJsonRpc<string>({
		rpcUrl,
		method: 'getblockhash',
		params: [Number(height)],
	})
)

export const getBlock = ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash: string
}) => (
	zebraJsonRpc<ZebraBlock>({
		rpcUrl,
		method: 'getblock',
		params: [
			blockHash,
			2,
		],
	})
)

export const getRawTransaction = ({
	rpcUrl,
	txId,
}: {
	rpcUrl: string
	txId: string
}) => (
	zebraJsonRpc<ZebraTransaction>({
		rpcUrl,
		method: 'getrawtransaction',
		params: [
			txId,
			true,
		],
	})
)

export const getTransparentAddressUtxos = async (
	binding: SourceBinding,
	{
		address,
		maxResults,
	}: {
		address: string
		maxResults: number
	}
) => {
	assertBinding(binding)
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
	binding: SourceBinding,
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
	assertBinding(binding)
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
