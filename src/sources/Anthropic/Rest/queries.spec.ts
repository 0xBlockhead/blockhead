import { expect, it, vi } from 'vitest'

import bindings from '$/sources/Anthropic/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const { listModels } = await import('$/sources/Anthropic/Rest/queries.ts')
const binding = bindings[Source.Anthropic_Rest][0]

it('passes only the caller-provided noncanonical binding and endpoint to transport', async () => {
	const modifiedBinding = {
		...binding,
		endpoints: binding.endpoints.map((endpoint) => ({
			...endpoint,
			locator: 'https://noncanonical.example/anthropic',
		})),
	}
	sourceFetch.mockResolvedValueOnce(new Response('{}'))

	await listModels({
		binding: modifiedBinding,
		credential: 'test-key',
		anthropicVersion: '2023-06-01',
	})

	expect(sourceFetch).toHaveBeenCalledOnce()
	expect(sourceFetch.mock.calls[0][0]).toBe(modifiedBinding)
	expect(sourceFetch.mock.calls[0][1]).toBe('https://noncanonical.example/v1/models')
	expect(sourceFetch.mock.calls[0][2]).toMatchObject({
		redirect: 'manual',
	})
})
