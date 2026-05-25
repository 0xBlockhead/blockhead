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

/**
 * `GET /v1/fids`
 */
export const getFids = ({
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
	snapchainGet<SnapchainFidsPage>('/v1/fids', {
		shard_id: shardId,
		pageSize,
		pageToken,
		reverse,
	})
)

/**
 * `GET /v1/castById`
 */
export const getCastById = ({
	fid,
	hash,
}: {
	fid: number
	hash: `0x${string}`
}) => (
	snapchainGet<SnapchainCast>('/v1/castById', {
		fid,
		hash,
	})
)

/**
 * `GET /v1/castsByFid`
 */
export const getCastsByFid = ({
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
	snapchainGet<SnapchainPage<SnapchainCast>>('/v1/castsByFid', {
		fid,
		pageSize,
		pageToken,
		reverse,
		startTimestamp,
		stopTimestamp,
	})
)

/**
 * `GET /v1/castsByParent`
 */
export const getCastsByParent = ({
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
	snapchainGet<SnapchainPage<SnapchainCast>>('/v1/castsByParent', {
		url,
		fid,
		hash,
		pageSize,
		pageToken,
	})
)

/**
 * `GET /v1/reactionsByCast`
 */
export const getReactionsByCast = ({
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
	snapchainGet<SnapchainPage<SnapchainReaction>>('/v1/reactionsByCast', {
		target_fid: targetFid,
		target_hash: targetHash,
		reaction_type: reactionType,
		pageSize,
		pageToken,
		reverse,
	})
)

/**
 * `GET /v1/userDataByFid`
 */
export const getUserDataByFid = ({
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
	snapchainGet<SnapchainPage<SnapchainUserData>>('/v1/userDataByFid', {
		fid,
		pageSize,
		pageToken,
		reverse,
	})
)

/**
 * `GET /v1/userNameProofsByFid`
 */
export const getUsernameProofsByFid = ({
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
	snapchainGet<SnapchainUsernameProofsResponse>('/v1/userNameProofsByFid', {
		fid,
		pageSize,
		pageToken,
		reverse,
	})
)

/**
 * `GET /v1/verificationsByFid`
 */
export const getVerificationsByFid = ({
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
	snapchainGet<SnapchainPage<SnapchainVerification>>('/v1/verificationsByFid', {
		fid,
		address,
		pageSize,
		pageToken,
		reverse,
	})
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
}): Promise<{ likeCount: number; recastCount: number }> => {
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
export const getLinksByFid = ({
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
	snapchainGet<SnapchainPage<SnapchainLink>>('/v1/linksByFid', {
		fid,
		link_type: linkType,
		pageSize,
		pageToken,
		reverse,
	})
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

/**
 * `GET /v1/onChainEventsByFid` — ID registry events for custody address lookup.
 */
export const getOnChainIdRegisterEventsByFid = ({
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
	snapchainGet<SnapchainOnChainEventsPage>('/v1/onChainEventsByFid', {
		fid,
		event_type: 'EVENT_TYPE_ID_REGISTER',
		pageSize,
		pageToken,
		reverse,
	})
)

export const getSnapchainUserBundleByFid = async ({ fid }: { fid: number }) => {
	const [userData, usernameProofs, verifications] = await Promise.all([
		getUserDataByFid({ fid }),
		getUsernameProofsByFid({ fid }),
		getVerificationsByFid({ fid }),
	])
	return { userData, usernameProofs, verifications }
}
