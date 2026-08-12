import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
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

const gitlabPage = (providerContinuationToken: string | undefined) => {
	const page = Number(providerContinuationToken ?? '1')
	if (!Number.isSafeInteger(page) || page < 1)
		throw new Error('Gitlab_Rest: invalid continuation page')

	return page
}

const gitlabCommitCoordinatesFromSignatureId = (signatureId: string) => {
	const signatureUrl = URL.parse(signatureId)
	if (signatureUrl == null)
		return undefined
	const pathSegments = signatureUrl.pathname.split('/').filter(Boolean)
	const commitMarkerIndex = pathSegments.length - 2
	const commitSha = pathSegments.at(-1)
	if (
		signatureUrl.origin !== 'https://gitlab.com'
		|| signatureUrl.search !== ''
		|| signatureUrl.hash !== '#signature'
		|| commitMarkerIndex < 3
		|| pathSegments[commitMarkerIndex] !== 'commit'
		|| pathSegments[commitMarkerIndex - 1] !== '-'
		|| commitSha == null
		|| !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(commitSha)
	)
		return undefined

	const projectId = pathSegments.slice(0, commitMarkerIndex - 1).join('/')
	const evidenceUrl = `https://gitlab.com/${projectId}/-/commit/${commitSha}`
	if (signatureId !== `${evidenceUrl}#signature`)
		return undefined

	return {
		commitSha,
		evidenceUrl,
		projectId,
	}
}

