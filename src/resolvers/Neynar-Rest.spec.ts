import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	NeynarCast,
	NeynarChannel,
	NeynarUser,
} from '$/sources/Neynar/Rest/types.ts'
const getBulkUsers = vi.hoisted(() => vi.fn())
const getCast = vi.hoisted(() => vi.fn())
const getChannel = vi.hoisted(() => vi.fn())
const getChannelMembersPage = vi.hoisted(() => vi.fn())
const getFeed = vi.hoisted(() => vi.fn())
const getUserChannelsPage = vi.hoisted(() => vi.fn())
const getUserCastsPage = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Neynar/Rest/queries.ts', () => ({
	getBulkUsers,
	getCast,
	getChannel,
	getChannelMembersPage,
	getFeed,
	getUserChannelsPage,
	getUserCastsPage,
}))

const { default: neynarResolvers } = await import('$/resolvers/Neynar-Rest.ts')

const feedResolver = neynarResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterFeed
	&& '$$entries' in resolver.projections
))

if (feedResolver == null)
	throw new Error('Neynar spec missing FarcasterFeed.$$entries resolver')

const userFeedResolver = neynarResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterUser
	&& '$$casts' in resolver.projections
))

if (userFeedResolver == null)
	throw new Error('Neynar spec missing FarcasterUser.$$casts resolver')

const channelFeedResolver = neynarResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterChannel
	&& '$$casts' in resolver.projections
))

if (channelFeedResolver == null)
	throw new Error('Neynar spec missing FarcasterChannel.$$casts resolver')

const channelResolver = neynarResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterChannel
	&& 'Id' in resolver.resolve
	&& 'parentUrl' in resolver.projections
))
const channelViewerResolver = neynarResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterUser
	&& '$$channelViewerTimestamps' in resolver.projections
))

if (
	channelResolver == null
	|| !('Id' in channelResolver.resolve)
	|| !('ParentUrl' in channelResolver.resolve)
	|| channelViewerResolver == null
	|| !('Fid' in channelViewerResolver.resolve)
)
	throw new Error('Neynar spec missing channel identity/viewer resolvers')

const castResolver = neynarResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterCast
	&& 'text' in resolver.projections
	&& 'Hash' in resolver.resolve
	&& 'UsernameHashPrefix' in resolver.resolve
))

if (
	castResolver == null
	|| !('FidHash' in castResolver.resolve)
	|| !('ClientUrl' in castResolver.resolve)
	|| !('Hash' in castResolver.resolve)
	|| !('UsernameHashPrefix' in castResolver.resolve)
)
	throw new Error('Neynar spec missing FarcasterCast resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const neynarUser = (
	fid: number,
	username = `user-${fid}`
) => ({
	auth_addresses: [],
	custody_address: '0x0000000000000000000000000000000000000000',
	fid,
	follower_count: 0,
	following_count: 0,
	object: 'user',
	profile: {
		bio: { text: '' },
	},
	registered_at: '2026-07-15T00:00:00.000Z',
	username,
	verifications: [],
	verified_accounts: [],
	verified_addresses: {
		eth_addresses: [],
		primary: {
			eth_address: null,
			sol_address: null,
		},
		sol_addresses: [],
	},
}) satisfies NeynarUser

const neynarCast = (
	{
		hash,
		fid,
		username,
		channelId,
		text = '',
		timestamp = '2026-07-15T00:00:00.000Z',
	}: {
		hash: string
		fid: number
		username?: string
		channelId?: string
		text?: string
		timestamp?: string
	},
	overrides: Partial<NeynarCast> = {}
) => ({
	author: neynarUser(fid, username),
	channel: channelId == null ? null : {
		id: channelId,
		name: channelId,
	},
	embeds: [],
	hash,
	mentioned_channels: [],
	mentioned_channels_ranges: [],
	mentioned_profiles: [],
	mentioned_profiles_ranges: [],
	object: 'cast',
	parent_author: { fid: null },
	parent_hash: null,
	parent_url: null,
	reactions: {
		likes: [],
		likes_count: 0,
		recasts: [],
		recasts_count: 0,
	},
	replies: { count: 0 },
	root_parent_url: null,
	text,
	thread_hash: null,
	timestamp,
	...overrides,
}) satisfies NeynarCast

