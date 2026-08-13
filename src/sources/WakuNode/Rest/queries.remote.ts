import { query } from '$app/server'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/WakuNode/bindings.ts'
import {
	getDebugInfo as getDebugInfoFromClient,
	getHealth as getHealthFromClient,
} from '$/sources/WakuNode/Rest/queries.ts'


const binding = bindings[Source.WakuNode][0]

export const getDebugInfo = query(() => getDebugInfoFromClient(binding))
export const getHealth = query(() => getHealthFromClient(binding))
