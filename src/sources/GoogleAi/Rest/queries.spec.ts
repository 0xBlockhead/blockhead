import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/GoogleAi/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { sourceFetch, throwHttpError } = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
	throwHttpError: vi.fn(async () => {
		throw new Error('Google AI request failed')
	}),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://generativelanguage.googleapis.com/',
	sourceFetch,
}))

vi.mock('$/lib/http.ts', () => ({ throwHttpError }))

const { listModels, retrieveModel } = await import('$/sources/GoogleAi/Rest/queries.ts')
const binding = bindings[Source.GoogleAi_Rest][0]

describe('Google AI model transport', () => {
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
			request: () => listModels({ credential: 'google-secret' }),
			url: 'https://generativelanguage.googleapis.com/v1beta/models',
		},
		{
			label: 'encoded model resource',
			request: () => retrieveModel({
				modelName: 'models/gemini 2?preview=true',
				credential: 'google-secret',
			}),
			url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini%202%3Fpreview%3Dtrue',
		},
	])('requests the $label with the Google API key', async ({ request, url }) => {
		await expect(request()).resolves.toEqual([])
		expect(sourceFetch).toHaveBeenCalledWith(binding, url, {
			headers: {
				'x-goog-api-key': 'google-secret',
			},
		})
	})

	it('propagates a non-OK response as an HTTP error', async () => {
		const response = { ok: false }
		sourceFetch.mockResolvedValue(response)

		await expect(listModels({ credential: 'google-secret' })).rejects.toThrow('Google AI request failed')
		expect(throwHttpError).toHaveBeenCalledWith(binding.source, response)
	})
})
