import bindings from '$/sources/Envio/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

export const {
	getTransactionByHash,
	getTransactionReceipt,
} = evmExecutionJsonRpc({
	binding: bindings[Source.EnvioHyperRpc_JsonRpc][0],
})
