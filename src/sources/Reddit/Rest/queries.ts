import { oauthGetJson } from '$/sources/Reddit/Rest/client.ts'
import type {
	RedditApiInfoResponse,
	RedditApiListing,
	RedditApiListingRequest,
	RedditApiSubredditAbout,
} from '$/sources/Reddit/Rest/types.ts'
import {
	redditApiCommentsWire,
	redditApiInfoResponseWire,
	redditApiListingWire,
	redditApiSubredditAboutWire,
} from '$/sources/Reddit/Rest/types.ts'

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Reddit_Rest: invalid ${label} response envelope`)
	}
}

export const getInfo = async (id: string) => (
	assertEnvelope(
		'info',
		redditApiInfoResponseWire,
		await oauthGetJson<RedditApiInfoResponse>(
			`/api/info?${(
				new URLSearchParams({ id, raw_json: '1' }).toString()
			)}`
		)
	)
)

export const getSubredditAbout = async (name: string) => (
	assertEnvelope(
		'subreddit-about',
		redditApiSubredditAboutWire,
		await oauthGetJson<RedditApiSubredditAbout>(`/r/${encodeURIComponent(name)}/about?raw_json=1`)
	)
)

export const listSubredditLinks = async (
	name: string,
	limit: number,
	after?: string,
	sort: RedditApiListingRequest['sort'] = 'hot'
) => (
	assertEnvelope(
		'listing',
		redditApiListingWire,
		await oauthGetJson<RedditApiListing>(
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
)

export const getLinkCommentsByArticleId = async (
	articleId: string,
	limit: number
) => (
	assertEnvelope(
		'comments',
		redditApiCommentsWire,
		await oauthGetJson<RedditApiListing[]>(
			`/comments/${encodeURIComponent(articleId)}?${(
				new URLSearchParams({
					limit: String(limit),
					raw_json: '1',
				}).toString()
			)}`
		)
	)
)
