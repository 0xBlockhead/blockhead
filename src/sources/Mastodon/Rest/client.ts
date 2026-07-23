import { fetchFailedMessage } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'

const mastodonRestBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.Mastodon_Rest
		&& binding.target.kind === SourceTargetKind.Global
		&& binding.target.key === 'mastodon-compatible-activitypub'
	))

if (mastodonRestBindings.length !== 1)
	throw new Error('Mastodon_Rest: canonical REST source binding is missing or ambiguous')

const mastodonRestBinding = mastodonRestBindings[0]

const qs = (o: Record<string, string | undefined>) => {
	const s = new URLSearchParams()
	for (const [k, v] of Object.entries(o)) {
		if (v == null) continue
		s.set(k, v)
	}
	const t = s.toString()
	return t ? `?${t}` : ''
}

const authHeaders = (publicEnv: SourcePublicEnv): Record<string, string> => {
	const token = optionalPublicEnvString(publicEnv, 'PUBLIC_MASTODON_ACCESS_TOKEN')
	return (
		token != null ?
			{ Authorization: `Bearer ${token}` as const }
		:
			{}
	)
}

export const mastodonGet = async <T>(
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => {
	const url = `${instanceOrigin}/api/${apiVersion}${path}${qs(search ?? {})}`
	const response = await sourceFetch(mastodonRestBinding, url, {
		headers: authHeaders(publicEnv),
	})
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}

export const mastodonFetch = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => sourceFetch(
	mastodonRestBinding,
	`${instanceOrigin}/api/${apiVersion}${path}${qs(search ?? {})}`,
	{ headers: authHeaders(publicEnv) }
)

export const mastodonFetchUrl = async (
	publicEnv: SourcePublicEnv,
	url: string
) => {
	const parsedUrl = new URL(url)
	if (
		parsedUrl.pathname !== '/api/v1/timelines/public'
		|| parsedUrl.username !== ''
		|| parsedUrl.password !== ''
		|| parsedUrl.hash !== ''
	)
		throw new Error('Mastodon_Rest: invalid public timeline URL')

	return sourceFetch(
		mastodonRestBinding,
		url,
		{ headers: authHeaders(publicEnv) }
	)
}
