/**
 * Neynar REST shapes used for Farcaster entities.
 * @see https://docs.neynar.com/reference
 */

export type NeynarUserWire = {
	object?: 'user' | 'user_dehydrated'
	fid: number
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

export type NeynarCastEmbedWire = {
	url?: string
	cast_id?: {
		fid?: number
		hash?: string
	}
	cast?: {
		hash?: string
	}
}

export type NeynarCastReactionsWire = {
	likes_count?: number
	recasts_count?: number
}

export type NeynarCastWire = {
	hash: string
	parent_hash?: string
	parent_url?: string
	root_parent_url?: string
	parent_author?: {
		fid?: number
	}
	author?: NeynarUserWire
	text?: string
	timestamp?: string
	embeds?: NeynarCastEmbedWire[]
	mentions?: number[]
	likes?: number
	recasts?: number
	reactions?: NeynarCastReactionsWire
}

export type NeynarFeedResponse = {
	casts?: NeynarCastWire[]
	next?: {
		cursor?: string | null
	}
}

export type NeynarBulkUsersResponse = {
	users: NeynarUserWire[]
}
