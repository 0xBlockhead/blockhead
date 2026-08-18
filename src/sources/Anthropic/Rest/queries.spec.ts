import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/Anthropic/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const { listModels, retrieveModel } = await import('$/sources/Anthropic/Rest/queries.ts')
const binding = bindings[Source.Anthropic_Rest][0]
const noncanonicalBinding = {
	...binding,
	endpoints: binding.endpoints.map((endpoint) => ({
		...endpoint,
		locator: 'https://noncanonical.example/anthropic',
	})),
}
const models = {
	data: [
		{
			id: 'claude/opus',
		},
	],
}

beforeEach(() => {
	sourceFetch.mockReset()
})

it('lists models from the caller-provided binding with versioned API-key headers', async () => {
	sourceFetch.mockResolvedValueOnce(Response.json(models))

	await expect(listModels({
		binding: noncanonicalBinding,
		credential: 'test-key',
		anthropicVersion: '2023-06-01',
	})).resolves.toEqual(models)

	expect(sourceFetch).toHaveBeenCalledOnce()
	expect(sourceFetch).toHaveBeenCalledWith(
		noncanonicalBinding,
		'https://noncanonical.example/v1/models',
		{
			redirect: 'manual',
			headers: {
				'anthropic-version': '2023-06-01',
				'x-api-key': 'test-key',
			},
		}
	)
})

it('encodes retrieveModel ids onto the caller-provided origin', async () => {
	const model = models.data[0]
	sourceFetch.mockResolvedValueOnce(Response.json(model))

	await expect(retrieveModel({
		binding: noncanonicalBinding,
		modelId: model.id,
		credential: 'test-key',
		anthropicVersion: '2023-06-01',
	})).resolves.toEqual(model)

	expect(sourceFetch).toHaveBeenCalledWith(
		noncanonicalBinding,
		'https://noncanonical.example/v1/models/claude%2Fopus',
		{
			redirect: 'manual',
			headers: {
				'anthropic-version': '2023-06-01',
				'x-api-key': 'test-key',
			},
		}
	)
})

it('fails closed with the Anthropic source label and JSON error hint', async () => {
	sourceFetch.mockResolvedValueOnce(Response.json({
		message: 'invalid x-api-key',
	}, {
		status: 401,
	}))

	await expect(listModels({
		binding: noncanonicalBinding,
		credential: 'test-key',
		anthropicVersion: '2023-06-01',
	})).rejects.toThrow('Anthropic_Rest (401): invalid x-api-key')
})
