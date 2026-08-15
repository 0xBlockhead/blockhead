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
	if (
		remoteUrl.origin !== 'https://gitlab.com'
		|| remoteUrl.username !== ''
		|| remoteUrl.password !== ''
		|| remoteUrl.search !== ''
		|| remoteUrl.hash !== ''
	) return undefined

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

const gitlabGitObjectId = (id: string) => (
	`0x${id.toLowerCase()}`
)

const gitObjectFormatFromObjectId = (objectId: string) => {
	if (objectId.length === 42)
		return 'sha1'
	if (objectId.length === 66)
		return 'sha256'
	throw new Error('Gitlab_Rest: unsupported git object ID length')
}

const gitCommitRefFromObjectId = (objectId: string) => ({
	[EntityMetaKey.Selector]: {
		objectId,
		objectFormat: gitObjectFormatFromObjectId(objectId),
	},
})

const gitlabCompareFromMirror = async ({
	$forgeMirror,
	fromObjectId,
	toObjectId,
}: {
	$forgeMirror: {
		forgeHost: string
		owner: string
		repositoryName: string
	}
	fromObjectId: string
	toObjectId: string
}) => {
	const projectId = gitlabProjectIdFromMirror($forgeMirror)
	if (projectId == null)
		return undefined

	const { compareRepositoryRefs } = await import('$/sources/Gitlab/Rest/queries.ts')
	const comparison = await compareRepositoryRefs({
		projectId,
		from: fromObjectId.slice(2),
		to: toObjectId.slice(2),
	})
	const toCommitObjectId = gitlabGitObjectId(comparison.commit.id)
	if (toCommitObjectId !== toObjectId.toLowerCase())
		throw new Error('Gitlab_Rest: compare head does not match to object ID')

	return comparison
}

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

const gitlabCollectionPage = (
	providerContinuationToken: string | undefined,
	streams: readonly [string, ...string[]]
) => {
	const token = providerContinuationToken ?? `${streams[0]}:1`
	const match = /^([a-z]+):(\d+)$/.exec(token)
	const stream = match?.[1]
	const page = Number(match?.[2])
	if (
		stream == null
		|| !streams.some((value) => value === stream)
		|| !Number.isSafeInteger(page)
		|| page < 1
	)
		throw new Error('Gitlab_Rest: invalid continuation page')

	return {
		page,
		stream,
	}
}

const gitlabCollectionContinuation = ({
	page,
	perPage,
	rowCount,
	stream,
	streams,
}: {
	page: number
	perPage: number
	rowCount: number
	stream: string
	streams: readonly [string, ...string[]]
}) => {
	if (perPage !== 0 && rowCount === perPage)
		return {
			terminal: false as const,
			token: `${stream}:${page + 1}`,
		}

	const streamIndex = streams.indexOf(stream)
	return (
		streamIndex >= 0 && streamIndex < streams.length - 1 ?
			{
				terminal: false as const,
				token: `${streams[streamIndex + 1]}:1`,
			}
		:
			{ terminal: true as const }
	)
}

const gitlabCanonicalRemoteUrl = (httpUrlToRepo: string) => {
	if (gitlabCoordinatesFromRemoteUrl(httpUrlToRepo) == null)
		throw new Error('Gitlab_Rest: project clone URL is not a canonical GitLab HTTPS remote')

	return httpUrlToRepo
}

const gitlabRefProtection = (ref: {
	protected?: boolean
	developers_can_push?: boolean
	developers_can_merge?: boolean
}) => (
	ref.protected == null ?
		undefined
	:
		{
			protected: ref.protected,
			...(ref.developers_can_push != null && {
				developersCanPush: ref.developers_can_push,
			}),
			...(ref.developers_can_merge != null && {
				developersCanMerge: ref.developers_can_merge,
			}),
		}
)

