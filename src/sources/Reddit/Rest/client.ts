import {
	fetchFailedMessage,
} from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Reddit/bindings.ts'
import type { RedditOAuthTokenResponse } from '$/sources/Reddit/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'

const redditUserAgent = 'Blockhead/1.0.0 (+https://blockhead.vision) by /u/blockhead'

const basicAuthB64 = (id: string, sec: string) => globalThis.btoa(`${id}:${sec}`)

let tokenCache: {
	t: string
	expMs: number
} | null = null

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Reddit_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)
const apiBinding = bindingByTargetKey['oauth-api']
const tokenBinding = bindingByTargetKey['oauth-token']

const getAccessToken = async (publicEnv: SourcePublicEnv) => {
	const id = requiredPublicEnvString(publicEnv, 'PUBLIC_REDDIT_CLIENT_ID')
	const sec = requiredPublicEnvString(publicEnv, 'PUBLIC_REDDIT_CLIENT_SECRET')
	if (tokenCache != null && tokenCache.expMs > Date.now() + 5_000)
		return tokenCache.t
	const url = `${firstHttpUrlForBinding(tokenBinding)}/api/v1/access_token`
	const response = await sourceFetch(tokenBinding, url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${basicAuthB64(id, sec)}`,
			'User-Agent': redditUserAgent,
		},
		body: 'grant_type=client_credentials',
	})
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	const j = await response.json<RedditOAuthTokenResponse>()
	const t = j.access_token
	if (t == null)
		throw new Error('Reddit_Rest: no access_token')

	tokenCache = {
		t,
		expMs: Date.now() + (j.expires_in ?? 3_600) * 1_000,
	}
	return t
}

const oauthGetJson = async <T>(publicEnv: SourcePublicEnv, path: string) => {
	const url = `${firstHttpUrlForBinding(apiBinding)}${path.startsWith('/') ? path : `/${path}`}`
	const response = await sourceFetch(apiBinding, url, {
		headers: {
			Authorization: `Bearer ${await getAccessToken(publicEnv)}`,
			'User-Agent': redditUserAgent,
		},
	})
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}

export { getAccessToken, oauthGetJson }
