/**
 * Farcaster Client API channel and primary-address queries.
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-all-channels
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-a-channel
 * @see https://docs.farcaster.xyz/reference/farcaster/api#get-user-primary-address
 */

import { farcasterGet } from '$/sources/Farcaster/Rest/client.ts'
import type {
	FarcasterChannelResponse,
	FarcasterChannelWire,
	FarcasterChannelsResponse,
	FarcasterPrimaryAddressResponse,
} from '$/sources/Farcaster/Rest/types.ts'

/**
 * `GET /v2/all-channels`
 */
export const getAllChannelsPage = async ({
	cursor,
	limit,
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
	const channels = new Map<string, FarcasterChannelWire>()
	let cursor: string | undefined

	do {
		const page = await getAllChannelsPage({
			cursor,
			limit: 100,
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
