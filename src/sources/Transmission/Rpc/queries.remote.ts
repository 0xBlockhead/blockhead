import { query } from '$app/server'
import { type } from 'arktype'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Transmission/bindings.ts'
import {
	sessionGet as sessionGetFromClient,
	sessionStats as sessionStatsFromClient,
	torrentGet as torrentGetFromClient,
} from '$/sources/Transmission/Rpc/queries.ts'


const binding = bindings[Source.TransmissionRpc_JsonRpc][0]

export const sessionGet = query(() => sessionGetFromClient(binding))
export const sessionStats = query(() => sessionStatsFromClient(binding))
const torrentFieldsWire = type('string[]')
export const torrentGet = query(
	torrentFieldsWire,
	(fields) => torrentGetFromClient(binding, fields)
)
