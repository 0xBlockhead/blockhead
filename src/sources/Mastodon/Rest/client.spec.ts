import { beforeEach, describe, expect, it, vi } from 'vitest'

const { bindings, sourceFetch } = vi.hoisted(() => ({
	bindings: [
		{
			source: 'Mastodon_Rest',
			target: {
				kind: 'Global',
				key: 'mastodon-instance:https://mastodon.social',
			},
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://mastodon.social',
				origin: 'https://mastodon.social',
			}],
		},
		{
			source: 'Mastodon_Rest',
			target: {
				kind: 'Global',
				key: 'mastodon-instance:https://fosstodon.org',
			},
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://fosstodon.org',
				origin: 'https://fosstodon.org',
			}],
		},
		{
			source: 'Mastodon_Rest',
			target: {
				kind: 'Feed',
				key: 'mastodon-public-timeline:https://fosstodon.org',
			},
			endpoints: [{
				endpointKind: 'HttpUrl',
				locator: 'https://fosstodon.org',
				origin: 'https://fosstodon.org',
			}],
		},
	],
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/$sourceProviders.ts', () => ({
	sourceProviderDefinitions: [{
		bindings,
	}],
}))
vi.mock('$/sources/_runtime/http.ts', () => ({
	httpOriginsForBinding: (binding: (typeof bindings)[number]) => binding.endpoints.map(({ origin }) => ({
		origin,
		corsEnabled: false,
	})),
	sourceFetch,
}))

const {
	mastodonFetchUrl,
	mastodonFetchPublicTimelineUrl,
	mastodonGet,
	mastodonInstanceOrigins,
	mastodonPublicTimelineOrigins,
} = await import('$/sources/Mastodon/Rest/client.ts')

describe('Mastodon REST client', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response('[]', {
			status: 200,
		}))
	})

	it('uses the registered delivery binding without inventing authorization', async () => {
		expect(mastodonInstanceOrigins).toEqual([
			'https://mastodon.social',
			'https://fosstodon.org',
		])
		expect(mastodonPublicTimelineOrigins).toEqual([
			'https://fosstodon.org',
		])

		await mastodonGet({}, 'https://mastodon.social', '/timelines/public', {
			limit: '20',
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[0],
			'https://mastodon.social/api/v1/timelines/public?limit=20'
		)
	})

	it('does not invent browser credentials that the proxy cannot forward', async () => {
		await mastodonGet({
			PUBLIC_MASTODON_ACCESS_TOKEN: 'mastodon-token',
		}, 'https://mastodon.social', '/timelines/public')

		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[0],
			'https://mastodon.social/api/v1/timelines/public'
		)
	})

	it('passes public timeline continuations only through the declared anonymous feed binding', async () => {
		await mastodonFetchPublicTimelineUrl(
			{},
			'https://fosstodon.org/api/v1/timelines/public?max_id=opaque%2B%2F%3D'
		)

		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[2],
			'https://fosstodon.org/api/v1/timelines/public?max_id=opaque%2B%2F%3D'
		)
	})

	it('rejects undeclared public timeline origins before delivery', async () => {
		await expect(mastodonFetchPublicTimelineUrl(
			{},
			'https://mastodon.social/api/v1/timelines/public?max_id=opaque%2B%2F%3D'
		)).rejects.toThrow('public timeline binding is missing')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('keeps instance continuations on their exact instance binding', async () => {
		await mastodonFetchUrl(
			{},
			'https://fosstodon.org/api/v1/accounts/123/statuses?max_id=opaque%2B%2F%3D'
		)

		expect(sourceFetch).toHaveBeenCalledWith(
			bindings[1],
			'https://fosstodon.org/api/v1/accounts/123/statuses?max_id=opaque%2B%2F%3D'
		)
	})
})
