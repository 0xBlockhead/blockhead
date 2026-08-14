import { query } from '$app/server'

import {
	endpoint,
	getConnectedPeerCount as getConnectedPeerCountFromClient,
	getDebugInfo as getDebugInfoFromClient,
	getHealth as getHealthFromClient,
	getVersion as getVersionFromClient,
} from '$/sources/WakuNode/Rest/queries.ts'


export const getEndpoint = query(() => endpoint)
export const getConnectedPeerCount = query(() => getConnectedPeerCountFromClient())
export const getDebugInfo = query(() => getDebugInfoFromClient())
export const getHealth = query(() => getHealthFromClient())
export const getVersion = query(() => getVersionFromClient())
