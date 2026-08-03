import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const providerSelector = {
	providerId: 'huggingface',
} as const

const assertProvider = ($provider: { domain?: string, providerId?: string }) => {
	if ($provider.providerId !== providerSelector.providerId && $provider.domain !== 'huggingface.co')
		throw new Error('HuggingFaceHub_Rest: unsupported AI model provider')
}

const providerReference = {
	[EntityMetaKey.Selector]: providerSelector,
} as const

const documentReference = (
	repoId: string,
	revision: string
) => ({
	[EntityMetaKey.Selector]: {
		documentUrl: `https://huggingface.co/${repoId}/blob/${revision}/README.md`,
	},
})

const artifactReference = (
	repoId: string,
	revision: string,
	path?: string
) => ({
	[EntityMetaKey.Selector]: {
		$provider: providerSelector,
		providerArtifactId: `${repoId}@${revision}${path == null ? '' : `:${path}`}`,
	},
})

const parseArtifactId = (providerArtifactId: string) => {
	const atIndex = providerArtifactId.lastIndexOf('@')
	if (atIndex <= 0)
		throw new Error('HuggingFaceHub_Rest: malformed provider artifact ID')

	const pathIndex = providerArtifactId.indexOf(':', atIndex)
	return {
		repoId: providerArtifactId.slice(0, atIndex),
		revision: providerArtifactId.slice(atIndex + 1, pathIndex < 0 ? undefined : pathIndex),
		path: pathIndex < 0 ? undefined : providerArtifactId.slice(pathIndex + 1),
	}
}

export const huggingFaceHubResolvers = [
		defineResolver({
			entityType: EntityType.AiModel,
			resolve: {
				ProviderModelId: {
					resolve: async ({ $provider, providerModelId }) => {
						assertProvider($provider)
						const { retrieveModel } = await import('$/sources/HuggingFace/Rest/queries.ts')
						return retrieveModel({
							repoId: providerModelId,
						})
					},
				},
			},
		})({
			providerResourceName: (model) => model.id,
			label: (model) => model.modelId ?? model.id,
			modelFamily: (model) => model.pipeline_tag,
			providerOwnedBy: (model) => model.author,
			providerCreatedAt: (model) => model.createdAt == null ? undefined : Date.parse(model.createdAt),
			$$versions: (model) => model.sha == null ? [] : [{
				[EntityMetaKey.Selector]: {
					huggingFaceRepo: model.id,
					revision: model.sha,
				},
			}],
			$$documents: (model) => model.sha == null ? [] : [documentReference(model.id, model.sha)],
		}),

		defineResolver({
			entityType: EntityType.AiModelVersion,
			resolve: {
				HuggingFaceRepoRevision: {
					resolve: async ({ huggingFaceRepo, revision }) => {
						const { retrieveModel } = await import('$/sources/HuggingFace/Rest/queries.ts')
						return retrieveModel({
							repoId: huggingFaceRepo,
							revision,
						})
					},
				},
			},
		})({
			$model: (model) => ({
				[EntityMetaKey.Selector]: {
					$provider: providerSelector,
					providerModelId: model.id,
				},
			}),
			versionId: (model) => model.sha,
			$artifact: (model, selector) => artifactReference(model.id, selector.revision),
			createdAt: (model) => model.createdAt == null ? undefined : Date.parse(model.createdAt),
			$$documents: (model, selector) => [documentReference(model.id, selector.revision)],
		}),

		defineResolver({
			entityType: EntityType.AiArtifact,
			resolve: {
				ProviderArtifactId: {
					resolve: async ({ $provider, providerArtifactId }) => {
						assertProvider($provider)
						const artifact = parseArtifactId(providerArtifactId)
						const { retrieveModel } = await import('$/sources/HuggingFace/Rest/queries.ts')
						return {
							...artifact,
							model: await retrieveModel({
								repoId: artifact.repoId,
								revision: artifact.revision,
							}),
						}
					},
				},
			},
		})({
			$provider: () => providerReference,
			gitObject: (artifact) => artifact.path == null ? artifact.revision : artifact.model.siblings?.find((sibling) => sibling.rfilename === artifact.path)?.blobId,
			digestAlgorithm: (artifact) => artifact.model.siblings?.find((sibling) => sibling.rfilename === artifact.path)?.lfs == null ? undefined : 'sha256',
			digest: (artifact) => {
				const sha256 = artifact.model.siblings?.find((sibling) => sibling.rfilename === artifact.path)?.lfs?.sha256
				return sha256 == null ? undefined : `0x${sha256}`
			},
			uri: (artifact) => artifact.path == null ? `https://huggingface.co/${artifact.repoId}/tree/${artifact.revision}` : `https://huggingface.co/${artifact.repoId}/blob/${artifact.revision}/${artifact.path}`,
			artifactType: (artifact) => artifact.path == null ? 'model-repository-revision' : 'model-file',
			size: (artifact) => artifact.model.siblings?.find((sibling) => sibling.rfilename === artifact.path)?.lfs?.size ?? artifact.model.siblings?.find((sibling) => sibling.rfilename === artifact.path)?.size,
			$$documents: (artifact) => artifact.path == null ? [documentReference(artifact.repoId, artifact.revision)] : [],
		}),

		defineResolver({
			entityType: EntityType.AiDocument,
			resolve: {
				DocumentUrl: {
					resolve: async ({ documentUrl }) => {
						const match = /^https:\/\/huggingface\.co\/(.+)\/blob\/([^/]+)\/(.+)$/.exec(documentUrl)
						if (match == null)
							throw new Error('HuggingFaceHub_Rest: unsupported document URL')

						const { retrieveFileText } = await import('$/sources/HuggingFace/Rest/queries.ts')
						await retrieveFileText({
							repoId: match[1],
							revision: match[2],
							path: match[3],
						})
						return {
							repoId: match[1],
							revision: match[2],
							path: match[3],
						}
					},
				},
			},
		})({
			documentKind: (document) => document.path.toLowerCase() === 'readme.md' ? 'model-card' : 'repository-document',
			$artifact: (document) => artifactReference(document.repoId, document.revision, document.path),
			mediaType: (document) => document.path.toLowerCase().endsWith('.md') ? 'text/markdown' : undefined,
			sourceFormat: (document) => document.path.toLowerCase().endsWith('.md') ? 'markdown' : undefined,
		}),
	] as const

export default {
	source: Source.HuggingFaceHub_Rest,
	resolvers: huggingFaceHubResolvers,
} satisfies RegisteredSourceResolverModule
