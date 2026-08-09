import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'
import bindings from '$/sources/Envio/bindings.ts'
import { Source } from '$/sources/Source.ts'

export const envioHyperRpc = evmExecutionJsonRpc({
	binding: bindings[Source.EnvioHyperRpc_JsonRpc][0],
})
