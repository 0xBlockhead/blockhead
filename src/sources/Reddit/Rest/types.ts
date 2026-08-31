import {
	scope,
	type as arktype,
	type Type,
} from 'arktype'

export type RedditOAuthTokenResponse = {
	access_token?: string
	expires_in?: number
}

export type RedditApiThing = {
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
		replies?: RedditApiListing | ''
	}
}

export type RedditApiListing = {
	kind: 'Listing'
	data: {
		after?: string | null
		children?: readonly RedditApiThing[]
	}
}

export type RedditApiListingSort =
	| 'hot'
	| 'new'
	| 'rising'
	| 'top'

export type RedditApiListingRequest = {
	after?: string
	limit: number
	sort: RedditApiListingSort
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


const redditApiWireModule = scope({
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

const redditApiThingWire = arktype(redditApiWireModule.thing)

export const redditApiListingWire = arktype(
	redditApiWireModule.listing
) satisfies Type<RedditApiListing>

export const redditApiInfoResponseWire = arktype({
	kind: "'Listing'",
	data: {
		children: redditApiThingWire.array(),
	},
}) satisfies Type<RedditApiInfoResponse>

export const redditApiSubredditAboutWire = arktype({
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
}) satisfies Type<RedditApiSubredditAbout>

export const redditApiCommentsWire = redditApiListingWire.array()

export const redditOAuthTokenResponseWire = arktype({
	'access_token?': 'string',
	'expires_in?': 'number.integer > 0',
}) satisfies Type<RedditOAuthTokenResponse>
