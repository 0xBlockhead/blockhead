import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Anthropic/bindings.ts'
import { Source } from '$/sources/Source.ts'

const listModels = vi.fn()
const retrieveModel = vi.fn()

vi.mock('$/sources/Anthropic/Rest/queries.ts', () => ({
	listModels,
	retrieveModel,
}))
vi.mock('$env/dynamic/private', () => ({
	env: {
		ANTHROPIC_API_KEY: 'test-key',
	},
}))

const { default: anthropicResolvers } = await import('$/resolvers/Anthropic-Rest.ts')
const sourceBinding = bindings[Source.Anthropic_Rest][0]
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	publicEnv: {},
	sourceBinding,
}
const $provider = { providerId: 'anthropic' }
const model = {
	type: 'model' as const,
	id: 'claude-test',
	display_name: 'Claude Test',
	created_at: '2025-01-02T03:04:05.000Z',
}

const resolverFor = (entityType: EntityType) => {
	const resolver = anthropicResolvers.resolvers.find((candidate) => candidate.entityType === entityType)
	if (resolver == null)
		throw new Error(`Anthropic REST spec missing ${entityType} resolver`)
	return resolver
}

beforeEach(() => {
	listModels.mockReset()
	retrieveModel.mockReset()
	retrieveModel.mockResolvedValue(model)
	listModels.mockResolvedValue({ data: [model], has_more: false })
})

describe('Anthropic REST public claims', () => {
	it('resolves an Anthropic model identity from the official model record', async () => {
		const resolver = resolverFor(EntityType.AiModel)
		await expect(resolver.resolve.ProviderModelId.resolve({
			$provider,
			providerModelId: model.id,
		}, context)).resolves.toEqual({
			$provider: { [EntityMetaKey.Selector]: $provider },
			providerModelId: model.id,
			providerResourceName: model.id,
			label: model.display_name,
			providerCreatedAt: Date.parse(model.created_at),
		})
		expect(retrieveModel).toHaveBeenCalledWith({
			binding: sourceBinding,
			modelId: model.id,
			credential: 'test-key',
			anthropicVersion: '2023-06-01',
		})
	})

	it('resolves the catalog entry and both documented operation identities', async () => {
		const catalogResolver = resolverFor(EntityType.AiProviderCatalogEntry)
		await expect(catalogResolver.resolve.ProviderCatalogKindProviderEntryId.resolve({
			$provider,
			catalogKind: 'model',
			providerEntryId: model.id,
		}, context)).resolves.toMatchObject({
			entryLabel: model.display_name,
			subjectKind: EntityType.AiModel,
			subjectSelector: { $provider, providerModelId: model.id },
		})

		const operationResolver = resolverFor(EntityType.AiProviderApiOperation)
		for (const operationId of ['listModels', 'retrieveModel'])
			await expect(operationResolver.resolve.ProviderOperationId.resolve({
				$provider,
				operationId,
			}, context)).resolves.toMatchObject({ operationId })
		expect(listModels).toHaveBeenCalledTimes(2)
	})

	it('rejects an unsupported provider and operation without provider work', async () => {
		const modelResolver = resolverFor(EntityType.AiModel)
		await expect(modelResolver.resolve.ProviderModelId.resolve({
			$provider: { providerId: 'openai' },
			providerModelId: model.id,
		}, context)).rejects.toThrow('Anthropic_Rest: unsupported AI model provider')

		const operationResolver = resolverFor(EntityType.AiProviderApiOperation)
		await expect(operationResolver.resolve.ProviderOperationId.resolve({
			$provider,
			operationId: 'unknown',
		}, context)).rejects.toThrow('Anthropic_Rest: unsupported operation unknown')
		expect(retrieveModel).not.toHaveBeenCalled()
		expect(listModels).not.toHaveBeenCalled()
	})
})
