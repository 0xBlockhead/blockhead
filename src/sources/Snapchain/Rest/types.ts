/**
 * Snapchain node HTTP wire shapes.
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

export type SnapchainCastEmbedWire = {
	url?: string
	castId?: {
		fid?: number
		hash?: `0x${string}`
	}
}

export type SnapchainCastWire = {
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
			embeds?: SnapchainCastEmbedWire[]
		}
	}
}

export type SnapchainReactionWire = {
	data?: {
		fid?: number
	}
}

export type SnapchainVerificationWire = {
	data?: {
		verificationAddAddressBody?: {
			address?: string
			protocol?: string
		}
	}
}

export type SnapchainUserDataWire = {
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

export type SnapchainLinkWire = {
	data?: {
		linkBody?: {
			type?: string
			targetFid?: number
		}
	}
}

export type SnapchainOnChainEventWire = {
	type?: string
	blockTimestamp?: number
	fid?: number
	idRegisterEventBody?: {
		to?: string
		eventType?: string
	}
}

export type SnapchainOnChainEventsPage = {
	events?: SnapchainOnChainEventWire[]
	nextPageToken?: string
}
