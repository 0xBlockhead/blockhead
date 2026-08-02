/**
 * Farcaster Client API channel and primary-address queries.
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-all-channels
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-a-channel
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-user-primary-address
 */

import { farcasterGet } from '$/sources/Farcaster/Rest/client.ts'
import { farcasterRestUserThreadCastsLimit } from '$/sources/Farcaster/Rest/constants.ts'
import type {
	FarcasterChannel,
	FarcasterChannelResponse,
	FarcasterChannelsResponse,
	FarcasterPage,
	FarcasterPrimaryAddressResponse,
	FarcasterUserThreadCastsResponse,
} from '$/sources/Farcaster/Rest/types.ts'

/**
 * `GET /v2/all-channels`
 */
export const getAllChannels = async () => {
	const channels = (
		await farcasterGet<FarcasterChannelsResponse>('client-api', '/v2/all-channels')
	).result?.channels ?? []
	if (new Set(channels.map(({ id }) => id)).size !== channels.length)
		throw new Error('Farcaster_Rest: duplicate channel id')

	return channels
}

/**
 * `GET /v1/channel`
 */
export const getChannel = async (channelId: string) => (
	(
		await farcasterGet<FarcasterChannelResponse>('client-api', '/v1/channel', { channelId })
	).result?.channel
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
}) => {
	const address = (
		await farcasterGet<FarcasterPrimaryAddressResponse>(
			'client-api',
			'/fc/primary-address',
			{
				fid,
				protocol,
			}
		)
	).result?.address
	if (
		address != null
		&& (
			address.fid !== fid
			|| address.protocol !== protocol
		)
	)
		throw new Error('Farcaster_Rest: primary address subject mismatch')
	return address?.address
}

/**
 * Public web API used by farcaster.xyz cast pages (no API key required).
 * `GET /~api/v2/user-thread-casts?castHashPrefix=<prefix>&username=<name>`
 */
export const getUserThreadCasts = ({
	username,
	castHashPrefix,
	limit = farcasterRestUserThreadCastsLimit,
}: {
	username: string
	castHashPrefix: string
	limit?: number
}) => (
	farcasterGet<FarcasterUserThreadCastsResponse>(
		'web-api',
		'/~api/v2/user-thread-casts',
		{
			username,
			castHashPrefix,
			limit,
		}
	)
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
	>('client-api', '/v1/channel-followers', { channelId, cursor, limit })
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
		'client-api',
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

export const getUserFollowingChannelsCount = ({
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
	}>('client-api', '/v1/user-channel', { fid, channelId })
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
	>('client-api', '/fc/channel-members', { channelId, fid, cursor, limit })
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
	>('client-api', '/fc/channel-invites', { channelId, fid, cursor, limit })
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
	>('client-api', '/fc/moderated-casts', { channelId, cursor, limit })
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
	>('client-api', '/fc/channel-restricted-users', { channelId, fid, cursor, limit })
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
	>('client-api', '/fc/channel-bans', { channelId, fid, cursor, limit })
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
	>('client-api', '/v2/discover-actions', { list, cursor, limit })
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
	>('client-api', '/fc/blocked-users', { blockerFid, cursor, limit })
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
	>('client-api', '/fc/account-verifications', { fid, platform, cursor, limit })
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
	>('client-api', '/v1/creator-rewards-winner-history', { periodsAgo, cursor, limit })
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
	>('client-api', '/v1/developer-rewards-winner-history', { periodsAgo, cursor, limit })
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
	}>('client-api', '/fc/primary-addresses', { fids, protocol })
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
	>('client-api', '/fc/starter-pack-members', { id, cursor, limit })
)
