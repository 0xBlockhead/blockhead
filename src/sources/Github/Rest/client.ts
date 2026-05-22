import { corsFetch, getJson as fetchGetJson, getText as fetchGetText } from '$/lib/http.ts'
import { githubHttpAllowedOrigins } from '$/sources/Github/githubHttpOrigins.ts'
import { restHeaders, restOrigin } from '$/sources/Github/Rest/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const isGithubRestApiUrl = (url: string) => url.startsWith(restOrigin)

const githubInit = (url: string): RequestInit | undefined => (
	isGithubRestApiUrl(url) ?
		{ headers: restHeaders }
	:	undefined
)

export const githubHttp = ({ url }: { url: string }): Promise<Response> => (
	corsFetch(url, {
		origins: githubHttpAllowedOrigins,
		init: githubInit(url),
	})
)

export const getJson = ({ url }: { url: string }): Promise<JsonValue> => (
	fetchGetJson<JsonValue>(url, {
		origins: [...githubHttpAllowedOrigins],
		init: githubInit(url),
	})
)

export const getText = ({ url }: { url: string }): Promise<string> => (
	fetchGetText(url, {
		origins: [...githubHttpAllowedOrigins],
		init: githubInit(url),
	})
)
