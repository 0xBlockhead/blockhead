import bindings from '$/sources/Envio/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getTransactionByHash as getEvmTransactionByHash,
	getTransactionReceipt as getEvmTransactionReceipt,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

const binding = bindings[Source.EnvioHyperRpc_JsonRpc][0]

export const getTransactionByHash = (txHash: string) => getEvmTransactionByHash({
	binding,
	txHash,
})

export const getTransactionReceipt = (txHash: string) => getEvmTransactionReceipt({
	binding,
	txHash,
})
