import { query } from '$app/server'
import { Source } from '$/sources/Source.ts'
import { probeSourceHttpEndpoint } from '$/sources/_runtime/probe.ts'
import { type } from 'arktype'


export const probeSourceHttpEndpointRemote = query(
	type.enumerated(...Object.values(Source)),
	probeSourceHttpEndpoint
)
