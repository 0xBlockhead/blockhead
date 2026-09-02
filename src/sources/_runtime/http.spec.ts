import { expect, it, vi } from 'vitest'

import bindings from '$/sources/Rss/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { corsFetch } = vi.hoisted(() => ({ corsFetch: vi.fn() }))

vi.mock('$/lib/http.ts', () => ({ corsFetch }))

const { sourceFetch } = await import('$/sources/_runtime/http.ts')
const binding = bindings[Source.Rss_Rest][0]
const url = binding.endpoints[0].locator

it('rejects an aborted queued request without consuming its slot', async () => {
	const releases: ((response: Response) => void)[] = []
	corsFetch.mockImplementation(() => new Promise<Response>((resolve) => {
		releases.push(resolve)
	}))

	const holders = Array.from({ length: 4 }, () => sourceFetch(binding, url))
	await vi.waitFor(() => expect(corsFetch).toHaveBeenCalledTimes(4))

	const controller = new AbortController()
	const aborted = sourceFetch(binding, url, { signal: controller.signal })
	controller.abort()
	await expect(aborted).rejects.toBe(controller.signal.reason)
	expect(corsFetch).toHaveBeenCalledTimes(4)

	const next = sourceFetch(binding, url)
	releases[0](new Response())
	await holders[0]
	await vi.waitFor(() => expect(corsFetch).toHaveBeenCalledTimes(5))
	releases[4](new Response())
	await expect(next).resolves.toBeInstanceOf(Response)

	for (const [index, holder] of holders.slice(1).entries()) {
		releases[index + 1](new Response())
		await holder
	}
})
