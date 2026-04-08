/**
 * Snapchain node HTTP wire shapes.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/casts
 * @see https://snapchain.farcaster.xyz/reference/httpapi/reactions
 * @see https://snapchain.farcaster.xyz/reference/httpapi/userdata
 * @see https://snapchain.farcaster.xyz/reference/httpapi/usernameproof
 * @see https://snapchain.farcaster.xyz/reference/httpapi/verification
 */

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
		verificationAddEthAddressBody?: {
			address?: `0x${string}`
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
