import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/MistralAi/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { sourceFetch, throwHttpError } = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
	throwHttpError: vi.fn(async () => {
		throw new Error('Mistral AI request failed')
	}),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://api.mistral.ai/',
	sourceFetch,
}))

vi.mock('$/lib/http.ts', () => ({ throwHttpError }))

const { listModels, retrieveModel } = await import('$/sources/MistralAi/Rest/queries.ts')
const binding = bindings[Source.MistralAi_Rest][0]

describe('Mistral AI model transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => [],
		})
	})

	it.each([
		{
			label: 'catalog',
			request: () => listModels({ credential: 'mistral-secret' }),
			url: 'https://api.mistral.ai/v1/models',
		},
		{
			label: 'encoded model',
			request: () => retrieveModel({
				modelId: 'mistral/model?preview=true',
				credential: 'mistral-secret',
			}),
			url: 'https://api.mistral.ai/v1/models/mistral%2Fmodel%3Fpreview%3Dtrue',
		},
	])('requests the $label with bearer authorization', async ({ request, url }) => {
		await expect(request()).resolves.toEqual([])
		expect(sourceFetch).toHaveBeenCalledWith(binding, url, {
			headers: {
				'authorization': 'Bearer mistral-secret',
			},
		})
	})

	it('propagates a non-OK response as an HTTP error', async () => {
		const response = { ok: false }
		sourceFetch.mockResolvedValue(response)

		await expect(listModels({ credential: 'mistral-secret' })).rejects.toThrow('Mistral AI request failed')
		expect(throwHttpError).toHaveBeenCalledWith(binding.source, response)
	})
})
