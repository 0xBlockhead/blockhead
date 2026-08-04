import { dydxIndexerLive } from '$/sources/Dydx/WebSocket/live.remote.ts'
import type {
	DydxWebSocketMessage,
	DydxWebSocketSubscription,
} from '$/sources/Dydx/WebSocket/types.ts'

export const subscribeDydxIndexer = async function* (
	subscription: DydxWebSocketSubscription,
	signal?: AbortSignal
): AsyncGenerator<DydxWebSocketMessage> {
	if (signal?.aborted)
		return

	const messages = dydxIndexerLive({
		targetKey: 'cosmos:dydx-mainnet-1',
		subscription,
	})[Symbol.asyncIterator]()
	const abort = () => {
		void messages.return?.()
	}
	signal?.addEventListener('abort', abort, { once: true })

	try {
		for (
			let result = await messages.next();
			!result.done;
			result = await messages.next()
		) {
			if (signal?.aborted)
				return

			yield result.value
		}
	} finally {
		signal?.removeEventListener('abort', abort)
		await messages.return?.()
	}
}
