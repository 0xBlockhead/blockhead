import { getJson } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import {
	redditOauthOrigin,
	redditUserAgent,
	redditWwwOrigin,
} from '$/sources/Reddit/Rest/constants.ts'
import Reddit from '$/sources/Reddit/index.ts'
import type { RedditOAuthTokenResponse } from '$/sources/Reddit/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'

const basicAuthB64 = (id: string, sec: string) => globalThis.btoa(`${id}:${sec}`)

let tokenCache: {
	t: string
	expMs: number
} | null = null

const getAccessToken = async (publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>) => {
	const id = requiredPublicEnvString(publicEnv, 'PUBLIC_REDDIT_CLIENT_ID')
	const sec = requiredPublicEnvString(publicEnv, 'PUBLIC_REDDIT_CLIENT_SECRET')
	if (tokenCache != null && tokenCache.expMs > Date.now() + 5_000)
		return tokenCache.t
	const j = await getJson<RedditOAuthTokenResponse>(
		`${redditWwwOrigin}/api/v1/access_token`,
		{
			origins: Reddit.origins,
			init: {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${basicAuthB64(id, sec)}`,
					'User-Agent': redditUserAgent,
				},
				body: 'grant_type=client_credentials',
			},
		}
	)
	const t = j.access_token
	if (t == null) throw new Error('Reddit_Rest: no access_token')
	const expMs = Date.now() + (j.expires_in ?? 3_600) * 1_000
	tokenCache = {
		t,
		expMs,
	}
	return t
}

const oauthGetJson = async <T>(publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>, path: string) => (
	getJson<T>(`${redditOauthOrigin}${path.startsWith('/') ? path : `/${path}`}`, {
		origins: Reddit.origins,
		init: {
			headers: {
				Authorization: `Bearer ${await getAccessToken(publicEnv)}`,
				'User-Agent': redditUserAgent,
			},
		},
	})
)

export { getAccessToken, oauthGetJson }
