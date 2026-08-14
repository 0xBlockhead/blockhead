import { query } from '$app/server'
import { type } from 'arktype'

import {
	sessionGet as sessionGetFromClient,
	sessionStats as sessionStatsFromClient,
	torrentGet as torrentGetFromClient,
} from '$/sources/Transmission/Rpc/queries.ts'


export const sessionGet = query(() => sessionGetFromClient())
export const sessionStats = query(() => sessionStatsFromClient())
const torrentFieldsWire = type('string[]')
export const torrentGet = query(
	torrentFieldsWire,
	(fields) => torrentGetFromClient(fields)
)
