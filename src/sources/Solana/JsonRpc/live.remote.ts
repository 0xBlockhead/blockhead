import {
	getRequestEvent,
	query,
} from '$app/server'
import { type } from 'arktype'

import { iterateSolanaSlotLive } from '$/sources/Solana/JsonRpc/live.server.ts'

export const solanaSlotLive = query.live(
	type({
		targetKey: 'string',
	}),
	({ targetKey }) => iterateSolanaSlotLive(
		targetKey,
		getRequestEvent().request.signal
	)
)
