import {
	getRequestEvent,
	query,
} from '$app/server'
import { type } from 'arktype'

import { iterateSourceLive } from '$/sources/_runtime/live.server.ts'
import { Source } from '$/sources/Source.ts'
import { SourceOperationGroup } from '$/sources/SourceBinding.ts'

const sourceLiveRequest = type({
	bindingId: 'string',
	source: type.enumerated(...Object.values(Source)),
	targetKey: 'string',
	operationGroup: type.enumerated(...Object.values(SourceOperationGroup)),
	'serviceOrigin?': 'string',
	'cursor?': type('number.integer').narrow((cursor) => (
		Number.isSafeInteger(cursor) && cursor >= 0
	)),
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
