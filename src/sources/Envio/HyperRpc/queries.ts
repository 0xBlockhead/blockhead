import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const envioHyperRpc = (binding: SourceBinding) => evmExecutionJsonRpc({ binding })
