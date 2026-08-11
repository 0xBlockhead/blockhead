import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
	mastodonFetch,
	mastodonFetchPublicTimelineUrl,
	mastodonFetchUrl,
	mastodonGet,
} = vi.hoisted(() => ({
	mastodonFetch: vi.fn(),
	mastodonFetchPublicTimelineUrl: vi.fn(),
	mastodonFetchUrl: vi.fn(),
	mastodonGet: vi.fn(),
}))

vi.mock('$/sources/Mastodon/Rest/client.ts', () => ({
	mastodonFetch,
	mastodonFetchPublicTimelineUrl,
	mastodonFetchUrl,
	mastodonGet,
	mastodonInstanceOrigins: [
		'https://mastodon.social',
		'https://fosstodon.org',
	],
	mastodonPublicTimelineOrigins: [
		'https://fosstodon.org',
	],
}))

const {
	getAccountByLocalAccountId,
	getInstance,
	getInstanceV2,
	getStatus,
	listAccountStatusesPageByLocalAccountId,
	listInstanceModeratedDomains,
	listInstancePeerDomains,
	listPublicTimelinePage,
	mastodonInstanceBindingByOrigin,
	mastodonPublicTimelines,
} = await import('$/sources/Mastodon/Rest/queries.ts')

const mastodonSocialBinding = mastodonInstanceBindingByOrigin.get('https://mastodon.social')
const fosstodonPublicTimeline = mastodonPublicTimelines.find(({ instanceOrigin }) => (
	instanceOrigin === 'https://fosstodon.org'
))

if (mastodonSocialBinding == null || fosstodonPublicTimeline == null)
	throw new Error('Mastodon test bindings are missing')

