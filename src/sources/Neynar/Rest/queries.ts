/**
 * Neynar Farcaster REST helpers.
 * @see https://docs.neynar.com/reference
 */

import { neynarFetch } from '$/sources/Neynar/Rest/client.ts'
import type {
	NeynarBulkUsersResponse,
	NeynarCastWire,
	NeynarFeedResponse,
	NeynarUserWire,
} from '$/sources/Neynar/Rest/types.ts'

const csv = (values: (number | string)[]) => values.join(',')

export const getBulkUsers = async ({
	fids,
}: {
	fids: number[]
}): Promise<NeynarBulkUsersResponse | undefined> => {
	if (fids.length === 0) return { users: [] }
	const q = new URLSearchParams({ fids: csv(fids) })
	return neynarFetch<NeynarBulkUsersResponse>(`/v2/farcaster/user/bulk/?${q}`)
}

export type NeynarFeedQuery =
	| {
		feedType: 'filter'
		filterType: 'global_trending'
		limit?: number
		cursor?: string
		viewerFid?: number
	}
	| {
		feedType: 'filter'
		filterType: 'fids'
		fids: number[]
		limit?: number
		cursor?: string
		viewerFid?: number
	}
	| {
		feedType: 'filter'
		filterType: 'channel_id'
		channelId: string
		limit?: number
		cursor?: string
		membersOnly?: boolean
		viewerFid?: number
	}

/**
 * Neynar feed — `feed_type` + `filter_type` per
 * https://docs.neynar.com/reference/fetch-feed
 */
export const getFeed = async (
	query: NeynarFeedQuery,
): Promise<NeynarFeedResponse | undefined> => {
	const q = new URLSearchParams()
	q.set('feed_type', query.feedType)
	q.set('filter_type', query.filterType)
	if (query.filterType === 'fids' && query.fids.length > 0) {
		q.set('fids', query.fids.join(','))
	}
	if (query.filterType === 'channel_id') {
		q.set('channel_id', query.channelId)
		if (query.membersOnly != null) {
			q.set('members_only', String(query.membersOnly))
		}
	}
	const cap = Math.min(Math.max(query.limit ?? 25, 1), 100)
	q.set('limit', String(cap))
	if (query.cursor != null && query.cursor !== '') {
		q.set('cursor', query.cursor)
	}
	if (query.viewerFid != null) {
		q.set('viewer_fid', String(query.viewerFid))
	}
	return neynarFetch<NeynarFeedResponse>(`/v2/farcaster/feed/?${q}`)
}

export const getCastByHash = async (
	hash: `0x${string}`,
): Promise<NeynarCastWire | undefined> => {
	const q = new URLSearchParams({
		identifier: hash,
		type: 'hash',
	})
	const response = await neynarFetch<{ cast?: NeynarCastWire }>(`/v2/farcaster/cast/?${q}`)
	return response?.cast
}

export const pickUserByFid = (
	users: NeynarUserWire[],
	fid: number,
) => (
	users.find((user) => user.fid === fid)
)
