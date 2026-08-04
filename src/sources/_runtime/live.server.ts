import {
	ApiFamily,
	SourceEndpointKind,
	SourceOperationGroup,
	WireProtocol,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import sourceServerCredentialsById from '$/sources/$sourceServerCredentials.server.ts'
import { remoteLiveBindings } from '$/sources/index.server.ts'
import type { GrpcLiveEvent } from '$/sources/_shared/wire/Grpc/live.server.ts'
import type { WebSocketLiveEvent } from '$/sources/_shared/wire/WebSocketMessages/live.server.ts'

export type SourceLiveRequest = {
	source: Source
	targetKey: string
	operationGroup: SourceOperationGroup
	grpc?: {
		service: string
		method: string
		messageBase64?: string
	}
}

const remoteLiveBindingBySourceTargetKeyAndOperationGroup = new Map(
	remoteLiveBindings.flatMap((binding) => (
		binding.operationGroups.map((operationGroup) => [
			`${binding.source}:${binding.target.key}:${operationGroup}`,
			binding,
		])
	))
)

export const iterateSourceLive = async function* (
	request: SourceLiveRequest,
	signal?: AbortSignal,
	webSocketInitialMessage?: string
): AsyncGenerator<GrpcLiveEvent | WebSocketLiveEvent> {
	const binding = remoteLiveBindingBySourceTargetKeyAndOperationGroup.get(
		`${request.source}:${request.targetKey}:${request.operationGroup}`
	)

	if (binding == null)
		throw new Error(`${request.source}: no enabled RemoteLive binding for ${request.operationGroup}`)

	if (binding.wireProtocol === WireProtocol.Grpc) {
		if (webSocketInitialMessage != null)
			throw new Error(`${request.source}: WebSocket initial message does not match the enabled gRPC binding`)
		if (request.grpc == null)
			throw new Error(`${request.source}: gRPC RemoteLive request is missing its method`)

		const { iterateManagedGrpcLive } = await import(
			'$/sources/_shared/wire/Grpc/live.server.ts'
		)

		yield* iterateManagedGrpcLive({
			binding,
			signal,
			serverCredential: sourceServerCredentialsById.get(sourceBindingId(binding)),
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
		if (webSocketInitialMessage != null)
			throw new Error(`${request.source}: WebSocket initial message does not match the enabled JSON-RPC binding`)
		const { iterateEvmExecutionJsonRpcLive } = await import(
			'$/sources/_shared/interfaces/EvmExecutionJsonRpc/live.server.ts'
		)

		yield* iterateEvmExecutionJsonRpcLive({
			binding,
			operationGroup: request.operationGroup,
			signal,
		})
		return
	}

	if (binding.endpoints.some((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)) {
		const { iterateWebSocketLive } = await import(
			'$/sources/_shared/wire/WebSocketMessages/live.server.ts'
		)

		yield* iterateWebSocketLive({
			binding,
			initialMessage: webSocketInitialMessage,
			operationGroup: request.operationGroup,
			signal,
		})
		return
	}

	throw new Error(`${request.source}: unsupported RemoteLive binding`)
}
