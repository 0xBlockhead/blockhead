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
