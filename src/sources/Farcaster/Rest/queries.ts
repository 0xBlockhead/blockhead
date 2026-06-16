/**
 * Farcaster Client API channel and primary-address queries.
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-all-channels
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-a-channel
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-user-primary-address
 */

import { farcasterGet } from '$/sources/Farcaster/Rest/client.ts'
import {
	farcasterRestAllChannelsPageLimit,
	farcasterRestUserThreadCastsLimit,
} from '$/sources/Farcaster/Rest/constants.ts'
import type {
	FarcasterChannelResponse,
	FarcasterPage,
	FarcasterChannel,
	FarcasterChannelsResponse,
	FarcasterPrimaryAddressResponse,
	FarcasterThreadCast,
	FarcasterUserThreadCastsResponse,
} from '$/sources/Farcaster/Rest/types.ts'

/**
 * `GET /v2/all-channels`
 */
export const getAllChannelsPage = async ({
	cursor,
	limit = farcasterRestAllChannelsPageLimit,
}: {
	cursor?: string
	limit?: number
} = {}) => (
	await farcasterGet<FarcasterChannelsResponse>('/v2/all-channels', {
		cursor,
		limit,
	})
)

export const getAllChannels = async () => {
	const channels = new Map<string, FarcasterChannel>()
	let cursor: string | undefined

	do {
		const page = await getAllChannelsPage({
			cursor,
		})

		for (const channel of page.result?.channels ?? []) {
			channels.set(channel.id, channel)
		}

		cursor = page.next?.cursor
	} while (cursor != null && cursor !== '')

	return [...channels.values()]
}

/**
 * `GET /v1/channel`
 */
export const getChannel = async (channelId: string) => (
	(await farcasterGet<FarcasterChannelResponse>('/v1/channel', { channelId })).result?.channel
)

/**
 * `GET /fc/primary-address`
 */
export const getPrimaryAddress = async ({
	fid,
	protocol = 'ethereum',
}: {
	fid: number
	protocol?: 'ethereum' | 'solana'
}) => (
	(await farcasterGet<FarcasterPrimaryAddressResponse>('/fc/primary-address', {
		fid,
		protocol,
	})).result?.address?.address
)

/**
 * Public web API used by farcaster.xyz cast pages (no API key required).
 * `GET /~api/v2/user-thread-casts?castHashPrefix=<prefix>&username=<name>`
 */
export const getUserThreadCasts = async ({
	username,
	castHashPrefix,
	limit = farcasterRestUserThreadCastsLimit,
}: {
	username: string
	castHashPrefix: string
	limit?: number
}) => (
	await farcasterGet<FarcasterUserThreadCastsResponse>(
		'/~api/v2/user-thread-casts',
		{
			username,
			castHashPrefix,
			limit,
		}
	)
)

export const getCastByUsernameAndHashPrefix = async ({
	username,
	castHashPrefix,
}: {
	username: string
	castHashPrefix: string
}): Promise<FarcasterThreadCast | undefined> => (
	(await getUserThreadCasts({
		username,
		castHashPrefix,
	})).result?.casts?.[0]
)

/**
 * `GET /v1/channel-followers`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-channel-followers
 */
export const getChannelFollowersPage = ({
	channelId,
	cursor,
	limit,
}: {
	channelId: string
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			users: { fid: number; followedAt: number }[]
		}>
	>('/v1/channel-followers', { channelId, cursor, limit })
)

/**
 * `GET /v1/user-following-channels`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-channels-a-user-is-following
 */
export const getUserFollowingChannelsPage = ({
	fid,
	cursor,
	limit,
}: {
	fid: number
	cursor?: string
	limit?: number
}) => (
	farcasterGet<FarcasterPage<{ channels: FarcasterChannel[] }>>(
		'/v1/user-following-channels',
		{ fid, cursor, limit }
	)
)

