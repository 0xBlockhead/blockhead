import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 as request } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	EnvioHyperRpcTransaction,
	EnvioHyperRpcTransactionReceipt,
} from '$/sources/Envio/HyperRpc/types.ts'

export const getEvmTransactionByHash = (
	binding: SourceBinding,
	txHash: string
): Promise<EnvioHyperRpcTransaction | null> => (
	request<EnvioHyperRpcTransaction | null>(
		binding,
		'eth_getTransactionByHash',
		[txHash]
	)
)

export const getEvmTransactionReceipt = (
	binding: SourceBinding,
	txHash: string
): Promise<EnvioHyperRpcTransactionReceipt | null> => (
	request<EnvioHyperRpcTransactionReceipt | null>(
		binding,
		'eth_getTransactionReceipt',
		[txHash]
	)
)
