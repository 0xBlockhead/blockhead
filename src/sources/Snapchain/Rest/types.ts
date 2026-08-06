/**
 * Snapchain node HTTP API shapes.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/casts
 * @see https://snapchain.farcaster.xyz/reference/httpapi/reactions
 * @see https://snapchain.farcaster.xyz/reference/httpapi/userdata
 * @see https://snapchain.farcaster.xyz/reference/httpapi/usernameproof
 * @see https://snapchain.farcaster.xyz/reference/httpapi/verification
 * @see https://snapchain.farcaster.xyz/reference/httpapi/links
 * @see https://snapchain.farcaster.xyz/reference/httpapi/onchain
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

export type SnapchainMessageEnvelope = {
	hash?: `0x${string}`
	hashScheme?: string
	signature?: string
	signatureScheme?: string
	signer?: string
}

export type SnapchainCast = SnapchainMessageEnvelope & {
	hash: `0x${string}`
	data?: {
		type?: string
		fid?: number
		timestamp?: number
		network?: string
		castAddBody?: {
			text?: string
			mentions?: number[]
			mentionsPositions?: number[]
			embedsDeprecated?: string[]
			parentCastId?: {
				fid?: number
				hash?: `0x${string}`
			}
			parentUrl?: string
			embeds?: SnapchainCastEmbed[]
			type?: string
		}
	}
}

export type SnapchainReaction = SnapchainMessageEnvelope & {
	data?: {
		type?: string
		fid?: number
		timestamp?: number
		network?: string
		reactionBody?: {
			type?: string | number
			targetCastId?: {
				fid?: number
				hash?: `0x${string}`
			}
			targetUrl?: string
		}
	}
}

export type SnapchainVerification = SnapchainMessageEnvelope & {
	data?: {
		type?: string
		fid?: number
		timestamp?: number
		network?: string
		verificationAddAddressBody?: {
			address?: string
			protocol?: string
			claimSignature?: string
			blockHash?: string
			verificationType?: number
			chainId?: number
		}
		verificationAddEthAddressBody?: {
			address?: string
			ethSignature?: string
			blockHash?: string
		}
	}
}

export type SnapchainUserData = SnapchainMessageEnvelope & {
	data?: {
		type?: string
		fid?: number
		timestamp?: number
		network?: string
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

export type SnapchainUsernameProof = {
	timestamp?: number
	name?: string
	owner?: string
	signature?: string
	fid?: number
	type?: string
}

export type SnapchainUsernameProofsResponse = {
	proofs?: SnapchainUsernameProof[]
	nextPageToken?: string
}

export type SnapchainLink = SnapchainMessageEnvelope & {
	data?: {
		type?: string
		fid?: number
		timestamp?: number
		network?: string
		linkBody?: {
			type?: string
			targetFid?: number
			displayTimestamp?: number
		}
	}
}

export type SnapchainOnChainEvent = {
	type?: string
	chainId?: number
	blockNumber?: number
	blockHash?: string
	blockTimestamp?: number
	transactionHash?: string
	logIndex?: number
	txIndex?: number
	fid?: number
	idRegisterEventBody?: {
		to?: string
		eventType?: string
		from?: string
		recoveryAddress?: string
	}
}

export type SnapchainOnChainEventsPage = {
	events?: SnapchainOnChainEvent[]
	nextPageToken?: string
}


const snapchainCastIdWire = arktype({
	'fid?': 'number.integer >= 0',
	'hash?': 'string',
})

const snapchainCastEmbedWire = arktype({
	'url?': 'string',
	'castId?': snapchainCastIdWire,
})

const snapchainMessageMetaWire = {
	'hashScheme?': 'string',
	'signature?': 'string',
	'signatureScheme?': 'string',
	'signer?': 'string',
} as const

const snapchainMessageDataMetaWire = {
	'type?': 'string',
	'fid?': 'number.integer >= 0',
	'timestamp?': 'number.integer >= 0',
	'network?': 'string',
} as const

const snapchainCastWire = arktype({
	hash: 'string',
	...snapchainMessageMetaWire,
	'data?': {
		...snapchainMessageDataMetaWire,
		'castAddBody?': {
			'text?': 'string',
			'mentions?': 'number.integer >= 0[]',
			'mentionsPositions?': 'number.integer >= 0[]',
			'embedsDeprecated?': 'string[]',
			'parentCastId?': snapchainCastIdWire,
			'parentUrl?': 'string',
			'embeds?': snapchainCastEmbedWire.array(),
			'type?': 'string',
		},
	},
})

export const snapchainCastResponseWire = snapchainCastWire satisfies Type<SnapchainCast>

export const snapchainCastPageWire = arktype({
	'messages?': snapchainCastWire.array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainPage<SnapchainCast>>

const snapchainReactionWire = arktype({
	'hash?': 'string',
	...snapchainMessageMetaWire,
	'data?': {
		...snapchainMessageDataMetaWire,
		'reactionBody?': {
			'type?': 'string | number.integer',
			'targetCastId?': snapchainCastIdWire,
			'targetUrl?': 'string',
		},
	},
})

export const snapchainReactionPageWire = arktype({
	'messages?': snapchainReactionWire.array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainPage<SnapchainReaction>>

const snapchainUserDataWire = arktype({
	'hash?': 'string',
	...snapchainMessageMetaWire,
	'data?': {
		...snapchainMessageDataMetaWire,
		'userDataBody?': {
			'type?': 'string | number.integer',
			'value?': 'string',
		},
	},
})

export const snapchainUserDataPageWire = arktype({
	'messages?': snapchainUserDataWire.array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainPage<SnapchainUserData>>

const snapchainUsernameProofWire = arktype({
	'timestamp?': 'number.integer >= 0',
	'name?': 'string',
	'owner?': 'string',
	'signature?': 'string',
	'fid?': 'number.integer >= 0',
	'type?': 'string',
})

export const snapchainUsernameProofsResponseWire = arktype({
	'proofs?': snapchainUsernameProofWire.array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainUsernameProofsResponse>

const snapchainVerificationWire = arktype({
	'hash?': 'string',
	...snapchainMessageMetaWire,
	'data?': {
		...snapchainMessageDataMetaWire,
		'verificationAddAddressBody?': {
			'address?': 'string',
			'protocol?': 'string',
			'claimSignature?': 'string',
			'blockHash?': 'string',
			'verificationType?': 'number.integer >= 0',
			'chainId?': 'number.integer >= 0',
		},
		'verificationAddEthAddressBody?': {
			'address?': 'string',
			'ethSignature?': 'string',
			'blockHash?': 'string',
		},
	},
})

export const snapchainVerificationPageWire = arktype({
	'messages?': snapchainVerificationWire.array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainPage<SnapchainVerification>>

const snapchainLinkWire = arktype({
	'hash?': 'string',
	...snapchainMessageMetaWire,
	'data?': {
		...snapchainMessageDataMetaWire,
		'linkBody?': {
			'type?': 'string',
			'targetFid?': 'number.integer >= 0',
			'displayTimestamp?': 'number.integer >= 0',
		},
	},
})

export const snapchainLinkPageWire = arktype({
	'messages?': snapchainLinkWire.array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainPage<SnapchainLink>>

export const snapchainFidsPageWire = arktype({
	'fids?': 'number.integer >= 0[]',
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainFidsPage>

export const snapchainOnChainEventsPageWire = arktype({
	'events?': arktype({
		'type?': 'string',
		'chainId?': 'number.integer >= 0',
		'blockNumber?': 'number.integer >= 0',
		'blockHash?': 'string',
		'blockTimestamp?': 'number.integer >= 0',
		'transactionHash?': 'string',
		'logIndex?': 'number.integer >= 0',
		'txIndex?': 'number.integer >= 0',
		'fid?': 'number.integer >= 0',
		'idRegisterEventBody?': {
			'to?': 'string',
			'eventType?': 'string',
			'from?': 'string',
			'recoveryAddress?': 'string',
		},
	}).array(),
	'nextPageToken?': 'string',
}) satisfies Type<SnapchainOnChainEventsPage>
