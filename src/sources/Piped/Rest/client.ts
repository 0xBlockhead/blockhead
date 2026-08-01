
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Piped/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Piped_Rest]

const toQuery = (params: Record<string, string | undefined>) => {
	const sp = new URLSearchParams()
	for (const [key, value] of Object.entries(params)) {
		if (value == null) continue
		sp.set(key, value)
	}
	const query = sp.toString()
	return query ? `?${query}` : ''
}

export const pipedApiGet = <T>(
	path: `/${string}`,
	params?: Record<string, string | undefined>
) => (
	sourceGetJson<T>(
		binding,
		`${firstHttpUrlForBinding(binding)}${path}${toQuery(params ?? {})}`
	)
)
