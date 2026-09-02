import { beforeEach, expect, test, vi } from 'vitest'

import bindings from '$/sources/OpenAI/bindings.ts'
import { Source } from '$/sources/Source.ts'


const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://api.openai.test',
	sourceFetch,
}))

const { retrieveModel } = await import('./queries.ts')

const binding = bindings[Source.OpenAI_Rest][0]

beforeEach(() => {
	sourceFetch.mockReset()
})

test('encodes provider model identity as one path segment', async () => {
	sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
		id: 'vendor/model?preview=true',
		object: 'model',
		created: 1_720_000_000,
		owned_by: 'vendor',
	})))

	await retrieveModel({
		modelId: 'vendor/model?preview=true',
	})

	expect(sourceFetch).toHaveBeenCalledWith(
		binding,
		'https://api.openai.test/v1/models/vendor%2Fmodel%3Fpreview%3Dtrue'
	)
})

test('propagates source-labeled HTTP failures before envelope validation', async () => {
	sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
		error: {
			message: 'invalid token',
		},
	}), {
		status: 401,
		statusText: 'Unauthorized',
	}))

	await expect(retrieveModel({
		modelId: 'gpt-test',
	})).rejects.toThrow('OpenAI_Rest')
})
