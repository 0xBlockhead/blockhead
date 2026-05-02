export type RedditApiThingWire = {
	kind: string
	data: Record<string, unknown> & {
		name?: string
		title?: string
		selftext?: string
		author?: string
		url?: string
		subreddit?: string
		body?: string
		permalink?: string
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
	data: { display_name: string, title: string, public_description: string }
}
