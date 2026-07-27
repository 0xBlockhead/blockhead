import { fetchFailedMessage } from '$/lib/http.ts'
import { restHeaders, restOrigin } from '$/sources/Github/Rest/constants.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const isGithubRestApiUrl = (url: string) => url.startsWith(restOrigin)

const githubInit = (url: string): RequestInit | undefined => (
	isGithubRestApiUrl(url) ?
		{ headers: restHeaders }
	:
		undefined
)

export const githubHttp = ({
	binding,
	url,
}: {
	binding: SourceBinding
	url: string
}): Promise<Response> => (
	sourceFetch(
		binding,
		url,
		githubInit(url)
	)
)

export const getJson = async <_Json extends JsonValue = JsonValue>(
	request: {
		binding: SourceBinding
		url: string
	}
): Promise<_Json> => {
	const response = await githubHttp(request)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(request.url, response))

	return response.json()
}

export const getText = async (
	request: {
		binding: SourceBinding
		url: string
	}
): Promise<string> => {
	const response = await githubHttp(request)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(request.url, response))

	return response.text()
}
