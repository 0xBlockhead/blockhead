import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/RadicleNode/bindings.ts'
import type { RadicleNodeJson } from '$/sources/RadicleNode/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

export const query = (path: string) => (
	getJson<RadicleNodeJson>(bindings[Source.RadicleNode_Control], path)
)
