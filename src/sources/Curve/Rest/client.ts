import bindings from '$/sources/Curve/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const binding = bindings[Source.Curve_Rest][0]

export const curveGetJson = <_Json>(
	path: string
) => (
	sourceGetJson<_Json>(binding, httpUrl(binding, path))
)
