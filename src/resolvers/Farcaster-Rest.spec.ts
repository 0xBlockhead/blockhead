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
const getUserFollowingChannelsCount = vi.hoisted(() => vi.fn())
const getUserFollowingChannelsPage = vi.hoisted(() => vi.fn())
const getUserThreadCastsByClientUrl = vi.hoisted(() => vi.fn())
const getUserThreadCasts = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Farcaster/Rest/queries.ts', () => ({
	getAllChannels,
	getChannel,
	getChannelMember,
	getUserFollowingChannelsCount,
	getUserFollowingChannelsPage,
	getUserThreadCastsByClientUrl,
	getUserThreadCasts,
}))

const { default: farcasterRest } = await import('$/resolvers/Farcaster-Rest.ts')

const castResolver = farcasterRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterCast
	&& 'ClientUrl' in resolver.resolve
	&& 'UsernameHashPrefix' in resolver.resolve
))

if (
	castResolver == null
	|| !('ClientUrl' in castResolver.resolve)
	|| !('UsernameHashPrefix' in castResolver.resolve)
)
	throw new Error('Farcaster spec missing client URL and username/hash-prefix cast resolvers')

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
	&& 'select' in resolver.projections.$$channelViewerTimestamps
))
const channelViewerCountResolver = farcasterRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterUser
	&& '$$channelViewerTimestamps' in resolver.projections
	&& 'resolveCount' in resolver.projections.$$channelViewerTimestamps
	&& !('select' in resolver.projections.$$channelViewerTimestamps)
))

