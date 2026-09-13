import { getRequestEvent, query } from '$app/server'
import { NostrReadRequest } from './live-request.ts'
import { iterateNostrRead } from './live.server.ts'

export const readRelay = query.live(NostrReadRequest, (request) => (
	iterateNostrRead(request, getRequestEvent().request.signal)
))
