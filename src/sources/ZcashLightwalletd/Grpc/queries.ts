import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { grpcRequest } from '$/sources/_shared/wire/Grpc/client.ts'
import type { GrpcRequest } from '$/sources/_shared/wire/Grpc/types.ts'

export const request = (
	binding: SourceBinding,
	message: GrpcRequest
) => (
	grpcRequest(binding, message)
)
