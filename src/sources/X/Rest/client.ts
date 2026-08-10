import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/X/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.X_Rest][0]

export const xApiV2Get = async <T>(
	path: `/${string}`
) => {
	const url = `${firstHttpUrlForBinding(binding)}/2${path}`
	const response = await sourceFetch(binding, url)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}
