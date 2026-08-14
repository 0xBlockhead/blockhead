import { query } from '$app/server'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/WakuNode/bindings.ts'
import {
	getConnectedPeerCount as getConnectedPeerCountFromClient,
	getDebugInfo as getDebugInfoFromClient,
	getHealth as getHealthFromClient,
	getVersion as getVersionFromClient,
} from '$/sources/WakuNode/Rest/queries.ts'


const binding = bindings[Source.WakuNode][0]

export const getConnectedPeerCount = query(() => getConnectedPeerCountFromClient(binding))
export const getDebugInfo = query(() => getDebugInfoFromClient(binding))
export const getHealth = query(() => getHealthFromClient(binding))
export const getVersion = query(() => getVersionFromClient(binding))
