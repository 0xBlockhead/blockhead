import { redditJsonGet } from '$/sources/RedditPublic/Rest/client.ts'
import type {
	RedditPublicApiInfoResponse,
	RedditPublicApiListing,
	RedditPublicApiSubredditAbout,
} from '$/sources/RedditPublic/Rest/types.ts'

export const redditJsonGetInfo = async (id: string) => (
	redditJsonGet<RedditPublicApiInfoResponse>(
		`/api/info.json?${(
			new URLSearchParams({ id, raw_json: '1' }).toString()
		)}` as const,
	)
)

export const redditJsonGetSubredditAbout = async (name: string) => (
	redditJsonGet<RedditPublicApiSubredditAbout>(
		`/r/${encodeURIComponent(name)}/about.json?raw_json=1` as const,
	)
)

export const redditJsonListSubredditHot = async (
	name: string,
	limit: number,
) => (
	redditJsonGet<RedditPublicApiListing>(
		`/r/${encodeURIComponent(name)}/hot.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}` as const,
	)
)

export const redditJsonGetComments = async (
	permalink: string,
	limit: number,
) => (
	redditJsonGet<RedditPublicApiListing[]>(
		`${permalink.startsWith('/') ? permalink : `/${permalink}`}.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}`,
	)
)

export const redditJsonGetCommentsByArticleId = async (
	articleId: string,
	limit: number,
) => (
	redditJsonGet<RedditPublicApiListing[]>(
		`/comments/${encodeURIComponent(articleId)}.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}` as const,
	)
)
