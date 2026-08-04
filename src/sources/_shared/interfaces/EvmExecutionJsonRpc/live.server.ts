import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	iterateWebSocketLive,
	type WebSocketLiveEvent,
} from '$/sources/_shared/wire/WebSocketMessages/live.server.ts'

export const iterateEvmExecutionJsonRpcLive = async function* ({
	binding,
	operationGroup,
	signal,
}: {
	binding: SourceBinding
	operationGroup: string
	signal?: AbortSignal
}): AsyncGenerator<WebSocketLiveEvent> {
	yield* iterateWebSocketLive({
		binding,
		operationGroup,
		signal,
	})
}
