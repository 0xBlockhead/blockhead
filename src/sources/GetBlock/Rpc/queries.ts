import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

export const getTransactionByHash = (
	binding: SourceBinding,
	request: Parameters<ReturnType<typeof evmExecutionJsonRpc>['getTransactionByHash']>[0]
) => evmExecutionJsonRpc({ binding }).getTransactionByHash(request)

export const getTransactionReceipt = (
	binding: SourceBinding,
	request: Parameters<ReturnType<typeof evmExecutionJsonRpc>['getTransactionReceipt']>[0]
) => evmExecutionJsonRpc({ binding }).getTransactionReceipt(request)
