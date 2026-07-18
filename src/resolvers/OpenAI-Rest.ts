import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { AiModelSelector } from '$/schema/AiModel.ts'
import { AiProviderApiOperationSelector } from '$/schema/AiProviderApiOperation.ts'
import { AiProviderCatalogEntrySelector } from '$/schema/AiProviderCatalogEntry.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import {
	listModels,
	retrieveModel,
} from '$/sources/OpenAI/Rest/queries.ts'
import type { OpenAIModel } from '$/sources/OpenAI/Rest/types.ts'

const openAiBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.OpenAI_Rest)

if (openAiBinding == null)
	throw new Error('OpenAI_Rest: source binding is missing')

const assertOpenAiProvider = (provider: { providerId?: string, domain?: string }) => {
	if (provider.providerId === 'openai' || provider.domain === 'openai.com')
		return

	throw new Error('OpenAI_Rest: unsupported AI model provider')
}

const modelFields = (
	model: OpenAIModel,
	$provider: { providerId?: string, domain?: string }
) => ({
	$provider: {
		[EntityMetaKey.Selector]: $provider,
	},
	providerModelId: model.id,
	providerResourceName: model.id,
	label: model.id,
	providerOwnedBy: model.owned_by,
	providerCreatedAt: model.created * 1_000,
})

const operationById = new Map([
	['listModels', {
		label: 'List models',
		operationKind: 'modelCatalogList',
		httpMethod: 'GET',
		pathTemplate: '/v1/models',
		documentUrl: 'https://platform.openai.com/docs/api-reference/models/list',
	}],
	['retrieveModel', {
		label: 'Retrieve model',
		operationKind: 'modelCatalogRetrieve',
		httpMethod: 'GET',
		pathTemplate: '/v1/models/{model}',
		documentUrl: 'https://platform.openai.com/docs/api-reference/models/retrieve',
	}],
] as const)

export default {
	source: Source.OpenAI_Rest,

	resolvers: [
		defineResolver(Source.OpenAI_Rest, {
			entityType: EntityType.AiModel,
			resolve: {
				[AiModelSelector.ProviderModelId]: {
					resolve: async ({ $provider, providerModelId }) => {
						assertOpenAiProvider($provider)
						return modelFields(
							await retrieveModel({
								binding: openAiBinding,
								modelId: providerModelId,
							}),
							$provider
						)
					},
				},
			},
		})({
			$provider: (model) => model.$provider,
			providerModelId: (model) => model.providerModelId,
			providerResourceName: (model) => model.providerResourceName,
			label: (model) => model.label,
			providerOwnedBy: (model) => model.providerOwnedBy,
			providerCreatedAt: (model) => model.providerCreatedAt,
		}),

		defineResolver(Source.OpenAI_Rest, {
			entityType: EntityType.AiProviderCatalogEntry,
			resolve: {
				[AiProviderCatalogEntrySelector.ProviderCatalogKindProviderEntryId]: {
					resolve: async ({
						$provider,
						catalogKind,
						providerEntryId,
					}) => {
						assertOpenAiProvider($provider)
						if (catalogKind !== 'model')
							throw new Error(`OpenAI_Rest: unsupported catalog kind ${catalogKind}`)

						const model = await retrieveModel({
							binding: openAiBinding,
							modelId: providerEntryId,
						})
						return {
							$provider: {
								[EntityMetaKey.Selector]: $provider,
							},
							catalogKind,
							providerEntryId: model.id,
							entryLabel: model.id,
							subjectKind: EntityType.AiModel,
							subjectSelector: {
								$provider,
								providerModelId: model.id,
							},
						}
					},
				},
			},
		})({
			$provider: (entry) => entry.$provider,
			catalogKind: (entry) => entry.catalogKind,
			providerEntryId: (entry) => entry.providerEntryId,
			entryLabel: (entry) => entry.entryLabel,
			subjectKind: (entry) => entry.subjectKind,
			subjectSelector: (entry) => entry.subjectSelector,
		}),

		defineResolver(Source.OpenAI_Rest, {
			entityType: EntityType.AiProviderApiOperation,
			resolve: {
				[AiProviderApiOperationSelector.ProviderOperationId]: {
					resolve: async ({ $provider, operationId }) => {
						assertOpenAiProvider($provider)
						const operation = operationById.get(operationId)
						if (operation == null)
							throw new Error(`OpenAI_Rest: unsupported operation ${operationId}`)

						await listModels({
							binding: openAiBinding,
						})
						return {
							$provider: {
								[EntityMetaKey.Selector]: $provider,
							},
							operationId,
							...operation,
						}
					},
				},
			},
		})({
			$provider: (operation) => operation.$provider,
			operationId: (operation) => operation.operationId,
			label: (operation) => operation.label,
			operationKind: (operation) => operation.operationKind,
			httpMethod: (operation) => operation.httpMethod,
			pathTemplate: (operation) => operation.pathTemplate,
			documentUrl: (operation) => operation.documentUrl,
		}),
	],
}
