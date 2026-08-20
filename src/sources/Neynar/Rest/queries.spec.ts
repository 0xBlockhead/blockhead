import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const neynarFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Neynar/Rest/client.ts', () => ({
	neynarFetch,
}))

const {
	getBulkUsers,
	getCast,
	getCastConversation,
	getChannel,
	getChannelMembersPage,
	getFeed,
	getUserCastsPage,
	getUserChannelMembershipsPage,
	getUserChannelsPage,
} = await import('$/sources/Neynar/Rest/queries.ts')

describe('Neynar channel request identity', () => {
	it('preserves channel identity and optional viewer attribution across lookup modes', async () => {
		neynarFetch.mockResolvedValueOnce({
			channel: {
				id: 'design',
				name: 'Design',
				object: 'channel',
				url: 'https://farcaster.xyz/~/channel/design',
				created_at: '2024-01-01T00:00:00Z',
			},
		})

		await expect(getChannel({}, {
			id: 'design',
			type: 'id',
		})).resolves.toMatchObject({
			id: 'design',
			name: 'Design',
		})
		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			'/v2/farcaster/channel/?id=design&type=id'
		)

		neynarFetch.mockResolvedValueOnce({
			channel: {
				id: 'design',
				name: 'Design',
				object: 'channel',
				parent_url: 'chain://eip155:1/erc721:0xabc',
				url: 'https://farcaster.xyz/~/channel/design',
				created_at: '2024-01-01T00:00:00Z',
				viewer_context: {
					following: false,
					role: 'member',
				},
			},
		})

		await expect(getChannel({}, {
			id: 'chain://eip155:1/erc721:0xabc',
			type: 'parent_url',
			viewerFid: 3,
		})).resolves.toMatchObject({
			viewer_context: {
				following: false,
				role: 'member',
			},
		})
		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			'/v2/farcaster/channel/?id=chain%3A%2F%2Feip155%3A1%2Ferc721%3A0xabc&type=parent_url&viewer_fid=3'
		)
	})

	it.each([
		{
			name: 'channel ID',
			response: {
				id: 'development',
				url: 'https://farcaster.xyz/~/channel/development',
			},
			query: { id: 'design', type: 'id' as const },
		},
		{
			name: 'parent URL',
			response: {
				id: 'design',
				parent_url: 'https://farcaster.xyz/~/channel/development',
				url: 'https://farcaster.xyz/~/channel/development',
			},
			query: {
				id: 'https://farcaster.xyz/~/channel/design',
				type: 'parent_url' as const,
			},
		},
	])('rejects a substituted $name', async ({ response, query }) => {
		neynarFetch.mockResolvedValueOnce({ channel: response })
		await expect(getChannel({}, query)).rejects.toThrow('channel subject mismatch')
	})

	it('serializes channel membership and user channel collection scopes', async () => {
		neynarFetch.mockResolvedValueOnce({
			members: [],
			next: { cursor: 'next+/=' },
		})

		await getChannelMembersPage({}, {
			channelId: 'design',
			limit: 100,
			cursor: 'opaque+/=',
		})

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			'/v2/farcaster/channel/member/list/?channel_id=design&limit=100&cursor=opaque%2B%2F%3D'
		)

		await getChannelMembersPage({}, {
			channelId: 'design',
			fid: 3,
		})

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			'/v2/farcaster/channel/member/list/?channel_id=design&fid=3'
		)

		await getUserChannelsPage({}, {
			fid: 3,
			limit: 100,
			cursor: 'opaque+/=',
		})

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			'/v2/farcaster/user/channels/?fid=3&limit=100&cursor=opaque%2B%2F%3D'
		)

		await getUserChannelMembershipsPage({}, {
			fid: 3,
			limit: 20,
			cursor: 'opaque+/=',
		})

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			'/v2/farcaster/user/memberships/list/?fid=3&limit=20&cursor=opaque%2B%2F%3D'
		)
	})
})

describe('Neynar FID request limits', () => {
	it('accepts and serializes the 100-FID bound across bulk users and feeds', async () => {
		const fids = Array.from({ length: 100 }, (_, index) => index + 1)

		await getBulkUsers({
			publicEnv: {},
			fids,
		})

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			`/v2/farcaster/user/bulk/?fids=${fids.join('%2C')}`
		)

		await getFeed({}, {
			feedType: 'filter',
			filterType: 'fids',
			fids,
		})

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			`/v2/farcaster/feed/?feed_type=filter&filter_type=fids&fids=${fids.join('%2C')}&limit=25`
		)
	})

	it('rejects invalid bulk-user and feed FID collections before transport', async () => {
		neynarFetch.mockClear()

		await expect(getBulkUsers({
			publicEnv: {},
			fids: Array.from({ length: 101 }, (_, index) => index + 1),
		})).rejects.toThrow('Neynar bulk users accepts at most 100 FIDs')

		await expect(getBulkUsers({
			publicEnv: {},
			fids: [
				1,
				1,
			],
		})).rejects.toThrow('Neynar bulk users requires unique FIDs')

		expect(() => getFeed({}, {
			feedType: 'filter',
			filterType: 'fids',
			fids: [],
		})).toThrow('Neynar FID feed filter requires at least one FID')
		expect(() => getFeed({}, {
			feedType: 'filter',
			filterType: 'fids',
			fids: Array.from({ length: 101 }, (_, index) => index + 1),
		})).toThrow('Neynar FID feed filter accepts at most 100 FIDs')
		expect(neynarFetch).not.toHaveBeenCalled()
	})
})

