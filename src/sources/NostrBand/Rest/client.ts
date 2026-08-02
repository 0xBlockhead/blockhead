import {
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/NostrBand/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.NostrBand_Rest][0]

export const nostrBandGet = <T>(
	path: string,
	params?: Record<string, string | number | undefined>
) => (
	sourceGetJson<T>(
		binding,
		httpUrl(binding, `/v0${path.startsWith('/') ? path : `/${path}`}`, params)
	)
)
