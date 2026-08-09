import bindings from '$/sources/GetBlock/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

const queries = evmExecutionJsonRpc({
	binding: bindings[Source.GetBlockRpc_JsonRpc][0],
})

export const getTransactionByHash = (
	request: Parameters<typeof queries.getTransactionByHash>[0]
) => queries.getTransactionByHash(request)

export const getTransactionReceipt = (
	request: Parameters<typeof queries.getTransactionReceipt>[0]
) => queries.getTransactionReceipt(request)
