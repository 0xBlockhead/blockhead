import {
	getRequestEvent,
	query,
} from '$app/server'
import { type } from 'arktype'

import { iterateSourceLive } from '$/sources/_runtime/live.server.ts'

const sourceLiveRequest = type({
	source: 'string',
	targetKey: 'string',
	operationGroup: 'string',
	'grpc?': {
		service: 'string',
		method: 'string',
		'messageBase64?': 'string',
	},
})

export const sourceLive = query.live(
	sourceLiveRequest,
	(request) => iterateSourceLive(
		request,
		getRequestEvent().request.signal
	)
)