describe('Neynar Farcaster feed resolver', () => {
	it('loads the Farcaster cast/feed materializers through the canonical registry', async () => {
		await expect(loadResolvers(new Set([
			Source.Neynar_Rest,
		]))).resolves.toEqual([
			neynarResolvers,
		])
	})

	it('materializes visible cast content from the feed response', async () => {
		const page = {
			casts: [
				neynarCast({
					hash: '0xABCDEF',
					fid: 42,
					username: 'alice',
					text: 'A live cast from the feed',
					timestamp: '2026-07-15T12:34:56.000Z',
				}),
			],
			next: {
				cursor: 'next-page',
			},
		}
		getFeed.mockResolvedValueOnce(page)

		await expect(feedResolver.resolve['Variant'].resolve({
			variant: 'trending',
		}, resolverContext)).resolves.toEqual(page)
		if (
			typeof feedResolver.projections.$$entries === 'function'
			|| feedResolver.projections.$$entries.select == null
			|| feedResolver.projections.$$entries.continuation == null
		)
			throw new Error('Neynar spec missing executable FarcasterFeed continuation')

		expect(feedResolver.projections.$$entries.select(
			page,
			{ variant: 'trending' },
			resolverContext
		)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					fid: 42,
					hash: '0xabcdef',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FarcasterCast, [], 'fid')]: 42,
					[entityFieldAddressKey(EntityType.FarcasterCast, [], 'hash')]: '0xabcdef',
					[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
						[EntityMetaKey.Selector]: { fid: 42 },
					},
					[entityFieldAddressKey(EntityType.FarcasterCast, [], 'text')]: 'A live cast from the feed',
					[entityFieldAddressKey(EntityType.FarcasterCast, [], 'timestamp')]: Date.parse('2026-07-15T12:34:56.000Z'),
					[entityFieldAddressKey(EntityType.FarcasterCast, [], 'username')]: 'alice',
					[entityFieldAddressKey(EntityType.FarcasterCast, [], '$$timestamps')]: [{
						[EntityMetaKey.Selector]: {
							$cast: {
								fid: 42,
								hash: '0xabcdef',
							},
							timestampMs: expect.any(Number),
							source: Source.Neynar_Rest,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'likeCount')]: 0,
							[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'recastCount')]: 0,
							[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'replyCount')]: 0,
						},
					}],
				},
			},
		])
		expect(feedResolver.projections.$$entries.continuation(
			page,
			{ variant: 'trending' },
			resolverContext
		)).toEqual({
			operation: 'feed',
			target: 'api',
			terminal: false,
			token: 'next-page',
		})
		expect(getFeed).toHaveBeenCalledWith(
			{},
			{
				feedType: 'filter',
				filterType: 'global_trending',
				limit: 64,
				cursor: undefined,
			}
		)
	})

	it('does not invent feed rows when Neynar returns an empty page', async () => {
		const page = {
			casts: [],
			next: { cursor: null },
		}
		getFeed.mockResolvedValueOnce(page)
		await expect(feedResolver.resolve['Variant'].resolve({
			variant: 'trending',
		}, resolverContext)).resolves.toEqual(page)
		if (
			typeof feedResolver.projections.$$entries === 'function'
			|| feedResolver.projections.$$entries.select == null
		)
			throw new Error('Neynar spec missing FarcasterFeed selector')
		expect(feedResolver.projections.$$entries.select(
			page,
			{ variant: 'trending' },
			resolverContext
		)).toEqual([])
	})

	it('preserves opaque continuation and viewer identity for following feeds', async () => {
		const page = {
			casts: [],
			next: {
				cursor: 'opaque+/=cursor',
			},
		}
		getFeed.mockResolvedValueOnce(page)

		await expect(feedResolver.resolve['Following'].resolve({
			variant: 'following',
			viewerFid: 42,
		}, {
			...resolverContext,
			pagination: {
				limit: 1_000,
			},
			providerContinuationToken: 'previous+/=cursor',
		})).resolves.toEqual(page)
		if (
			typeof feedResolver.projections.$$entries === 'function'
			|| feedResolver.projections.$$entries.continuation == null
		)
			throw new Error('Neynar spec missing FarcasterFeed continuation')

		expect(feedResolver.projections.$$entries.continuation(
			page,
			{
				variant: 'following',
				viewerFid: 42,
			},
			resolverContext
		)).toEqual({
			operation: 'feed',
			target: 'api',
			viewerScope: '42',
			terminal: false,
			token: 'opaque+/=cursor',
		})
		expect(getFeed).toHaveBeenCalledWith(
			{},
			{
				feedType: 'following',
				fid: 42,
				limit: 1_000,
				cursor: 'previous+/=cursor',
				viewerFid: 42,
			}
		)
		expect(feedResolver.projections.$$entries.continuation(
			{
				casts: [],
				next: {
					cursor: '',
				},
			},
			{
				variant: 'following',
				viewerFid: 42,
			},
			resolverContext
		)).toEqual({
			operation: 'feed',
			target: 'api',
			viewerScope: '42',
			terminal: true,
		})
	})

	it('preserves the members-only channel partition', async () => {
		const page = {
			casts: [],
			next: {
				cursor: 'channel-next',
			},
		}
		getFeed.mockResolvedValueOnce(page)

		await expect(feedResolver.resolve['ByChannel'].resolve({
			variant: 'channel',
			channelId: 'design',
		}, {
			...resolverContext,
			providerContinuationToken: 'channel-current',
		})).resolves.toEqual(page)
		expect(getFeed).toHaveBeenCalledWith(
			{},
			{
				feedType: 'filter',
				filterType: 'channel_id',
				channelId: 'design',
				membersOnly: true,
				limit: 64,
				cursor: 'channel-current',
			}
		)
	})

	it('partitions only user and channel selectors while preserving variant and following feeds', () => {
		const projection = feedResolver.projections.$$entries
		if (
			typeof projection === 'function'
			|| projection.select == null
		)
			throw new Error('Neynar spec missing FarcasterFeed selector')
		const page = {
			casts: [
				neynarCast({
					hash: '0x1111',
					fid: 42,
					channelId: 'design',
				}),
				neynarCast({
					hash: '0x2222',
					fid: 43,
					channelId: 'design',
				}),
				neynarCast({
					hash: '0x3333',
					fid: 42,
					channelId: 'other',
				}),
			],
			next: { cursor: null },
		}

		for (const {
			entitySelector,
			expectedHashes,
		} of [
			{
				entitySelector: { variant: 'trending' },
				expectedHashes: ['0x1111', '0x2222', '0x3333'],
			},
			{
				entitySelector: {
					variant: 'user',
					fid: 42,
				},
				expectedHashes: ['0x1111', '0x3333'],
			},
			{
				entitySelector: {
					variant: 'channel',
					channelId: 'design',
				},
				expectedHashes: ['0x1111', '0x2222'],
			},
			{
				entitySelector: {
					variant: 'following',
					viewerFid: 42,
				},
				expectedHashes: ['0x1111', '0x2222', '0x3333'],
			},
		])
			expect(projection.select(
				page,
				entitySelector,
				resolverContext
			).map((cast) => cast[EntityMetaKey.Selector].hash)).toEqual(expectedHashes)
	})

	it('partitions official cast rows by user and channel identity', () => {
		const page = {
			casts: [
				neynarCast({
					hash: '0x1111',
					fid: 42,
					channelId: 'design',
				}),
				neynarCast({
					hash: '0x2222',
					fid: 43,
					channelId: 'design',
				}),
				neynarCast({
					hash: '0x5555',
					fid: 42,
					channelId: 'other',
				}),
			],
			next: { cursor: null },
		}
		const userProjection = userFeedResolver.projections.$$casts
		const channelProjection = channelFeedResolver.projections.$$casts
		if (
			typeof userProjection === 'function'
			|| userProjection.select == null
			|| typeof channelProjection === 'function'
			|| channelProjection.select == null
		)
			throw new Error('Neynar spec missing scoped cast selectors')

		expect(userProjection.select(
			page,
			{ fid: 42 },
			resolverContext
		)).toHaveLength(2)
		expect(channelProjection.select(
			page,
			{ id: 'design' },
			resolverContext
		)).toHaveLength(2)
		expect(userProjection.select(
			page,
			{ fid: 42 },
			resolverContext
		).map((cast) => cast[EntityMetaKey.Selector])).toEqual([
			{
				fid: 42,
				hash: '0x1111',
			},
			{
				fid: 42,
				hash: '0x5555',
			},
		])
	})

	it('materializes an exact FID cast page through the dedicated user-casts operation', async () => {
		const page = {
			casts: [
				neynarCast({
					hash: '0x1111',
					fid: 42,
				}),
				neynarCast({
					hash: '0x2222',
					fid: 42,
				}),
			],
			next: {
				cursor: 'next-user-page',
			},
		}
		getUserCastsPage.mockResolvedValueOnce(page)

		const resolvedPage = await userFeedResolver.resolve.Fid.resolve({
			fid: 42,
		}, {
			...resolverContext,
			providerContinuationToken: 'current-user-page',
		})
		expect(getUserCastsPage).toHaveBeenCalledWith(
			resolverContext.publicEnv,
			{
				fid: 42,
				limit: 64,
				cursor: 'current-user-page',
			}
		)
		const projection = userFeedResolver.projections.$$casts
		if (
			typeof projection === 'function'
			|| projection.select == null
			|| projection.continuation == null
		)
			throw new Error('Neynar spec missing user-cast pagination')

		expect(projection.select(
			resolvedPage,
			{ fid: 42 },
			resolverContext
		).map((cast) => cast[EntityMetaKey.Selector])).toEqual([{
			fid: 42,
			hash: '0x1111',
		}, {
			fid: 42,
			hash: '0x2222',
		}])
		expect(projection.continuation(
			resolvedPage,
			{ fid: 42 },
			resolverContext
		)).toEqual({
			operation: 'user-feed',
			target: 'api',
			terminal: false,
			token: 'next-user-page',
		})
	})

	it('rejects a dedicated user-casts page for a foreign FID', async () => {
		getUserCastsPage.mockResolvedValueOnce({
			casts: [
				neynarCast({
					hash: '0x2222',
					fid: 43,
				}),
			],
			next: {
				cursor: null,
			},
		})

		await expect(userFeedResolver.resolve.Fid.resolve({
			fid: 42,
		}, resolverContext)).rejects.toThrow('user casts subject mismatch')
	})

	it('marks user and channel continuations terminal without inventing tokens', () => {
		for (const resolver of [
			userFeedResolver,
			channelFeedResolver,
		]) {
			const projection = resolver.projections.$$casts
			if (
				typeof projection === 'function'
				|| projection.continuation == null
			)
				throw new Error('Neynar spec missing cast continuation')

			expect(projection.continuation(
				{
					casts: [],
					next: {
						cursor: '',
					},
				},
				resolver.entityType === EntityType.FarcasterUser ?
					{ fid: 42 }
				:
					{ id: 'design' },
				resolverContext
			)).toEqual({
				operation: (
					resolver.entityType === EntityType.FarcasterUser ?
						'user-feed'
					:
						'channel-feed'
				),
				target: 'api',
				terminal: true,
			})
		}
	})
})

