import bindings from '$/sources/GetBlock/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

export const {
	getTransactionByHash,
	getTransactionReceipt,
} = evmExecutionJsonRpc({
	binding: bindings[Source.GetBlockRpc_JsonRpc][0],
})
