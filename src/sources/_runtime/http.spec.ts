import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/Rss/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { CorsAwareFetchOptions } from '$/lib/http.ts'

const { corsFetch } = vi.hoisted(() => ({ corsFetch: vi.fn() }))

vi.mock('$/lib/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/lib/http.ts')>(),
	corsFetch,
}))

const { sourceFetch, sourceGetJson } = await import('$/sources/_runtime/http.ts')
const binding = bindings[Source.Rss_Rest][0]
const url = binding.endpoints[0].locator

beforeEach(() => {
	corsFetch.mockReset()
})

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

it('preserves accepted error statuses in the third argument while forwarding RequestInit', async () => {
	corsFetch.mockResolvedValueOnce(Response.json({ missing: true }, { status: 404 }))
	const init = {
		signal: new AbortController().signal,
		headers: { accept: 'application/json' },
	}
	await expect(sourceGetJson(binding, url, [404], init)).resolves.toEqual({ missing: true })
	expect(corsFetch).toHaveBeenCalledWith(url, expect.objectContaining({ init }))

	corsFetch.mockResolvedValueOnce(Response.json({ value: 1 }))
	await expect(sourceGetJson(binding, url)).resolves.toEqual({ value: 1 })

	corsFetch.mockResolvedValueOnce(new Response('unavailable', { status: 503 }))
	await expect(sourceGetJson(binding, url)).rejects.toThrow('503')
})

it('preserves cancellation after a JSON request has started', async () => {
	const controller = new AbortController()
	corsFetch.mockImplementationOnce((_url: string, options: CorsAwareFetchOptions) => {
		expect(options.init?.signal).toBe(controller.signal)
		return new Promise<Response>((_resolve, reject) => {
			options.init?.signal?.addEventListener('abort', () => reject(controller.signal.reason), { once: true })
		})
	})
	const pending = sourceGetJson(binding, url, [], { signal: controller.signal })
	const reason = new Error('cancel JSON request')
	const rejected = expect(pending).rejects.toBe(reason)
	controller.abort(reason)
	await rejected
})
