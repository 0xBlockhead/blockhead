import { oauthGetJson } from '$/sources/Reddit/Rest/client.ts'
import type {
	RedditApiInfoResponseWire,
	RedditApiListingWire,
} from '$/sources/Reddit/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

export const redditGetInfo = async (publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>, id: string) => (
	oauthGetJson<RedditApiInfoResponseWire>(
		publicEnv,
		`/api/info?${(
			new URLSearchParams({ id, raw_json: '1' }).toString()
		)}` as const,
	)
)

export const redditGetSubredditAbout = async (publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>, name: string) => (
	oauthGetJson<{
		kind: 't5'
		data: { display_name: string, title: string, public_description: string }
	}>(publicEnv, `/r/${encodeURIComponent(name)}/about?raw_json=1` as const)
)

export const redditListSubredditLinks = async (
	publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>,
	name: string,
	limit: number,
) => (
	oauthGetJson<RedditApiListingWire>(
		publicEnv,
		`/r/${encodeURIComponent(name)}/hot?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}` as const,
	)
)

export const redditListPopularLinks = async (
	publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>,
	limit: number,
) => (
	oauthGetJson<RedditApiListingWire>(
		publicEnv,
		`/r/popular/hot?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}` as const,
	)
)

export const redditGetLinkComments = async (
	publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>,
	permalink: string,
	limit: number,
) => (
	oauthGetJson<RedditApiListingWire[]>(
		publicEnv,
		`${permalink.startsWith('/') ? permalink : `/${permalink}`}.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}`,
	)
)
