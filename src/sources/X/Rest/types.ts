export type XApiV2PublicMetricsWire = {
	followers_count?: number
	following_count?: number
	tweet_count?: number
	like_count?: number
	retweet_count?: number
	reply_count?: number
	quote_count?: number
}

export type XApiV2UserDataWire = {
	id?: string
	name?: string
	username?: string
	description?: string
	profile_image_url?: string
	public_metrics?: XApiV2PublicMetricsWire
	verified?: boolean
	created_at?: string
	location?: string
	url?: string
}

export type XApiV2UserWire = {
	data?: XApiV2UserDataWire
}

export type XApiV2TweetDataWire = {
	id?: string
	text?: string
	author_id?: string
	created_at?: string
	conversation_id?: string
	public_metrics?: XApiV2PublicMetricsWire
	referenced_tweets?: {
		type: string
		id: string
	}[]
}

export type XApiV2TweetWire = {
	data?: XApiV2TweetDataWire
	includes?: {
		users?: XApiV2UserDataWire[]
	}
}

export type XApiV2UserTweetsWire = {
	data?: XApiV2TweetDataWire[]
}

export type XApiV2SearchRecentTweetsWire = {
	data?: XApiV2TweetDataWire[]
	includes?: {
		users?: XApiV2UserDataWire[]
	}
}