const countRowsAcrossFarcasterPages = async <_Result, _Row>({
	loadPage,
	selectRows,
}: {
	loadPage: (cursor?: string) => Promise<FarcasterPage<_Result>>
	selectRows: (result: _Result | undefined) => _Row[] | undefined
}) => {
	let count = 0
	let cursor: string | undefined
	do {
		const page = await loadPage(cursor)
		count += selectRows(page.result)?.length ?? 0
		cursor = page.next?.cursor
	} while (cursor != null && cursor !== '')
	return count
}

export const getChannelFollowersCount = async ({
	channelId,
}: {
	channelId: string
}) => (
	countRowsAcrossFarcasterPages({
		loadPage: (cursor) => (
			getChannelFollowersPage({
				channelId,
				cursor,
				limit: 100,
			})
		),
		selectRows: (result) => (
			result?.users
		),
	})
)

export const getChannelMembersCount = async ({
	channelId,
}: {
	channelId: string
}) => (
	countRowsAcrossFarcasterPages({
		loadPage: (cursor) => (
			getChannelMembersPage({
				channelId,
				cursor,
				limit: 100,
			})
		),
		selectRows: (result) => (
			result?.members
		),
	})
)

export const getUserFollowingChannelsCount = async ({
	fid,
}: {
	fid: number
}) => (
	countRowsAcrossFarcasterPages({
		loadPage: (cursor) => (
			getUserFollowingChannelsPage({
				fid,
				cursor,
				limit: 100,
			})
		),
		selectRows: (result) => (
			result?.channels
		),
	})
)

/**
 * `GET /v1/user-channel`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-user-following-channel-status
 */
export const getUserChannelFollowStatus = ({
	fid,
	channelId,
}: {
	fid: number
	channelId: string
}) => (
	farcasterGet<{
		result: { following: boolean; followedAt?: number }
	}>('/v1/user-channel', { fid, channelId })
)

/**
 * `GET /fc/channel-members`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-channel-members
 */
export const getChannelMembersPage = ({
	channelId,
	fid,
	cursor,
	limit,
}: {
	channelId: string
	fid?: number
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			members: { fid: number; memberAt: number }[]
		}>
	>('/fc/channel-members', { channelId, fid, cursor, limit })
)

/**
 * `GET /fc/channel-invites`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-channel-invites
 */
export const getChannelInvitesPage = ({
	channelId,
	fid,
	cursor,
	limit,
}: {
	channelId?: string
	fid?: number
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			invites: {
				channelId: string
				invitedFid: number
				invitedAt: number
				inviterFid: number
				role: 'member' | 'moderator'
			}[]
		}>
	>('/fc/channel-invites', { channelId, fid, cursor, limit })
)

/**
 * `GET /fc/moderated-casts`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-cast-moderation-actions
 */
export const getModeratedCastsPage = ({
	channelId,
	cursor,
	limit,
}: {
	channelId?: string
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			moderationActions: {
				castHash: string
				channelId: string
				action: 'hide' | 'unhide'
				moderatedAt: number
			}[]
		}>
	>('/fc/moderated-casts', { channelId, cursor, limit })
)

/**
 * `GET /fc/channel-restricted-users`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-channel-restricted-users
 */
export const getChannelRestrictedUsersPage = ({
	channelId,
	fid,
	cursor,
	limit,
}: {
	channelId?: string
	fid?: number
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			restrictedUsers: { fid: number; channelId: string; restrictedAt: number }[]
		}>
	>('/fc/channel-restricted-users', { channelId, fid, cursor, limit })
)

/**
 * `GET /fc/channel-bans`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-channel-banned-users
 */
export const getChannelBannedUsersPage = ({
	channelId,
	fid,
	cursor,
	limit,
}: {
	channelId?: string
	fid?: number
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			bannedUsers: { fid: number; channelId: string; bannedAt: number }[]
		}>
	>('/fc/channel-bans', { channelId, fid, cursor, limit })
)

