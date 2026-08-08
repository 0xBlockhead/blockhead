
import {
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Piped/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Piped_Rest].at(0)!

export const pipedApiGet = <T>(
	path: `/${string}`,
	params?: Record<string, string | undefined>
) => (
	sourceGetJson<T>(
		binding,
		httpUrl(binding, path, params)
	)
)
