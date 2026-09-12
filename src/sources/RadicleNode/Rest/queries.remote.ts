import { getRequestEvent, query } from '$app/server'
import { env } from '$env/dynamic/private'

import {
	getNode as getNodeFromControl,
	getStats as getStatsFromControl,
	listRepos as listReposFromControl,
} from '$/sources/RadicleNode/Rest/queries.ts'

const controlEnvironment = () => {
	if (getRequestEvent().isRemoteRequest)
		throw new Error('RadicleNode_Control: ServerOnly authority is unavailable through remote requests')

	return {
		RADICLE_NODE_CONTROL_URL: env.RADICLE_NODE_CONTROL_URL ?? '',
	}
}

export const getNode = query(async () => {
	const node = await getNodeFromControl(controlEnvironment())
	return {
		...node,
		observedAtMs: Date.now(),
	}
})
export const getStats = query(() => getStatsFromControl(controlEnvironment()))
export const listRepos = query(() => listReposFromControl(controlEnvironment()))
