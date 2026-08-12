import { query } from '$app/server'
import { type } from 'arktype'

import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Transmission/bindings.ts'
import {
	sessionGet as sessionGetFromClient,
	sessionStats as sessionStatsFromClient,
	torrentGet as torrentGetFromClient,
} from '$/sources/Transmission/Rpc/queries.ts'


const binding = bindings[Source.TransmissionRpc_JsonRpc][0]

const sessionRemote = query(() => sessionGetFromClient(binding))
const sessionStatsRemote = query(() => sessionStatsFromClient(binding))
const torrentFieldsWire = type('string[]')
const torrentsRemote = query(
	torrentFieldsWire,
	(fields) => torrentGetFromClient(binding, fields)
)

export const sessionGet = (_binding: SourceBinding) => sessionRemote()
export const sessionStats = (_binding: SourceBinding) => sessionStatsRemote()
export const torrentGet = (_binding: SourceBinding, fields: readonly string[]) => torrentsRemote([...fields])
