import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { wrpcRequest } from '$/sources/_shared/wire/Wrpc/client.ts'
import type { WrpcRequest } from '$/sources/_shared/wire/Wrpc/types.ts'

export const request = (
	binding: SourceBinding,
	message: WrpcRequest
) => (
	wrpcRequest(binding, message)
)
