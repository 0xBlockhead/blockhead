import { expect, it, vi } from 'vitest'
import bindings from '$/sources/Rss2Json/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn(async () => ({ status: 'ok', items: [] })))
vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0].locator,
	sourceGetJson,
}))

it('executes with the selected RSS2JSON binding', async () => {
	const binding = bindings[Source.Rss2Json_Rest][0]
	const { getFeed } = await import('./queries.ts')
	await getFeed('https://example.com/feed.xml')
	expect(sourceGetJson.mock.calls[0][0]).toBe(binding)
})
