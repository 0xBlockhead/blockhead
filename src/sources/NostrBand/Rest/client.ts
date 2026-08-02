import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/NostrBand/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.NostrBand_Rest][0]

const toQuery = (params: Record<string, string | number | undefined>) => {
	const searchParams = new URLSearchParams()
	for (const [key, value] of Object.entries(params)) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}
	const query = searchParams.toString()
	return query ? `?${query}` : ''
}

export const nostrBandGet = <T>(
	path: string,
	params?: Record<string, string | number | undefined>
) => (
	sourceGetJson<T>(
		binding,
		`${firstHttpUrlForBinding(binding)}/v0${path.startsWith('/') ? path : `/${path}`}${toQuery(params ?? {})}`
	)
)
