import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	MoneroRpcDecodedTransaction,
	MoneroRpcBlock,
	MoneroRpcInfo,
	MoneroRpcTransaction,
} from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'

export const moneroMainnetRpcEndpoints = [
	{
		url: 'https://xmr-node.cakewallet.com:18081/json_rpc',
		transportType: TransportType.Http,
		providerName: 'Monero daemon',
	},
	{
		url: 'http://nodes.hashvault.pro:18081/json_rpc',
		transportType: TransportType.Http,
		providerName: 'Monero daemon',
	},
] as const

export const moneroDaemonRpcOrigins = [
	{
		origin: 'https://xmr-node.cakewallet.com:18081',
		corsEnabled: false,
	},
	{
		origin: 'http://nodes.hashvault.pro:18081',
		corsEnabled: false,
	},
	{
		origin: 'http://127.0.0.1:18081',
		corsEnabled: false,
	},
] as const

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

const moneroTransactionWithDecodedJson = (transaction: MoneroRpcTransaction): MoneroRpcTransaction => {
	if (transaction.as_json == null) return transaction
	const decoded_json: MoneroRpcDecodedTransaction = JSON.parse(transaction.as_json)
	return {
		...transaction,
		decoded_json,
	}
}

const moneroJsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue
}) => {
	const response = await corsFetch(rpcUrl, {
		origins: moneroDaemonRpcOrigins,
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
	if (!response.ok) await throwHttpError(`Monero ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`Monero ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`Monero ${method}: missing result`)
	return json.result
}

export const getBlock = ({
	rpcUrl,
	height,
}: {
	rpcUrl: string
	height: bigint
}) => (
	moneroJsonRpc<MoneroRpcBlock>({
		rpcUrl,
		method: 'get_block',
		params: {
			height: Number(height),
		},
	})
)

export const getTransactions = ({
	rpcUrl,
	txHashes,
}: {
	rpcUrl: string
	txHashes: readonly string[]
}) => {
	const transactionsUrl = new URL('get_transactions', rpcUrl).toString()
	return corsFetch(transactionsUrl, {
		origins: moneroDaemonRpcOrigins,
		init: {
			method: 'POST',
			headers: jsonRpcHeaders,
			body: JSON.stringify({
				txs_hashes: [...txHashes],
				decode_as_json: true,
			}),
		},
	}).then(async (response) => {
		if (!response.ok) await throwHttpError('Monero get_transactions', response)
		return response.json<{
			txs: MoneroRpcTransaction[]
			txs_as_hex: string[]
		}>()
	}).then((transactions) => ({
		...transactions,
		txs: transactions.txs.map(moneroTransactionWithDecodedJson),
	}))
}

export const getInfo = ({ rpcUrl }: { rpcUrl: string }) => (
	moneroJsonRpc<MoneroRpcInfo>({
		rpcUrl,
		method: 'get_info',
		params: {},
	})
)
