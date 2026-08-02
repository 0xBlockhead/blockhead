import bindings from '$/sources/Envio/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { jsonRpc2 as request } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	EnvioHyperRpcTransaction,
	EnvioHyperRpcTransactionReceipt,
} from '$/sources/Envio/HyperRpc/types.ts'

const binding = bindings[Source.EnvioHyperRpc_JsonRpc][0]

export const getEvmTransactionByHash = (
	txHash: string
) => (
	request<EnvioHyperRpcTransaction | null>(
		binding,
		'eth_getTransactionByHash',
		[txHash]
	)
)

export const getEvmTransactionReceipt = (
	txHash: string
) => (
	request<EnvioHyperRpcTransactionReceipt | null>(
		binding,
		'eth_getTransactionReceipt',
		[txHash]
	)
)
