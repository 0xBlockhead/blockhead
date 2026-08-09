import {
	getRequestEvent,
	query,
} from '$app/server'
import { type } from 'arktype'

import { iterateXrplLedgerLive } from '$/sources/XrplClio/JsonRpc/live.server.ts'

export const xrplLedgerLive = query.live(
	type({
		bindingId: 'string',
		targetKey: 'string',
	}),
	({ bindingId, targetKey }) => iterateXrplLedgerLive(
		bindingId,
		targetKey,
		getRequestEvent().request.signal
	)
)
