import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { WrpcRequest } from '$/sources/_shared/wire/Wrpc/types.ts'

export const wrpcRequest = (
	binding: SourceBinding,
	request: WrpcRequest
) => ({
	binding,
	request,
})