describe('Neynar channel observations', () => {
	const channel = {
		created_at: '2026-07-15T00:00:00.000Z',
		id: 'design',
		name: 'Design',
		object: 'channel',
		parent_url: 'https://farcaster.xyz/~/channel/design',
		url: 'https://warpcast.com/~/channel/design',
		follower_count: 0,
		member_count: 0,
	} satisfies NeynarChannel

	it('keeps provider URL separate from stable FIP-2 parent identity', async () => {
		getChannel.mockResolvedValue(channel)

		const snapshot = await channelResolver.resolve.Id.resolve(
			{ id: channel.id },
			resolverContext
		)
		expect(channelResolver.projections.parentUrl(snapshot)).toBe(channel.parent_url)
		const timestamps = channelResolver.projections.$$timestamps(snapshot)
		expect(timestamps).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$channel: { id: 'design' },
				source: 'Neynar_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'name')]: 'Design',
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'followerCount')]: 0,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'memberCount')]: 0,
			},
		}])
		expect(timestamps[0]?.[EntityMetaKey.Selector]).toEqual(expect.objectContaining({
			timestampMs: expect.any(Number),
			source: 'Neynar_Rest',
		}))
		expect(getChannel).toHaveBeenCalledWith(resolverContext.publicEnv, {
			id: 'design',
			type: 'id',
		})
		expect(neynarResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.FarcasterChannel
			&& '$$viewerTimestamps' in resolver.projections
		))).toBe(false)
	})

	it('isolates false and role-bearing membership observations by viewer', async () => {
		getUserChannelsPage.mockResolvedValue({
			channels: [channel],
			next: { cursor: null },
		})
		getChannelMembersPage
			.mockResolvedValueOnce({
				members: [],
				next: { cursor: null },
			})
			.mockResolvedValueOnce({
				members: [{
					channel,
					object: 'member',
					role: 'owner',
					user: neynarUser(43),
				}],
				next: { cursor: null },
			})

		const rowsByViewer = [
			channelViewerResolver.projections.$$channelViewerTimestamps.select(
				await channelViewerResolver.resolve.Fid.resolve({ fid: 42 }, resolverContext)
			),
			channelViewerResolver.projections.$$channelViewerTimestamps.select(
				await channelViewerResolver.resolve.Fid.resolve({ fid: 43 }, resolverContext)
			),
		]

		expect(rowsByViewer[0]).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$viewer: { fid: 42 },
				source: 'Neynar_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'following')]: true,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'member')]: false,
			},
		}])
		expect(rowsByViewer[1]).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$viewer: { fid: 43 },
				source: 'Neynar_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'member')]: true,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'role')]: 'owner',
			},
		}])
		expect(rowsByViewer[0]?.[0]?.[EntityMetaKey.Selector]).toEqual(expect.objectContaining({
			timestampMs: expect.any(Number),
			source: 'Neynar_Rest',
		}))
		expect(rowsByViewer[1]?.[0]?.[EntityMetaKey.Selector]).toEqual(expect.objectContaining({
			timestampMs: expect.any(Number),
			source: 'Neynar_Rest',
		}))
	})
})

