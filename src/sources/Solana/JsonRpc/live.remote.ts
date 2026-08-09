import {
	getRequestEvent,
	query,
} from '$app/server'
import { type } from 'arktype'

import { iterateSolanaSlotLive } from '$/sources/Solana/JsonRpc/live.server.ts'

export const solanaSlotLive = query.live(
	type({
		bindingId: 'string',
		targetKey: 'string',
	}),
	({ bindingId, targetKey }) => iterateSolanaSlotLive(
		bindingId,
		targetKey,
		getRequestEvent().request.signal
	)
)