describe('Mastodon public timeline', () => {
	beforeEach(() => {
		mastodonFetch.mockReset()
		mastodonFetchPublicTimelineUrl.mockReset()
		mastodonFetchUrl.mockReset()
		mastodonGet.mockReset()
	})

	it('requests the public federated timeline without requiring a token', async () => {
		mastodonFetchPublicTimelineUrl.mockResolvedValueOnce(new Response('[{"id":"114000000000000001"}]'))

		await expect(listPublicTimelinePage(
			fosstodonPublicTimeline.binding,
			'https://fosstodon.org',
			20
		)).resolves.toEqual({
			statuses: [{ id: '114000000000000001' }],
			continuationToken: undefined,
		})
		expect(mastodonFetchPublicTimelineUrl).toHaveBeenCalledWith(
			fosstodonPublicTimeline.binding,
			'https://fosstodon.org/api/v1/timelines/public?limit=20'
		)
	})

	it('does not call an instance binding that lacks anonymous public timeline authority', async () => {
		await expect(listPublicTimelinePage(
			mastodonSocialBinding,
			'https://mastodon.social',
			20
		)).rejects.toThrow('public timeline binding is missing')
		expect(mastodonFetchPublicTimelineUrl).not.toHaveBeenCalled()
		expect(mastodonGet).not.toHaveBeenCalled()
	})

	it.each([
		[0, '1'],
		[100, '40'],
	])('bounds the requested page size %s to %s', async (limit, expectedLimit) => {
		mastodonFetchPublicTimelineUrl.mockResolvedValueOnce(new Response('[]'))

		await listPublicTimelinePage(fosstodonPublicTimeline.binding, 'https://fosstodon.org', limit)

		expect(mastodonFetchPublicTimelineUrl).toHaveBeenCalledWith(
			fosstodonPublicTimeline.binding,
			`https://fosstodon.org/api/v1/timelines/public?limit=${expectedLimit}`
		)
	})

	it('returns an exact same-origin next Link as an opaque continuation', async () => {
		mastodonFetchPublicTimelineUrl.mockResolvedValueOnce(new Response('[{"id":"1"}]', {
			headers: {
				Link: '<https://fosstodon.org/api/v1/timelines/public?limit=2&max_id=opaque%2B%2F%3D>; rel="next", <https://fosstodon.org/api/v1/timelines/public?limit=2&min_id=1>; rel="prev"',
			},
		}))

		await expect(listPublicTimelinePage(
			fosstodonPublicTimeline.binding,
			'https://fosstodon.org',
			2
		)).resolves.toEqual({
			statuses: [{ id: '1' }],
			continuationToken: 'https://fosstodon.org/api/v1/timelines/public?limit=2&max_id=opaque%2B%2F%3D',
		})
		expect(mastodonFetchPublicTimelineUrl).toHaveBeenCalledWith(
			fosstodonPublicTimeline.binding,
			'https://fosstodon.org/api/v1/timelines/public?limit=2'
		)

		mastodonFetchPublicTimelineUrl.mockResolvedValueOnce(new Response('[]'))
		await expect(listPublicTimelinePage(
			fosstodonPublicTimeline.binding,
			'https://fosstodon.org',
			2,
			'https://fosstodon.org/api/v1/timelines/public?limit=2&max_id=opaque%2B%2F%3D'
		)).resolves.toEqual({
			statuses: [],
			continuationToken: undefined,
		})
		expect(mastodonFetchPublicTimelineUrl).toHaveBeenLastCalledWith(
			fosstodonPublicTimeline.binding,
			'https://fosstodon.org/api/v1/timelines/public?limit=2&max_id=opaque%2B%2F%3D'
		)
	})

	it('parses RFC Link values without splitting URI or parameter commas and terminates a repeated cursor', async () => {
		const continuationToken = 'https://fosstodon.org/api/v1/timelines/public?max_id=opaque%2B%2F%3D,still-opaque'
		mastodonFetchPublicTimelineUrl.mockResolvedValueOnce(new Response('[]', {
			headers: {
				Link: `<${continuationToken}>; title="page, two"; rel="prev next"; type="application/json"`,
			},
		}))

		await expect(listPublicTimelinePage(
			fosstodonPublicTimeline.binding,
			'https://fosstodon.org',
			2,
			continuationToken
		)).resolves.toEqual({
			statuses: [],
			continuationToken: undefined,
		})
		expect(mastodonFetchPublicTimelineUrl).toHaveBeenCalledWith(
			fosstodonPublicTimeline.binding,
			continuationToken
		)
	})

	it.each([
		'https://evil.example/api/v1/timelines/public?max_id=1',
		'https://fosstodon.org/api/v1/accounts?max_id=1',
		'https://user@fosstodon.org/api/v1/timelines/public?max_id=1',
		'https://fosstodon.org/api/v1/timelines/public?max_id=1#fragment',
	])('rejects invalid continuation %s before transport', async (continuationToken) => {
		await expect(listPublicTimelinePage(
			fosstodonPublicTimeline.binding,
			'https://fosstodon.org',
			2,
			continuationToken
		)).rejects.toThrow('invalid public timeline continuation')
		expect(mastodonFetchPublicTimelineUrl).not.toHaveBeenCalled()
	})

	it('rejects malformed and cross-origin next Links', async () => {
		mastodonFetchPublicTimelineUrl
			.mockResolvedValueOnce(new Response('[]', {
				headers: { Link: 'not-a-link; rel="next"' },
			}))
			.mockResolvedValueOnce(new Response('[]', {
				headers: { Link: '<https://evil.example/api/v1/timelines/public?max_id=1>; rel="next"' },
			}))

		await expect(listPublicTimelinePage(fosstodonPublicTimeline.binding, 'https://fosstodon.org', 2)).rejects.toThrow('malformed public timeline continuation')
		await expect(listPublicTimelinePage(fosstodonPublicTimeline.binding, 'https://fosstodon.org', 2)).rejects.toThrow('invalid public timeline continuation')
	})

	it('rejects ambiguous next Links', async () => {
		mastodonFetchPublicTimelineUrl.mockResolvedValueOnce(new Response('[]', {
			headers: {
				Link: '<https://fosstodon.org/api/v1/timelines/public?max_id=1>; rel="next", <https://fosstodon.org/api/v1/timelines/public?max_id=2>; rel="next"',
			},
		}))

		await expect(listPublicTimelinePage(fosstodonPublicTimeline.binding, 'https://fosstodon.org', 2)).rejects.toThrow('ambiguous public timeline continuation')
	})

	it('rejects duplicate status identities in public and authored timeline pages', async () => {
		mastodonFetchPublicTimelineUrl.mockResolvedValueOnce(new Response('[{"id":"1"},{"id":"1"}]'))
		mastodonFetchUrl.mockResolvedValueOnce(new Response('[{"id":"2"},{"id":"2"}]'))

		await expect(listPublicTimelinePage(
			fosstodonPublicTimeline.binding,
			'https://fosstodon.org',
			2
		)).rejects.toThrow('public timeline response contains a duplicate status')
		await expect(listAccountStatusesPageByLocalAccountId(
			mastodonSocialBinding,
			'https://mastodon.social',
			'13179',
			2
		)).rejects.toThrow('authored notes response contains a duplicate status')
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
			mastodonSocialBinding,
			'https://mastodon.social',
			'actor/id',
			3
		)
		expect(firstPage.continuationToken).toBe('https://mastodon.social/api/v1/accounts/actor%2Fid/statuses?limit=3&max_id=opaque%2B%2F%3D')
		expect(mastodonFetchUrl).toHaveBeenNthCalledWith(
			1,
			mastodonSocialBinding,
			'https://mastodon.social/api/v1/accounts/actor%2Fid/statuses?limit=3'
		)
		await expect(listAccountStatusesPageByLocalAccountId(
			mastodonSocialBinding,
			'https://mastodon.social',
			'actor/id',
			3,
			firstPage.continuationToken
		)).resolves.toEqual({
			statuses: [],
			continuationToken: undefined,
		})
		expect(mastodonFetchUrl).toHaveBeenNthCalledWith(
			2,
			mastodonSocialBinding,
			firstPage.continuationToken
		)
	})

	it.each([
		'https://evil.example/api/v1/accounts/13179/statuses?max_id=1',
		'https://mastodon.social/api/v1/accounts/other/statuses?max_id=1',
		'https://mastodon.social/api/v1/accounts/13179/statuses?max_id=1#fragment',
	])('rejects invalid authored-notes continuation %s before transport', async (continuationToken) => {
		await expect(listAccountStatusesPageByLocalAccountId(
			mastodonSocialBinding,
			'https://mastodon.social',
			'13179',
			2,
			continuationToken
		)).rejects.toThrow('invalid authored notes continuation')
		expect(mastodonFetchUrl).not.toHaveBeenCalled()
	})
})

