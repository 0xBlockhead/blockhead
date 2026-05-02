import { getJson } from '$/lib/http.ts'
import {
	redditApiOrigins,
	redditOauthOrigin,
	redditUserAgent,
	redditWwwOrigin,
} from '$/sources/Reddit/Rest/constants.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const basicAuthB64 = (id: string, sec: string) => globalThis.btoa(`${id}:${sec}`)

let tokenCache: { t: string, expMs: number } | null = null

const getAccessToken = async (publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>) => {
	const id = publicEnv.PUBLIC_REDDIT_CLIENT_ID
	const sec = publicEnv.PUBLIC_REDDIT_CLIENT_SECRET
	if (typeof id !== 'string' || id.trim() === '' || typeof sec !== 'string' || sec.trim() === '') {
		throw new Error('Reddit_Rest: set PUBLIC_REDDIT_CLIENT_ID and PUBLIC_REDDIT_CLIENT_SECRET')
	}
	if (tokenCache != null && tokenCache.expMs > Date.now() + 5_000) {
		return tokenCache.t
	}
	const j = await getJson<{ access_token?: string, expires_in?: number }>(
		`${redditWwwOrigin}/api/v1/access_token`,
		{
			origins: redditApiOrigins,
			init: {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${basicAuthB64(id.trim(), sec.trim())}`,
					'User-Agent': redditUserAgent,
				},
				body: 'grant_type=client_credentials',
			},
		},
	)
	const t = j.access_token
	if (t == null) throw new Error('Reddit_Rest: no access_token')
	const expMs = Date.now() + (typeof j.expires_in === 'number' ? j.expires_in * 1000 : 3_600_000)
	tokenCache = { t, expMs }
	return t
}

const oauthGetJson = async <T>(path: `/${string}`, publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>) => (
	getJson<T>(`${redditOauthOrigin}${path}`, {
		origins: redditApiOrigins,
		init: {
			headers: {
				Authorization: `Bearer ${await getAccessToken(publicEnv)}`,
				'User-Agent': redditUserAgent,
			},
		},
	})
)

export { getAccessToken, oauthGetJson }
