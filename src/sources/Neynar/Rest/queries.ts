/**
 * Neynar Farcaster REST helpers.
 * @see https://docs.neynar.com/reference
 */

import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { neynarFetch } from '$/sources/Neynar/Rest/client.ts'
import { neynarFeedDefaultLimit, neynarFeedMaxLimit } from '$/sources/Neynar/Rest/constants.ts'
import type {
	NeynarBulkUsersResponse,
	NeynarCast,
	NeynarConversationQuery,
	NeynarConversationResponse,
	NeynarFeedQuery,
	NeynarFeedResponse,
	NeynarUser,
} from '$/sources/Neynar/Rest/types.ts'

export const getBulkUsers = async ({
	publicEnv,
	fids,
}: {
	publicEnv: SourcePublicEnv
	fids: number[]
}): Promise<readonly NeynarUser[]> => {
	if (fids.length === 0) return []
	const searchParams = new URLSearchParams({ fids: fids.join(',') })
	return (
		(await neynarFetch<NeynarBulkUsersResponse>(
			publicEnv,
			`/v2/farcaster/user/bulk/?${searchParams}`
		))?.users ?? []
	)
}

/**
 * Neynar feed — `feed_type` + `filter_type` per
 * https://docs.neynar.com/reference/fetch-feed
 */
export const getFeed = async (
	publicEnv: SourcePublicEnv,
	query: NeynarFeedQuery
): Promise<NeynarFeedResponse | undefined> => {
	const searchParams = new URLSearchParams()
	searchParams.set('feed_type', query.feedType)
	if (query.feedType === 'following') {
		searchParams.set('fid', String(query.fid))
	}
	else {
		searchParams.set('filter_type', query.filterType)
		if (query.filterType === 'fids' && query.fids.length > 0) {
			searchParams.set('fids', query.fids.join(','))
		}
		if (query.filterType === 'channel_id') {
			searchParams.set('channel_id', query.channelId)
			if (query.membersOnly != null) {
				searchParams.set('members_only', String(query.membersOnly))
			}
		}
	}
	const clampedFeedLimit = Math.min(
		Math.max(query.limit ?? neynarFeedDefaultLimit, 1),
		neynarFeedMaxLimit
	)
	searchParams.set('limit', String(clampedFeedLimit))
	if (query.cursor != null && query.cursor !== '') {
		searchParams.set('cursor', query.cursor)
	}
	if (query.viewerFid != null) {
		searchParams.set('viewer_fid', String(query.viewerFid))
	}
	return neynarFetch<NeynarFeedResponse>(publicEnv, `/v2/farcaster/feed/?${searchParams}`)
}

export const getCastByHash = async (
	publicEnv: SourcePublicEnv,
	hash: `0x${string}`
): Promise<NeynarCast | undefined> => {
	const searchParams = new URLSearchParams({
		identifier: hash,
		type: 'hash',
	})
	const response = await neynarFetch<{ cast?: NeynarCast }>(
		publicEnv,
		`/v2/farcaster/cast/?${searchParams}`
	)
	return response?.cast
}

/**
 * Cast by Farcaster / Warpcast web URL — `type=url` per
 * https://docs.neynar.com/reference/lookup-cast-by-hash-or-url
 */
export const getCastByClientUrl = async (
	publicEnv: SourcePublicEnv,
	clientUrl: string
): Promise<NeynarCast | undefined> => {
	const searchParams = new URLSearchParams({
		identifier: clientUrl,
		type: 'url',
	})
	const response = await neynarFetch<{ cast?: NeynarCast }>(
		publicEnv,
		`/v2/farcaster/cast/?${searchParams}`
	)
	return response?.cast
}

/**
 * One level of replies to the focal cast. Parent casts and recursive descendants
 * are intentionally excluded from this product relationship.
 */
export const getCastConversation = async (
	publicEnv: SourcePublicEnv,
	query: NeynarConversationQuery
): Promise<NeynarConversationResponse | undefined> => {
	const searchParams = new URLSearchParams({
		identifier: query.identifier,
		type: query.type,
		reply_depth: '1',
		include_chronological_parent_casts: 'false',
	})
	return neynarFetch<NeynarConversationResponse>(
		publicEnv,
		`/v2/farcaster/cast/conversation/?${searchParams}`
	)
}
