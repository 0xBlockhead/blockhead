/**
 * Snapchain node HTTP API shapes.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/casts
 * @see https://snapchain.farcaster.xyz/reference/httpapi/reactions
 * @see https://snapchain.farcaster.xyz/reference/httpapi/userdata
 * @see https://snapchain.farcaster.xyz/reference/httpapi/usernameproof
 * @see https://snapchain.farcaster.xyz/reference/httpapi/verification
 */

export enum SnapchainNodeEndpointId {
	Pinata = 'Pinata',
	Snap = 'Snap',
	Pop = 'Pop',
	Haatz = 'Haatz',
}

export type SnapchainNodeEndpoint = {
	id: SnapchainNodeEndpointId
	url: string
}

export type SnapchainCastEmbed = {
	url?: string
	castId?: {
		fid?: number
		hash?: `0x${string}`
	}
}

export type SnapchainCast = {
	hash: `0x${string}`
	data?: {
		fid?: number
		timestamp?: number
		castAddBody?: {
			text?: string
			mentions?: number[]
			parentCastId?: {
				fid?: number
				hash?: `0x${string}`
			}
			parentUrl?: string
			embeds?: SnapchainCastEmbed[]
		}
	}
}

export type SnapchainReaction = {
	data?: {
		fid?: number
	}
}

export type SnapchainVerification = {
	data?: {
		verificationAddAddressBody?: {
			address?: string
			protocol?: string
		}
	}
}

export type SnapchainUserData = {
	data?: {
		userDataBody?: {
			type?: string | number
			value?: string
		}
	}
}

export type SnapchainPage<T> = {
	messages?: T[]
	nextPageToken?: string
}

export type SnapchainFidsPage = {
	fids?: number[]
	nextPageToken?: string
}

export type SnapchainUsernameProofsResponse = {
	proofs?: {
		name?: string
	}[]
	nextPageToken?: string
}

export type SnapchainLink = {
	data?: {
		linkBody?: {
			type?: string
			targetFid?: number
		}
	}
}

export type SnapchainOnChainEvent = {
	type?: string
	blockTimestamp?: number
	fid?: number
	idRegisterEventBody?: {
		to?: string
		eventType?: string
	}
}

export type SnapchainOnChainEventsPage = {
	events?: SnapchainOnChainEvent[]
	nextPageToken?: string
}
