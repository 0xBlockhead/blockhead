import { xApiV2Get } from '$/sources/X/Rest/client.ts'
import type {
	XApiV2SearchRecentTweetsResponse,
	XApiV2TweetResponse,
	XApiV2UserTweetsResponse,
	XApiV2UserResponse,
} from '$/sources/X/Rest/types.ts'
import {
	xApiV2SearchRecentTweetsResponseWire,
	xApiV2TweetResponseWire,
	xApiV2UserResponseWire,
	xApiV2UserTweetsResponseWire,
} from '$/sources/X/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

const userFields = 'id,name,username,description,profile_image_url,profile_banner_url,public_metrics,verified,created_at,location,url'
const tweetFields = 'id,text,author_id,created_at,public_metrics,conversation_id,referenced_tweets,attachments'
const tweetExpansions = 'author_id,attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id'
const mediaFields = 'url,type,preview_image_url,alt_text'

const tweetListQuery = (extra: Record<string, string> = {}) => (
	new URLSearchParams({
		'tweet.fields': tweetFields,
		expansions: tweetExpansions,
		'user.fields': userFields,
		'media.fields': mediaFields,
		...extra,
	}).toString()
)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`X_Rest: invalid ${label} response envelope`)
	}
}

export const getUser = async (publicEnv: SourcePublicEnv, id: string) => (
	assertEnvelope(
		'user',
		xApiV2UserResponseWire,
		await xApiV2Get<XApiV2UserResponse>(
			publicEnv,
			`/users/${encodeURIComponent(id)}?${(
				new URLSearchParams({ 'user.fields': userFields }).toString()
			)}`
		)
	)
)

export const getUserByUsername = async (publicEnv: SourcePublicEnv, username: string) => (
	assertEnvelope(
		'user-by-username',
		xApiV2UserResponseWire,
		await xApiV2Get<XApiV2UserResponse>(
			publicEnv,
			`/users/by/username/${encodeURIComponent(username)}?${(
				new URLSearchParams({ 'user.fields': userFields }).toString()
			)}`
		)
	)
)

export const getTweet = async (publicEnv: SourcePublicEnv, id: string) => (
	assertEnvelope(
		'tweet',
		xApiV2TweetResponseWire,
		await xApiV2Get<XApiV2TweetResponse>(
			publicEnv,
			`/tweets/${encodeURIComponent(id)}?${tweetListQuery()}`
		)
	)
)

export const listUserTweets = async (
	publicEnv: SourcePublicEnv,
	userId: string,
	maxResults: number,
	paginationToken?: string
) => (
	assertEnvelope(
		'user-tweets',
		xApiV2UserTweetsResponseWire,
		await xApiV2Get<XApiV2UserTweetsResponse>(
			publicEnv,
			`/users/${encodeURIComponent(userId)}/tweets?${tweetListQuery({
				max_results: String(Math.min(100, Math.max(5, maxResults))),
				...(paginationToken != null && {
					pagination_token: paginationToken,
				}),
			})}`
		)
	)
)

export const searchRecentTweets = async (
	publicEnv: SourcePublicEnv,
	maxResults: number,
	paginationToken?: string
) => (
	assertEnvelope(
		'search-recent',
		xApiV2SearchRecentTweetsResponseWire,
		await xApiV2Get<XApiV2SearchRecentTweetsResponse>(
			publicEnv,
			`/tweets/search/recent?${tweetListQuery({
				query: 'lang:en -is:retweet',
				max_results: String(Math.min(100, Math.max(10, maxResults))),
				...(paginationToken != null && {
					pagination_token: paginationToken,
				}),
			})}`
		)
	)
)
