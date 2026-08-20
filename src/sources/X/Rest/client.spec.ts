import { beforeEach, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/X/bindings.ts'

const xBinding = bindings[Source.X_Rest][0]

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: typeof xBinding) => binding.endpoints[0].locator,
	sourceFetch,
}))

const {
	listUserTweets,
	searchRecentTweets,
} = await import('$/sources/X/Rest/queries.ts')

beforeEach(() => {
	sourceFetch.mockReset()
	sourceFetch.mockResolvedValue({
		ok: true,
		json: () => Promise.resolve({ data: [] }),
	})
})

it('preserves bounded and opaque parameters through source transport', async () => {
	await listUserTweets('user/with reserved', 25)

	expect(sourceFetch).toHaveBeenCalledTimes(1)
	expect(sourceFetch.mock.calls[0][0]).toBe(xBinding)
	expect(sourceFetch.mock.calls[0][1]).toContain(
		'https://api.x.com/2/users/user%2Fwith%20reserved/tweets?'
	)
	expect(sourceFetch.mock.calls[0]).toHaveLength(2)
	expect(new URL(sourceFetch.mock.calls[0][1]).searchParams.get('max_results')).toBe('25')
	expect(new URL(sourceFetch.mock.calls[0][1]).searchParams.get('expansions'))
		.toContain('referenced_tweets.id.author_id')

	await searchRecentTweets(500)
	await listUserTweets('user', 25, 'opaque/+ %=token')

	expect(new URL(sourceFetch.mock.calls[1][1]).searchParams.get('max_results')).toBe('100')
	expect(new URL(sourceFetch.mock.calls[2][1]).searchParams.get('pagination_token'))
		.toBe('opaque/+ %=token')
})