describe('Neynar feed request identity', () => {
	it.each([
		{
			name: 'omits anonymous viewer identity',
			query: {
				feedType: 'filter' as const,
				filterType: 'global_trending' as const,
			},
			expected: 'feed_type=filter&filter_type=global_trending&limit=25',
		},
		{
			name: 'includes verified viewer identity',
			query: {
				feedType: 'filter' as const,
				filterType: 'global_trending' as const,
				viewerFid: 3,
			},
			expected: 'feed_type=filter&filter_type=global_trending&limit=25&viewer_fid=3',
		},
		{
			name: 'preserves channel membership and opaque cursor scope',
			query: {
				feedType: 'filter' as const,
				filterType: 'channel_id' as const,
				channelId: 'design',
				membersOnly: true,
				cursor: 'opaque+/=cursor',
			},
			expected: 'feed_type=filter&filter_type=channel_id&channel_id=design&members_only=true&limit=25&cursor=opaque%2B%2F%3Dcursor',
		},
		{
			name: 'clamps excessive limits',
			query: {
				feedType: 'following' as const,
				fid: 3,
				limit: 1_000,
			},
			expected: 'feed_type=following&fid=3&limit=100',
		},
	])('$name', async ({ query, expected }) => {
		await getFeed({}, query)

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			`/v2/farcaster/feed/?${expected}`
		)
	})
})

describe('Neynar user-cast request identity', () => {
	it('uses the dedicated FID operation with provider-default and bounded pagination', async () => {
		await getUserCastsPage({}, {
			fid: 42,
			limit: 1_000,
			cursor: 'opaque+/=cursor',
		})

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			'/v2/farcaster/feed/user/casts/?fid=42&limit=150&cursor=opaque%2B%2F%3Dcursor'
		)

		await getUserCastsPage({}, {
			fid: 42,
		})

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			'/v2/farcaster/feed/user/casts/?fid=42&limit=25'
		)
	})

	it('rejects a non-protocol FID before transport', async () => {
		neynarFetch.mockClear()

		await expect(getUserCastsPage({}, {
			fid: 0,
		})).rejects.toThrow('positive FID')
		expect(neynarFetch).not.toHaveBeenCalled()
	})

	it('rejects substituted user-cast authors and repeated continuations', async () => {
		neynarFetch.mockResolvedValueOnce({
			casts: [{
				author: { fid: 43 },
			}],
			next: { cursor: '' },
		})

		await expect(getUserCastsPage({}, {
			fid: 42,
		})).rejects.toThrow('user casts subject mismatch')

		neynarFetch.mockResolvedValueOnce({
			casts: [],
			next: { cursor: 'same' },
		})

		await expect(getUserCastsPage({}, {
			fid: 42,
			cursor: 'same',
		})).rejects.toThrow('user casts repeated cursor')
	})
})

describe('Neynar cast request identity', () => {
	it.each([
		{
			query: {
				identifier: '0xabcdef' as const,
				type: 'hash' as const,
			},
			expected: 'identifier=0xabcdef&type=hash',
		},
		{
			query: {
				identifier: 'https://warpcast.com/alice/0xab+c/d',
				type: 'url' as const,
			},
			expected: 'identifier=https%3A%2F%2Fwarpcast.com%2Falice%2F0xab%2Bc%2Fd&type=url',
		},
	])('looks up a cast by $query.type identity', async ({
		query,
		expected,
	}) => {
		await getCast({}, query)

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			`/v2/farcaster/cast/?${expected}`
		)
	})
})

describe('Neynar cast conversation request identity', () => {
	it.each([
		{
			query: {
				identifier: '0xabcdef' as const,
				type: 'hash' as const,
			},
			expected: 'identifier=0xabcdef&type=hash&reply_depth=1&include_chronological_parent_casts=false',
		},
		{
			query: {
				identifier: 'https://warpcast.com/alice/0xab+c/d',
				type: 'url' as const,
			},
			expected: 'identifier=https%3A%2F%2Fwarpcast.com%2Falice%2F0xab%2Bc%2Fd&type=url&reply_depth=1&include_chronological_parent_casts=false',
		},
	])('requests only direct replies for $query.type identity', async ({
		query,
		expected,
	}) => {
		await getCastConversation({}, query)

		expect(neynarFetch).toHaveBeenLastCalledWith(
			{},
			`/v2/farcaster/cast/conversation/?${expected}`
		)
	})
})
