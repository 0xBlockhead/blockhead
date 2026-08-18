import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/Cohere/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())
vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const { listModels } = await import('./queries.ts')
const binding = bindings[Source.Cohere_Rest][0]
const models = {
	models: [
		{
			name: 'command-r',
		},
	],
}

beforeEach(() => {
	sourceFetch.mockReset()
})

it('lists models with Bearer auth on the selected Cohere REST binding', async () => {
	sourceFetch.mockResolvedValueOnce(Response.json(models))

	await expect(listModels(binding, {
		credential: 'secret',
	})).resolves.toEqual(models)

	expect(sourceFetch).toHaveBeenCalledOnce()
	expect(sourceFetch).toHaveBeenCalledWith(
		binding,
		'https://api.cohere.com/v1/models',
		{
			redirect: 'manual',
			headers: {
				authorization: 'Bearer secret',
			},
		}
	)
})

it('fails closed with the Cohere source label and JSON error hint', async () => {
	sourceFetch.mockResolvedValueOnce(Response.json({
		message: 'invalid api token',
	}, {
		status: 401,
	}))

	await expect(listModels(binding, {
		credential: 'secret',
	})).rejects.toThrow('Cohere_Rest (401): invalid api token')
})
