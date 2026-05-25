import { oauthGetJson } from '$/sources/Reddit/Rest/client.ts'
import type {
	RedditApiInfoResponse,
	RedditApiListing,
	RedditApiSubredditAbout,
} from '$/sources/Reddit/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

export const redditGetInfo = async (publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>, id: string) => (
	oauthGetJson<RedditApiInfoResponse>(
		publicEnv,
		`/api/info?${(
			new URLSearchParams({ id, raw_json: '1' }).toString()
		)}` as const,
	)
)

export const redditGetSubredditAbout = async (publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>, name: string) => (
	oauthGetJson<RedditApiSubredditAbout>(publicEnv, `/r/${encodeURIComponent(name)}/about?raw_json=1` as const)
)

export const redditListSubredditLinks = async (
	publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>,
	name: string,
	limit: number,
) => (
	oauthGetJson<RedditApiListing>(
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
	oauthGetJson<RedditApiListing>(
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
	oauthGetJson<RedditApiListing[]>(
		publicEnv,
		`${permalink.startsWith('/') ? permalink : `/${permalink}`}.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}`,
	)
)

export const redditGetLinkCommentsByArticleId = async (
	publicEnv: SourcePublicEnvFor<Source.Reddit_Rest>,
	articleId: string,
	limit: number,
) => (
	oauthGetJson<RedditApiListing[]>(
		publicEnv,
		`/comments/${encodeURIComponent(articleId)}?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}` as const,
	)
)
