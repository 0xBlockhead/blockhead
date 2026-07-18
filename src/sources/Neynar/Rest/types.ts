/**
 * Neynar REST shapes used for Farcaster entities.
 * @see https://docs.neynar.com/reference
 */

export type NeynarUser = {
	object?: 'user' | 'user_dehydrated'
	fid: number
	custody_address?: string
	auth_addresses?: {
		address: string
		app: {
			fid: number
		}
	}[]
	follower_count?: number
	following_count?: number
	username?: string
	display_name?: string
	pfp_url?: string
	profile?: {
		bio?: {
			text?: string
		} | string
	}
	verified_addresses?: {
		eth_addresses?: string[]
		sol_addresses?: string[]
		primary?: {
			eth_address?: string
			sol_address?: string
		}
	}
}

export type NeynarCastEmbed = {
	url?: string
	metadata?: {
		html?: {
			ogTitle?: string
			ogDescription?: string
			ogImage?: { url?: string }[]
		}
	}
	cast_id?: {
		fid?: number
		hash?: string
	}
	cast?: {
		hash?: string
		author?: {
			fid?: number
		}
		text?: string
	}
}

export type NeynarCastReactions = {
	likes_count?: number
	recasts_count?: number
}

export type NeynarCastReplies = {
	count?: number
}

export type NeynarCastChannel = {
	id?: string
	name?: string
	object?: string
}

export type NeynarCast = {
	hash: string
	parent_hash?: string
	parent_url?: string
	root_parent_url?: string
	parent_author?: {
		fid?: number
	}
	author?: NeynarUser
	app?: NeynarUser
	text?: string
	timestamp?: string
	embeds?: NeynarCastEmbed[]
	mentions?: number[]
	likes?: number
	recasts?: number
	reactions?: NeynarCastReactions
	replies?: NeynarCastReplies
	thread_hash?: string | null
	channel?: NeynarCastChannel | null
	mentioned_profiles?: { fid?: number }[]
	mentioned_channels?: { id?: string }[]
}

export type NeynarFeedResponse = {
	casts?: NeynarCast[]
	next?: {
		cursor?: string | null
	}
}

export type NeynarFeedQuery =
	| {
		feedType: 'filter'
		filterType: 'global_trending'
		limit?: number
		cursor?: string
		viewerFid?: number
	}
	| {
		feedType: 'filter'
		filterType: 'fids'
		fids: number[]
		limit?: number
		cursor?: string
		viewerFid?: number
	}
	| {
		feedType: 'filter'
		filterType: 'channel_id'
		channelId: string
		limit?: number
		cursor?: string
		membersOnly?: boolean
		viewerFid?: number
	}
	| {
		feedType: 'following'
		fid: number
		limit?: number
		cursor?: string
		viewerFid?: number
	}

export type NeynarBulkUsersResponse = {
	users?: NeynarUser[]
}