export default {
	source: Source.Gitlab_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.GitSignature,
			resolve: {
				SignatureId: {
					resolve: async ({ signatureId }) => {
						const coordinates = gitlabCommitCoordinatesFromSignatureId(signatureId)
						if (coordinates == null)
							return undefined

						const { getCommitSignature } = await import('$/sources/Gitlab/Rest/queries.ts')
						const signature = await getCommitSignature({
							projectId: coordinates.projectId,
							commitSha: coordinates.commitSha,
						})
						const signerSelector = {
							...(signature.gpg_key_primary_keyid != null && {
								gpgKeyPrimaryKeyId: signature.gpg_key_primary_keyid,
							}),
							...(signature.gpg_key_user_name != null && {
								gpgKeyUserName: signature.gpg_key_user_name,
							}),
							...(signature.gpg_key_user_email != null && {
								gpgKeyUserEmail: signature.gpg_key_user_email,
							}),
							...(signature.x509_certificate != null && {
								x509Certificate: signature.x509_certificate,
							}),
							...(signature.commit_source != null && {
								commitSource: signature.commit_source,
							}),
						}

						return {
							signatureId,
							subjectObjectId: `0x${coordinates.commitSha}`,
							signatureKind: signature.signature_type,
							...(Object.keys(signerSelector).length > 0 && { signerSelector }),
							verificationStatus: signature.verification_status,
							verifier: 'GitLab',
							evidenceUrl: coordinates.evidenceUrl,
						}
					},
				},
			},
		})({
			signatureId: (signature) => signature.signatureId,
			subjectObjectId: (signature) => signature.subjectObjectId,
			signatureKind: (signature) => signature.signatureKind,
			signerSelector: (signature) => signature.signerSelector,
			verificationStatus: (signature) => signature.verificationStatus,
			verifier: (signature) => signature.verifier,
			evidenceUrl: (signature) => signature.evidenceUrl,
		}),

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

						const { getProject } = await import('$/sources/Gitlab/Rest/queries.ts')
						const projectId = `${owner}/${repositoryName}`
						const project = await getProject({ projectId })
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
		}),

		defineResolver({
			entityType: EntityType.GitForgeMirror,
			resolve: {
				ForgeHostOwnerRepositoryName: {
					resolve: async (mirror, context) => {
						const projectId = gitlabProjectIdFromMirror(mirror)
						if (projectId == null) return undefined

						const page = gitlabPage(context.providerContinuationToken)
						const perPage = resolverContextRowLimit(context)
						const { getIssues } = await import('$/sources/Gitlab/Rest/queries.ts')
						return {
							page,
							perPage,
							issues: (
								perPage === 0 ?
									[]
								:
									await getIssues({
										projectId,
										page,
										perPage,
									})
							),
						}
					},
				},
			},
		})({
			$$issues: {
				select: ({ issues }, mirror) => issues.map((issue) => ({
					[EntityMetaKey.Selector]: {
						$forgeMirror: mirror,
						issueNumber: issue.iid,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.GitForgeIssue, [], 'title')]: issue.title,
						[entityFieldAddressKey(EntityType.GitForgeIssue, [], 'state')]: issue.state,
						[entityFieldAddressKey(EntityType.GitForgeIssue, [], 'labels')]: issue.labels,
						...(issue.author != null && {
							[entityFieldAddressKey(EntityType.GitForgeIssue, [], 'authorSelector')]: issue.author,
						}),
						[entityFieldAddressKey(EntityType.GitForgeIssue, [], 'createdAt')]: gitlabTimestampMs(issue.created_at),
						[entityFieldAddressKey(EntityType.GitForgeIssue, [], 'updatedAt')]: gitlabTimestampMs(issue.updated_at),
						...(issue.closed_at != null && {
							[entityFieldAddressKey(EntityType.GitForgeIssue, [], 'closedAt')]: gitlabTimestampMs(issue.closed_at),
						}),
					},
				})),
				continuation: ({
					issues,
					page,
					perPage,
				}) => ({
					operation: 'gitlab-issues',
					terminal: perPage === 0 || issues.length < perPage,
					...(issues.length === perPage && { token: String(page + 1) }),
				}),
			},
		}),

		defineResolver({
			entityType: EntityType.GitForgeMirror,
			resolve: {
				ForgeHostOwnerRepositoryName: {
					resolve: async (mirror, context) => {
						const projectId = gitlabProjectIdFromMirror(mirror)
						if (projectId == null) return undefined

						const page = gitlabPage(context.providerContinuationToken)
						const perPage = resolverContextRowLimit(context)
						const { getMergeRequests } = await import('$/sources/Gitlab/Rest/queries.ts')
						return {
							page,
							perPage,
							mergeRequests: (
								perPage === 0 ?
									[]
								:
									await getMergeRequests({
										projectId,
										page,
										perPage,
									})
							),
						}
					},
				},
			},
		})({
			$$pullRequests: {
				select: ({ mergeRequests }, mirror) => mergeRequests.map((mergeRequest) => ({
					[EntityMetaKey.Selector]: {
						$forgeMirror: mirror,
						pullRequestNumber: mergeRequest.iid,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'title')]: mergeRequest.title,
						[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'state')]: mergeRequest.state,
						[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'baseRef')]: mergeRequest.target_branch,
						[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'headRef')]: mergeRequest.source_branch,
						[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'headObjectId')]: `0x${mergeRequest.sha}`,
						...(mergeRequest.author != null && {
							[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'authorSelector')]: mergeRequest.author,
						}),
						[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'createdAt')]: gitlabTimestampMs(mergeRequest.created_at),
						[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'updatedAt')]: gitlabTimestampMs(mergeRequest.updated_at),
						...(mergeRequest.merged_at != null && {
							[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'mergedAt')]: gitlabTimestampMs(mergeRequest.merged_at),
						}),
					},
				})),
				continuation: ({
					mergeRequests,
					page,
					perPage,
				}) => ({
					operation: 'gitlab-merge-requests',
					terminal: perPage === 0 || mergeRequests.length < perPage,
					...(mergeRequests.length === perPage && { token: String(page + 1) }),
				}),
			},
		}),

		defineResolver({
			entityType: EntityType.GitForgeMirror,
			resolve: {
				ForgeHostOwnerRepositoryName: {
					resolve: async (mirror, context) => {
						const projectId = gitlabProjectIdFromMirror(mirror)
						if (projectId == null) return undefined

						const page = gitlabPage(context.providerContinuationToken)
						const perPage = resolverContextRowLimit(context)
						const { getReleases } = await import('$/sources/Gitlab/Rest/queries.ts')
						return {
							page,
							perPage,
							releases: (
								perPage === 0 ?
									[]
								:
									await getReleases({
										projectId,
										page,
										perPage,
									})
							),
						}
					},
				},
			},
		})({
			$$releases: {
				select: ({ releases }, mirror) => releases.map((release) => ({
					[EntityMetaKey.Selector]: {
						$forgeMirror: mirror,
						releaseTagName: release.tag_name,
					},
					[EntityMetaKey.Fields]: {
						...(release.name != null && {
							[entityFieldAddressKey(EntityType.GitForgeRelease, [], 'name')]: release.name,
						}),
						[entityFieldAddressKey(EntityType.GitForgeRelease, [], 'targetObjectId')]: `0x${release.commit.id}`,
						...(release.author != null && {
							[entityFieldAddressKey(EntityType.GitForgeRelease, [], 'authorSelector')]: release.author,
						}),
						[entityFieldAddressKey(EntityType.GitForgeRelease, [], 'createdAt')]: gitlabTimestampMs(release.created_at),
						[entityFieldAddressKey(EntityType.GitForgeRelease, [], 'publishedAt')]: gitlabTimestampMs(release.released_at),
					},
				})),
				continuation: ({
					releases,
					page,
					perPage,
				}) => ({
					operation: 'gitlab-releases',
					terminal: perPage === 0 || releases.length < perPage,
					...(releases.length === perPage && { token: String(page + 1) }),
				}),
			},
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
							getCommits,
							getProject,
							getRepositoryTree,
							getTags,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, branches, tags, commits, repositoryTree] = await Promise.all([
							getProject({ projectId: coordinates.projectId }),
							getBranches({ projectId: coordinates.projectId }),
							getTags({ projectId: coordinates.projectId }),
							getCommits({ projectId: coordinates.projectId }),
							getRepositoryTree({ projectId: coordinates.projectId }),
						])
						if (project.path !== coordinates.repositoryName || project.path_with_namespace !== coordinates.projectId)
							throw new Error('Gitlab_Rest: project identity does not match remote URL')

						const objectFormat = [...branches, ...tags].some(({ commit }) => commit.id.length === 64) ? 'sha256' : 'sha1'
						return {
							repositoryId: project.http_url_to_repo,
							canonicalRemoteUrl: project.http_url_to_repo,
							objectFormat,
							...(project.default_branch != null && { defaultRefName: `refs/heads/${project.default_branch}` }),
							$$refs: [
								...branches.map((branch) => ({
									[EntityMetaKey.Selector]: {
										$repository: {
											canonicalRemoteUrl: project.http_url_to_repo,
										},
										refName: `refs/heads/${branch.name}`,
									},
									refKind: 'branch',
									targetObjectId: `0x${branch.commit.id}`,
								})),
								...tags.map((tag) => ({
									[EntityMetaKey.Selector]: {
										$repository: {
											canonicalRemoteUrl: project.http_url_to_repo,
										},
										refName: `refs/tags/${tag.name}`,
									},
									refKind: 'tag',
									targetObjectId: `0x${tag.target}`,
								})),
							],
							$$objects: [...new Map([
								...branches.map((branch) => [branch.commit.id, 'commit'] as const),
								...tags.map((tag) => [tag.commit.id, 'commit'] as const),
								...commits.map((commit) => [commit.id, 'commit'] as const),
								...repositoryTree.map((object) => [object.id, object.type] as const),
							]).entries()].map(([objectId, objectKind]) => ({
								[EntityMetaKey.Selector]: {
									objectId: `0x${objectId}`,
									objectFormat,
								},
								objectKind,
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
			entityType: EntityType.GitRef,
			resolve: {
				RepositoryRefName: {
					resolve: async ({
						$repository,
						refName,
					}) => {
						const coordinates = gitlabCoordinatesFromRemoteUrl(
							'canonicalRemoteUrl' in $repository ?
								$repository.canonicalRemoteUrl
							:
								$repository.repositoryId
						)
						if (coordinates == null)
							return undefined

						const branchName = refName.startsWith('refs/heads/') ? refName.slice('refs/heads/'.length) : undefined
						const tagName = refName.startsWith('refs/tags/') ? refName.slice('refs/tags/'.length) : undefined
						if ((branchName == null && tagName == null) || branchName === '' || tagName === '')
							return undefined

						const { getBranch, getTag } = await import('$/sources/Gitlab/Rest/queries.ts')
						const ref = await (
							branchName != null ?
								getBranch({
									projectId: coordinates.projectId,
									branchName,
								})
							: tagName != null ?
								getTag({
									projectId: coordinates.projectId,
									tagName,
								})
							:
								undefined
						)
						if (ref == null)
							return undefined
						if (ref.name !== branchName && ref.name !== tagName)
							throw new Error('Gitlab_Rest: ref identity does not match selector')

						const targetObjectId = `0x${'target' in ref ? ref.target : ref.commit.id}`
						const timestampMs = Date.now()
						return {
							$repository,
							refName,
							refKind: branchName != null ? 'branch' : 'tag',
							targetObjectId,
							$$observations: [{
								[EntityMetaKey.Selector]: {
									$ref: {
										$repository,
										refName,
									},
									timestampMs,
									source: Source.Gitlab_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'targetObjectId')]: targetObjectId,
									[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'advertised')]: true,
									...(ref.protected != null && {
										[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'protection')]: {
											protected: ref.protected,
											...('developers_can_push' in ref && ref.developers_can_push != null && {
												developersCanPush: ref.developers_can_push,
											}),
											...('developers_can_merge' in ref && ref.developers_can_merge != null && {
												developersCanMerge: ref.developers_can_merge,
											}),
										},
									}),
								},
							}],
						}
					},
				},
			},
		})({
			$repository: (ref) => ({
				[EntityMetaKey.Selector]: ref.$repository,
			}),
			refName: (ref) => ref.refName,
			refKind: (ref) => ref.refKind,
			targetObjectId: (ref) => ref.targetObjectId,
			$$observations: (ref) => ref.$$observations,
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
						const pathSegments = normalizedPath.split('/')
						const treeObjectIds: `0x${string}`[] = []
						let target: Awaited<ReturnType<typeof getRepositoryTree>>[number] | undefined
						for (let segmentIndex = 0; segmentIndex < pathSegments.length; segmentIndex += 1) {
							const parentPath = pathSegments.slice(0, segmentIndex).join('/')
							target = undefined
							let page = 1
							let treePage: Awaited<ReturnType<typeof getRepositoryTree>>
							do {
								treePage = await getRepositoryTree({
									page,
									projectId: coordinates.projectId,
									...(parentPath !== '' && { path: parentPath }),
									perPage: 100,
									ref: commitObjectId.slice(2),
									recursive: false,
								})
								target = treePage.find((entry) => entry.path === pathSegments.slice(0, segmentIndex + 1).join('/'))
								page += 1
							} while (treePage.length === 100 && target == null)
							if (target == null)
								break

							if (segmentIndex < pathSegments.length - 1) {
								if (target.type !== 'tree') {
									target = undefined
									break
								}

								treeObjectIds.push(`0x${target.id}`)
							}
						}
						return {
							$repository,
							commitObjectId,
							path: normalizedPath,
							treeObjectIds,
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
							...(issue.author != null && { authorSelector: issue.author }),
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
			authorSelector: (issue) => issue.authorSelector,
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
							...(mergeRequest.author != null && { authorSelector: mergeRequest.author }),
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
			authorSelector: (mergeRequest) => mergeRequest.authorSelector,
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
							...(release.author != null && { authorSelector: release.author }),
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
			authorSelector: (release) => release.authorSelector,
			createdAt: (release) => release.createdAt,
			publishedAt: (release) => release.publishedAt,
		}),
	],
} satisfies RegisteredSourceResolverModule
