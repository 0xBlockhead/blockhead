import {
	scope,
	type as arktype,
	type Type,
} from 'arktype'

export type RedditPublicApiThing = {
	kind: string
	data: {
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
		after?: string | null
		children?: readonly RedditPublicApiThing[]
	}
}

export type RedditPublicApiListingSort =
	| 'hot'
	| 'new'
	| 'rising'
	| 'top'

export type RedditPublicApiListingRequest = {
	after?: string
	limit: number
	sort: RedditPublicApiListingSort
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


const redditPublicWireModule = scope({
	thing: {
		kind: 'string',
		data: {
			'name?': 'string',
			'title?': 'string',
			'selftext?': 'string',
			'author?': 'string',
			'url?': 'string',
			'subreddit?': 'string',
			'body?': 'string',
			'permalink?': 'string',
			'link_id?': 'string',
			'parent_id?': 'string',
			'score?': 'number',
			'num_comments?': 'number',
			'created_utc?': 'number',
			'depth?': 'number',
			'replies?': "listing | ''",
		},
	},
	listing: {
		kind: "'Listing'",
		data: {
			'after?': 'string | null',
			'children?': 'thing[]',
		},
	},
}).export()

const redditPublicThingWire = arktype(redditPublicWireModule.thing)

export const redditPublicListingWire = arktype(
	redditPublicWireModule.listing
) satisfies Type<RedditPublicApiListing>

export const redditPublicInfoResponseWire = arktype({
	kind: "'Listing'",
	data: {
		children: redditPublicThingWire.array(),
	},
}) satisfies Type<RedditPublicApiInfoResponse>

export const redditPublicSubredditAboutWire = arktype({
	kind: "'t5'",
	data: {
		display_name: 'string',
		title: 'string',
		public_description: 'string',
		'subscribers?': 'number.integer >= 0',
		'active_user_count?': 'number.integer >= 0',
		'created_utc?': 'number',
		'over18?': 'boolean',
		'icon_img?': 'string',
		'community_icon?': 'string',
	},
}) satisfies Type<RedditPublicApiSubredditAbout>

export const redditPublicCommentsWire = redditPublicListingWire.array()
