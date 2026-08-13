import { expect, it, vi } from 'vitest'
import bindings from '$/sources/Rss2Json/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn(async () => ({
	status: 'ok',
	feed: { url: 'https://example.com/feed.xml' },
	items: [],
})))
vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0].locator,
	sourceGetJson,
}))

const { getFeed } = await import('./queries.ts')

it('executes with the selected RSS2JSON binding', async () => {
	const binding = bindings[Source.Rss2Json_Rest][0]
	await getFeed('https://example.com/feed.xml')
	expect(sourceGetJson.mock.calls[0][0]).toBe(binding)
})

it.each([
	{},
	{ status: 'ok', items: [{ categories: 'not-an-array' }] },
	{ status: 'ok', feed: { title: 42 } },
])('fails closed on malformed feed response %#', async (response) => {
	sourceGetJson.mockResolvedValueOnce(response)

	await expect(getFeed('https://example.com/feed.xml')).rejects.toThrow(
		'Rss2Json_Rest: invalid feed response envelope'
	)
})

it('preserves a provider-declared feed failure after envelope validation', async () => {
	sourceGetJson.mockResolvedValueOnce({
		status: 'error',
	})

	await expect(getFeed('https://example.com/feed.xml')).rejects.toThrow(
		'Rss2Json_Rest: feed fetch failed for https://example.com/feed.xml'
	)
})

it('fails closed when the provider returns a different feed identity', async () => {
	sourceGetJson.mockResolvedValueOnce({
		status: 'ok',
		feed: { url: 'https://other.example/feed.xml' },
		items: [],
	})

	await expect(getFeed('https://example.com/feed.xml')).rejects.toThrow(
		'Rss2Json_Rest: feed response does not match requested identity'
	)
})

it('fails closed when the success envelope is missing feed', async () => {
	sourceGetJson.mockResolvedValueOnce({
		status: 'ok',
		items: [],
	})

	await expect(getFeed('https://example.com/feed.xml')).rejects.toThrow(
		'Rss2Json_Rest: feed response is missing feed'
	)
})

it('fails closed when the success envelope is missing items', async () => {
	sourceGetJson.mockResolvedValueOnce({
		status: 'ok',
		feed: { url: 'https://example.com/feed.xml' },
	})

	await expect(getFeed('https://example.com/feed.xml')).rejects.toThrow(
		'Rss2Json_Rest: feed response is missing items'
	)
})

it('fails closed on duplicate feed item identities', async () => {
	sourceGetJson.mockResolvedValueOnce({
		status: 'ok',
		feed: { url: 'https://example.com/feed.xml' },
		items: [
			{ guid: 'same' },
			{ guid: 'same' },
		],
	})

	await expect(getFeed('https://example.com/feed.xml')).rejects.toThrow(
		'Rss2Json_Rest: duplicate feed item identity'
	)
})
