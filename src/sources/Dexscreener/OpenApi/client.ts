import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Dexscreener/bindings.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = bindings[Source.Dexscreener_Rest]

export const getDexscreenerJson = <_Response>(
	pathAndQuery: string
) => getJson<_Response>(binding, pathAndQuery)
