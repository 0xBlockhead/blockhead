/**
 * Farcaster Client API response shapes used by resolvers.
 * @see https://docs.neynar.com/farcaster/reference/farcaster/api
 */

export type FarcasterChannelWire = {
	id: string
	url: string
	name: string
	description?: string
	descriptionMentions?: number[]
	descriptionMentionsPositions?: number[]
	imageUrl?: string
	headerImageUrl?: string
	leadFid?: number
	moderatorFid?: number
	moderatorFids?: number[]
	createdAt?: number
	followerCount?: number
	memberCount?: number
	pinnedCastHash?: string
	publicCasting?: boolean
	externalLink?: {
		title?: string
		url?: string
	}
}

/** Provider-normalized channel identity: wire `url` is the FIP-2 parent URL. */
export type FarcasterChannel = (
	& Omit<FarcasterChannelWire, 'url'>
	& { parentUrl: FarcasterChannelWire['url'] }
)

export type FarcasterFollowedChannelWire = (
	& FarcasterChannelWire
	& { followedAt: number }
)

export type FarcasterPage<Result> = {
	result?: Result
	next?: {
		cursor?: string
	}
}

export type FarcasterChannelsResponse = {
	result?: {
		channels?: FarcasterChannelWire[]
	}
}

export type FarcasterChannelResponse = FarcasterPage<{
	channel?: FarcasterChannelWire
}>

export type FarcasterChannelFollowStatusResponse = FarcasterPage<{
	following: boolean
	followedAt?: number
}>

export type FarcasterChannelMember = {
	fid: number
	memberAt: number
}

export type FarcasterChannelMembersResponse = FarcasterPage<{
	members: FarcasterChannelMember[]
}>

export type FarcasterPrimaryAddress = {
	fid?: number
	protocol?: 'ethereum' | 'solana'
	address?: string
}

export type FarcasterPrimaryAddressResponse = FarcasterPage<{
	address?: FarcasterPrimaryAddress
}>

export type FarcasterThreadCastAuthor = {
	fid?: number
	username?: string
}

export type FarcasterThreadCastEmbed = {
	url?: string
	title?: string
	description?: string
	iconUrl?: string
	quotedPreviewText?: string
	castId?: {
		fid?: number
		hash?: string
	}
}

export type FarcasterThreadCast = {
	hash?: string
	threadHash?: string
	author?: FarcasterThreadCastAuthor
	parentHash?: string
	parentAuthor?: FarcasterThreadCastAuthor
	parentUrl?: string
	channel?: {
		id?: string
	}
	text?: string
	timestamp?: number
	replies?: {
		count?: number
	}
	reactions?: {
		count?: number
	}
	recasts?: {
		count?: number
	}
	quoteCount?: number
	embeds?: FarcasterThreadCastEmbed[]
}

export type FarcasterUserThreadCastsResponse = {
	result?: {
		casts?: FarcasterThreadCast[]
	}
}
