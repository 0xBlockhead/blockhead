import { beforeEach, describe, expect, it, vi } from 'vitest'

const { binding, sourceFetch } = vi.hoisted(() => ({
	binding: {
		source: 'Mastodon_Rest',
		target: {
			kind: 'Global',
			key: 'mastodon-compatible-activitypub',
		},
	},
	sourceFetch: vi.fn(),
}))

vi.mock('$/sources/$sourceProviders.ts', () => ({
	sourceProviderDefinitions: [{
		bindings: [binding],
	}],
}))
vi.mock('$/sources/_runtime/http.ts', () => ({ sourceFetch }))

const { mastodonFetchUrl, mastodonGet } = await import('$/sources/Mastodon/Rest/client.ts')

describe('Mastodon REST client', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response('[]', {
			status: 200,
		}))
	})

	it('uses the registered delivery binding without inventing authorization', async () => {
		await mastodonGet({}, 'https://mastodon.social', '/timelines/public', {
			limit: '20',
		})

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mastodon.social/api/v1/timelines/public?limit=20',
			{ headers: {} }
		)
	})

	it('sends optional authorization when configured', async () => {
		await mastodonGet({
			PUBLIC_MASTODON_ACCESS_TOKEN: 'mastodon-token',
		}, 'https://mastodon.social', '/timelines/public')

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mastodon.social/api/v1/timelines/public',
			{ headers: { Authorization: 'Bearer mastodon-token' } }
		)
	})

	it('passes continuation URLs through the canonical binding without decoding or guessing', async () => {
		await mastodonFetchUrl(
			{},
			'https://mastodon.social/api/v1/timelines/public?max_id=opaque%2B%2F%3D'
		)

		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mastodon.social/api/v1/timelines/public?max_id=opaque%2B%2F%3D',
			{ headers: {} }
		)
	})

	it('rejects cross-operation continuation URLs before delivery', async () => {
		await expect(mastodonFetchUrl(
			{},
			'https://mastodon.social/api/v1/accounts?max_id=opaque%2B%2F%3D'
		)).rejects.toThrow('invalid public timeline URL')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})
