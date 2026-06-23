export type GrpcRequest = {
	service: string
	method: string
	message?: Uint8Array
}
