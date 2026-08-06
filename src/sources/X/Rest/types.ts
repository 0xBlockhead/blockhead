import {
	type as arktype,
	type Type,
} from 'arktype'

export type XApiV2PublicMetrics = {
	followers_count?: number
	following_count?: number
	tweet_count?: number
	listed_count?: number
	like_count?: number
	retweet_count?: number
	reply_count?: number
	quote_count?: number
}

export type XApiV2User = {
	id?: string
	name?: string
	username?: string
	description?: string
	profile_image_url?: string
	profile_banner_url?: string
	public_metrics?: XApiV2PublicMetrics
	verified?: boolean
	created_at?: string
	location?: string
	url?: string
}

export type XApiV2UserResponse = {
	data?: XApiV2User
}

export type XApiV2Media = {
	media_key?: string
	type?: string
	url?: string
	preview_image_url?: string
	alt_text?: string
}

export type XApiV2Tweet = {
	id?: string
	text?: string
	author_id?: string
	created_at?: string
	conversation_id?: string
	public_metrics?: XApiV2PublicMetrics
	referenced_tweets?: {
		type: string
		id: string
	}[]
	attachments?: {
		media_keys?: string[]
	}
}

export type XApiV2TweetIncludes = {
	users?: XApiV2User[]
	media?: XApiV2Media[]
	tweets?: XApiV2Tweet[]
}

export type XApiV2TweetResponse = {
	data?: XApiV2Tweet
	includes?: XApiV2TweetIncludes
}

export type XApiV2UserTweetsResponse = {
	data?: XApiV2Tweet[]
	includes?: XApiV2TweetIncludes
	meta?: {
		next_token?: string
	}
}

export type XApiV2SearchRecentTweetsResponse = {
	data?: XApiV2Tweet[]
	includes?: XApiV2TweetIncludes
	meta?: {
		next_token?: string
	}
}


const xApiV2PublicMetricsWire = arktype({
	'followers_count?': 'number.integer >= 0',
	'following_count?': 'number.integer >= 0',
	'tweet_count?': 'number.integer >= 0',
	'listed_count?': 'number.integer >= 0',
	'like_count?': 'number.integer >= 0',
	'retweet_count?': 'number.integer >= 0',
	'reply_count?': 'number.integer >= 0',
	'quote_count?': 'number.integer >= 0',
})

const xApiV2UserWire = arktype({
	'id?': 'string',
	'name?': 'string',
	'username?': 'string',
	'description?': 'string',
	'profile_image_url?': 'string',
	'profile_banner_url?': 'string',
	'public_metrics?': xApiV2PublicMetricsWire,
	'verified?': 'boolean',
	'created_at?': 'string',
	'location?': 'string',
	'url?': 'string',
})

const xApiV2MediaWire = arktype({
	'media_key?': 'string',
	'type?': 'string',
	'url?': 'string',
	'preview_image_url?': 'string',
	'alt_text?': 'string',
})

const xApiV2ReferencedTweetWire = arktype({
	type: 'string',
	id: 'string',
})

const xApiV2TweetWire = arktype({
	'id?': 'string',
	'text?': 'string',
	'author_id?': 'string',
	'created_at?': 'string',
	'conversation_id?': 'string',
	'public_metrics?': xApiV2PublicMetricsWire,
	'referenced_tweets?': xApiV2ReferencedTweetWire.array(),
	'attachments?': {
		'media_keys?': 'string[]',
	},
})

const xApiV2TweetIncludesWire = arktype({
	'users?': xApiV2UserWire.array(),
	'media?': xApiV2MediaWire.array(),
	'tweets?': xApiV2TweetWire.array(),
})

const xApiV2MetaWire = arktype({
	'next_token?': 'string',
})

export const xApiV2UserResponseWire = arktype({
	'data?': xApiV2UserWire,
}) satisfies Type<XApiV2UserResponse>

export const xApiV2TweetResponseWire = arktype({
	'data?': xApiV2TweetWire,
	'includes?': xApiV2TweetIncludesWire,
}) satisfies Type<XApiV2TweetResponse>

export const xApiV2UserTweetsResponseWire = arktype({
	'data?': xApiV2TweetWire.array(),
	'includes?': xApiV2TweetIncludesWire,
	'meta?': xApiV2MetaWire,
}) satisfies Type<XApiV2UserTweetsResponse>

export const xApiV2SearchRecentTweetsResponseWire = arktype({
	'data?': xApiV2TweetWire.array(),
	'includes?': xApiV2TweetIncludesWire,
	'meta?': xApiV2MetaWire,
}) satisfies Type<XApiV2SearchRecentTweetsResponse>
