import { type } from 'arktype'

import { TransportType } from '$/constants/TransportType.ts'
import { throwHttpError } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import {
	jsonRpcHeaders,
	jsonRpcVersion,
} from '$/sources/_shared/wire/JsonRpc2/constants.ts'
import type {
	JsonRpc2Request,
	JsonRpc2Response,
} from '$/sources/_shared/wire/JsonRpc2/types.ts'
import bindings from '$/sources/MoneroDaemonRpc/bindings.ts'
import {
	MoneroRpcBlock,
	MoneroRpcDecodedTransaction,
	MoneroRpcInfo,
	MoneroRpcOuts,
	MoneroRpcTransactionWire,
} from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	type SourceBinding,
	type SourceEndpoint,
} from '$/sources/SourceBinding.ts'


const moneroMainnetBinding = bindings[Source.MoneroDaemonRpc_JsonRpc][0]

type MoneroDaemonRpcBinding = SourceBinding<Source.MoneroDaemonRpc_JsonRpc> & {
	readonly endpoints: readonly SourceEndpoint[]
}

const httpEndpoints = (binding: MoneroDaemonRpcBinding) => binding.endpoints

const moneroTransactionsResponse = type({
	txs: MoneroRpcTransactionWire.array(),
	txs_as_hex: 'string[]',
})

export const moneroMainnetRpcEndpoints = httpEndpoints(moneroMainnetBinding).map(({ locator: url }) => ({
	url,
	transportType: TransportType.Http,
	providerName: 'Monero daemon',
}))

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
		throw new Error(`MoneroDaemonRpc_JsonRpc: invalid ${label} response envelope`)
	}
}

const moneroDaemonUrl = (
	endpoint: SourceEndpoint,
	path: string
) => (
	new URL(
		path.replace(/^\//, ''),
		endpoint.locator.endsWith('/') ?
			endpoint.locator
		:
			`${endpoint.locator}/`
	).toString()
)

const queryMoneroBinding = async <_Result>(
	binding: MoneroDaemonRpcBinding,
	query: (endpoint: SourceEndpoint) => Promise<_Result>
) => {
	const errors: string[] = []
	for (const endpoint of httpEndpoints(binding)) {
		try {
			return await query(endpoint)
		} catch (error) {
			errors.push(`${endpoint.locator}: ${error instanceof Error ? error.message : String(error)}`)
		}
	}
	throw new Error(`MoneroDaemonRpc_JsonRpc: all selected binding endpoints failed${errors.length === 0 ? '' : `: ${errors.join('; ')}`}`)
}

const requestMoneroDaemonJsonRpc = async <_Result>(
	binding: MoneroDaemonRpcBinding,
	endpoint: SourceEndpoint,
	method: string,
	params?: Readonly<Record<string, unknown>>
) => {
	const response = await sourceFetch(moneroMainnetBinding, moneroDaemonUrl(endpoint, 'json_rpc'), {
		method: 'POST',
		headers: jsonRpcHeaders,
		body: JSON.stringify({
			jsonrpc: jsonRpcVersion,
			id: 1,
			method,
			...(params != null && {
				params,
			}),
		} satisfies JsonRpc2Request),
	})
	if (!response.ok)
		await throwHttpError(`JSON-RPC ${method}`, response)

	const json = await response.json<JsonRpc2Response<_Result>>()
	if (json.error != null)
		throw new Error(`JSON-RPC ${method}: ${json.error.message}`)

	return json.result
}

const moneroTransactionWithDecodedJson = (transaction: MoneroRpcTransactionWire) => {
	if (transaction.as_json == null)
		return transaction

	return {
		...transaction,
		decoded_json: MoneroRpcDecodedTransaction.assert(JSON.parse(transaction.as_json)),
	}
}

export const getBlock = ({
	height,
}: {
	height: bigint
}) => queryMoneroBinding(moneroMainnetBinding, async (endpoint) => (
	assertEnvelope(
		'block',
		MoneroRpcBlock,
		await requestMoneroDaemonJsonRpc(
			moneroMainnetBinding,
			endpoint,
			'get_block',
			{
				height: Number(height),
			}
		)
	)
))

export const getTransactions = ({
	txHashes,
}: {
	txHashes: readonly string[]
}) => queryMoneroBinding(moneroMainnetBinding, async (endpoint) => {
	const response = await sourceFetch(moneroMainnetBinding, moneroDaemonUrl(endpoint, 'get_transactions'), {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			txs_hashes: [...txHashes],
			decode_as_json: true,
		}),
	})
	if (!response.ok)
		await throwHttpError('MoneroDaemonRpc_JsonRpc /get_transactions', response)
	const transactions = assertEnvelope(
		'transactions',
		moneroTransactionsResponse,
		await response.json()
	)
	return {
		...transactions,
		txs: transactions.txs.map(moneroTransactionWithDecodedJson),
	}
})

export const getInfo = () => queryMoneroBinding(moneroMainnetBinding, async (endpoint) => (
	assertEnvelope(
		'info',
		MoneroRpcInfo,
		await requestMoneroDaemonJsonRpc(
			moneroMainnetBinding,
			endpoint,
			'get_info',
			{}
		)
	)
))

export const getOuts = ({
	outputs,
	getTxid = false,
}: {
	outputs: readonly {
		amount: number
		index: number | bigint
	}[]
	getTxid?: boolean
}) => queryMoneroBinding(moneroMainnetBinding, async (endpoint) => {
	const response = await sourceFetch(moneroMainnetBinding, moneroDaemonUrl(endpoint, 'get_outs'), {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			outputs: outputs.map(({ amount, index }) => ({
				amount,
				index: Number(index),
			})),
			get_txid: getTxid,
		}),
	})
	if (!response.ok)
		await throwHttpError('MoneroDaemonRpc_JsonRpc /get_outs', response)
	return assertEnvelope(
		'outs',
		MoneroRpcOuts,
		await response.json()
	)
})
