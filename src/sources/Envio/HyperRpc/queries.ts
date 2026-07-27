import bindings from '$/sources/Envio/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { jsonRpc2 as request } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	EnvioHyperRpcTransaction,
	EnvioHyperRpcTransactionReceipt,
} from '$/sources/Envio/HyperRpc/types.ts'

const binding = bindings[Source.EnvioHyperRpc_JsonRpc]

export const getEvmTransactionByHash = (
	txHash: string
): Promise<EnvioHyperRpcTransaction | null> => (
	request<EnvioHyperRpcTransaction | null>(
		binding,
		'eth_getTransactionByHash',
		[txHash]
	)
)

export const getEvmTransactionReceipt = (
	txHash: string
): Promise<EnvioHyperRpcTransactionReceipt | null> => (
	request<EnvioHyperRpcTransactionReceipt | null>(
		binding,
		'eth_getTransactionReceipt',
		[txHash]
	)
)
