import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/HuggingFace/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	listModels,
	retrieveFileText,
	retrieveModel,
} from '$/sources/HuggingFace/Rest/queries.ts'

const sourceFetch = vi.hoisted(() => vi.fn())
const sourceGetText = vi.hoisted(() => vi.fn())
const firstHttpUrlForBinding = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetText,
}))

const binding = bindings[Source.HuggingFaceHub_Rest][0]

describe('Hugging Face typed queries', () => {
	beforeEach(() => {
		firstHttpUrlForBinding.mockReset()
		firstHttpUrlForBinding.mockReturnValue('https://huggingface.co/api')
		sourceFetch.mockReset()
		sourceGetText.mockReset()
	})

	it('returns typed model list and detail payloads without requiring a token', async () => {
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => [{
				id: 'org/model',
				sha: 'abc123',
			}],
		})

		await expect(listModels({
			search: 'model',
		})).resolves.toEqual([{
			id: 'org/model',
			sha: 'abc123',
		}])
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://huggingface.co/api/models?search=model',
			{}
		)

		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				id: 'org/model',
				sha: 'abc123',
			}),
		})
		await retrieveModel({
			repoId: 'org/model',
			revision: 'abc123',
			credential: 'token',
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://huggingface.co/api/models/org/model?revision=abc123',
			{
				headers: {
					authorization: 'Bearer token',
				},
			}
		)
	})

	it('reads repository documents through the source delivery boundary', async () => {
		firstHttpUrlForBinding.mockReturnValue('https://huggingface.example/api')
		sourceGetText.mockResolvedValue('# Model card')

		await expect(retrieveFileText({
			repoId: 'org/model',
			revision: 'abc123',
			path: 'README.md',
		})).resolves.toBe('# Model card')
		expect(sourceGetText).toHaveBeenCalledWith(
			binding,
			'https://huggingface.example/org/model/resolve/abc123/README.md'
		)
	})
})
