import { query } from '$app/server'

import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/WakuNode/bindings.ts'
import {
	getDebugInfo as getDebugInfoFromClient,
	getHealth as getHealthFromClient,
} from '$/sources/WakuNode/Rest/queries.ts'


const binding = bindings[Source.WakuNode][0]

const debugInfoRemote = query(() => getDebugInfoFromClient(binding))
const healthRemote = query(() => getHealthFromClient(binding))

export const getDebugInfo = (_binding: SourceBinding) => debugInfoRemote()
export const getHealth = (_binding: SourceBinding) => healthRemote()
