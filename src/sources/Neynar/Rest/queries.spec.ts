import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const neynarFetch = vi.hoisted(() => vi.fn(async () => ({ casts: [] })))

vi.mock('$/sources/Neynar/Rest/client.ts', () => ({
	neynarFetch,
}))

const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')

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
