import {
	redditJsonGet,
} from '$/sources/RedditPublic/Rest/client.ts'
import type {
	RedditPublicApiInfoResponse,
	RedditPublicApiListing,
	RedditPublicApiListingRequest,
	RedditPublicApiSubredditAbout,
} from '$/sources/RedditPublic/Rest/types.ts'
import {
	redditPublicCommentsWire,
	redditPublicInfoResponseWire,
	redditPublicListingWire,
	redditPublicSubredditAboutWire,
} from '$/sources/RedditPublic/Rest/types.ts'

const redditListingLimit = (limit: number) => {
	if (!Number.isSafeInteger(limit) || limit < 0)
		throw new Error('Reddit_PublicJson: listing limit must be a nonnegative safe integer')
	return Math.min(100, limit)
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Reddit_PublicJson: invalid ${label} response envelope`)
	}
}

export const getInfo = async (id: string) => (
	assertEnvelope(
		'info',
		redditPublicInfoResponseWire,
		await redditJsonGet<RedditPublicApiInfoResponse>(
			`/api/info.json?${(
				new URLSearchParams({ id, raw_json: '1' }).toString()
			)}`
		)
	)
)

export const getSubredditAbout = async (name: string) => (
	assertEnvelope(
		'subreddit-about',
		redditPublicSubredditAboutWire,
		await redditJsonGet<RedditPublicApiSubredditAbout>(
			`/r/${encodeURIComponent(name)}/about.json?raw_json=1`
		)
	)
)

export const listSubredditLinks = async (
	name: string,
	request: RedditPublicApiListingRequest
) => {
	const limit = redditListingLimit(request.limit)
	if (limit === 0)
		return {
			kind: 'Listing',
			data: { children: [] },
		} satisfies RedditPublicApiListing

	return assertEnvelope(
		'listing',
		redditPublicListingWire,
		await redditJsonGet<RedditPublicApiListing>(
			`/r/${encodeURIComponent(name)}/${request.sort}.json?${(
				new URLSearchParams({
					...(request.after !== undefined && {
						after: request.after,
					}),
					limit: String(limit),
					raw_json: '1',
				}).toString()
			)}`
		)
	)
}

export const getCommentsByArticleId = async (
	articleId: string,
	limit: number
) => {
	const boundedLimit = redditListingLimit(limit)
	if (boundedLimit === 0)
		return [
			{ kind: 'Listing', data: { children: [] } },
			{ kind: 'Listing', data: { children: [] } },
		] satisfies RedditPublicApiListing[]

	return assertEnvelope(
		'comments',
		redditPublicCommentsWire,
		await redditJsonGet<RedditPublicApiListing[]>(
			`/comments/${encodeURIComponent(articleId)}.json?${(
				new URLSearchParams({
					limit: String(boundedLimit),
					raw_json: '1',
				}).toString()
			)}`
		)
	)
}