if (
	channelsResolver == null
	|| channelResolver == null
	|| !('Id' in channelResolver.resolve)
	|| !('ParentUrl' in channelResolver.resolve)
	|| channelViewerResolver == null
	|| !('Fid' in channelViewerResolver.resolve)
	|| channelViewerCountResolver == null
	|| !('Fid' in channelViewerCountResolver.resolve)
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

	it('rejects invalid external channel observation counts', async () => {
		getChannel.mockResolvedValueOnce({
			id: 'dev',
			parentUrl: 'https://farcaster.xyz/~/channel/dev',
			name: 'Dev',
			followerCount: -1,
		})

		await expect(channelResolver.resolve.Id.resolve({ id: 'dev' }, {})).rejects.toThrow(
			'channel counts must be safe nonnegative integers'
		)

		getChannel.mockResolvedValueOnce({
			id: 'dev',
			parentUrl: 'https://farcaster.xyz/~/channel/dev',
			name: 'Dev',
			createdAt: -1,
		})

		await expect(channelResolver.resolve.Id.resolve({ id: 'dev' }, {})).rejects.toThrow(
			'timestamp must resolve to safe nonnegative milliseconds'
		)
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

	it('resolves the independent following-channel count without coupling it to page rows', async () => {
		getUserFollowingChannelsCount.mockResolvedValue(3)

		const count = await channelViewerCountResolver.resolve.Fid.resolve({ fid: 42 }, {})

		expect(channelViewerCountResolver.projections.$$channelViewerTimestamps.resolveCount(count)).toBe(3)
		expect(getUserFollowingChannelsCount).toHaveBeenCalledWith({ fid: 42 })
	})
})

describe('Farcaster public cast direct replies', () => {
	it('materializes the exact ClientUrl selector through the public thread operation', async () => {
		const clientUrl = 'https://farcaster.xyz/alice/0xabcdef12'
		getUserThreadCastsByClientUrl.mockResolvedValueOnce({
			username: 'alice',
			castHashPrefix: '0xabcdef12',
			response: {
				result: {
					casts: [{
						hash: '0xabcdef1234567890123456789012345678901234',
						author: {
							fid: 42,
							username: 'alice',
						},
						text: 'Focal cast',
						timestamp: 1_752_840_000,
					}],
				},
			},
		})

		const cast = await castResolve.ClientUrl.resolve({ clientUrl })

		expect(getUserThreadCastsByClientUrl).toHaveBeenCalledWith(clientUrl)
		expect(castResolver.projections.clientUrl(cast)).toBe(clientUrl)
		expect(cast).toMatchObject({
			fid: 42,
			hash: '0xabcdef1234567890123456789012345678901234',
			username: 'alice',
			hashPrefix: '0xabcdef12',
			clientUrl,
			text: 'Focal cast',
			timestamp: 1_752_840_000_000,
		})
	})

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
						reactions: { count: 4 },
						recasts: { count: 2 },
						replies: { count: 1 },
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
			[entityFieldAddressKey(EntityType.FarcasterCast, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$cast: {
						fid: 7,
						hash: '0x1111',
					},
					source: 'Farcaster_Rest',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'likeCount')]: 4,
					[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'recastCount')]: 2,
					[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'replyCount')]: 1,
				},
			}],
		})
	})

	it('materializes source-clocked public engagement counts on the cast observation', async () => {
		getUserThreadCasts.mockResolvedValueOnce({
			result: {
				casts: [{
					hash: '0xabcdef',
					author: {
						fid: 42,
						username: 'alice',
					},
					timestamp: 1_752_840_000,
					reactions: { count: 8 },
					recasts: { count: 3 },
					replies: { count: 5 },
					quoteCount: 2,
				}],
			},
		})

		const cast = await castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})

		expect(castResolver.projections.$$timestamps(cast)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$cast: {
					fid: 42,
					hash: '0xabcdef',
				},
				source: 'Farcaster_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'likeCount')]: 8,
				[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'recastCount')]: 3,
				[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'replyCount')]: 5,
			},
		}])
		expect(cast.$$timestamps[0]?.[EntityMetaKey.Selector]).toEqual(expect.objectContaining({
			timestampMs: expect.any(Number),
			source: 'Farcaster_Rest',
		}))
	})

	it('materializes URL and quoted-cast embeds without fabricating empty rows', async () => {
		getUserThreadCasts.mockResolvedValueOnce({
			result: {
				casts: [{
					hash: '0xabcdef',
					author: { fid: 42, username: 'alice' },
					timestamp: 1_752_840_000,
					embeds: [
						{
							url: 'https://example.com/article',
							title: 'Article',
							description: 'A description',
						},
						{
							castId: {
								fid: 7,
								hash: '0x1234',
							},
							quotedPreviewText: 'Quoted body',
						},
						{},
					],
				}],
			},
		})

		const cast = await castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})
		const embeds = castResolver.projections.$$embeds.select(cast)
		expect(castResolver.projections.$$embeds.resolveCount(cast)).toBe(2)
		expect(embeds).toHaveLength(2)
		expect(embeds[0]?.[EntityMetaKey.Selector]).toEqual({
			$cast: { fid: 42, hash: '0xabcdef' },
			indexInCast: 0,
		})
		expect(embeds[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'url')]: 'https://example.com/article',
			[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'title')]: 'Article',
		})
		expect(embeds[1]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], '$embeddedCast')]: {
				[EntityMetaKey.Selector]: { fid: 7, hash: '0x1234' },
			},
			[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'quotedPreviewText')]: 'Quoted body',
		})
	})

	it('rejects invalid public engagement observations', async () => {
		getUserThreadCasts.mockResolvedValueOnce({
			result: {
				casts: [{
					hash: '0xabcdef',
					author: {
						fid: 42,
						username: 'alice',
					},
					timestamp: 1_752_840_000,
					recasts: { count: -1 },
				}],
			},
		})

		await expect(castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})).rejects.toThrow('cast engagement counts must be safe nonnegative integers')
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

	it('rejects non-hexadecimal cast identities before materialization', async () => {
		getUserThreadCasts.mockResolvedValueOnce({
			result: {
				casts: [{
					hash: 'not-a-cast-hash',
					author: {
						fid: 42,
						username: 'alice',
					},
					timestamp: 1_752_840_000,
				}],
			},
		})

		await expect(castResolve.UsernameHashPrefix.resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		})).rejects.toThrow('cast hash is not hexadecimal')
	})
})
