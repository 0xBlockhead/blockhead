import {
	fetchFailedMessage,
} from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Reddit/bindings.ts'
import { Source } from '$/sources/Source.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Reddit_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)
const apiBinding = bindingByTargetKey['oauth-api']

const oauthGetJson = async <_Json>(path: string) => {
	const url = `${firstHttpUrlForBinding(apiBinding)}${path.startsWith('/') ? path : `/${path}`}`
	const response = await sourceFetch(apiBinding, url)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<_Json>()
}

export { oauthGetJson }