describe('Neynar Farcaster cast resolver', () => {
	it('preserves selector identity when Neynar has no cast so another source can resolve detail', async () => {
		getCast.mockResolvedValueOnce(undefined)

		await expect(castResolver.resolve['FidHash'].resolve({
			fid: 42,
			hash: '0xABCDEF',
		}, resolverContext)).resolves.toEqual(expect.objectContaining({
			fid: 42,
			hash: '0xabcdef',
			$$timestamps: [],
		}))
		expect(getCast).toHaveBeenLastCalledWith(resolverContext.publicEnv, {
			identifier: '0xabcdef',
			type: 'hash',
		})
	})

	it('projects UsernameHashPrefix via Warpcast URL lookup', async () => {
		getCast.mockResolvedValueOnce(neynarCast({
			hash: '0xabcdef12',
			fid: 42,
			username: 'alice',
			text: 'Prefix cast',
			timestamp: '2026-07-16T00:00:00.000Z',
		}))

		const cast = await castResolver.resolve['UsernameHashPrefix'].resolve({
			username: 'alice',
			hashPrefix: '0xabcdef',
		}, resolverContext)

		expect(getCast).toHaveBeenLastCalledWith(resolverContext.publicEnv, {
			identifier: 'https://warpcast.com/alice/0xabcdef',
			type: 'url',
		})
		expect(cast).toEqual(expect.objectContaining({
			fid: 42,
			hash: '0xabcdef12',
			username: 'alice',
			hashPrefix: '0xabcdef',
			clientUrl: 'https://warpcast.com/alice/0xabcdef',
			text: 'Prefix cast',
		}))
	})

	it('projects Hash via hash-only Neynar lookup', async () => {
		getCast.mockResolvedValueOnce(neynarCast({
			hash: '0xabcdef',
			fid: 42,
			text: 'Hash cast',
			timestamp: '2026-07-16T00:00:00.000Z',
		}))

		const cast = await castResolver.resolve['Hash'].resolve({
			hash: '0xABCDEF',
		}, resolverContext)

		expect(getCast).toHaveBeenLastCalledWith(resolverContext.publicEnv, {
			identifier: '0xabcdef',
			type: 'hash',
		})
		expect(cast).toEqual(expect.objectContaining({
			fid: 42,
			hash: '0xabcdef',
			text: 'Hash cast',
		}))
	})

	it('projects enrolled cast engagement observations from reactions/replies', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_768_435_200_000)
		getCast.mockResolvedValueOnce(neynarCast(
			{
				hash: '0xabcdef',
				fid: 42,
				text: 'Counted cast',
			},
			{
				embeds: [{
					url: 'https://example.com/embed',
				}],
				reactions: {
					likes: [],
					likes_count: 0,
					recasts: [],
					recasts_count: 3,
				},
				replies: { count: 7 },
			}
		))

		const cast = await castResolver.resolve['FidHash'].resolve({
			fid: 42,
			hash: '0xabcdef',
		}, resolverContext)
		expect(castResolver.projections.$$embeds.resolveCount(cast)).toBe(1)
		expect(castResolver.projections.$$embeds.select(cast)).toHaveLength(1)
		expect(castResolver.projections.$$timestamps(cast)).toEqual([{
			[EntityMetaKey.Selector]: {
				$cast: {
					fid: 42,
					hash: '0xabcdef',
				},
				timestampMs: 1_768_435_200_000,
				source: 'Neynar_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'likeCount')]: 0,
				[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'recastCount')]: 3,
				[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'replyCount')]: 7,
			},
		}])
	})

	it('projects enrolled user follower/following observations from bulk users', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_768_435_200_000)
		const userResolver = neynarResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.FarcasterUser
			&& '$$timestamps' in resolver.projections
			&& '$$verifiedAddresses' in resolver.projections
		))
		if (userResolver == null || !('Fid' in userResolver.resolve))
			throw new Error('Neynar spec missing FarcasterUser identity resolver')

		getBulkUsers.mockResolvedValueOnce([{
			...neynarUser(42, 'alice'),
			follower_count: 0,
			following_count: 11,
			display_name: 'Alice',
		}])

		const user = await userResolver.resolve.Fid.resolve(
			{ fid: 42 },
			resolverContext
		)
		expect(userResolver.projections.$$timestamps(user)).toEqual([{
			[EntityMetaKey.Selector]: {
				$user: { fid: 42 },
				timestampMs: 1_768_435_200_000,
				source: 'Neynar_Rest',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followerCount')]: 0,
				[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followingCount')]: 11,
			},
		}])
	})

	for (const {
		label,
		wire,
		expected,
	} of [
		{
			label: 'keeps direct reply and conversation root URLs distinct',
			wire: {
				parent_author: { fid: 7 },
				parent_hash: '0x7777',
				parent_url: 'https://warpcast.com/alice/0x7777',
				root_parent_url: 'https://warpcast.com/alice/0x3333',
			},
			expected: {
				$parentCast: {
					[EntityMetaKey.Selector]: {
						fid: 7,
						hash: '0x7777',
					},
				},
				parentUrl: 'https://warpcast.com/alice/0x7777',
				rootParentUrl: 'https://warpcast.com/alice/0x3333',
				$channel: undefined,
			},
		},
		{
			label: 'preserves a root URL without fabricating a parent cast',
			wire: {
				root_parent_url: 'https://warpcast.com/alice/0x3333',
			},
			expected: {
				$parentCast: undefined,
				rootParentUrl: 'https://warpcast.com/alice/0x3333',
				$channel: undefined,
			},
		},
		{
			label: 'keeps channel membership separate from its root URL',
			wire: {
				root_parent_url: 'https://warpcast.com/~/channel/design',
				channel: {
					id: 'design',
					name: 'Design',
				},
			},
			expected: {
				$parentCast: undefined,
				rootParentUrl: 'https://warpcast.com/~/channel/design',
				$channel: {
					[EntityMetaKey.Selector]: {
						id: 'design',
					},
				},
			},
		},
	]) {
		it(`${label} across FidHash, Hash, ClientUrl, and UsernameHashPrefix`, async () => {
			for (const {
				query,
				selector,
				resolve,
			} of [
				{
					query: {
						identifier: '0xabcdef',
						type: 'hash',
					} as const,
					selector: {
						fid: 42,
						hash: '0xabcdef',
					},
					resolve: castResolver.resolve['FidHash'].resolve,
				},
				{
					query: {
						identifier: '0xabcdef',
						type: 'hash',
					} as const,
					selector: {
						hash: '0xabcdef',
					},
					resolve: castResolver.resolve['Hash'].resolve,
				},
				{
					query: {
						identifier: 'https://warpcast.com/alice/0xabcdef',
						type: 'url',
					} as const,
					selector: {
						clientUrl: 'https://warpcast.com/alice/0xabcdef',
					},
					resolve: castResolver.resolve['ClientUrl'].resolve,
				},
				{
					query: {
						identifier: 'https://warpcast.com/alice/0xabcdef',
						type: 'url',
					} as const,
					selector: {
						username: 'alice',
						hashPrefix: '0xabcdef',
					},
					resolve: castResolver.resolve['UsernameHashPrefix'].resolve,
				},
			]) {
				getCast.mockResolvedValueOnce(neynarCast(
					{
						hash: '0xabcdef',
						fid: 42,
						username: 'alice',
						text: 'Thread fixture',
						timestamp: '2026-07-16T00:00:00.000Z',
					},
					wire
				))

				const cast = await resolve(
					selector,
					resolverContext
				)

				expect(getCast).toHaveBeenLastCalledWith(
					resolverContext.publicEnv,
					query
				)
				expect(cast).toEqual(expect.objectContaining(expected))
				if (!('parentUrl' in expected))
					expect(cast).not.toHaveProperty('parentUrl')
			}
		})
	}
})
