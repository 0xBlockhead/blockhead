import type { JsonValue } from '$/typescript/JsonValue.ts'

export type RedditOAuthTokenResponse = {
	access_token?: string
	expires_in?: number
}

export type RedditApiThing = {
	kind: string
	data: Record<string, JsonValue> & {
		name?: string
		title?: string
		selftext?: string
		author?: string
		url?: string
		subreddit?: string
		body?: string
		permalink?: string
		link_id?: string
		parent_id?: string
		score?: number
		num_comments?: number
		created_utc?: number
		depth?: number
		replies?: RedditApiListing | ''
	}
}

export type RedditApiListing = {
	kind: 'Listing'
	data: {
		children?: readonly RedditApiThing[]
	}
}

export type RedditApiInfoResponse = {
	kind: 'Listing'
	data: { children: RedditApiThing[] }
}

export type RedditApiSubredditAbout = {
	kind: 't5'
	data: {
		display_name: string
		title: string
		public_description: string
		subscribers?: number
		active_user_count?: number
		created_utc?: number
		over18?: boolean
		icon_img?: string
		community_icon?: string
	}
}
