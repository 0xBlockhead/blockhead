import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Mastodon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	mastodonFetchPublicTimelineUrl,
	mastodonFetchUrl,
	mastodonGet,
} from '$/sources/Mastodon/Rest/client.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => binding.endpoints[0].locator,
	sourceFetch,
}))

const mastodonSocialBinding = bindings[Source.Mastodon_Rest].find(
	({ target }) => target.key === 'mastodon-instance:https://mastodon.social'
)
const fosstodonInstanceBinding = bindings[Source.Mastodon_Rest].find(
	({ target }) => target.key === 'mastodon-instance:https://fosstodon.org'
)
const fosstodonTimelineBinding = bindings[Source.Mastodon_Rest].find(
	({ target }) => target.key === 'mastodon-public-timeline:https://fosstodon.org'
)

if (
	mastodonSocialBinding == null
	|| fosstodonInstanceBinding == null
	|| fosstodonTimelineBinding == null
)
	throw new Error('Mastodon REST test bindings are missing')

describe('Mastodon REST client', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response('[]', {
			status: 200,
		}))
	})

	it('keeps instance and timeline requests on their selected bindings', async () => {
		await mastodonGet(
			mastodonSocialBinding,
			'/timelines/public',
			{
				limit: '20',
			}
		)

		await mastodonFetchPublicTimelineUrl(
			fosstodonTimelineBinding,
			'https://fosstodon.org/api/v1/timelines/public?max_id=opaque%2B%2F%3D'
		)

		await mastodonFetchUrl(
			fosstodonInstanceBinding,
			'https://fosstodon.org/api/v1/accounts/123/statuses?max_id=opaque%2B%2F%3D'
		)


		expect(sourceFetch.mock.calls).toEqual([
			[
				mastodonSocialBinding,
				'https://mastodon.social/api/v1/timelines/public?limit=20',
			],
			[
				fosstodonTimelineBinding,
				'https://fosstodon.org/api/v1/timelines/public?max_id=opaque%2B%2F%3D',
			],
			[
				fosstodonInstanceBinding,
				'https://fosstodon.org/api/v1/accounts/123/statuses?max_id=opaque%2B%2F%3D',
			],
		])

		await expect(mastodonFetchPublicTimelineUrl(
			fosstodonTimelineBinding,
			'https://fosstodon.org/api/v1/accounts/123/statuses'
		)).rejects.toThrow('invalid public timeline URL')
		expect(sourceFetch).toHaveBeenCalledTimes(3)
	})
})
