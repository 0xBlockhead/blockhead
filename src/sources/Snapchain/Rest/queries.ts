/**
 * Snapchain node `/v1/*` queries.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/casts#castbyid
 * @see https://snapchain.farcaster.xyz/reference/httpapi/reactions#reactionsbycast
 * @see https://snapchain.farcaster.xyz/reference/httpapi/userdata#userdatabyfid
 * @see https://snapchain.farcaster.xyz/reference/httpapi/usernameproof#usernameproofsbyfid
 * @see https://snapchain.farcaster.xyz/reference/httpapi/verification#verificationsbyfid
 */

import { snapchainGet } from '$/sources/Snapchain/Rest/client.ts'
import {
	defaultShardId,
	snapchainDefaultCastTimelinePageSize,
	snapchainMaxPageSize,
} from '$/sources/Snapchain/Rest/constants.ts'
import type {
	SnapchainCast,
	SnapchainFidsPage,
	SnapchainLink,
	SnapchainOnChainEventsPage,
	SnapchainPage,
	SnapchainReaction,
	SnapchainUserData,
	SnapchainUsernameProofsResponse,
	SnapchainVerification,
} from '$/sources/Snapchain/Rest/types.ts'
import {
	snapchainCastPageWire,
	snapchainCastResponseWire,
	snapchainFidsPageWire,
	snapchainLinkPageWire,
	snapchainOnChainEventsPageWire,
	snapchainReactionPageWire,
	snapchainUserDataPageWire,
	snapchainUsernameProofsResponseWire,
	snapchainVerificationPageWire,
} from '$/sources/Snapchain/Rest/types.ts'

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Snapchain_Rest: invalid ${label} response envelope`)
	}
}

/**
 * `GET /v1/fids`
 */
export const getFids = async ({
	shardId = defaultShardId,
	pageSize = snapchainMaxPageSize,
	pageToken,
	reverse,
}: {
	shardId?: number
	pageSize?: number
	pageToken?: string
	reverse?: boolean
} = {}) => (
	assertEnvelope(
		'fids',
		snapchainFidsPageWire,
		await snapchainGet<SnapchainFidsPage>('/v1/fids', {
			shard_id: shardId,
			pageSize,
			pageToken,
			reverse,
		})
	)
)

/**
 * `GET /v1/castById`
 */
export const getCastById = async ({
	fid,
	hash,
}: {
	fid: number
	hash: `0x${string}`
}) => (
	assertEnvelope(
		'cast',
		snapchainCastResponseWire,
		await snapchainGet<SnapchainCast>('/v1/castById', {
			fid,
			hash,
		})
	)
)

/**
 * `GET /v1/castsByFid`
 */
export const getCastsByFid = async ({
	fid,
	pageSize = snapchainDefaultCastTimelinePageSize,
	pageToken,
	reverse = true,
	startTimestamp,
	stopTimestamp,
}: {
	fid: number
	pageSize?: number
	pageToken?: string
	reverse?: boolean
	startTimestamp?: number
	stopTimestamp?: number
}) => (
	assertEnvelope(
		'casts-by-fid',
		snapchainCastPageWire,
		await snapchainGet<SnapchainPage<SnapchainCast>>('/v1/castsByFid', {
			fid,
			pageSize,
			pageToken,
			reverse,
			startTimestamp,
			stopTimestamp,
		})
	)
)

/**
 * `GET /v1/castsByParent`
 */
export const getCastsByParent = async ({
	url,
	fid,
	hash,
	pageSize = snapchainDefaultCastTimelinePageSize,
	pageToken,
}: {
	url?: string
	fid?: number
	hash?: `0x${string}`
	pageSize?: number
	pageToken?: string
}) => (
	assertEnvelope(
		'casts-by-parent',
		snapchainCastPageWire,
		await snapchainGet<SnapchainPage<SnapchainCast>>('/v1/castsByParent', {
			url,
			fid,
			hash,
			pageSize,
			pageToken,
		})
	)
)

/**
 * `GET /v1/reactionsByCast`
 */
export const getReactionsByCast = async ({
	targetFid,
	targetHash,
	reactionType,
	pageSize = snapchainMaxPageSize,
	pageToken,
	reverse,
}: {
	targetFid: number
	targetHash: `0x${string}`
	reactionType: number | string
	pageSize?: number
	pageToken?: string
	reverse?: boolean
}) => (
	assertEnvelope(
		'reactions-by-cast',
		snapchainReactionPageWire,
		await snapchainGet<SnapchainPage<SnapchainReaction>>('/v1/reactionsByCast', {
			target_fid: targetFid,
			target_hash: targetHash,
			reaction_type: reactionType,
			pageSize,
			pageToken,
			reverse,
		})
	)
)

/**
 * `GET /v1/userDataByFid`
 */
export const getUserDataByFid = async ({
	fid,
	pageSize = snapchainMaxPageSize,
	pageToken,
	reverse,
}: {
	fid: number
	pageSize?: number
	pageToken?: string
	reverse?: boolean
}) => (
	assertEnvelope(
		'user-data',
		snapchainUserDataPageWire,
		await snapchainGet<SnapchainPage<SnapchainUserData>>('/v1/userDataByFid', {
			fid,
			pageSize,
			pageToken,
			reverse,
		})
	)
)

/**
 * `GET /v1/userNameProofsByFid`
 */
export const getUsernameProofsByFid = async ({
	fid,
	pageSize = snapchainMaxPageSize,
	pageToken,
	reverse,
}: {
	fid: number
	pageSize?: number
	pageToken?: string
	reverse?: boolean
}) => (
	assertEnvelope(
		'username-proofs',
		snapchainUsernameProofsResponseWire,
		await snapchainGet<SnapchainUsernameProofsResponse>('/v1/userNameProofsByFid', {
			fid,
			pageSize,
			pageToken,
			reverse,
		})
	)
)

/**
 * `GET /v1/verificationsByFid`
 */
export const getVerificationsByFid = async ({
	fid,
	address,
	pageSize = snapchainMaxPageSize,
	pageToken,
	reverse,
}: {
	fid: number
	address?: `0x${string}`
	pageSize?: number
	pageToken?: string
	reverse?: boolean
}) => (
	assertEnvelope(
		'verifications',
		snapchainVerificationPageWire,
		await snapchainGet<SnapchainPage<SnapchainVerification>>('/v1/verificationsByFid', {
			fid,
			address,
			pageSize,
			pageToken,
			reverse,
		})
	)
)

const countReactionsForCastTarget = async ({
	targetFid,
	targetHash,
	reactionType,
}: {
	targetFid: number
	targetHash: `0x${string}`
	reactionType: number | string
}) => {
	let reactionCount = 0
	let pageToken: string | undefined
	do {
		const reactionPage = await getReactionsByCast({
			targetFid,
			targetHash,
			reactionType,
			pageToken,
		})
		reactionCount += reactionPage.messages?.length ?? 0
		pageToken = reactionPage.nextPageToken
	} while (pageToken != null)
	return reactionCount
}

export const getLikeAndRecastCountsForCast = async ({
	targetFid,
	targetHash,
	likeReactionType,
	recastReactionType,
}: {
	targetFid: number
	targetHash: `0x${string}`
	likeReactionType: number | string
	recastReactionType: number | string
}) => {
	const [likeCount, recastCount] = await Promise.all([
		countReactionsForCastTarget({ targetFid, targetHash, reactionType: likeReactionType }),
		countReactionsForCastTarget({ targetFid, targetHash, reactionType: recastReactionType }),
	])
	return { likeCount, recastCount }
}

const countCastsByParent = async ({
	fid,
	hash,
}: {
	fid: number
	hash: `0x${string}`
}) => {
	let replyCount = 0
	let pageToken: string | undefined
	do {
		const page = await getCastsByParent({
			fid,
			hash,
			pageToken,
		})
		replyCount += page.messages?.length ?? 0
		pageToken = page.nextPageToken
	} while (pageToken != null)
	return replyCount
}

export const getCastEngagementCountsForCast = async ({
	targetFid,
	targetHash,
	likeReactionType,
	recastReactionType,
}: {
	targetFid: number
	targetHash: `0x${string}`
	likeReactionType: number | string
	recastReactionType: number | string
}) => {
	const [{ likeCount, recastCount }, replyCount] = await Promise.all([
		getLikeAndRecastCountsForCast({
			targetFid,
			targetHash,
			likeReactionType,
			recastReactionType,
		}),
		countCastsByParent({
			fid: targetFid,
			hash: targetHash,
		}),
	])
	return { likeCount, recastCount, replyCount }
}

/**
 * `GET /v1/linksByFid`
 */
export const getLinksByFid = async ({
	fid,
	linkType = 'follow',
	pageSize = snapchainMaxPageSize,
	pageToken,
	reverse,
}: {
	fid: number
	linkType?: string
	pageSize?: number
	pageToken?: string
	reverse?: boolean
}) => (
	assertEnvelope(
		'links-by-fid',
		snapchainLinkPageWire,
		await snapchainGet<SnapchainPage<SnapchainLink>>('/v1/linksByFid', {
			fid,
			link_type: linkType,
			pageSize,
			pageToken,
			reverse,
		})
	)
)

/**
 * `GET /v1/linksByTargetFid`
 */
export const getLinksByTargetFid = async ({
	targetFid,
	linkType = 'follow',
	pageSize = snapchainMaxPageSize,
	pageToken,
	reverse,
}: {
	targetFid: number
	linkType?: string
	pageSize?: number
	pageToken?: string
	reverse?: boolean
}) => (
	assertEnvelope(
		'links-by-target-fid',
		snapchainLinkPageWire,
		await snapchainGet<SnapchainPage<SnapchainLink>>('/v1/linksByTargetFid', {
			target_fid: targetFid,
			link_type: linkType,
			pageSize,
			pageToken,
			reverse,
		})
	)
)

export const countLinksByFid = async ({
	fid,
	linkType = 'follow',
	reverse,
}: {
	fid: number
	linkType?: string
	reverse?: boolean
}) => {
	let linkCount = 0
	let pageToken: string | undefined
	do {
		const page = await getLinksByFid({
			fid,
			linkType,
			pageToken,
			reverse,
		})
		linkCount += page.messages?.length ?? 0
		pageToken = page.nextPageToken
	} while (pageToken != null)
	return linkCount
}

export const countLinksByTargetFid = async ({
	targetFid,
	linkType = 'follow',
	reverse,
}: {
	targetFid: number
	linkType?: string
	reverse?: boolean
}) => {
	let linkCount = 0
	let pageToken: string | undefined
	do {
		const page = await getLinksByTargetFid({
			targetFid,
			linkType,
			pageToken,
			reverse,
		})
		linkCount += page.messages?.length ?? 0
		pageToken = page.nextPageToken
	} while (pageToken != null)
	return linkCount
}

/**
 * `GET /v1/onChainEventsByFid` — ID registry events for custody address lookup.
 */
export const getOnChainIdRegisterEventsByFid = async ({
	fid,
	pageSize = snapchainMaxPageSize,
	pageToken,
	reverse,
}: {
	fid: number
	pageSize?: number
	pageToken?: string
	reverse?: boolean
}) => (
	assertEnvelope(
		'on-chain-id-register-events',
		snapchainOnChainEventsPageWire,
		await snapchainGet<SnapchainOnChainEventsPage>('/v1/onChainEventsByFid', {
			fid,
			event_type: 'EVENT_TYPE_ID_REGISTER',
			pageSize,
			pageToken,
			reverse,
		})
	)
)
