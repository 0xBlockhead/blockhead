/**
 * Neynar Farcaster REST helpers.
 * @see https://docs.neynar.com/reference
 */

import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { neynarFetch } from '$/sources/Neynar/Rest/client.ts'
import {
	neynarFeedDefaultLimit,
	neynarFeedMaxLimit,
	neynarFidCountMax,
	neynarUserCastsDefaultLimit,
	neynarUserCastsMaxLimit,
} from '$/sources/Neynar/Rest/constants.ts'
import type {
	NeynarBulkUsersResponse,
	NeynarCastQuery,
	NeynarCastResponse,
	NeynarChannelLookupQuery,
	NeynarChannelMembersQuery,
	NeynarChannelMembersResponse,
	NeynarChannelResponse,
	NeynarConversationResponse,
	NeynarFeedQuery,
	NeynarFeedResponse,
	NeynarUserChannelMembershipsQuery,
	NeynarUserChannelMembershipsResponse,
	NeynarUserChannelsQuery,
	NeynarUserChannelsResponse,
	NeynarUserCastsQuery,
	NeynarUserCastsResponse,
} from '$/sources/Neynar/Rest/types.ts'

/** Channel lookup by canonical channel id or FIP-2 parent URL. */
export const getChannel = async (
	publicEnv: SourcePublicEnv,
	query: NeynarChannelLookupQuery
) => {
	const searchParams = new URLSearchParams({
		id: query.id,
		type: query.type,
	})
	if (query.viewerFid != null)
		searchParams.set('viewer_fid', String(query.viewerFid))

	const channel = (
		await neynarFetch<NeynarChannelResponse>(
			publicEnv,
			`/v2/farcaster/channel/?${searchParams}`
		)
	)?.channel
	if (
		channel != null
		&& (
			query.type === 'id' ?
				channel.id !== query.id
				:
				channel.parent_url !== query.id
		)
	)
		throw new Error('Neynar channel subject mismatch')

	return channel
}

/** Paginated channel members, or an exact membership check when `fid` is set. */
export const getChannelMembersPage = (
	publicEnv: SourcePublicEnv,
	query: NeynarChannelMembersQuery
) => {
	const searchParams = new URLSearchParams({ channel_id: query.channelId })
	if (query.fid != null)
		searchParams.set('fid', String(query.fid))
	if (query.limit != null)
		searchParams.set('limit', String(query.limit))
	if (query.cursor != null && query.cursor !== '')
		searchParams.set('cursor', query.cursor)

	return neynarFetch<NeynarChannelMembersResponse>(
		publicEnv,
		`/v2/farcaster/channel/member/list/?${searchParams}`
	)
}

/** Channels followed by one FID. */
export const getUserChannelsPage = (
	publicEnv: SourcePublicEnv,
	query: NeynarUserChannelsQuery
) => {
	const searchParams = new URLSearchParams({ fid: String(query.fid) })
	if (query.limit != null)
		searchParams.set('limit', String(query.limit))
	if (query.cursor != null && query.cursor !== '')
		searchParams.set('cursor', query.cursor)

	return neynarFetch<NeynarUserChannelsResponse>(
		publicEnv,
		`/v2/farcaster/user/channels/?${searchParams}`
	)
}

/** Channel memberships and roles held by one FID. */
export const getUserChannelMembershipsPage = (
	publicEnv: SourcePublicEnv,
	query: NeynarUserChannelMembershipsQuery
) => {
	const searchParams = new URLSearchParams({ fid: String(query.fid) })
	if (query.limit != null)
		searchParams.set('limit', String(query.limit))
	if (query.cursor != null && query.cursor !== '')
		searchParams.set('cursor', query.cursor)

	return neynarFetch<NeynarUserChannelMembershipsResponse>(
		publicEnv,
		`/v2/farcaster/user/memberships/list/?${searchParams}`
	)
}

export const getBulkUsers = async ({
	publicEnv,
	fids,
}: {
	publicEnv: SourcePublicEnv
	fids: number[]
}) => {
	if (fids.length === 0) return []
	if (fids.length > neynarFidCountMax)
		throw new Error(`Neynar bulk users accepts at most ${neynarFidCountMax} FIDs`)
	if (new Set(fids).size !== fids.length)
		throw new Error('Neynar bulk users requires unique FIDs')

	const searchParams = new URLSearchParams({ fids: fids.join(',') })
	return (
		(await neynarFetch<NeynarBulkUsersResponse>(
			publicEnv,
			`/v2/farcaster/user/bulk/?${searchParams}`
		))?.users ?? []
)
}

/** Reverse-chronological casts authored by one exact FID. */
export const getUserCastsPage = async (
	publicEnv: SourcePublicEnv,
	query: NeynarUserCastsQuery
) => {
	if (!Number.isSafeInteger(query.fid) || query.fid < 1)
		throw new Error('Neynar user casts require a positive FID')

	const searchParams = new URLSearchParams({
		fid: String(query.fid),
		limit: String(Math.min(
			Math.max(query.limit ?? neynarUserCastsDefaultLimit, 1),
			neynarUserCastsMaxLimit
		)),
	})
	if (query.cursor != null && query.cursor !== '')
		searchParams.set('cursor', query.cursor)

	const page = await neynarFetch<NeynarUserCastsResponse>(
		publicEnv,
		`/v2/farcaster/feed/user/casts/?${searchParams}`
	)
	if (page?.casts.some((cast) => cast.author.fid !== query.fid))
		throw new Error('Neynar user casts subject mismatch')
	if (query.cursor != null && query.cursor !== '' && page?.next.cursor === query.cursor)
		throw new Error('Neynar user casts repeated cursor')

	return page
}

/**
 * Neynar feed — `feed_type` + `filter_type` per
 * https://docs.neynar.com/reference/fetch-feed
 */
export const getFeed = (
	publicEnv: SourcePublicEnv,
	query: NeynarFeedQuery
) => {
	const searchParams = new URLSearchParams()
	searchParams.set('feed_type', query.feedType)
	if (query.feedType === 'following') {
		searchParams.set('fid', String(query.fid))
	}
	else {
		searchParams.set('filter_type', query.filterType)
		if (query.filterType === 'fids') {
			if (query.fids.length === 0)
				throw new Error('Neynar FID feed filter requires at least one FID')

			if (query.fids.length > neynarFidCountMax)
				throw new Error(`Neynar FID feed filter accepts at most ${neynarFidCountMax} FIDs`)

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

/** Cast lookup by its hash or public client URL. */
export const getCast = async (
	publicEnv: SourcePublicEnv,
	query: NeynarCastQuery
) => {
	const searchParams = new URLSearchParams({
		identifier: query.identifier,
		type: query.type,
	})
	const response = await neynarFetch<NeynarCastResponse>(
		publicEnv,
		`/v2/farcaster/cast/?${searchParams}`
	)
	return response?.cast
}

/**
 * One level of replies to the focal cast. Parent casts and recursive descendants
 * are intentionally excluded from this product relationship.
 */
export const getCastConversation = (
	publicEnv: SourcePublicEnv,
	query: NeynarCastQuery
) => {
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
