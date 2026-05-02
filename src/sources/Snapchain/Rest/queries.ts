/**
 * Snapchain node `/v1/*` queries.
 * @see https://snapchain.farcaster.xyz/reference/httpapi/casts#castbyid
 * @see https://snapchain.farcaster.xyz/reference/httpapi/reactions#reactionsbycast
 * @see https://snapchain.farcaster.xyz/reference/httpapi/userdata#userdatabyfid
 * @see https://snapchain.farcaster.xyz/reference/httpapi/usernameproof#usernameproofsbyfid
 * @see https://snapchain.farcaster.xyz/reference/httpapi/verification#verificationsbyfid
 */

import { singleFlight } from '$/lib/singleFlight.ts'
import { snapchainGet } from '$/sources/Snapchain/Rest/client.ts'
import {
	defaultShardId,
	snapchainDefaultCastTimelinePageSize,
	snapchainMaxPageSize,
} from '$/sources/Snapchain/Rest/constants.ts'
import type {
	SnapchainCastWire,
	SnapchainFidsPage,
	SnapchainPage,
	SnapchainReactionWire,
	SnapchainUserDataWire,
	SnapchainUsernameProofsResponse,
	SnapchainVerificationWire,
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
	snapchainGet<SnapchainCastWire>('/v1/castById', {
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
	snapchainGet<SnapchainPage<SnapchainCastWire>>('/v1/castsByFid', {
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
	snapchainGet<SnapchainPage<SnapchainCastWire>>('/v1/castsByParent', {
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
	snapchainGet<SnapchainPage<SnapchainReactionWire>>('/v1/reactionsByCast', {
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
	snapchainGet<SnapchainPage<SnapchainUserDataWire>>('/v1/userDataByFid', {
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
	snapchainGet<SnapchainPage<SnapchainVerificationWire>>('/v1/verificationsByFid', {
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

export const getSnapchainUserBundleByFid = async ({ fid }: { fid: number }) => {
	const [userData, usernameProofs, verifications] = await Promise.all([
		singleFlight(getUserDataByFid)({ fid }),
		singleFlight(getUsernameProofsByFid)({ fid }),
		singleFlight(getVerificationsByFid)({ fid }),
	])
	return { userData, usernameProofs, verifications }
}
