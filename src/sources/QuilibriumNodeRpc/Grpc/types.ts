import type { GrpcRequest } from '$/sources/_shared/wire/Grpc/types.ts'

export type QuilibriumImplicitAccountReference = {
	implicitAccount: {
		implicitType: number
		address: Uint8Array
	}
}

export type QuilibriumNodeRpcWire = GrpcRequest