describe('Mastodon Rest arktype envelopes', () => {
	beforeEach(() => {
		mastodonFetch.mockReset()
		mastodonFetchPublicTimelineUrl.mockReset()
		mastodonFetchUrl.mockReset()
		mastodonGet.mockReset()
	})

	it('accepts account / status / instance / peers / domain-block / timeline envelopes', async () => {
		mastodonGet
			.mockResolvedValueOnce({
				id: '1',
				acct: 'alice',
				uri: 'https://mastodon.social/users/alice',
				followers_count: 0,
			})
			.mockResolvedValueOnce({
				id: '9',
				uri: 'https://mastodon.social/users/alice/statuses/9',
				favourites_count: 0,
				reblog: {
					id: '8',
					uri: 'https://mastodon.social/users/bob/statuses/8',
				},
			})
			.mockResolvedValueOnce({
				title: 'Mastodon',
				version: '4.3.0',
				urls: {
					streaming_api: 'wss://mastodon.social',
				},
			})
			.mockResolvedValueOnce({
				usage: {
					users: {
						active_month: 12,
					},
				},
			})
		mastodonFetch
			.mockResolvedValueOnce(new Response('["peer.example"]'))
			.mockResolvedValueOnce(new Response('[{"domain":"blocked.example","severity":"suspend"}]'))
		mastodonFetchPublicTimelineUrl.mockResolvedValueOnce(new Response('[{"id":"1","uri":"https://fosstodon.org/users/a/statuses/1"}]'))

		await expect(getAccountByLocalAccountId(mastodonSocialBinding, 'https://mastodon.social', '1')).resolves.toMatchObject({
			id: '1',
			acct: 'alice',
		})
		await expect(getStatus(mastodonSocialBinding, 'https://mastodon.social', '9')).resolves.toMatchObject({
			id: '9',
			reblog: {
				id: '8',
			},
		})
		await expect(getInstance(mastodonSocialBinding, 'https://mastodon.social')).resolves.toMatchObject({
			title: 'Mastodon',
		})
		await expect(getInstanceV2(mastodonSocialBinding, 'https://mastodon.social')).resolves.toMatchObject({
			usage: {
				users: {
					active_month: 12,
				},
			},
		})
		await expect(listInstancePeerDomains(mastodonSocialBinding, 'https://mastodon.social')).resolves.toEqual([
			'peer.example',
		])
		await expect(listInstanceModeratedDomains(mastodonSocialBinding, 'https://mastodon.social')).resolves.toEqual([
			{ domain: 'blocked.example', severity: 'suspend' },
		])
		await expect(listPublicTimelinePage(fosstodonPublicTimeline.binding, 'https://fosstodon.org', 10)).resolves.toMatchObject({
			statuses: [{ id: '1' }],
		})
		expect(mastodonGet).toHaveBeenNthCalledWith(
			4,
			mastodonSocialBinding,
			'/instance',
			undefined,
			'v2'
		)
	})

	it('rejects substituted local account and status identities', async () => {
		mastodonGet
			.mockResolvedValueOnce({
				id: '2',
				acct: 'bob',
				uri: 'https://mastodon.social/users/bob',
				followers_count: 0,
			})
			.mockResolvedValueOnce({
				id: '10',
				uri: 'https://mastodon.social/users/bob/statuses/10',
				favourites_count: 0,
			})

		await expect(getAccountByLocalAccountId(
			mastodonSocialBinding,
			'https://mastodon.social',
			'1'
		)).rejects.toThrow('account response does not match request')
		await expect(getStatus(
			mastodonSocialBinding,
			'https://mastodon.social',
			'9'
		)).rejects.toThrow('status response does not match request')
	})

	it('fails closed on malformed envelopes', async () => {
		mastodonGet
			.mockResolvedValueOnce({
				id: 1,
			})
			.mockResolvedValueOnce({
				id: 9,
			})
			.mockResolvedValueOnce({
				title: 1,
			})
			.mockResolvedValueOnce({
				usage: {
					users: {
						active_month: 'nope',
					},
				},
			})
		await expect(getAccountByLocalAccountId(mastodonSocialBinding, 'https://mastodon.social', '1')).rejects.toThrow(
			'Mastodon_Rest: invalid account response envelope'
		)
		await expect(getStatus(mastodonSocialBinding, 'https://mastodon.social', '9')).rejects.toThrow(
			'Mastodon_Rest: invalid status response envelope'
		)
		await expect(getInstance(mastodonSocialBinding, 'https://mastodon.social')).rejects.toThrow(
			'Mastodon_Rest: invalid instance response envelope'
		)
		await expect(getInstanceV2(mastodonSocialBinding, 'https://mastodon.social')).rejects.toThrow(
			'Mastodon_Rest: invalid instance-v2 response envelope'
		)

		mastodonFetchPublicTimelineUrl.mockResolvedValueOnce(new Response('{"not":"an-array"}'))
		await expect(listPublicTimelinePage(fosstodonPublicTimeline.binding, 'https://fosstodon.org', 2)).rejects.toThrow(
			'Mastodon_Rest: invalid public-timeline response envelope'
		)

		mastodonFetch
			.mockResolvedValueOnce(new Response('{"not":"peers"}'))
			.mockResolvedValueOnce(new Response('[{"domain":1}]'))
		await expect(listInstancePeerDomains(mastodonSocialBinding, 'https://mastodon.social')).rejects.toThrow(
			'Mastodon_Rest: invalid instance-peers response envelope'
		)
		await expect(listInstanceModeratedDomains(mastodonSocialBinding, 'https://mastodon.social')).rejects.toThrow(
			'Mastodon_Rest: invalid instance-domain-blocks response envelope'
		)
	})
})
