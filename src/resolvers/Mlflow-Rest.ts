import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { AiArtifactSelector } from '$/schema/AiArtifact.ts'
import { AiDocumentSelector } from '$/schema/AiDocument.ts'
import { AiModelSelector } from '$/schema/AiModel.ts'
import { AiModelVersionSelector } from '$/schema/AiModelVersion.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { resolveEnvLocator } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceEndpointKind } from '$/sources/SourceBinding.ts'

const mlflowBindingDefinition = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.Mlflow_Rest)

if (mlflowBindingDefinition == null)
	throw new Error('Mlflow_Rest: source binding is missing')

const providerSelector = {
	providerId: 'mlflow',
} as const

const assertProvider = ($provider: { domain?: string, providerId?: string }) => {
	if ($provider.providerId !== providerSelector.providerId)
		throw new Error('Mlflow_Rest: unsupported AI model provider')
}

const providerReference = {
	[EntityMetaKey.Selector]: providerSelector,
} as const

const bindingWithEndpoint = (publicEnv: Record<string, string>) => ({
	...mlflowBindingDefinition,
	endpoints: mlflowBindingDefinition.endpoints.map((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl ?
			{
				...endpoint,
				locator: resolveEnvLocator(endpoint.locator, publicEnv),
			}
		:
			endpoint
	)),
})

const artifactReference = (
	runId: string,
	path: string
) => ({
	[EntityMetaKey.Selector]: {
		$provider: providerSelector,
		providerArtifactId: `${runId}::${path}`,
	},
})

const parseArtifactId = (providerArtifactId: string) => {
	const delimiterIndex = providerArtifactId.indexOf('::')
	if (delimiterIndex <= 0)
		throw new Error('Mlflow_Rest: malformed provider artifact ID')

	return {
		runId: providerArtifactId.slice(0, delimiterIndex),
		path: providerArtifactId.slice(delimiterIndex + 2),
	}
}

export const mlflowResolvers = [
		defineResolver(Source.Mlflow_Rest, {
			entityType: EntityType.AiModel,
			resolve: {
				[AiModelSelector.ProviderModelId]: async ({ $provider, providerModelId }, context) => {
					assertProvider($provider)
					const { getRegisteredModel } = await import('$/sources/Mlflow/Rest/queries.ts')
					return (await getRegisteredModel({
						binding: bindingWithEndpoint(context.publicEnv),
						name: providerModelId,
					})).registered_model
				},
			},
		})({
			providerResourceName: (model) => model.name,
			label: (model) => model.name,
			providerCreatedAt: (model) => model.creation_timestamp,
			$$versions: (model) => (model.latest_versions ?? []).map((version) => ({
				[EntityMetaKey.Selector]: {
					$model: {
						$provider: providerSelector,
						providerModelId: model.name,
					},
					versionId: version.version,
				},
			})),
			$$documents: () => [],
		}),

		defineResolver(Source.Mlflow_Rest, {
			entityType: EntityType.AiModelVersion,
			resolve: {
				[AiModelVersionSelector.ModelVersionId]: async ({ $model, versionId }, context) => {
					assertProvider($model.$provider)
					const { getModelVersion } = await import('$/sources/Mlflow/Rest/queries.ts')
					return (await getModelVersion({
						binding: bindingWithEndpoint(context.publicEnv),
						name: $model.providerModelId,
						version: versionId,
					})).model_version
				},
			},
		})({
			$model: (version) => ({
				[EntityMetaKey.Selector]: {
					$provider: providerSelector,
					providerModelId: version.name,
				},
			}),
			versionId: (version) => version.version,
			$artifact: (version) => version.run_id == null || version.source == null ? undefined : artifactReference(version.run_id, version.source),
			mlflowRegisteredModelName: (version) => version.name,
			mlflowModelVersion: (version) => version.version,
			createdAt: (version) => version.creation_timestamp,
			$$documents: (version) => version.run_id == null || version.source == null ? [] : [{
				[EntityMetaKey.Selector]: {
					documentKind: 'mlflow-model-metadata',
					$artifact: artifactReference(version.run_id, version.source)[EntityMetaKey.Selector],
				},
			}],
		}),

		defineResolver(Source.Mlflow_Rest, {
			entityType: EntityType.AiArtifact,
			resolve: {
				[AiArtifactSelector.ProviderArtifactId]: async ({ $provider, providerArtifactId }, context) => {
					assertProvider($provider)
					const artifact = parseArtifactId(providerArtifactId)
					const { listArtifacts } = await import('$/sources/Mlflow/Rest/queries.ts')
					return {
						...artifact,
						listing: await listArtifacts({
							binding: bindingWithEndpoint(context.publicEnv),
							runId: artifact.runId,
							path: artifact.path,
						}),
					}
				},
			},
		})({
			$provider: () => providerReference,
			providerArtifactId: (_artifact, selector) => selector.providerArtifactId,
			uri: (artifact) => artifact.listing.root_uri?.startsWith('http://') === true || artifact.listing.root_uri?.startsWith('https://') === true ? `${artifact.listing.root_uri.replace(/\/$/, '')}/${artifact.path}` : undefined,
			artifactType: (artifact) => artifact.listing.files?.find((file) => file.path === artifact.path)?.is_dir === true ? 'mlflow-artifact-directory' : 'mlflow-artifact',
			size: (artifact) => artifact.listing.files?.find((file) => file.path === artifact.path)?.file_size,
			$$documents: (artifact) => /(^|\/)(MLmodel|README\.md|model-card\.md)$/i.test(artifact.path) ? [{
				[EntityMetaKey.Selector]: {
					documentKind: 'mlflow-model-metadata',
					$artifact: {
						$provider: providerSelector,
						providerArtifactId: `${artifact.runId}::${artifact.path}`,
					},
				},
			}] : [],
		}),

		defineResolver(Source.Mlflow_Rest, {
			entityType: EntityType.AiDocument,
			resolve: {
				[AiDocumentSelector.KindArtifact]: async ({ documentKind, $artifact }, context) => {
					assertProvider($artifact.$provider)
					const artifact = parseArtifactId($artifact.providerArtifactId)
					const { listArtifacts } = await import('$/sources/Mlflow/Rest/queries.ts')
					await listArtifacts({
						binding: bindingWithEndpoint(context.publicEnv),
						runId: artifact.runId,
						path: artifact.path,
					})
					return {
						documentKind,
						artifact,
					}
				},
			},
		})({
			documentKind: (document) => document.documentKind,
			$artifact: (document) => artifactReference(document.artifact.runId, document.artifact.path),
			mediaType: (document) => document.artifact.path.toLowerCase().endsWith('.md') ? 'text/markdown' : 'application/yaml',
			sourceFormat: (document) => document.artifact.path.toLowerCase().endsWith('.md') ? 'markdown' : 'mlflow-model',
		}),
	] as const

export default {
	source: Source.Mlflow_Rest,
	resolvers: mlflowResolvers,
}
