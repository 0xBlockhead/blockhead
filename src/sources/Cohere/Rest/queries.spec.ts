import { expect, it, vi } from 'vitest'
import bindings from '$/sources/Cohere/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn(async () => new Response('{}')))
vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0].locator,
	sourceFetch,
}))

it('executes with the selected Cohere binding', async () => {
	const binding = bindings[Source.Cohere_Rest][0]
	const { listModels } = await import('./queries.ts')
	await listModels(binding, { credential: 'secret' })
	expect(sourceFetch).toHaveBeenCalledWith(binding, 'https://api.cohere.com/v1/models', expect.any(Object))
})
