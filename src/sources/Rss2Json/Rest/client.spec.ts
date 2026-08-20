import { beforeEach, expect, test, vi } from 'vitest'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

import { getFeed } from '$/sources/Rss2Json/Rest/queries.ts'

beforeEach(() => {
	sourceGetJson.mockReset()
})

test('encodes an arbitrary feed URL as one reserved query value', async () => {
	const requestedFeedUrl = (
		'https://example.com/feed.xml?topic=a+b&redirect=https%3A%2F%2Fother.example%2Fx%3Fy%3D1%26z%3D2#latest'
	)
	sourceGetJson.mockResolvedValueOnce({
		status: 'ok',
		feed: {
			url: requestedFeedUrl,
		},
		items: [],
	})

	await getFeed(requestedFeedUrl)

	const requestUrl = new URL(sourceGetJson.mock.calls[0][1])
	expect(requestUrl.origin).toBe('https://api.rss2json.com')
	expect(requestUrl.pathname).toBe('/v1/api.json')
	expect(requestUrl.searchParams.get('rss_url')).toBe(
		'https://example.com/feed.xml?topic=a+b&redirect=https%3A%2F%2Fother.example%2Fx%3Fy%3D1%26z%3D2#latest'
	)
	expect(requestUrl.searchParams.has('count')).toBe(false)
	expect(sourceGetJson.mock.calls[0][1]).toContain(
		'rss_url=https%3A%2F%2Fexample.com%2Ffeed.xml%3Ftopic%3Da%2Bb%26redirect%3Dhttps%253A%252F%252Fother.example%252Fx%253Fy%253D1%2526z%253D2%23latest'
	)
})
