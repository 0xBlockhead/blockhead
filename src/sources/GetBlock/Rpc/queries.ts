import bindings from '$/sources/GetBlock/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getTransactionByHash,
	getTransactionReceipt,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

const binding = bindings[Source.GetBlockRpc_JsonRpc][0]

export const getEvmTransactionByHash = (
	txHash: string
) => getTransactionByHash({
	binding,
	txHash,
})

export const getEvmTransactionReceipt = (
	txHash: string
) => getTransactionReceipt({
	binding,
	txHash,
})
