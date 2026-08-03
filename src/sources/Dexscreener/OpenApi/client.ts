import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Dexscreener/bindings.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'

export const getDexscreenerJson = <_Response>(
	pathAndQuery: string
) => getJson<_Response>(bindings[Source.Dexscreener_Rest][0], pathAndQuery)
