import {
	ApiFamily,
	SourceEndpointKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceServerCredentialsById } from '$/sources/$sourceServerCredentials.server.ts'
import { remoteLiveBindings } from '$/sources/index.server.ts'

export type SourceLiveRequest = {
	source: string
	targetKey: string
	operationGroup: string
	grpc?: {
		service: string
		method: string
		messageBase64?: string
	}
}

const remoteLiveBindingBySourceTargetKeyAndOperationGroup: Partial<Record<string, SourceBinding>> = Object.fromEntries(
	remoteLiveBindings.flatMap((binding) => (
		binding.operationGroups.map((operationGroup) => [
			`${binding.source}:${binding.target.key}:${operationGroup}`,
			binding,
		])
	))
)

export const iterateSourceLive = async function* (
	request: SourceLiveRequest,
	signal?: AbortSignal
) {
	const binding = remoteLiveBindingBySourceTargetKeyAndOperationGroup[
		`${request.source}:${request.targetKey}:${request.operationGroup}`
	]

	if (binding == null)
		throw new Error(`${request.source}: no enabled RemoteLive binding for ${request.operationGroup}`)

	if (
		binding.wireProtocol === WireProtocol.Grpc
		&& binding.apiFamily === ApiFamily.GrpcService
	) {
		if (request.grpc == null)
			throw new Error(`${request.source}: gRPC RemoteLive request is missing its method`)

		const { iterateManagedGrpcLive } = await import(
			'$/sources/_shared/wire/Grpc/live.server.ts'
		)

		yield* iterateManagedGrpcLive({
			binding,
			signal,
			serverCredential: binding.serverCredentialId == null ?
				undefined
			:
				Object.entries(sourceServerCredentialsById)
					.find(([serverCredentialId]) => serverCredentialId === binding.serverCredentialId)?.[1],
			request: {
				service: request.grpc.service,
				method: request.grpc.method,
				...(request.grpc.messageBase64 != null && {
					message: new Uint8Array(Buffer.from(request.grpc.messageBase64, 'base64')),
				}),
			},
		})
		return
	}

	if (request.grpc != null)
		throw new Error(`${request.source}: gRPC request does not match the enabled RemoteLive binding`)

	if (
		binding.wireProtocol === WireProtocol.JsonRpc2
		&& binding.apiFamily === ApiFamily.EvmExecutionJsonRpc
	) {
		const { iterateEvmExecutionJsonRpcLive } = await import(
			'$/sources/_shared/interfaces/EvmExecutionJsonRpc/live.server.ts'
		)

		yield* iterateEvmExecutionJsonRpcLive({
			binding,
			operationGroup: request.operationGroup,
		})
		return
	}

	if (binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)) {
		const { iterateWebSocketLive } = await import(
			'$/sources/_shared/wire/WebSocketMessages/live.server.ts'
		)

		yield* iterateWebSocketLive({
			binding,
			operationGroup: request.operationGroup,
		})
		return
	}

	throw new Error(`${request.source}: unsupported RemoteLive binding`)
}
