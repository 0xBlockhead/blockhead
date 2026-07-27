import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Paraswap/bindings.ts'
import type { ParaswapJson } from '$/sources/Paraswap/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

export const query = (path: string) => (
	getJson<ParaswapJson>(bindings[Source.Paraswap_Rest], path)
)
