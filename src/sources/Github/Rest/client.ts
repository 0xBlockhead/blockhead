import { corsFetch, getJson as fetchGetJson, getText as fetchGetText } from '$/lib/http.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'
import { restHeaders, restOrigin } from '$/sources/Github/Rest/constants.ts'
import type { SourceOrigin } from '$/sources/$SourceProvider.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const isGithubRestApiUrl = (url: string) => url.startsWith(restOrigin)

const githubInit = (url: string): RequestInit | undefined => (
	isGithubRestApiUrl(url) ?
		{ headers: restHeaders }
	:
		undefined
)

export const githubHttp = ({
	url,
	origins = githubHttpAllowedOrigins,
}: {
	url: string
	origins?: readonly SourceOrigin[]
}): Promise<Response> => (
	corsFetch(url, {
		origins,
		init: githubInit(url),
	})
)

export const getJson = <_Json extends JsonValue = JsonValue>({
	url,
	origins = githubHttpAllowedOrigins,
}: {
	url: string
	origins?: readonly SourceOrigin[]
}): Promise<_Json> => (
	fetchGetJson<_Json>(url, {
		origins: [...origins],
		init: githubInit(url),
	})
)

export const getText = ({
	url,
	origins = githubHttpAllowedOrigins,
}: {
	url: string
	origins?: readonly SourceOrigin[]
}): Promise<string> => (
	fetchGetText(url, {
		origins: [...origins],
		init: githubInit(url),
	})
)
