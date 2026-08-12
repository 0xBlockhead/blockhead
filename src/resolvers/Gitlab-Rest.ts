import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const gitlabCoordinatesFromRemoteUrl = (canonicalRemoteUrl: string) => {
	const remoteUrl = new URL(canonicalRemoteUrl)
	if (remoteUrl.hostname !== 'gitlab.com') return undefined

	const pathSegments = remoteUrl.pathname
		.replace(/\.git$/, '')
		.split('/')
		.filter(Boolean)
	if (pathSegments.length < 2) return undefined
	const repositoryName = pathSegments.at(-1)
	if (repositoryName == null) return undefined

	return {
		owner: pathSegments.slice(0, -1).join('/'),
		repositoryName,
		projectId: pathSegments.join('/'),
	}
}

const gitlabProjectIdFromMirror = ({
	forgeHost,
	owner,
	repositoryName,
}: {
	forgeHost: string
	owner: string
	repositoryName: string
}) => (
	forgeHost === 'gitlab.com' ? `${owner}/${repositoryName}` : undefined
)

const gitlabTimestampMs = (timestamp: string) => {
	const timestampMs = Date.parse(timestamp)
	if (!Number.isFinite(timestampMs))
		throw new Error('Gitlab_Rest: invalid lifecycle timestamp')
	return timestampMs
}

