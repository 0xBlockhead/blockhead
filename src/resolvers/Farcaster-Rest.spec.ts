import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getAllChannels = vi.hoisted(() => vi.fn())
const getChannel = vi.hoisted(() => vi.fn())
const getChannelMember = vi.hoisted(() => vi.fn())
const getUserFollowingChannelsPage = vi.hoisted(() => vi.fn())
const getUserThreadCasts = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Farcaster/Rest/queries.ts', () => ({
	getAllChannels,
	getChannel,
	getChannelMember,
	getUserFollowingChannelsPage,
	getUserThreadCasts,
}))

const { default: farcasterRest } = await import('$/resolvers/Farcaster-Rest.ts')

const castResolver = farcasterRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterCast
	&& 'UsernameHashPrefix' in resolver.resolve
))

if (castResolver == null || !('UsernameHashPrefix' in castResolver.resolve))
	throw new Error('Farcaster spec missing UsernameHashPrefix cast resolver')

const castResolve = castResolver.resolve

const channelsResolver = farcasterRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterNetwork
	&& '$$channels' in resolver.projections
))
const channelResolver = farcasterRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterChannel
	&& 'Id' in resolver.resolve
	&& '$$timestamps' in resolver.projections
))
const channelViewerResolver = farcasterRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterUser
	&& '$$channelViewerTimestamps' in resolver.projections
))

if (
	channelsResolver == null
	|| channelResolver == null
	|| !('Id' in channelResolver.resolve)
	|| !('ParentUrl' in channelResolver.resolve)
	|| channelViewerResolver == null
	|| !('Fid' in channelViewerResolver.resolve)
)
	throw new Error('Farcaster_Rest spec missing channel resolvers')

describe('Farcaster channel directory', () => {
	it('materializes all-channels fields without channel-detail requests', async () => {
		getAllChannels.mockResolvedValue([{
			id: 'dev',
			parentUrl: 'https://farcaster.xyz/~/channel/dev',
			name: 'Dev',
			createdAt: 1_700_000_000,
		}, {
			id: 'design',
			parentUrl: 'https://farcaster.xyz/~/channel/design',
			name: 'Design',
		}])

		const snapshot = await channelsResolver.resolve.Scope.resolve({}, {
			filters: [],
			sorts: [],
			pagination: { limit: 1 },
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(getAllChannels).toHaveBeenCalledOnce()
		expect(getChannel).not.toHaveBeenCalled()
		expect(channelsResolver.projections.$$channels.resolveCount(snapshot)).toBe(2)
		expect(channelsResolver.projections.$$channels.continuation(snapshot)).toEqual({
			operation: 'all-channels',
			target: 'client-api',
			terminal: false,
			token: '1',
		})
		expect(channelsResolver.projections.$$channels.select(snapshot)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					id: 'dev',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FarcasterChannel, [], 'parentUrl')]: 'https://farcaster.xyz/~/channel/dev',
					[entityFieldAddressKey(EntityType.FarcasterChannel, [], 'createdAt')]: 1_700_000_000_000,
					[entityFieldAddressKey(EntityType.FarcasterChannel, [], '$$timestamps')]: [{
						[EntityMetaKey.Selector]: {
							$channel: { id: 'dev' },
							source: 'Farcaster_Rest',
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'name')]: 'Dev',
						},
					}],
				},
			},
		])
	})

	it('projects stable detail and a source-keyed observation from one channel response', async () => {
		getChannel.mockResolvedValue({
			id: 'dev',
			name: 'Dev',
			parentUrl: 'https://farcaster.xyz/~/channel/dev',
			followerCount: 100,
			memberCount: 10,
		})
		const channel = await channelResolver.resolve.Id.resolve({ id: 'dev' }, {})
		expect(channelResolver.projections.parentUrl(channel)).toBe('https://farcaster.xyz/~/channel/dev')
		const timestamps = channelResolver.projections.$$timestamps(channel)
		expect(timestamps).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$channel: { id: 'dev' },
				source: 'Farcaster_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'name')]: 'Dev',
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'followerCount')]: 100,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'memberCount')]: 10,
			},
		}])
		expect(timestamps[0]?.[EntityMetaKey.Selector]).toEqual(expect.objectContaining({
			timestampMs: expect.any(Number),
			source: 'Farcaster_Rest',
		}))
		expect(farcasterRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.FarcasterChannel_Timestamp
		))).toBe(false)
		expect(farcasterRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.FarcasterChannel
			&& '$$viewerTimestamps' in resolver.projections
		))).toBe(false)
		expect(getChannel).toHaveBeenCalledOnce()
	})

	it('keeps viewer identity and false membership on the materialized observation row', async () => {
		getUserFollowingChannelsPage.mockResolvedValue({
			result: {
				channels: [{
					id: 'dev',
					parentUrl: 'https://farcaster.xyz/~/channel/dev',
					name: 'Dev',
					followedAt: 0,
				}],
			},
		})
		getChannelMember.mockResolvedValue(undefined)

		const snapshot = await channelViewerResolver.resolve.Fid.resolve({ fid: 42 }, {
			filters: [],
			sorts: [],
			pagination: { limit: 16 },
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})
		const rows = channelViewerResolver.projections.$$channelViewerTimestamps.select(snapshot)

		expect(rows).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$channel: { id: 'dev' },
				$viewer: { fid: 42 },
				source: 'Farcaster_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'following')]: true,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'member')]: false,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'followedAt')]: 0,
			},
		}])
		expect(rows[0]?.[EntityMetaKey.Selector]).toEqual(expect.objectContaining({
			timestampMs: expect.any(Number),
			source: 'Farcaster_Rest',
		}))
		expect(getChannelMember).toHaveBeenCalledWith({
			channelId: 'dev',
			fid: 42,
		})
	})
})

