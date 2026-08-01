import { oauthGetJson } from '$/sources/Reddit/Rest/client.ts'
import type {
	RedditApiInfoResponse,
	RedditApiListing,
	RedditApiListingRequest,
	RedditApiSubredditAbout,
} from '$/sources/Reddit/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

export const getInfo = (publicEnv: SourcePublicEnv, id: string) => (
	oauthGetJson<RedditApiInfoResponse>(
		publicEnv,
		`/api/info?${(
			new URLSearchParams({ id, raw_json: '1' }).toString()
		)}`
	)
)

export const getSubredditAbout = (publicEnv: SourcePublicEnv, name: string) => (
	oauthGetJson<RedditApiSubredditAbout>(publicEnv, `/r/${encodeURIComponent(name)}/about?raw_json=1`)
)

export const listSubredditLinks = (
	publicEnv: SourcePublicEnv,
	name: string,
	limit: number,
	after?: string,
	sort: RedditApiListingRequest['sort'] = 'hot'
) => (
	oauthGetJson<RedditApiListing>(
		publicEnv,
		`/r/${encodeURIComponent(name)}/${sort}?${(
			new URLSearchParams({
				...(after !== undefined && {
					after,
				}),
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}`
	)
)

export const getLinkComments = (
	publicEnv: SourcePublicEnv,
	permalink: string,
	limit: number
) => (
	oauthGetJson<RedditApiListing[]>(
		publicEnv,
		`${permalink.startsWith('/') ? permalink : `/${permalink}`}.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}`
	)
)

export const getLinkCommentsByArticleId = (
	publicEnv: SourcePublicEnv,
	articleId: string,
	limit: number
) => (
	oauthGetJson<RedditApiListing[]>(
		publicEnv,
		`/comments/${encodeURIComponent(articleId)}?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}`
	)
)