export default {
	source: Source.Gitlab_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.GitForgeMirror,
			resolve: {
				ForgeHostOwnerRepositoryName: {
					resolve: async ({
						forgeHost,
						owner,
						repositoryName,
					}) => {
						if (forgeHost !== 'gitlab.com') return undefined

						const {
							getIssues,
							getMergeRequests,
							getProject,
							getReleases,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const projectId = `${owner}/${repositoryName}`
						const [project, issues, mergeRequests, releases] = await Promise.all([
							getProject({ projectId }),
							getIssues({ projectId }),
							getMergeRequests({ projectId }),
							getReleases({ projectId }),
						])
						if (project.path !== repositoryName || project.path_with_namespace !== `${owner}/${repositoryName}`)
							throw new Error('Gitlab_Rest: project identity does not match selector')

						return {
							forgeHost,
							owner,
							repositoryName,
							$gitRepository: {
								[EntityMetaKey.Selector]: {
									canonicalRemoteUrl: project.http_url_to_repo,
								},
							},
							...(project.default_branch != null && { defaultBranch: project.default_branch }),
							visibility: project.visibility,
							cloneUrls: [
								project.http_url_to_repo,
								project.ssh_url_to_repo,
							],
							htmlUrl: project.web_url,
							providerRepositoryId: String(project.id),
							source: Source.Gitlab_Rest,
							$$issues: issues.map((issue) => ({
								$forgeMirror: { forgeHost, owner, repositoryName },
								issueNumber: issue.iid,
							})),
							$$pullRequests: mergeRequests.map((mergeRequest) => ({
								$forgeMirror: { forgeHost, owner, repositoryName },
								pullRequestNumber: mergeRequest.iid,
							})),
							$$releases: releases.map((release) => ({
								$forgeMirror: { forgeHost, owner, repositoryName },
								releaseTagName: release.tag_name,
							})),
						}
					},
				},
			},
		})({
			forgeHost: (project) => project.forgeHost,
			owner: (project) => project.owner,
			repositoryName: (project) => project.repositoryName,
			$gitRepository: (project) => project.$gitRepository,
			defaultBranch: (project) => project.defaultBranch,
			visibility: (project) => project.visibility,
			cloneUrls: (project) => project.cloneUrls,
			htmlUrl: (project) => project.htmlUrl,
			providerRepositoryId: (project) => project.providerRepositoryId,
			source: (project) => project.source,
			$$issues: (project) => project.$$issues,
			$$pullRequests: (project) => project.$$pullRequests,
			$$releases: (project) => project.$$releases,
		}),

		defineResolver({
			entityType: EntityType.GitRepository,
			resolve: {
				CanonicalRemoteUrl: {
					resolve: async ({ canonicalRemoteUrl }) => {
						const coordinates = gitlabCoordinatesFromRemoteUrl(canonicalRemoteUrl)
						if (coordinates == null) return undefined

						const {
							getBranches,
							getProject,
							getRepositoryTree,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, branches, repositoryTree] = await Promise.all([
							getProject({ projectId: coordinates.projectId }),
							getBranches({ projectId: coordinates.projectId }),
							getRepositoryTree({ projectId: coordinates.projectId }),
						])
						if (project.path !== coordinates.repositoryName || project.path_with_namespace !== coordinates.projectId)
							throw new Error('Gitlab_Rest: project identity does not match remote URL')

						const objectFormat = branches.some((branch) => branch.commit.id.length === 64) ? 'sha256' : 'sha1'
						return {
							repositoryId: project.http_url_to_repo,
							canonicalRemoteUrl: project.http_url_to_repo,
							objectFormat,
							...(project.default_branch != null && { defaultRefName: `refs/heads/${project.default_branch}` }),
							$$refs: branches.map((branch) => ({
								[EntityMetaKey.Selector]: {
									$repository: {
										canonicalRemoteUrl: project.http_url_to_repo,
									},
									refName: `refs/heads/${branch.name}`,
								},
								refKind: 'branch',
								targetObjectId: `0x${branch.commit.id}`,
							})),
							$$objects: repositoryTree.map((object) => ({
								[EntityMetaKey.Selector]: {
									objectId: `0x${object.id}`,
									objectFormat,
								},
								objectKind: object.type,
								$repository: {
									[EntityMetaKey.Selector]: {
										canonicalRemoteUrl: project.http_url_to_repo,
									},
								},
							})),
						}
					},
				},
			},
		})({
			repositoryId: (repository) => repository.repositoryId,
			canonicalRemoteUrl: (repository) => repository.canonicalRemoteUrl,
			objectFormat: (repository) => repository.objectFormat,
			defaultRefName: (repository) => repository.defaultRefName,
			$$refs: {
				select: (repository) => repository.$$refs.map((ref) => ({
					[EntityMetaKey.Selector]: ref[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.GitRef, [], 'refKind')]: ref.refKind,
						[entityFieldAddressKey(EntityType.GitRef, [], 'targetObjectId')]: ref.targetObjectId,
					},
				})),
				resolveCount: (repository) => repository.$$refs.length,
			},
			$$objects: {
				select: (repository) => repository.$$objects.map((object) => ({
					[EntityMetaKey.Selector]: object[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.GitObject, [], 'objectKind')]: object.objectKind,
						[entityFieldAddressKey(EntityType.GitObject, [], '$repository')]: object.$repository,
					},
				})),
				resolveCount: (repository) => repository.$$objects.length,
			},
		}),

		defineResolver({
			entityType: EntityType.GitTreePathResolution,
			resolve: {
				RepositoryCommitObjectIdPath: {
					resolve: async ({
						$repository,
						commitObjectId,
						path,
					}) => {
						const coordinates = gitlabCoordinatesFromRemoteUrl(
							'canonicalRemoteUrl' in $repository ?
								$repository.canonicalRemoteUrl
							:
								$repository.repositoryId
						)
						if (coordinates == null)
							return undefined
						const normalizedPath = path.replace(/^\/+|\/+$/g, '')
						if (
							normalizedPath === ''
							|| normalizedPath.split('/').some((segment) => segment === '.' || segment === '..' || segment === '')
						)
							throw new Error('Gitlab_Rest: invalid repository path')

						const { getRepositoryTree } = await import('$/sources/Gitlab/Rest/queries.ts')
						const repositoryTree = await getRepositoryTree({
							projectId: coordinates.projectId,
							ref: commitObjectId.slice(2),
						})
						const target = repositoryTree.find((entry) => entry.path === normalizedPath)
						return {
							$repository,
							commitObjectId,
							path: normalizedPath,
							treeObjectIds: repositoryTree
								.filter((entry) => (
									entry.type === 'tree'
									&& normalizedPath.startsWith(`${entry.path}/`)
								))
								.toSorted((left, right) => left.path.split('/').length - right.path.split('/').length)
								.map((entry) => `0x${entry.id}`),
							...(target?.type === 'blob' && { blobObjectId: `0x${target.id}` }),
							...(target?.type === 'commit' && { submoduleCommitId: `0x${target.id}` }),
							status: (
								target == null ?
									'not-found'
								: target.type === 'blob' ?
									'resolved-blob'
								: target.type === 'tree' ?
									'resolved-tree'
								:
									'resolved-submodule'
							),
						}
					},
				},
			},
		})({
			$repository: (resolution) => ({
				[EntityMetaKey.Selector]: resolution.$repository,
			}),
			commitObjectId: (resolution) => resolution.commitObjectId,
			path: (resolution) => resolution.path,
			treeObjectIds: (resolution) => resolution.treeObjectIds,
			blobObjectId: (resolution) => resolution.blobObjectId,
			submoduleCommitId: (resolution) => resolution.submoduleCommitId,
			status: (resolution) => resolution.status,
		}),

		defineResolver({
			entityType: EntityType.GitForgeIssue,
			resolve: {
				ForgeMirrorIssueNumber: {
					resolve: async ({
						$forgeMirror,
						issueNumber,
					}) => {
						const projectId = gitlabProjectIdFromMirror($forgeMirror)
						if (projectId == null) return undefined

						const { getIssue } = await import('$/sources/Gitlab/Rest/queries.ts')
						const issue = await getIssue({
							projectId,
							issueNumber,
						})
						if (issue.iid !== issueNumber)
							throw new Error('Gitlab_Rest: issue identity does not match selector')

						return {
							$forgeMirror,
							issueNumber,
							title: issue.title,
							state: issue.state,
							labels: issue.labels,
							createdAt: gitlabTimestampMs(issue.created_at),
							updatedAt: gitlabTimestampMs(issue.updated_at),
							...(issue.closed_at != null && { closedAt: gitlabTimestampMs(issue.closed_at) }),
						}
					},
				},
			},
		})({
			$forgeMirror: (issue) => issue.$forgeMirror,
			issueNumber: (issue) => issue.issueNumber,
			title: (issue) => issue.title,
			state: (issue) => issue.state,
			labels: (issue) => issue.labels,
			createdAt: (issue) => issue.createdAt,
			updatedAt: (issue) => issue.updatedAt,
			closedAt: (issue) => issue.closedAt,
		}),

		defineResolver({
			entityType: EntityType.GitForgePullRequest,
			resolve: {
				ForgeMirrorPullRequestNumber: {
					resolve: async ({
						$forgeMirror,
						pullRequestNumber,
					}) => {
						const projectId = gitlabProjectIdFromMirror($forgeMirror)
						if (projectId == null) return undefined

						const { getMergeRequest } = await import('$/sources/Gitlab/Rest/queries.ts')
						const mergeRequest = await getMergeRequest({
							projectId,
							pullRequestNumber,
						})
						if (mergeRequest.iid !== pullRequestNumber)
							throw new Error('Gitlab_Rest: merge request identity does not match selector')

						return {
							$forgeMirror,
							pullRequestNumber,
							title: mergeRequest.title,
							state: mergeRequest.state,
							baseRef: mergeRequest.target_branch,
							headRef: mergeRequest.source_branch,
							headObjectId: `0x${mergeRequest.sha}`,
							createdAt: gitlabTimestampMs(mergeRequest.created_at),
							updatedAt: gitlabTimestampMs(mergeRequest.updated_at),
							...(mergeRequest.merged_at != null && { mergedAt: gitlabTimestampMs(mergeRequest.merged_at) }),
						}
					},
				},
			},
		})({
			$forgeMirror: (mergeRequest) => mergeRequest.$forgeMirror,
			pullRequestNumber: (mergeRequest) => mergeRequest.pullRequestNumber,
			title: (mergeRequest) => mergeRequest.title,
			state: (mergeRequest) => mergeRequest.state,
			baseRef: (mergeRequest) => mergeRequest.baseRef,
			headRef: (mergeRequest) => mergeRequest.headRef,
			headObjectId: (mergeRequest) => mergeRequest.headObjectId,
			createdAt: (mergeRequest) => mergeRequest.createdAt,
			updatedAt: (mergeRequest) => mergeRequest.updatedAt,
			mergedAt: (mergeRequest) => mergeRequest.mergedAt,
		}),

		defineResolver({
			entityType: EntityType.GitForgeRelease,
			resolve: {
				ForgeMirrorReleaseTagName: {
					resolve: async ({
						$forgeMirror,
						releaseTagName,
					}) => {
						const projectId = gitlabProjectIdFromMirror($forgeMirror)
						if (projectId == null) return undefined

						const { getRelease } = await import('$/sources/Gitlab/Rest/queries.ts')
						const release = await getRelease({
							projectId,
							releaseTagName,
						})
						if (release.tag_name !== releaseTagName)
							throw new Error('Gitlab_Rest: release identity does not match selector')

						return {
							$forgeMirror,
							releaseTagName,
							...(release.name != null && { name: release.name }),
							targetObjectId: `0x${release.commit.id}`,
							createdAt: gitlabTimestampMs(release.created_at),
							publishedAt: gitlabTimestampMs(release.released_at),
						}
					},
				},
			},
		})({
			$forgeMirror: (release) => release.$forgeMirror,
			releaseTagName: (release) => release.releaseTagName,
			name: (release) => release.name,
			targetObjectId: (release) => release.targetObjectId,
			createdAt: (release) => release.createdAt,
			publishedAt: (release) => release.publishedAt,
		}),
	],
} satisfies RegisteredSourceResolverModule
