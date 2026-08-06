/**
 * Snapchain node HTTP API shapes.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/casts
 * @see https://snapchain.farcaster.xyz/reference/httpapi/reactions
 * @see https://snapchain.farcaster.xyz/reference/httpapi/userdata
 * @see https://snapchain.farcaster.xyz/reference/httpapi/usernameproof
 * @see https://snapchain.farcaster.xyz/reference/httpapi/verification
 */

import {
	type as arktype,
	type Type,
} from 'arktype'

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
		fid?: number
		verificationAddAddressBody?: {
			address?: string
			protocol?: string
		}
	}
}

export type SnapchainUserData = {
	data?: {
		fid?: number
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
		fid?: number
		name?: string
	}[]
	nextPageToken?: string
}

export type SnapchainLink = {
	data?: {
		fid?: number
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


const snapchainCastEmbedWire = arktype({
	'url?': 'string',
	'castId?': {
		'fid?': 'number.integer >= 0',
		'hash?': 'string',
	},
})

const snapchainCastWire = arktype({
	hash: 'string',
	'data?': {
		'fid?': 'number.integer >= 0',
		'timestamp?': 'number.integer >= 0',
		'castAddBody?': {
			'text?': 'string',
			'mentions?': 'number.integer >= 0[]',
			'parentCastId?': {
				'fid?': 'number.integer >= 0',
				'hash?': 'string',
			},
			'parentUrl?': 'string',
			'embeds?': snapchainCastEmbedWire.array(),
		},
	},
})

const snapchainPageTokenWire = arktype({
	'messages?': 'unknown[]',
	'nextPageToken?': 'string',
})

export const snapchainCastResponseWire = snapchainCastWire satisfies Type<SnapchainCast>

export const snapchainCastPageWire = arktype({
	'messages?': snapchainCastWire.array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainPage<SnapchainCast>>

export const snapchainReactionPageWire = snapchainPageTokenWire satisfies Type<SnapchainPage<SnapchainReaction>>

export const snapchainUserDataPageWire = arktype({
	'messages?': arktype({
		'data?': {
			'fid?': 'number.integer >= 0',
			'userDataBody?': {
				'type?': 'string | number.integer',
				'value?': 'string',
			},
		},
	}).array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainPage<SnapchainUserData>>

export const snapchainUsernameProofsResponseWire = arktype({
	'proofs?': arktype({
		'fid?': 'number.integer >= 0',
		'name?': 'string',
	}).array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainUsernameProofsResponse>

export const snapchainVerificationPageWire = arktype({
	'messages?': arktype({
		'data?': {
			'fid?': 'number.integer >= 0',
			'verificationAddAddressBody?': {
				'address?': 'string',
				'protocol?': 'string',
			},
		},
	}).array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainPage<SnapchainVerification>>

export const snapchainLinkPageWire = arktype({
	'messages?': arktype({
		'data?': {
			'fid?': 'number.integer >= 0',
			'linkBody?': {
				'type?': 'string',
				'targetFid?': 'number.integer >= 0',
			},
		},
	}).array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainPage<SnapchainLink>>

export const snapchainFidsPageWire = arktype({
	'fids?': 'number.integer >= 0[]',
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainFidsPage>

export const snapchainOnChainEventsPageWire = arktype({
	'events?': arktype({
		'type?': 'string',
		'blockTimestamp?': 'number.integer >= 0',
		'fid?': 'number.integer >= 0',
		'idRegisterEventBody?': {
			'to?': 'string',
			'eventType?': 'string',
		},
	}).array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainOnChainEventsPage>
