import type { JsonValue } from '$/typescript/JsonValue.ts'

export type RedditPublicApiThing = {
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
		replies?: RedditPublicApiListing | ''
	}
}

export type RedditPublicApiListing = {
	kind: 'Listing'
	data: {
		children?: readonly RedditPublicApiThing[]
	}
}

export type RedditPublicApiInfoResponse = {
	kind: 'Listing'
	data: { children: RedditPublicApiThing[] }
}

export type RedditPublicApiSubredditAbout = {
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