/**
 * `GET /v2/discover-actions`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-farcaster-actions
 */
export const getDiscoverActionsPage = ({
	list,
	cursor,
	limit,
}: {
	list: 'top'
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			actions: {
				name: string
				icon: string
				description: string
				aboutUrl: string
				actionUrl: string
				action: { actionType: 'post'; postUrl: string }
			}[]
		}>
	>('/v2/discover-actions', { list, cursor, limit })
)

/**
 * `GET /fc/blocked-users`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-blocked-users
 */
export const getBlockedUsersPage = ({
	blockerFid,
	cursor,
	limit,
}: {
	blockerFid?: number
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			blockedUsers: { blockerFid: number; blockedFid: number; createdAt: number }[]
		}>
	>('/fc/blocked-users', { blockerFid, cursor, limit })
)

/**
 * `GET /fc/account-verifications`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-account-verifications
 */
export const getAccountVerificationsPage = ({
	fid,
	platform,
	cursor,
	limit,
}: {
	fid?: number
	platform?: 'x' | 'github' | 'discord'
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			verifications: {
				fid: number
				platform: 'x' | 'github' | 'discord'
				platformId: string
				platformUsername: string
				verifiedAt: number
			}[]
		}>
	>('/fc/account-verifications', { fid, platform, cursor, limit })
)

/**
 * `GET /v1/creator-rewards-winner-history`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-creator-reward-winners
 */
export const getCreatorRewardsWinnerHistoryPage = ({
	periodsAgo,
	cursor,
	limit,
}: {
	periodsAgo?: number
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			history: {
				periodStartTimestamp: number
				periodEndTimestamp: number
				winners: {
					fid: number
					score: number
					rank: number
					rewardCents: number
					username: string
					walletAddress?: `0x${string}`
				}[]
			}
		}>
	>('/v1/creator-rewards-winner-history', { periodsAgo, cursor, limit })
)

/**
 * `GET /v1/developer-rewards-winner-history`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-developer-reward-winners
 */
export const getDeveloperRewardsWinnerHistoryPage = ({
	periodsAgo,
	cursor,
	limit,
}: {
	periodsAgo?: number
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			history: {
				periodStartTimestamp: number
				periodEndTimestamp: number
				winners: {
					fid: number
					domain: string
					frameName: string
					score: number
					rank: number
					rewardCents: number
					walletAddress?: `0x${string}`
				}[]
			}
		}>
	>('/v1/developer-rewards-winner-history', { periodsAgo, cursor, limit })
)

/**
 * `GET /fc/primary-address`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-user-primary-address
 */
export const getPrimaryAddressResponse = ({
	fid,
	protocol,
}: {
	fid: number
	protocol: 'ethereum' | 'solana'
}) => (
	farcasterGet<{
		result: {
			address: {
				fid: number
				protocol: 'ethereum' | 'solana'
				address: string
			}
		}
	}>('/fc/primary-address', { fid, protocol })
)

/**
 * `GET /fc/primary-addresses`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-multiple-user-primary-addresses
 */
export const getPrimaryAddresses = ({
	fids,
	protocol,
}: {
	fids: string
	protocol: 'ethereum' | 'solana'
}) => (
	farcasterGet<{
		result: {
			addresses: (
				| { fid: number; success: true; address: { fid: number; protocol: 'ethereum' | 'solana'; address: string } }
				| { fid: number; success: false }
			)[]
		}
	}>('/fc/primary-addresses', { fids, protocol })
)

/**
 * `GET /fc/starter-pack-members`
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-starter-pack-members
 */
export const getStarterPackMembersPage = ({
	id,
	cursor,
	limit,
}: {
	id: string
	cursor?: string
	limit?: number
}) => (
	farcasterGet<
		FarcasterPage<{
			members: { fid: number; memberAt: number }[]
		}>
	>('/fc/starter-pack-members', { id, cursor, limit })
)
