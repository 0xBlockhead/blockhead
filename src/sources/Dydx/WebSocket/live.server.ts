import { SourceOperationGroup } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import { iterateSourceLive } from '$/sources/_runtime/live.server.ts'
import {
	parseDydxWebSocketMessage,
	type DydxIndexerLiveRequest,
	type DydxWebSocketMessage,
} from '$/sources/Dydx/WebSocket/types.ts'

export const iterateDydxIndexerLive = async function* (
	request: DydxIndexerLiveRequest,
	signal?: AbortSignal
): AsyncGenerator<DydxWebSocketMessage> {
	for await (const event of iterateSourceLive({
		bindingId: request.bindingId,
		source: Source.DydxIndexer,
		targetKey: request.targetKey,
		operationGroup: SourceOperationGroup.GenericSubscribe,
	}, signal, JSON.stringify(request.subscription))) {
		if (event.type === 'connected')
			continue
		if (event.type === 'grpc-message')
			throw new Error('DydxIndexer_WebSocket: subscription received a gRPC message')

		yield parseDydxWebSocketMessage(event.payload)
	}
}
