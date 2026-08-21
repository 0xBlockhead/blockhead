import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { resolverSourceBinding, type ResolverContext } from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { AnthropicModel } from '$/sources/Anthropic/Rest/types.ts'

const anthropicVersion = '2023-06-01'

const assertAnthropicProvider = (provider: { providerId?: string, domain?: string }) => {
	if (provider.providerId === 'anthropic' || provider.domain === 'anthropic.com')
		return
	throw new Error('Anthropic_Rest: unsupported AI model provider')
}

const modelFields = (
	model: AnthropicModel,
	$provider: { providerId?: string, domain?: string }
) => {
	const providerCreatedAt = Date.parse(model.created_at)
	if (!Number.isSafeInteger(providerCreatedAt) || providerCreatedAt < 0)
		throw new Error(`Anthropic_Rest: invalid model created_at ${model.created_at}`)

	return {
		$provider: { [EntityMetaKey.Selector]: $provider },
		providerModelId: model.id,
		providerResourceName: model.id,
		label: model.display_name,
		providerCreatedAt,
	}
}

const operationById = new Map([
	['listModels', {
		label: 'List models',
		operationKind: 'modelCatalogList',
		httpMethod: 'GET',
		pathTemplate: '/v1/models',
		documentUrl: 'https://docs.anthropic.com/en/api/models-list',
	}],
	['retrieveModel', {
		label: 'Retrieve model',
		operationKind: 'modelCatalogRetrieve',
		httpMethod: 'GET',
		pathTemplate: '/v1/models/{model_id}',
		documentUrl: 'https://docs.anthropic.com/en/api/models-retrieve',
	}],
] as const)

const retrieve = async (
	modelId: string,
	context: ResolverContext
) => {
	const binding = resolverSourceBinding(context)
	if (typeof window === 'undefined') {
		const { env } = await import('$env/dynamic/private')
		const credential = env.ANTHROPIC_API_KEY?.trim() ?? ''
		if (credential === '')
			throw new Error('Anthropic_Rest: missing runtime credential ANTHROPIC_API_KEY')
		const { retrieveModel } = await import('$/sources/Anthropic/Rest/queries.ts')
		return retrieveModel({ binding, modelId, credential, anthropicVersion })
	}
	const { retrieveModelRemote } = await import('$/sources/Anthropic/Rest/queries.remote.ts')
	return retrieveModelRemote({ modelId })
}

const verifyCatalogAccess = async (context: ResolverContext) => {
	const binding = resolverSourceBinding(context)
	if (typeof window === 'undefined') {
		const { env } = await import('$env/dynamic/private')
		const credential = env.ANTHROPIC_API_KEY?.trim() ?? ''
		if (credential === '')
			throw new Error('Anthropic_Rest: missing runtime credential ANTHROPIC_API_KEY')
		const { listModels } = await import('$/sources/Anthropic/Rest/queries.ts')
		await listModels({ binding, credential, anthropicVersion })
		return
	}
	const { listModelsRemote } = await import('$/sources/Anthropic/Rest/queries.remote.ts')
	await listModelsRemote({})
}

export default {
	source: Source.Anthropic_Rest,
	resolvers: [
		defineResolver({
			entityType: EntityType.AiModel,
			resolve: {
				ProviderModelId: {
					resolve: async ({ $provider, providerModelId }, context) => {
						assertAnthropicProvider($provider)
						return modelFields(await retrieve(providerModelId, context), $provider)
					},
				},
			},
		})({
			$provider: (model) => model.$provider,
			providerModelId: (model) => model.providerModelId,
			providerResourceName: (model) => model.providerResourceName,
			label: (model) => model.label,
			providerCreatedAt: (model) => model.providerCreatedAt,
		}),
		defineResolver({
			entityType: EntityType.AiProviderCatalogEntry,
			resolve: {
				ProviderCatalogKindProviderEntryId: {
					resolve: async ({ $provider, catalogKind, providerEntryId }, context) => {
						assertAnthropicProvider($provider)
						if (catalogKind !== 'model')
							throw new Error(`Anthropic_Rest: unsupported catalog kind ${catalogKind}`)
						const model = await retrieve(providerEntryId, context)
						return {
							$provider: { [EntityMetaKey.Selector]: $provider },
							catalogKind,
							providerEntryId: model.id,
							entryLabel: model.display_name,
							subjectKind: EntityType.AiModel,
							subjectSelector: { $provider, providerModelId: model.id },
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
		defineResolver({
			entityType: EntityType.AiProviderApiOperation,
			resolve: {
				ProviderOperationId: {
					resolve: async ({ $provider, operationId }, context) => {
						assertAnthropicProvider($provider)
						const operation = operationById.get(operationId)
						if (operation == null)
							throw new Error(`Anthropic_Rest: unsupported operation ${operationId}`)
						await verifyCatalogAccess(context)
						return {
							$provider: { [EntityMetaKey.Selector]: $provider },
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
} satisfies RegisteredSourceResolverModule
