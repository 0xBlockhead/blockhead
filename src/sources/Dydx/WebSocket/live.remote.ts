import {
	getRequestEvent,
	query,
} from '$app/server'

import { iterateDydxIndexerLive } from '$/sources/Dydx/WebSocket/live.server.ts'
import { DydxIndexerLiveRequest } from '$/sources/Dydx/WebSocket/types.ts'

export const dydxIndexerLive = query.live(
	DydxIndexerLiveRequest,
	(request) => iterateDydxIndexerLive(
		request,
		getRequestEvent().request.signal
	)
)
