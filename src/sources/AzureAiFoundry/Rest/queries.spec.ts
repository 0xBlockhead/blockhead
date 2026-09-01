import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/AzureAiFoundry/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { sourceFetch, throwHttpError } = vi.hoisted(() => ({
	sourceFetch: vi.fn(),
	throwHttpError: vi.fn(async () => {
		throw new Error('Azure AI Foundry request failed')
	}),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://foundry.example/base/',
	sourceFetch,
}))

vi.mock('$/lib/http.ts', () => ({ throwHttpError }))

const { listDeployments } = await import('$/sources/AzureAiFoundry/Rest/queries.ts')
const binding = bindings[Source.AzureAiFoundry_Rest][0]

describe('Azure AI Foundry deployment transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('sends the API key and encoded API version to the supplied binding', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => [],
		})

		await expect(listDeployments({
			binding,
			credential: 'azure-secret',
			apiVersion: '2025-01-01 preview',
		})).resolves.toEqual([])
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://foundry.example/openai/deployments?api-version=2025-01-01+preview',
			{
				headers: {
					'api-key': 'azure-secret',
				},
			}
		)
	})

	it('propagates a non-OK response as an HTTP error', async () => {
		const response = { ok: false }
		sourceFetch.mockResolvedValue(response)

		await expect(listDeployments({
			binding,
			credential: 'azure-secret',
			apiVersion: '2025-01-01',
		})).rejects.toThrow('Azure AI Foundry request failed')
		expect(throwHttpError).toHaveBeenCalledWith(binding.source, response)
	})
})
