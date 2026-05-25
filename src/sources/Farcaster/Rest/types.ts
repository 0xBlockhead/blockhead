/**
 * Farcaster Client API response shapes used by resolvers.
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-all-channels
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-a-channel
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-user-primary-address
 */

export type FarcasterChannel = {
	id: string
	url: string
	name: string
	description?: string
	imageUrl?: string
	headerImageUrl?: string
	leadFid?: number
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
	followedAt?: number
}

export type FarcasterPage<Result> = {
	result?: Result
	next?: {
		cursor?: string
	}
}

export type FarcasterChannelsResponse = FarcasterPage<{
	channels?: FarcasterChannel[]
}>

export type FarcasterChannelResponse = FarcasterPage<{
	channel?: FarcasterChannel
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

export type FarcasterThreadCast = {
	hash?: string
	threadHash?: string
	author?: FarcasterThreadCastAuthor
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
}

export type FarcasterUserThreadCastsResponse = {
	result?: {
		casts?: FarcasterThreadCast[]
	}
}
