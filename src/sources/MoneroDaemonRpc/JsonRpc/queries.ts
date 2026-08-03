import { throwHttpError } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import { TransportType } from '$/constants/TransportType.ts'
import bindings from '$/sources/MoneroDaemonRpc/bindings.ts'
import { jsonRpc2 as requestMoneroDaemonJsonRpc } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type {
	MoneroRpcDecodedTransaction,
	MoneroRpcBlock,
	MoneroRpcInfo,
	MoneroRpcTransaction,
} from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'
import {
	SourceEndpointKind,
	SourceTargetKind,
	type SourceBinding,
	type SourceEndpoint,
} from '$/sources/SourceBinding.ts'

const moneroMainnetBinding = new Map<SourceTargetKind, SourceBinding<Source.MoneroDaemonRpc_JsonRpc>>(
	bindings[Source.MoneroDaemonRpc_JsonRpc].map((binding) => [
		binding.target.kind,
		binding,
	] as const)
).get(SourceTargetKind.Caip2Network)

if (moneroMainnetBinding == null)
	throw new Error('MoneroDaemonRpc_JsonRpc: no mainnet binding')

const moneroMainnetHttpEndpoints = moneroMainnetBinding.endpoints.filter(
	(endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl
)

export const moneroMainnetRpcEndpoints = moneroMainnetHttpEndpoints.map(({ locator: url }) => ({
	url,
	transportType: TransportType.Http,
	providerName: 'Monero daemon',
}))

const queryMoneroMainnet = async <_Result>(
	query: (endpoint: SourceEndpoint) => Promise<_Result>
) => {
	const errors: string[] = []
	for (const endpoint of moneroMainnetHttpEndpoints) {
		try {
			return await query(endpoint)
		} catch (error) {
			errors.push(`${endpoint.locator}: ${error instanceof Error ? error.message : String(error)}`)
		}
	}
	throw new Error(`MoneroDaemonRpc_JsonRpc: all mainnet endpoints failed${errors.length === 0 ? '' : `: ${errors.join('; ')}`}`)
}

const moneroTransactionWithDecodedJson = (transaction: MoneroRpcTransaction) => {
	if (transaction.as_json == null) return transaction
	const decoded_json: MoneroRpcDecodedTransaction = JSON.parse(transaction.as_json)
	return {
		...transaction,
		decoded_json,
	}
}

export const getBlock = ({
	height,
}: {
	height: bigint
}) => queryMoneroMainnet((endpoint) => (
	requestMoneroDaemonJsonRpc<MoneroRpcBlock>(
		moneroMainnetBinding,
		'get_block',
		{
			height: Number(height),
		},
		endpoint
	)
))

export const getTransactions = ({
	txHashes,
}: {
	txHashes: readonly string[]
}) => queryMoneroMainnet(async (endpoint) => {
	const url = new URL('/get_transactions', endpoint.locator).toString()
	const response = await sourceFetch(moneroMainnetBinding, url, {
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
	const transactions = await response.json<{
		txs: MoneroRpcTransaction[]
		txs_as_hex: string[]
	}>()
	return {
		...transactions,
		txs: transactions.txs.map(moneroTransactionWithDecodedJson),
	}
})

export const getInfo = () => queryMoneroMainnet((endpoint) => (
	requestMoneroDaemonJsonRpc<MoneroRpcInfo>(
		moneroMainnetBinding,
		'get_info',
		{},
		endpoint
	)
))
