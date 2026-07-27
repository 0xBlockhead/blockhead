import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/MoneroDaemonRpc/bindings.ts'
import { postJson as postMoneroDaemonRestJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import { jsonRpc2 as requestMoneroDaemonJsonRpc } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	MoneroRpcDecodedTransaction,
	MoneroRpcBlock,
	MoneroRpcInfo,
	MoneroRpcTransaction,
} from '$/sources/MoneroDaemonRpc/JsonRpc/types.ts'

const [moneroMainnetBinding] = bindings[Source.MoneroDaemonRpc_JsonRpc]

export const moneroMainnetRpcEndpointUrls = moneroMainnetBinding.endpoints.map(({ locator }) => locator)

const moneroTransactionWithDecodedJson = (transaction: MoneroRpcTransaction): MoneroRpcTransaction => {
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
}) => {
	return requestMoneroDaemonJsonRpc<MoneroRpcBlock>(
		moneroMainnetBinding,
		'get_block',
		{
			height: Number(height),
		}
	)
}

export const getTransactions = ({
	txHashes,
}: {
	txHashes: readonly string[]
}) => {
	return postMoneroDaemonRestJson<{
		txs: MoneroRpcTransaction[]
		txs_as_hex: string[]
	}>({
		binding: moneroMainnetBinding,
		path: '/get_transactions',
		body: {
			txs_hashes: [...txHashes],
			decode_as_json: true,
		},
	}).then((transactions) => ({
		...transactions,
		txs: transactions.txs.map(moneroTransactionWithDecodedJson),
	}))
}

export const getInfo = () => {
	return requestMoneroDaemonJsonRpc<MoneroRpcInfo>(
		moneroMainnetBinding,
		'get_info',
		{}
	)
}