describe('Farcaster public cast direct replies', () => {
	it('keeps valid direct reply siblings when another row is malformed', async () => {
		getUserThreadCasts.mockResolvedValueOnce({
			result: {
				casts: [
					{
						hash: '0xabcdef',
						author: { fid: 42 },
						text: 'Focal cast',
						timestamp: 1_752_840_000,
					},
					{
						hash: '0x1111',
						parentHash: 'ABCDEF',
						parentAuthor: { fid: 42 },
						author: {
							fid: 7,
							username: 'bob',
						},
						text: 'Direct reply',
						timestamp: 1_752_840_001,
						channel: { id: 'design' },
					},
					{
						hash: '0x2222',
						parentHash: '0xabcdef',
						parentAuthor: { fid: 42 },
					},
					{
						hash: '0x3333',
						parentHash: '0x1111',
						parentAuthor: { fid: 7 },
						author: { fid: 8 },
					},
					{
						hash: '0x4444',
						parentHash: '0xabcdef',
						parentAuthor: { fid: 99 },
						author: { fid: 9 },
					},
					{
						hash: '0x5555',
						parentHash: '0xABCDEF',
						parentAuthor: { fid: 42 },
						author: { fid: 10 },
						timestamp: 1_752_840_002,
					},
				],
			},
		})

		const cast = await castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})

		expect(cast.$$directReplies.map((reply) => reply[EntityMetaKey.Selector])).toEqual([
			{
				fid: 7,
				hash: '0x1111',
			},
			{
				fid: 10,
				hash: '0x5555',
			},
		])
		expect(cast.$$directReplies[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
				[EntityMetaKey.Selector]: { fid: 7 },
			},
			[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
				[EntityMetaKey.Selector]: {
					fid: 42,
					hash: '0xabcdef',
				},
			},
			[entityFieldAddressKey(EntityType.FarcasterCast, [], '$channel')]: {
				[EntityMetaKey.Selector]: { id: 'design' },
			},
		})
	})

	it('rejects a hash-prefix result for another username subject', async () => {
		getUserThreadCasts.mockResolvedValueOnce({
			result: {
				casts: [{
					hash: '0xabcdef',
					author: {
						fid: 42,
						username: 'mallory',
					},
					timestamp: 1_752_840_000,
				}],
			},
		})

		await expect(castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})).rejects.toThrow('cast author username mismatch')
	})
})