const gitlabRefObservation = ({
	$repository,
	peeledObjectId,
	protection,
	refName,
	targetObjectId,
	timestampMs,
}: {
	$repository: {
		canonicalRemoteUrl: string
	} | {
		repositoryId: string
	}
	peeledObjectId?: `0x${string}`
	protection?: {
		protected: boolean
		developersCanPush?: boolean
		developersCanMerge?: boolean
	}
	refName: string
	targetObjectId: `0x${string}`
	timestampMs: number
}) => ({
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
		...(peeledObjectId != null && {
			[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'peeledObjectId')]: peeledObjectId,
		}),
		...(protection != null && {
			[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'protection')]: protection,
		}),
	},
})

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
							...(signature.key != null && {
								sshKey: signature.key,
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
						const canonicalRemoteUrl = gitlabCanonicalRemoteUrl(project.http_url_to_repo)

						return {
							forgeHost,
							owner,
							repositoryName,
							$gitRepository: {
								[EntityMetaKey.Selector]: {
									canonicalRemoteUrl,
								},
							},
							...(project.default_branch != null && { defaultBranch: project.default_branch }),
							visibility: project.visibility,
							cloneUrls: [
								canonicalRemoteUrl,
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
						const {
							getPipelines,
							getProject,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, pipelines] = await Promise.all([
							getProject({ projectId }),
							(
								perPage === 0 ?
									[]
								:
									getPipelines({
										projectId,
										page,
										perPage,
									})
							),
						])
						if (pipelines.some((pipeline) => pipeline.project_id !== project.id))
							throw new Error('Gitlab_Rest: pipeline project identity does not match selector')

						return {
							page,
							perPage,
							pipelines,
						}
					},
				},
			},
		})({
			$$pipelines: {
				select: ({ pipelines }, mirror) => pipelines.map((pipeline) => ({
					[EntityMetaKey.Selector]: {
						$forgeMirror: mirror,
						pipelineId: pipeline.id,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'pipelineIid')]: pipeline.iid,
						[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'ref')]: pipeline.ref,
						[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'commitObjectId')]: `0x${pipeline.sha}`,
						[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'status')]: pipeline.status,
						[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'source')]: pipeline.source,
						[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'url')]: pipeline.web_url,
						[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'createdAt')]: gitlabTimestampMs(pipeline.created_at),
						[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'updatedAt')]: gitlabTimestampMs(pipeline.updated_at),
					},
				})),
				continuation: ({
					page,
					perPage,
					pipelines,
				}) => ({
					operation: 'gitlab-pipelines',
					terminal: perPage === 0 || pipelines.length < perPage,
					...(pipelines.length === perPage && { token: String(page + 1) }),
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
						const {
							getIssues,
							getProject,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, issues] = await Promise.all([
							getProject({ projectId }),
							(
								perPage === 0 ?
									[]
								:
									getIssues({
										projectId,
										page,
										perPage,
									})
							),
						])
						if (issues.some((issue) => issue.project_id !== project.id))
							throw new Error('Gitlab_Rest: issue project identity does not match selector')

						return {
							page,
							perPage,
							issues,
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
						const {
							getMergeRequests,
							getProject,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, mergeRequests] = await Promise.all([
							getProject({ projectId }),
							(
								perPage === 0 ?
									[]
								:
									getMergeRequests({
										projectId,
										page,
										perPage,
									})
							),
						])
						if (mergeRequests.some((mergeRequest) => mergeRequest.project_id !== project.id))
							throw new Error('Gitlab_Rest: merge request project identity does not match selector')

						return {
							page,
							perPage,
							mergeRequests,
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
						[entityFieldAddressKey(EntityType.GitForgeRelease, [], 'draft')]: false,
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
			entityType: EntityType.GitForgeMirror,
			resolve: {
				ForgeHostOwnerRepositoryName: {
					resolve: async (mirror, context) => {
						const projectId = gitlabProjectIdFromMirror(mirror)
						if (projectId == null) return undefined

						const page = gitlabPage(context.providerContinuationToken)
						const perPage = resolverContextRowLimit(context)
						const { listProtectedBranches } = await import('$/sources/Gitlab/Rest/queries.ts')
						return {
							page,
							perPage,
							protectedBranches: (
								perPage === 0 ?
									[]
								:
									await listProtectedBranches({
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
			$$protectedBranches: {
				select: ({ protectedBranches }, mirror) => protectedBranches.map((protectedBranch) => ({
					[EntityMetaKey.Selector]: {
						$forgeMirror: mirror,
						name: protectedBranch.name,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.GitForgeProtectedBranch, [], 'providerProtectedBranchId')]: String(protectedBranch.id),
						[entityFieldAddressKey(EntityType.GitForgeProtectedBranch, [], 'pushAccessDescriptions')]: protectedBranch.push_access_levels.map((access) => access.access_level_description),
						[entityFieldAddressKey(EntityType.GitForgeProtectedBranch, [], 'mergeAccessDescriptions')]: protectedBranch.merge_access_levels.map((access) => access.access_level_description),
						[entityFieldAddressKey(EntityType.GitForgeProtectedBranch, [], 'unprotectAccessDescriptions')]: (protectedBranch.unprotect_access_levels ?? []).map((access) => access.access_level_description),
						[entityFieldAddressKey(EntityType.GitForgeProtectedBranch, [], 'allowForcePush')]: protectedBranch.allow_force_push,
						[entityFieldAddressKey(EntityType.GitForgeProtectedBranch, [], 'codeOwnerApprovalRequired')]: protectedBranch.code_owner_approval_required,
						...(protectedBranch.inherited != null && {
							[entityFieldAddressKey(EntityType.GitForgeProtectedBranch, [], 'inherited')]: protectedBranch.inherited,
						}),
					},
				})),
				continuation: ({
					protectedBranches,
					page,
					perPage,
				}) => ({
					operation: 'gitlab-protected-branches',
					terminal: perPage === 0 || protectedBranches.length < perPage,
					...(protectedBranches.length === perPage && { token: String(page + 1) }),
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

						const { getProject } = await import('$/sources/Gitlab/Rest/queries.ts')
						const project = await getProject({ projectId: coordinates.projectId })
						if (project.path !== coordinates.repositoryName || project.path_with_namespace !== coordinates.projectId)
							throw new Error('Gitlab_Rest: project identity does not match remote URL')
						const repositoryRemoteUrl = gitlabCanonicalRemoteUrl(project.http_url_to_repo)

						return {
							repositoryId: repositoryRemoteUrl,
							canonicalRemoteUrl: repositoryRemoteUrl,
							objectFormat: project.repository_object_format,
							...(project.default_branch != null && { defaultRefName: `refs/heads/${project.default_branch}` }),
							$$remotes: [{
								[EntityMetaKey.Selector]: {
									$repository: {
										canonicalRemoteUrl: repositoryRemoteUrl,
									},
									remoteName: 'origin',
								},
								url: repositoryRemoteUrl,
								transportKind: 'https',
								hostKind: 'gitlab.com',
								source: Source.Gitlab_Rest,
							}],
						}
					},
				},
			},
		})({
			repositoryId: (repository) => repository.repositoryId,
			canonicalRemoteUrl: (repository) => repository.canonicalRemoteUrl,
			objectFormat: (repository) => repository.objectFormat,
			defaultRefName: (repository) => repository.defaultRefName,
			$$remotes: {
				select: (repository) => repository.$$remotes.map((remote) => ({
					[EntityMetaKey.Selector]: remote[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.GitRemote, [], 'url')]: remote.url,
						[entityFieldAddressKey(EntityType.GitRemote, [], 'transportKind')]: remote.transportKind,
						[entityFieldAddressKey(EntityType.GitRemote, [], 'hostKind')]: remote.hostKind,
						[entityFieldAddressKey(EntityType.GitRemote, [], 'source')]: remote.source,
					},
				})),
				resolveCount: (repository) => repository.$$remotes.length,
			},
		}),

		defineResolver({
			entityType: EntityType.GitRepository,
			resolve: {
				CanonicalRemoteUrl: {
					resolve: async ({ canonicalRemoteUrl }, context) => {
						const coordinates = gitlabCoordinatesFromRemoteUrl(canonicalRemoteUrl)
						if (coordinates == null) return undefined

						const {
							page,
							stream,
						} = gitlabCollectionPage(context.providerContinuationToken, ['heads', 'tags'])
						const perPage = resolverContextRowLimit(context)
						const {
							getBranches,
							getProject,
							getTags,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, refs] = await Promise.all([
							getProject({ projectId: coordinates.projectId }),
							(
								perPage === 0 ?
									[]
								: stream === 'heads' ?
									getBranches({
										projectId: coordinates.projectId,
										page,
										perPage,
									})
								:
									getTags({
										projectId: coordinates.projectId,
										page,
										perPage,
									})
							),
						])
						if (project.path !== coordinates.repositoryName || project.path_with_namespace !== coordinates.projectId)
							throw new Error('Gitlab_Rest: project identity does not match remote URL')

						return {
							canonicalRemoteUrl: gitlabCanonicalRemoteUrl(project.http_url_to_repo),
							page,
							perPage,
							refs,
							stream,
							timestampMs: Date.now(),
						}
					},
				},
			},
		})({
			$$refs: {
				select: ({
					canonicalRemoteUrl,
					refs,
					stream,
					timestampMs,
				}) => refs.map((ref) => {
					const refName = `${stream === 'heads' ? 'refs/heads' : 'refs/tags'}/${ref.name}`
					const targetObjectId = `0x${'target' in ref ? ref.target : ref.commit.id}` as const
					const peeledObjectId = (
						'target' in ref && ref.target !== ref.commit.id ?
							`0x${ref.commit.id}` as const
						:
							undefined
					)
					const $repository = {
						canonicalRemoteUrl,
					}
					return {
						[EntityMetaKey.Selector]: {
							$repository,
							refName,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.GitRef, [], 'refKind')]: stream === 'heads' ? 'branch' : 'tag',
							[entityFieldAddressKey(EntityType.GitRef, [], 'targetObjectId')]: targetObjectId,
							[entityFieldAddressKey(EntityType.GitRef, [], '$$observations')]: [
								gitlabRefObservation({
									$repository,
									peeledObjectId,
									protection: gitlabRefProtection(ref),
									refName,
									targetObjectId,
									timestampMs,
								}),
							],
						},
					}
				}),
				continuation: ({
					page,
					perPage,
					refs,
					stream,
				}) => ({
					operation: 'gitlab-refs',
					...gitlabCollectionContinuation({
						page,
						perPage,
						rowCount: refs.length,
						stream,
						streams: ['heads', 'tags'],
					}),
				}),
			},
		}),

		defineResolver({
			entityType: EntityType.GitRepository,
			resolve: {
				CanonicalRemoteUrl: {
					resolve: async ({ canonicalRemoteUrl }, context) => {
						const coordinates = gitlabCoordinatesFromRemoteUrl(canonicalRemoteUrl)
						if (coordinates == null) return undefined

						const {
							page,
							stream,
						} = gitlabCollectionPage(context.providerContinuationToken, ['commits', 'tree'])
						const perPage = resolverContextRowLimit(context)
						const {
							getCommits,
							getProject,
							getRepositoryTree,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, objectPage] = await Promise.all([
							getProject({ projectId: coordinates.projectId }),
							(
								perPage === 0 ?
									[]
								: stream === 'commits' ?
									getCommits({
										projectId: coordinates.projectId,
										page,
										perPage,
									}).then((commits) => commits.map((commit) => ({
										objectId: commit.id,
										objectKind: 'commit',
									})))
								:
									getRepositoryTree({
										page,
										projectId: coordinates.projectId,
										perPage,
									}).then((entries) => entries.map((entry) => ({
										objectId: entry.id,
										objectKind: entry.type,
									})))
							),
						])
						if (project.path !== coordinates.repositoryName || project.path_with_namespace !== coordinates.projectId)
							throw new Error('Gitlab_Rest: project identity does not match remote URL')

						return {
							canonicalRemoteUrl: gitlabCanonicalRemoteUrl(project.http_url_to_repo),
							objectFormat: project.repository_object_format,
							objects: objectPage,
							page,
							perPage,
							stream,
						}
					},
				},
			},
		})({
			$$objects: {
				select: ({
					canonicalRemoteUrl,
					objectFormat,
					objects,
				}) => [...new Map(objects.map((object) => [
					object.objectId,
					object.objectKind,
				] as const)).entries()].map(([objectId, objectKind]) => ({
					[EntityMetaKey.Selector]: {
						objectId: `0x${objectId}`,
						objectFormat,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.GitObject, [], 'objectKind')]: objectKind,
						[entityFieldAddressKey(EntityType.GitObject, [], '$repository')]: {
							[EntityMetaKey.Selector]: {
								canonicalRemoteUrl,
							},
						},
					},
				})),
				continuation: ({
					objects,
					page,
					perPage,
					stream,
				}) => ({
					operation: 'gitlab-objects',
					...gitlabCollectionContinuation({
						page,
						perPage,
						rowCount: objects.length,
						stream,
						streams: ['commits', 'tree'],
					}),
				}),
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

						const targetObjectId = `0x${'target' in ref ? ref.target : ref.commit.id}` as const
						const peeledObjectId = (
							'target' in ref && ref.target !== ref.commit.id ?
								`0x${ref.commit.id}` as const
							:
								undefined
						)
						return {
							$repository,
							refName,
							refKind: branchName != null ? 'branch' : 'tag',
							targetObjectId,
							$$observations: [
								gitlabRefObservation({
									$repository,
									peeledObjectId,
									protection: gitlabRefProtection(ref),
									refName,
									targetObjectId,
									timestampMs: Date.now(),
								}),
							],
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
			$$observations: {
				select: (ref) => ref.$$observations,
				resolveCount: (ref) => ref.$$observations.length,
			},
		}),

		defineResolver({
			entityType: EntityType.GitRemote,
			resolve: {
				RepositoryRemoteName: {
					resolve: async ({
						$repository,
						remoteName,
					}) => {
						if (remoteName !== 'origin')
							return undefined

						const coordinates = gitlabCoordinatesFromRemoteUrl(
							'canonicalRemoteUrl' in $repository ?
								$repository.canonicalRemoteUrl
							:
								$repository.repositoryId
						)
						if (coordinates == null)
							return undefined

						const { getProject } = await import('$/sources/Gitlab/Rest/queries.ts')
						const project = await getProject({ projectId: coordinates.projectId })
						if (project.path !== coordinates.repositoryName || project.path_with_namespace !== coordinates.projectId)
							throw new Error('Gitlab_Rest: project identity does not match remote URL')
						const canonicalRemoteUrl = gitlabCanonicalRemoteUrl(project.http_url_to_repo)

						return {
							$repository,
							remoteName,
							url: canonicalRemoteUrl,
							transportKind: 'https',
							hostKind: 'gitlab.com',
							source: Source.Gitlab_Rest,
						}
					},
				},
			},
		})({
			$repository: (remote) => ({
				[EntityMetaKey.Selector]: remote.$repository,
			}),
			remoteName: (remote) => remote.remoteName,
			url: (remote) => remote.url,
			transportKind: (remote) => remote.transportKind,
			hostKind: (remote) => remote.hostKind,
			source: (remote) => remote.source,
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
			entityType: EntityType.GitForgePipeline,
			resolve: {
				ForgeMirrorPipelineId: {
					resolve: async ({
						$forgeMirror,
						pipelineId,
					}) => {
						const projectId = gitlabProjectIdFromMirror($forgeMirror)
						if (projectId == null) return undefined

						const {
							getPipeline,
							getProject,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, pipeline] = await Promise.all([
							getProject({ projectId }),
							getPipeline({
								projectId,
								pipelineId,
							}),
						])
						if (pipeline.id !== pipelineId || pipeline.project_id !== project.id)
							throw new Error('Gitlab_Rest: pipeline identity does not match selector')

						return {
							$forgeMirror,
							pipelineId,
							pipelineIid: pipeline.iid,
							ref: pipeline.ref,
							commitObjectId: `0x${pipeline.sha}`,
							status: pipeline.status,
							source: pipeline.source,
							url: pipeline.web_url,
							createdAt: gitlabTimestampMs(pipeline.created_at),
							updatedAt: gitlabTimestampMs(pipeline.updated_at),
						}
					},
				},
			},
		})({
			$forgeMirror: (pipeline) => pipeline.$forgeMirror,
			pipelineId: (pipeline) => pipeline.pipelineId,
			pipelineIid: (pipeline) => pipeline.pipelineIid,
			ref: (pipeline) => pipeline.ref,
			commitObjectId: (pipeline) => pipeline.commitObjectId,
			status: (pipeline) => pipeline.status,
			source: (pipeline) => pipeline.source,
			url: (pipeline) => pipeline.url,
			createdAt: (pipeline) => pipeline.createdAt,
			updatedAt: (pipeline) => pipeline.updatedAt,
		}),

		defineResolver({
			entityType: EntityType.GitForgePipeline,
			resolve: {
				ForgeMirrorPipelineId: {
					resolve: async (pipeline, context) => {
						const projectId = gitlabProjectIdFromMirror(pipeline.$forgeMirror)
						if (projectId == null) return undefined

						const page = gitlabPage(context.providerContinuationToken)
						const perPage = resolverContextRowLimit(context)
						const { getPipelineJobs } = await import('$/sources/Gitlab/Rest/queries.ts')
						const jobs = (
							perPage === 0 ?
								[]
							:
								await getPipelineJobs({
									projectId,
									pipelineId: pipeline.pipelineId,
									page,
									perPage,
								})
						)
						if (jobs.some((job) => job.pipeline.id !== pipeline.pipelineId))
							throw new Error('Gitlab_Rest: job pipeline identity does not match selector')

						return {
							jobs,
							page,
							perPage,
						}
					},
				},
			},
		})({
			$$jobs: {
				select: ({ jobs }, pipeline) => jobs.map((job) => ({
					[EntityMetaKey.Selector]: {
						$pipeline: pipeline,
						jobId: job.id,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.GitForgeJob, [], 'name')]: job.name,
						[entityFieldAddressKey(EntityType.GitForgeJob, [], 'stage')]: job.stage,
						[entityFieldAddressKey(EntityType.GitForgeJob, [], 'status')]: job.status,
						[entityFieldAddressKey(EntityType.GitForgeJob, [], 'commitObjectId')]: `0x${job.commit.id}`,
						[entityFieldAddressKey(EntityType.GitForgeJob, [], 'url')]: job.web_url,
						[entityFieldAddressKey(EntityType.GitForgeJob, [], 'createdAt')]: gitlabTimestampMs(job.created_at),
						...(job.started_at != null && {
							[entityFieldAddressKey(EntityType.GitForgeJob, [], 'startedAt')]: gitlabTimestampMs(job.started_at),
						}),
						...(job.finished_at != null && {
							[entityFieldAddressKey(EntityType.GitForgeJob, [], 'finishedAt')]: gitlabTimestampMs(job.finished_at),
						}),
						...(job.duration != null && {
							[entityFieldAddressKey(EntityType.GitForgeJob, [], 'durationSeconds')]: job.duration,
						}),
						...(job.queued_duration != null && {
							[entityFieldAddressKey(EntityType.GitForgeJob, [], 'queuedDurationSeconds')]: job.queued_duration,
						}),
					},
				})),
				continuation: ({
					jobs,
					page,
					perPage,
				}) => ({
					operation: 'gitlab-pipeline-jobs',
					terminal: perPage === 0 || jobs.length < perPage,
					...(jobs.length === perPage && { token: String(page + 1) }),
				}),
			},
		}),

		defineResolver({
			entityType: EntityType.GitForgeJob,
			resolve: {
				PipelineJobId: {
					resolve: async ({
						$pipeline,
						jobId,
					}) => {
						const projectId = gitlabProjectIdFromMirror($pipeline.$forgeMirror)
						if (projectId == null) return undefined

						const { getJob } = await import('$/sources/Gitlab/Rest/queries.ts')
						const job = await getJob({
							projectId,
							jobId,
						})
						if (job.id !== jobId || job.pipeline.id !== $pipeline.pipelineId)
							throw new Error('Gitlab_Rest: job identity does not match selector')

						return {
							$pipeline,
							jobId,
							name: job.name,
							stage: job.stage,
							status: job.status,
							commitObjectId: `0x${job.commit.id}`,
							url: job.web_url,
							createdAt: gitlabTimestampMs(job.created_at),
							...(job.started_at != null && { startedAt: gitlabTimestampMs(job.started_at) }),
							...(job.finished_at != null && { finishedAt: gitlabTimestampMs(job.finished_at) }),
							...(job.duration != null && { durationSeconds: job.duration }),
							...(job.queued_duration != null && { queuedDurationSeconds: job.queued_duration }),
						}
					},
				},
			},
		})({
			$pipeline: (job) => job.$pipeline,
			jobId: (job) => job.jobId,
			name: (job) => job.name,
			stage: (job) => job.stage,
			status: (job) => job.status,
			commitObjectId: (job) => job.commitObjectId,
			url: (job) => job.url,
			createdAt: (job) => job.createdAt,
			startedAt: (job) => job.startedAt,
			finishedAt: (job) => job.finishedAt,
			durationSeconds: (job) => job.durationSeconds,
			queuedDurationSeconds: (job) => job.queuedDurationSeconds,
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

						const {
							getIssue,
							getProject,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, issue] = await Promise.all([
							getProject({ projectId }),
							getIssue({
								projectId,
								issueNumber,
							}),
						])
						if (issue.iid !== issueNumber || issue.project_id !== project.id)
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
			entityType: EntityType.GitForgeProtectedBranch,
			resolve: {
				ForgeMirrorName: {
					resolve: async ({
						$forgeMirror,
						name,
					}) => {
						const projectId = gitlabProjectIdFromMirror($forgeMirror)
						if (projectId == null) return undefined

						const { getProtectedBranch } = await import('$/sources/Gitlab/Rest/queries.ts')
						const protectedBranch = await getProtectedBranch({
							projectId,
							branchName: name,
						})
						if (protectedBranch.name !== name)
							throw new Error('Gitlab_Rest: protected branch identity does not match selector')

						return {
							$forgeMirror,
							name,
							providerProtectedBranchId: String(protectedBranch.id),
							pushAccessDescriptions: protectedBranch.push_access_levels.map((access) => access.access_level_description),
							mergeAccessDescriptions: protectedBranch.merge_access_levels.map((access) => access.access_level_description),
							unprotectAccessDescriptions: (protectedBranch.unprotect_access_levels ?? []).map((access) => access.access_level_description),
							allowForcePush: protectedBranch.allow_force_push,
							codeOwnerApprovalRequired: protectedBranch.code_owner_approval_required,
							...(protectedBranch.inherited != null && { inherited: protectedBranch.inherited }),
						}
					},
				},
			},
		})({
			$forgeMirror: (protectedBranch) => protectedBranch.$forgeMirror,
			name: (protectedBranch) => protectedBranch.name,
			providerProtectedBranchId: (protectedBranch) => protectedBranch.providerProtectedBranchId,
			pushAccessDescriptions: (protectedBranch) => protectedBranch.pushAccessDescriptions,
			mergeAccessDescriptions: (protectedBranch) => protectedBranch.mergeAccessDescriptions,
			unprotectAccessDescriptions: (protectedBranch) => protectedBranch.unprotectAccessDescriptions,
			allowForcePush: (protectedBranch) => protectedBranch.allowForcePush,
			codeOwnerApprovalRequired: (protectedBranch) => protectedBranch.codeOwnerApprovalRequired,
			inherited: (protectedBranch) => protectedBranch.inherited,
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

						const {
							getMergeRequest,
							getProject,
						} = await import('$/sources/Gitlab/Rest/queries.ts')
						const [project, mergeRequest] = await Promise.all([
							getProject({ projectId }),
							getMergeRequest({
								projectId,
								pullRequestNumber,
							}),
						])
						if (mergeRequest.iid !== pullRequestNumber || mergeRequest.project_id !== project.id)
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
							draft: false,
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
			draft: (release) => release.draft,
			authorSelector: (release) => release.authorSelector,
			createdAt: (release) => release.createdAt,
			publishedAt: (release) => release.publishedAt,
		}),

		defineResolver({
			entityType: EntityType.GitForgeCompare,
			resolve: {
				ForgeMirrorFromObjectIdToObjectId: {
					resolve: async ({
						$forgeMirror,
						fromObjectId,
						toObjectId,
					}) => {
						const comparison = await gitlabCompareFromMirror({
							$forgeMirror,
							fromObjectId,
							toObjectId,
						})
						if (comparison == null)
							return undefined

						const fromCommit = gitCommitRefFromObjectId(fromObjectId)
						const toCommit = gitCommitRefFromObjectId(toObjectId)
						const compareSelector = {
							$forgeMirror,
							fromObjectId,
							toObjectId,
						}

						return {
							$forgeMirror,
							fromObjectId,
							toObjectId,
							$fromCommit: fromCommit,
							$toCommit: toCommit,
							sameRef: comparison.compare_same_ref,
							timedOut: comparison.compare_timeout,
							$$commits: comparison.commits.map((commit) => (
								gitCommitRefFromObjectId(gitlabGitObjectId(commit.id))
							)),
							$$fileChanges: comparison.diffs.map((diff) => ({
								[EntityMetaKey.Selector]: {
									$compare: compareSelector,
									oldPath: diff.old_path,
									newPath: diff.new_path,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.GitForgeCompareFileChange, [], 'oldMode')]: diff.a_mode,
									[entityFieldAddressKey(EntityType.GitForgeCompareFileChange, [], 'newMode')]: diff.b_mode,
									[entityFieldAddressKey(EntityType.GitForgeCompareFileChange, [], 'newFile')]: diff.new_file,
									[entityFieldAddressKey(EntityType.GitForgeCompareFileChange, [], 'renamedFile')]: diff.renamed_file,
									[entityFieldAddressKey(EntityType.GitForgeCompareFileChange, [], 'deletedFile')]: diff.deleted_file,
									...(diff.too_large != null && {
										[entityFieldAddressKey(EntityType.GitForgeCompareFileChange, [], 'tooLarge')]: diff.too_large,
									}),
									...(diff.diff !== '' && {
										[entityFieldAddressKey(EntityType.GitForgeCompareFileChange, [], 'patch')]: diff.diff,
									}),
								},
							})),
						}
					},
				},
			},
		})({
			$forgeMirror: (comparison) => comparison.$forgeMirror,
			fromObjectId: (comparison) => comparison.fromObjectId,
			toObjectId: (comparison) => comparison.toObjectId,
			$fromCommit: (comparison) => comparison.$fromCommit,
			$toCommit: (comparison) => comparison.$toCommit,
			sameRef: (comparison) => comparison.sameRef,
			timedOut: (comparison) => comparison.timedOut,
			$$commits: {
				select: (comparison) => comparison.$$commits,
				resolveCount: (comparison) => comparison.$$commits.length,
			},
			$$fileChanges: (comparison) => comparison.$$fileChanges,
		}),

		defineResolver({
			entityType: EntityType.GitForgeCompareFileChange,
			resolve: {
				CompareOldPathNewPath: {
					resolve: async ({
						$compare,
						oldPath,
						newPath,
					}) => {
						const comparison = await gitlabCompareFromMirror($compare)
						if (comparison == null)
							return undefined

						const diff = comparison.diffs.find((candidate) => (
							candidate.old_path === oldPath
							&& candidate.new_path === newPath
						))
						if (diff == null)
							throw new Error('Gitlab_Rest: file change is not in this comparison')

						return {
							$compare,
							oldPath,
							newPath,
							oldMode: diff.a_mode,
							newMode: diff.b_mode,
							newFile: diff.new_file,
							renamedFile: diff.renamed_file,
							deletedFile: diff.deleted_file,
							...(diff.too_large != null && {
								tooLarge: diff.too_large,
							}),
							...(diff.diff !== '' && {
								patch: diff.diff,
							}),
						}
					},
				},
			},
		})({
			$compare: (fileChange) => fileChange.$compare,
			oldPath: (fileChange) => fileChange.oldPath,
			newPath: (fileChange) => fileChange.newPath,
			oldMode: (fileChange) => fileChange.oldMode,
			newMode: (fileChange) => fileChange.newMode,
			newFile: (fileChange) => fileChange.newFile,
			renamedFile: (fileChange) => fileChange.renamedFile,
			deletedFile: (fileChange) => fileChange.deletedFile,
			tooLarge: (fileChange) => fileChange.tooLarge,
			patch: (fileChange) => fileChange.patch,
		}),
	],
} satisfies RegisteredSourceResolverModule
