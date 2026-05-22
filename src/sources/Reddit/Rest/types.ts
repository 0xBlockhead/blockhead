import type { JsonValue } from '$/typescript/JsonValue.ts'

export type RedditApiThingWire = {
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
		score?: number
		num_comments?: number
		created_utc?: number
		depth?: number
	}
}

export type RedditApiListingWire = {
	kind: 'Listing'
	data: {
		children?: readonly RedditApiThingWire[]
	}
}

export type RedditApiInfoResponseWire = {
	kind: 'Listing'
	data: { children: RedditApiThingWire[] }
}

export type RedditApiSubredditAboutWire = {
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
	}
}
