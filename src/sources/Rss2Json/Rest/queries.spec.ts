import { expect, it, vi } from 'vitest'
import bindings from '$/sources/Rss2Json/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn(async () => ({ status: 'ok', items: [] })))
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
