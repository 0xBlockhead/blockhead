import { redditJsonGet } from '$/sources/RedditPublic/Rest/client.ts'
import type {
	RedditApiInfoResponseWire,
	RedditApiListingWire,
	RedditApiSubredditAboutWire,
} from '$/sources/Reddit/Rest/types.ts'

export const redditJsonGetInfo = async (id: string) => (
	redditJsonGet<RedditApiInfoResponseWire>(
		`/api/info.json?${(
			new URLSearchParams({ id, raw_json: '1' }).toString()
		)}` as const,
	)
)

export const redditJsonGetSubredditAbout = async (name: string) => (
	redditJsonGet<RedditApiSubredditAboutWire>(
		`/r/${encodeURIComponent(name)}/about.json?raw_json=1` as const,
	)
)

export const redditJsonListSubredditHot = async (
	name: string,
	limit: number,
) => (
	redditJsonGet<RedditApiListingWire>(
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
	redditJsonGet<RedditApiListingWire[]>(
		`${permalink.startsWith('/') ? permalink : `/${permalink}`}.json?${(
			new URLSearchParams({
				limit: String(limit),
				raw_json: '1',
			}).toString()
		)}`,
	)
)
