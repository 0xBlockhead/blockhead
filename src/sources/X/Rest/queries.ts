import { xApiV2Get } from '$/sources/X/Rest/client.ts'
import type { XApiV2TweetWire, XApiV2UserTweetsWire, XApiV2UserWire } from '$/sources/X/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const userFields = 'id,name,username,description,profile_image_url'
const tweetFields = 'id,text,author_id,created_at'

export const xGetUser = async (publicEnv: SourcePublicEnvFor<Source.X_Rest>, id: string) => (
	xApiV2Get<XApiV2UserWire>(
		publicEnv,
		`/users/${encodeURIComponent(id)}?${(
			new URLSearchParams({ 'user.fields': userFields }).toString()
		)}` as const,
	)
)

export const xGetTweet = async (publicEnv: SourcePublicEnvFor<Source.X_Rest>, id: string) => (
	xApiV2Get<XApiV2TweetWire>(
		publicEnv,
		`/tweets/${encodeURIComponent(id)}?${(
			new URLSearchParams([
				['tweet.fields', tweetFields],
				['expansions', 'author_id'],
				['user.fields', userFields],
			]).toString()
		)}` as const,
	)
)

export const xListUserTweets = async (
	publicEnv: SourcePublicEnvFor<Source.X_Rest>,
	userId: string,
	maxResults: number,
) => (
	xApiV2Get<XApiV2UserTweetsWire>(
		publicEnv,
		`/users/${encodeURIComponent(userId)}/tweets?${(
			new URLSearchParams({
				max_results: String(Math.min(100, Math.max(5, maxResults))),
				'tweet.fields': 'id',
			}).toString()
		)}` as const,
	)
)

export const xSearchRecentTweets = async (
	publicEnv: SourcePublicEnvFor<Source.X_Rest>,
	maxResults: number,
) => (
	xApiV2Get<{
		data?: {
			author_id?: string
			id: string
		}[]
		includes?: {
			users?: {
				id: string
			}[]
		}
	}>(
		publicEnv,
		`/tweets/search/recent?${(
			new URLSearchParams({
				query: 'lang:en -is:retweet',
				max_results: String(Math.min(100, Math.max(10, maxResults))),
				expansions: 'author_id',
				'tweet.fields': 'id,author_id',
				'user.fields': 'id',
			}).toString()
		)}` as const,
	)
)
