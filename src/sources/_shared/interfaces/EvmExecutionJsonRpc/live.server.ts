import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { iterateWebSocketLive } from '$/sources/_shared/wire/WebSocketMessages/live.server.ts'

export type EvmExecutionJsonRpcLiveEvent = {
	type: string
	source: string
	targetKey: string
	payload?: unknown
}

export const iterateEvmExecutionJsonRpcLive = async function* ({
	binding,
	operationGroup,
}: {
	binding: SourceBinding
	operationGroup: string
}): AsyncGenerator<EvmExecutionJsonRpcLiveEvent> {
	yield* iterateWebSocketLive({
		binding,
		operationGroup,
	})
}
