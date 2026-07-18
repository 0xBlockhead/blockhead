import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { FarcasterCastSelector } from '$/schema/FarcasterCast.ts'
import { FarcasterFeedSelector } from '$/schema/FarcasterFeed.ts'

const getCastByHash = vi.hoisted(() => vi.fn())
const getCastByClientUrl = vi.hoisted(() => vi.fn())
const getFeed = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Neynar/Rest/queries.ts', () => ({
	getCastByHash,
	getCastByClientUrl,
	getFeed,
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

const castResolver = neynarResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FarcasterCast
	&& 'text' in resolver.projections
))

if (castResolver == null)
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

describe('Neynar Farcaster feed resolver', () => {
	it('materializes visible cast content from the feed response', async () => {
		const page = {
			casts: [
				{
					hash: '0xABCDEF',
					author: {
						fid: 42,
						username: 'alice',
					},
					text: 'A live cast from the feed',
					timestamp: '2026-07-15T12:34:56.000Z',
				},
			],
			next: {
				cursor: 'next-page',
			},
		}
		getFeed.mockResolvedValueOnce(page)

		await expect(feedResolver.resolve[FarcasterFeedSelector.Variant].resolve({
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

	it('drops feed rows that cannot identify a cast', async () => {
		const page = {
			casts: [
				{
					hash: '',
					author: { fid: 42 },
				},
				{
					hash: '0x1234',
				},
			],
		}
		getFeed.mockResolvedValueOnce(page)
		await expect(feedResolver.resolve[FarcasterFeedSelector.Variant].resolve({
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

		await expect(feedResolver.resolve[FarcasterFeedSelector.Following].resolve({
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
	})

	it('preserves the members-only channel partition', async () => {
		const page = {
			casts: [],
			next: {
				cursor: 'channel-next',
			},
		}
		getFeed.mockResolvedValueOnce(page)

		await expect(feedResolver.resolve[FarcasterFeedSelector.ByChannel].resolve({
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

describe('Neynar Farcaster cast resolver', () => {
	it('preserves selector identity when Neynar has no cast so another source can resolve detail', async () => {
		getCastByHash.mockResolvedValueOnce(undefined)

		await expect(castResolver.resolve[FarcasterCastSelector.FidHash].resolve({
			fid: 42,
			hash: '0xABCDEF',
		}, resolverContext)).resolves.toEqual({
			fid: 42,
			hash: '0xabcdef',
		})
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
				channel: { id: 'design' },
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
		it(`${label} for both public selectors`, async () => {
			for (const {
				getCast,
				selector,
				resolve,
			} of [
				{
					getCast: getCastByHash,
					selector: {
						fid: 42,
						hash: '0xabcdef',
					},
					resolve: castResolver.resolve[FarcasterCastSelector.FidHash].resolve,
				},
				{
					getCast: getCastByClientUrl,
					selector: {
						clientUrl: 'https://warpcast.com/alice/0xabcdef',
					},
					resolve: castResolver.resolve[FarcasterCastSelector.ClientUrl].resolve,
				},
			]) {
				getCast.mockResolvedValueOnce({
					hash: '0xabcdef',
					author: {
						fid: 42,
					},
					text: 'Thread fixture',
					timestamp: '2026-07-16T00:00:00.000Z',
					...wire,
				})

				const cast = await resolve(
					selector,
					resolverContext
				)

				expect(cast).toEqual(expect.objectContaining(expected))
				if (!('parentUrl' in expected))
					expect(cast).not.toHaveProperty('parentUrl')
			}
		})
	}
})
