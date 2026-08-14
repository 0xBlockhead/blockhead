import { describe, expect, it, vi } from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const retrieveModel = vi.hoisted(() => vi.fn())
const retrieveFileText = vi.hoisted(() => vi.fn())

vi.mock('$/sources/HuggingFace/Rest/queries.ts', () => ({
	retrieveModel,
	retrieveFileText,
}))

describe('HuggingFace resolver mappings', () => {
	it('applies provider selectors only to Hugging Face identities', async () => {
		const { default: huggingFace } = await import('$/resolvers/HuggingFaceHub-Rest.ts')
		const indexes = indexResolvers(schema, [huggingFace], new Set([Source.HuggingFaceHub_Rest]))
		const resolver = indexes.resolverDefinitionsByEntityType.AiModel[0]

		expect(resolver.appliesTo('ProviderModelId', {
			$provider: {
				providerId: 'huggingface',
			},
			providerModelId: 'bert-base-uncased',
		})).toBe(true)
		expect(resolver.appliesTo('ProviderModelId', {
			$provider: {
				providerId: 'mlflow',
			},
			providerModelId: 'fraud-detector',
		})).toBe(false)
	})

	it('maps model, revision, artifact, and document identities from provider payloads', async () => {
		retrieveModel.mockResolvedValue({
			id: 'org/model',
			modelId: 'org/model',
			author: 'org',
			sha: 'abcdef',
			createdAt: '2026-01-02T00:00:00.000Z',
			pipeline_tag: 'text-generation',
			siblings: [{
				rfilename: 'model.safetensors',
				lfs: {
					sha256: '0123456789abcdef',
					size: 42,
				},
			}],
		})
		const { huggingFaceHubResolvers } = await import('$/resolvers/HuggingFaceHub-Rest.ts')
		const model = await huggingFaceHubResolvers[0].resolve.ProviderModelId.resolve({
			$provider: {
				providerId: 'huggingface',
			},
			providerModelId: 'org/model',
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})

		expect(huggingFaceHubResolvers[0].projections.$$versions(model)).toEqual([{
			[EntityMetaKey.Selector]: {
				huggingFaceRepo: 'org/model',
				revision: 'abcdef',
			},
		}])
		expect(huggingFaceHubResolvers[0].projections.$$documents(model)).toEqual([{
			[EntityMetaKey.Selector]: {
				documentUrl: 'https://huggingface.co/org/model/blob/abcdef/README.md',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.AiDocument, [], 'documentKind')]: 'model-card',
				[entityFieldAddressKey(EntityType.AiDocument, [], 'mediaType')]: 'text/markdown',
				[entityFieldAddressKey(EntityType.AiDocument, [], 'sourceFormat')]: 'markdown',
			},
		}])
		expect(huggingFaceHubResolvers[1].projections.huggingFaceRepo(model, {
			huggingFaceRepo: 'org/model',
			revision: 'abcdef',
		})).toBe('org/model')
		expect(huggingFaceHubResolvers[1].projections.revision(model, {
			huggingFaceRepo: 'org/model',
			revision: 'abcdef',
		})).toBe('abcdef')

		const artifact = await huggingFaceHubResolvers[2].resolve.ProviderArtifactId.resolve({
			$provider: {
				providerId: 'huggingface',
			},
			providerArtifactId: 'org/model@abcdef:model.safetensors',
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})
		expect(huggingFaceHubResolvers[2].projections.digest(artifact)).toBe('0x0123456789abcdef')
		expect(huggingFaceHubResolvers[2].projections.size(artifact)).toBe(42)
		expect(huggingFaceHubResolvers[2].projections.providerArtifactId(artifact, {
			$provider: {
				providerId: 'huggingface',
			},
			providerArtifactId: 'org/model@abcdef:model.safetensors',
		})).toBe('org/model@abcdef:model.safetensors')
		expect(huggingFaceHubResolvers[3].projections.documentUrl({
			repoId: 'org/model',
			revision: 'abcdef',
			path: 'README.md',
		}, {
			documentUrl: 'https://huggingface.co/org/model/blob/abcdef/README.md',
		})).toBe('https://huggingface.co/org/model/blob/abcdef/README.md')
	})

	it('rejects a model selector owned by another provider', async () => {
		const { huggingFaceHubResolvers } = await import('$/resolvers/HuggingFaceHub-Rest.ts')
		await expect(huggingFaceHubResolvers[0].resolve.ProviderModelId.resolve({
			$provider: {
				providerId: 'mlflow',
			},
			providerModelId: 'org/model',
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})).rejects.toThrow('unsupported AI model provider')
	})
})
