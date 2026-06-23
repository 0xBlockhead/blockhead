import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { GrpcRequest } from '$/sources/_shared/wire/Grpc/types.ts'

export const grpcRequest = (
	binding: SourceBinding,
	request: GrpcRequest
) => ({
	binding,
	request,
})
