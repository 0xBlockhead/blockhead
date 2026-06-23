import { query } from '$app/server'
import { type } from 'arktype'

import {
	ApiFamily,
	SourceEndpointKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { remoteLiveBindings } from '$/sources/index.server.ts'

const sourceLiveRequest = type({
	source: 'string',
	targetKey: 'string',
	operationGroup: 'string',
})

const remoteLiveBindingKey = ({
	source,
	targetKey,
	operationGroup,
}: {
	source: string
	targetKey: string
	operationGroup: string
}) => `${source}:${targetKey}:${operationGroup}`

const remoteLiveBindingBySourceTargetKeyAndOperationGroup: Partial<Record<string, SourceBinding>> = Object.fromEntries(
	remoteLiveBindings.flatMap((binding) => (
		binding.operationGroups.map((operationGroup) => [
			remoteLiveBindingKey({
				source: binding.source,
				targetKey: binding.target.key,
				operationGroup,
			}),
			binding,
		])
	))
)

export const sourceLive = query.live(sourceLiveRequest, async function* (request) {
	const binding = remoteLiveBindingBySourceTargetKeyAndOperationGroup[
		remoteLiveBindingKey(request)
	]

	if (binding == null)
		throw new Error(`${request.source}: no enabled RemoteLive binding for ${request.operationGroup}`)

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
})
