import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/OpenAI/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://api.openai.test',
	sourceFetch,
}))

const { default: openAiResolvers } = await import('$/resolvers/OpenAI-Rest.ts')

const openAiBinding = bindings[Source.OpenAI_Rest]

const resolverFor = (entityType: EntityType) => {
	const resolver = openAiResolvers.resolvers.find((candidate) => candidate.entityType === entityType)
	if (resolver == null)
		throw new Error(`OpenAI REST spec missing ${entityType} resolver`)

	return resolver
}

const $provider = {
	providerId: 'openai',
}

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const model = {
	id: 'gpt-test',
	object: 'model',
	created: 1_720_000_000,
	owned_by: 'openai',
}

describe('OpenAI AI catalog source and resolver materialization', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue(new Response(JSON.stringify({
			object: 'list',
			data: [model],
		})))
	})

	it('maps a provider-native model id to AiModel', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(model)))
		const resolver = resolverFor(EntityType.AiModel)
		const snapshot = await resolver.resolve['ProviderModelId'].resolve({
			$provider,
			providerModelId: model.id,
		}, context)

		expect(snapshot).toEqual({
			$provider: {
				[EntityMetaKey.Selector]: $provider,
			},
			providerModelId: model.id,
			providerResourceName: model.id,
			label: model.id,
			providerOwnedBy: model.owned_by,
			providerCreatedAt: model.created * 1_000,
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			openAiBinding,
			`https://api.openai.test/v1/models/${model.id}`
		)
	})

	it('maps a model result through an explicit AiProviderCatalogEntry', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(model)))
		const resolver = resolverFor(EntityType.AiProviderCatalogEntry)
		await expect(resolver.resolve['ProviderCatalogKindProviderEntryId'].resolve({
			$provider,
			catalogKind: 'model',
			providerEntryId: model.id,
		}, context)).resolves.toMatchObject({
			catalogKind: 'model',
			providerEntryId: model.id,
			entryLabel: model.id,
			subjectKind: EntityType.AiModel,
			subjectSelector: {
				$provider,
				providerModelId: model.id,
			},
		})
	})

	it('maps the verified catalog endpoint to AiProviderApiOperation', async () => {
		const resolver = resolverFor(EntityType.AiProviderApiOperation)
		await expect(resolver.resolve['ProviderOperationId'].resolve({
			$provider,
			operationId: 'listModels',
		}, context)).resolves.toMatchObject({
			operationId: 'listModels',
			operationKind: 'modelCatalogList',
			httpMethod: 'GET',
			pathTemplate: '/v1/models',
		})
		expect(sourceFetch).toHaveBeenCalledWith(
			openAiBinding,
			'https://api.openai.test/v1/models'
		)
	})

	it('rejects unknown operation identities before provider work', async () => {
		const resolver = resolverFor(EntityType.AiProviderApiOperation)
		await expect(resolver.resolve['ProviderOperationId'].resolve({
			$provider,
			operationId: 'unknownOperation',
		}, context)).rejects.toThrow('OpenAI_Rest: unsupported operation unknownOperation')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})
