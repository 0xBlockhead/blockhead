import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { XrpcRequest } from '$/sources/_shared/wire/Xrpc/types.ts'

export const xrpcRequest = (
	binding: SourceBinding,
	request: XrpcRequest
) => ({
	binding,
	request,
})
