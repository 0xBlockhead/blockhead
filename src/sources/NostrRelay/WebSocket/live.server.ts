import { Source } from '$/sources/Source.ts'
import { SourceOperationGroup } from '$/sources/SourceBinding.ts'
import { iterateSourceLive } from '$/sources/_runtime/live.server.ts'
import { NostrReadRequest } from './live-request.ts'

export const iterateNostrRead = async function* (
	input: typeof NostrReadRequest.infer,
	signal?: AbortSignal
) {
	const request = NostrReadRequest.assert(input)
	yield* iterateSourceLive({
		bindingId: request.bindingId,
		source: Source.NostrRelay_WebSocket,
		targetKey: request.targetKey,
		operationGroup: request.filters.some((filter) => filter.search != null) ?
			SourceOperationGroup.NostrSearch
		:
			SourceOperationGroup.NostrRelayRead,
	}, signal, JSON.stringify(['REQ', request.subscriptionId, ...request.filters]))
}
