import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mastodonFetchUrl, mastodonGet } = vi.hoisted(() => ({
	mastodonFetchUrl: vi.fn(),
	mastodonGet: vi.fn(),
}))

vi.mock('$/sources/Mastodon/Rest/client.ts', () => ({
	mastodonFetch: vi.fn(),
	mastodonFetchUrl,
	mastodonGet,
}))

const { listAccountStatusesPageByLocalAccountId, listPublicTimeline, listPublicTimelinePage } = await import('$/sources/Mastodon/Rest/queries.ts')

describe('Mastodon public timeline', () => {
	beforeEach(() => {
		mastodonFetchUrl.mockReset()
		mastodonGet.mockReset()
	})

	it('requests the public federated timeline without requiring a token', async () => {
		mastodonGet.mockResolvedValueOnce([{ id: '114000000000000001' }])

		await expect(listPublicTimeline(
			{},
			'https://mastodon.social',
			20
		)).resolves.toEqual([{ id: '114000000000000001' }])
		expect(mastodonGet).toHaveBeenCalledWith(
			{},
			'https://mastodon.social',
			'/timelines/public',
			{ limit: '20' }
		)
	})

	it.each([
		[0, '1'],
		[100, '40'],
	])('bounds the requested page size %s to %s', async (limit, expectedLimit) => {
		mastodonGet.mockResolvedValueOnce([])

		await listPublicTimeline({}, 'https://mastodon.social', limit)

		expect(mastodonGet).toHaveBeenCalledWith(
			{},
			'https://mastodon.social',
			'/timelines/public',
			{ limit: expectedLimit }
		)
	})

	it('returns an exact same-origin next Link as an opaque continuation', async () => {
		mastodonFetchUrl.mockResolvedValueOnce(new Response('[{"id":"1"}]', {
			headers: {
				Link: '<https://mastodon.social/api/v1/timelines/public?limit=2&max_id=opaque%2B%2F%3D>; rel="next", <https://mastodon.social/api/v1/timelines/public?limit=2&min_id=1>; rel="prev"',
			},
		}))

		await expect(listPublicTimelinePage(
			{},
			'https://mastodon.social',
			2
		)).resolves.toEqual({
			statuses: [{ id: '1' }],
			continuationToken: 'https://mastodon.social/api/v1/timelines/public?limit=2&max_id=opaque%2B%2F%3D',
		})
		expect(mastodonFetchUrl).toHaveBeenCalledWith(
			{},
			'https://mastodon.social/api/v1/timelines/public?limit=2'
		)

		mastodonFetchUrl.mockResolvedValueOnce(new Response('[]'))
		await expect(listPublicTimelinePage(
			{},
			'https://mastodon.social',
			2,
			'https://mastodon.social/api/v1/timelines/public?limit=2&max_id=opaque%2B%2F%3D'
		)).resolves.toEqual({
			statuses: [],
			continuationToken: undefined,
		})
		expect(mastodonFetchUrl).toHaveBeenLastCalledWith(
			{},
			'https://mastodon.social/api/v1/timelines/public?limit=2&max_id=opaque%2B%2F%3D'
		)
	})

	it('parses RFC Link values without splitting URI or parameter commas and terminates a repeated cursor', async () => {
		const continuationToken = 'https://mastodon.social/api/v1/timelines/public?max_id=opaque%2B%2F%3D,still-opaque'
		mastodonFetchUrl.mockResolvedValueOnce(new Response('[]', {
			headers: {
				Link: `<${continuationToken}>; title="page, two"; rel="prev next"; type="application/json"`,
			},
		}))

		await expect(listPublicTimelinePage(
			{},
			'https://mastodon.social',
			2,
			continuationToken
		)).resolves.toEqual({
			statuses: [],
			continuationToken: undefined,
		})
		expect(mastodonFetchUrl).toHaveBeenCalledWith({}, continuationToken)
	})

	it.each([
		'https://evil.example/api/v1/timelines/public?max_id=1',
		'https://mastodon.social/api/v1/accounts?max_id=1',
		'https://user@mastodon.social/api/v1/timelines/public?max_id=1',
		'https://mastodon.social/api/v1/timelines/public?max_id=1#fragment',
	])('rejects invalid continuation %s before transport', async (continuationToken) => {
		await expect(listPublicTimelinePage(
			{},
			'https://mastodon.social',
			2,
			continuationToken
		)).rejects.toThrow('invalid public timeline continuation')
		expect(mastodonFetchUrl).not.toHaveBeenCalled()
	})

	it('rejects malformed and cross-origin next Links', async () => {
		mastodonFetchUrl
			.mockResolvedValueOnce(new Response('[]', {
				headers: { Link: 'not-a-link; rel="next"' },
			}))
			.mockResolvedValueOnce(new Response('[]', {
				headers: { Link: '<https://evil.example/api/v1/timelines/public?max_id=1>; rel="next"' },
			}))

		await expect(listPublicTimelinePage({}, 'https://mastodon.social', 2)).rejects.toThrow('malformed public timeline continuation')
		await expect(listPublicTimelinePage({}, 'https://mastodon.social', 2)).rejects.toThrow('invalid public timeline continuation')
	})

	it('rejects ambiguous next Links', async () => {
		mastodonFetchUrl.mockResolvedValueOnce(new Response('[]', {
			headers: {
				Link: '<https://mastodon.social/api/v1/timelines/public?max_id=1>; rel="next", <https://mastodon.social/api/v1/timelines/public?max_id=2>; rel="next"',
			},
		}))

		await expect(listPublicTimelinePage({}, 'https://mastodon.social', 2)).rejects.toThrow('ambiguous public timeline continuation')
	})

	it('continues one actor status collection with the shared opaque Link contract', async () => {
		mastodonFetchUrl
			.mockResolvedValueOnce(new Response('[{"id":"1","uri":"https://mastodon.social/users/alice/statuses/1"}]', {
				headers: {
					Link: '<https://mastodon.social/api/v1/accounts/actor%2Fid/statuses?limit=3&max_id=opaque%2B%2F%3D>; rel="next"',
				},
			}))
			.mockResolvedValueOnce(new Response('[]'))

		const firstPage = await listAccountStatusesPageByLocalAccountId(
			{},
			'https://mastodon.social',
			'actor/id',
			3
		)
		expect(firstPage.continuationToken).toBe('https://mastodon.social/api/v1/accounts/actor%2Fid/statuses?limit=3&max_id=opaque%2B%2F%3D')
		expect(mastodonFetchUrl).toHaveBeenNthCalledWith(
			1,
			{},
			'https://mastodon.social/api/v1/accounts/actor%2Fid/statuses?limit=3'
		)
		await expect(listAccountStatusesPageByLocalAccountId(
			{},
			'https://mastodon.social',
			'actor/id',
			3,
			firstPage.continuationToken
		)).resolves.toEqual({
			statuses: [],
			continuationToken: undefined,
		})
		expect(mastodonFetchUrl).toHaveBeenNthCalledWith(2, {}, firstPage.continuationToken)
	})

	it.each([
		'https://evil.example/api/v1/accounts/13179/statuses?max_id=1',
		'https://mastodon.social/api/v1/accounts/other/statuses?max_id=1',
		'https://mastodon.social/api/v1/accounts/13179/statuses?max_id=1#fragment',
	])('rejects invalid authored-notes continuation %s before transport', async (continuationToken) => {
		await expect(listAccountStatusesPageByLocalAccountId(
			{},
			'https://mastodon.social',
			'13179',
			2,
			continuationToken
		)).rejects.toThrow('invalid authored notes continuation')
		expect(mastodonFetchUrl).not.toHaveBeenCalled()
	})
})
