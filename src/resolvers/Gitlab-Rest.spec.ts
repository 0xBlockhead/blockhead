import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const {
	getBranches,
	getBranch,
	getCommitSignature,
	getCommits,
	getIssue,
	getIssues,
	getMergeRequest,
	getMergeRequests,
	getJob,
	getPipeline,
	getPipelineJobs,
	getPipelines,
	getProject,
	getRelease,
	getReleases,
	getRepositoryTree,
	getTag,
	getTags,
} = vi.hoisted(() => ({
	getBranches: vi.fn(),
	getBranch: vi.fn(),
	getCommitSignature: vi.fn(),
	getCommits: vi.fn(),
	getIssue: vi.fn(),
	getIssues: vi.fn(),
	getMergeRequest: vi.fn(),
	getMergeRequests: vi.fn(),
	getJob: vi.fn(),
	getPipeline: vi.fn(),
	getPipelineJobs: vi.fn(),
	getPipelines: vi.fn(),
	getProject: vi.fn(),
	getRelease: vi.fn(),
	getReleases: vi.fn(),
	getRepositoryTree: vi.fn(),
	getTag: vi.fn(),
	getTags: vi.fn(),
}))

vi.mock('$/sources/Gitlab/Rest/queries.ts', () => ({
	getBranches,
	getBranch,
	getCommitSignature,
	getCommits,
	getIssue,
	getIssues,
	getMergeRequest,
	getMergeRequests,
	getJob,
	getPipeline,
	getPipelineJobs,
	getPipelines,
	getProject,
	getRelease,
	getReleases,
	getRepositoryTree,
	getTag,
	getTags,
}))

const resolverModule = (await import('$/resolvers/Gitlab-Rest.ts')).default
const mirrorResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgeMirror)
const mirrorIssuesResolver = resolverModule.resolvers.find((resolver) => '$$issues' in resolver.projections)
const mirrorPipelinesResolver = resolverModule.resolvers.find((resolver) => '$$pipelines' in resolver.projections)
const mirrorPullRequestsResolver = resolverModule.resolvers.find((resolver) => '$$pullRequests' in resolver.projections)
const mirrorReleasesResolver = resolverModule.resolvers.find((resolver) => '$$releases' in resolver.projections)
const repositoryResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitRepository && 'objectFormat' in resolver.projections)
const repositoryRefsResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitRepository && '$$refs' in resolver.projections)
const repositoryObjectsResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitRepository && '$$objects' in resolver.projections)
const remoteResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitRemote)
const refResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitRef)
const pathResolutionResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitTreePathResolution)
const issueResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgeIssue)
const pullRequestResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgePullRequest)
const pipelineResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgePipeline && 'pipelineIid' in resolver.projections)
const pipelineJobsResolver = resolverModule.resolvers.find((resolver) => '$$jobs' in resolver.projections)
const jobResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgeJob)
const releaseResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgeRelease)
const signatureResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitSignature)
if (
	mirrorResolver == null
	|| repositoryResolver == null
	|| mirrorIssuesResolver == null
	|| mirrorPipelinesResolver == null
	|| mirrorPullRequestsResolver == null
	|| mirrorReleasesResolver == null
	|| repositoryRefsResolver == null
	|| repositoryObjectsResolver == null
	|| remoteResolver == null
	|| refResolver == null
	|| pathResolutionResolver == null
	|| issueResolver == null
	|| pullRequestResolver == null
	|| pipelineResolver == null
	|| pipelineJobsResolver == null
	|| jobResolver == null
	|| releaseResolver == null
	|| signatureResolver == null
)
	throw new Error('GitLab repository-journey resolvers must all be registered')

const project = {
	id: 278964,
	path: 'gitlab',
	path_with_namespace: 'gitlab-org/gitlab',
	default_branch: 'master',
	visibility: 'public',
	http_url_to_repo: 'https://gitlab.com/gitlab-org/gitlab.git',
	ssh_url_to_repo: 'git@gitlab.com:gitlab-org/gitlab.git',
	web_url: 'https://gitlab.com/gitlab-org/gitlab',
	repository_object_format: 'sha1',
}
const observationTimestampMs = Date.parse('2026-08-14T00:00:00Z')
const dateNow = vi.spyOn(Date, 'now')

describe('GitLab repository journey', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		dateNow.mockReturnValue(observationTimestampMs)
		getProject.mockResolvedValue(project)
		getBranches.mockResolvedValue([
			{
				name: 'master',
				commit: {
					id: 'a'.repeat(40),
					committed_date: '2026-04-01T00:00:00Z',
				},
			},
			{
				name: 'stable',
				commit: {
					id: 'b'.repeat(40),
					committed_date: '2026-04-02T00:00:00Z',
				},
			},
		])
		getRepositoryTree.mockImplementation(({
			path,
			recursive,
		}: {
			path?: string
			recursive?: boolean
		}) => Promise.resolve(
			recursive !== false ?
				[
					{
						id: 'c'.repeat(40),
						name: 'src',
						type: 'tree',
						path: 'src',
						mode: '040000',
					},
					{
						id: 'd'.repeat(40),
						name: 'index.ts',
						type: 'blob',
						path: 'src/index.ts',
						mode: '100644',
					},
				]
			: path === 'src' ?
				[{
					id: 'd'.repeat(40),
					name: 'index.ts',
					type: 'blob',
					path: 'src/index.ts',
					mode: '100644',
				}]
			:
				[{
					id: 'c'.repeat(40),
					name: 'src',
					type: 'tree',
					path: 'src',
					mode: '040000',
				}]
		))
		getCommits.mockResolvedValue([
			{
				id: 'f'.repeat(40),
				short_id: 'f'.repeat(8),
				title: 'Connect complete commit history',
				message: 'Connect complete commit history',
				parent_ids: ['a'.repeat(40)],
				author_name: 'Commit Author',
				author_email: 'author@example.com',
				authored_date: '2026-04-01T00:00:00Z',
				committer_name: 'Committer',
				committer_email: 'committer@example.com',
				committed_date: '2026-04-01T00:00:00Z',
				web_url: 'https://gitlab.com/gitlab-org/gitlab/-/commit/' + 'f'.repeat(40),
			},
		])
		getTags.mockResolvedValue([
			{
				name: 'v1.0.0',
				target: 'e'.repeat(40),
				message: 'Version 1.0.0',
				commit: {
					id: 'e'.repeat(40),
					committed_date: '2026-04-03T00:00:00Z',
				},
			},
		])
		getBranch.mockResolvedValue({
			name: 'master',
			protected: true,
			developers_can_push: false,
			developers_can_merge: true,
			commit: {
				id: 'a'.repeat(40),
				committed_date: '2026-04-01T00:00:00Z',
			},
		})
		getTag.mockResolvedValue({
			name: 'v1.0.0',
			target: 'e'.repeat(40),
			message: 'Version 1.0.0',
			protected: false,
			commit: {
				id: 'e'.repeat(40),
				committed_date: '2026-04-03T00:00:00Z',
			},
		})
		getIssue.mockResolvedValue({
			iid: 12,
			project_id: project.id,
			title: 'Preserve native repository links',
			state: 'closed',
			labels: [
				'architecture',
			],
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-02T00:00:00Z',
			closed_at: '2026-01-03T00:00:00Z',
			author: {
				id: 7,
				username: 'issue-author',
				name: 'Issue Author',
				web_url: 'https://gitlab.com/issue-author',
			},
		})
		getIssues.mockResolvedValue([])
		getMergeRequest.mockResolvedValue({
			iid: 34,
			project_id: project.id,
			title: 'Connect the repository graph',
			state: 'merged',
			target_branch: 'master',
			source_branch: 'native-repository-links',
			sha: 'c'.repeat(40),
			created_at: '2026-02-01T00:00:00Z',
			updated_at: '2026-02-02T00:00:00Z',
			merged_at: '2026-02-03T00:00:00Z',
			author: {
				id: 8,
				username: 'merge-author',
				name: 'Merge Author',
				web_url: 'https://gitlab.com/merge-author',
			},
		})
		getMergeRequests.mockResolvedValue([])
		getRelease.mockResolvedValue({
			tag_name: 'v1.0.0',
			name: 'Version 1.0.0',
			created_at: '2026-03-01T00:00:00Z',
			released_at: '2026-03-02T00:00:00Z',
			commit: {
				id: 'd'.repeat(40),
			},
			author: {
				id: 9,
				username: 'release-author',
				name: 'Release Author',
				web_url: 'https://gitlab.com/release-author',
			},
		})
		getReleases.mockResolvedValue([])
		getPipeline.mockResolvedValue({
			id: 91,
			iid: 17,
			project_id: project.id,
			sha: 'a'.repeat(40),
			ref: 'master',
			status: 'success',
			source: 'push',
			created_at: '2026-08-12T00:00:00Z',
			updated_at: '2026-08-12T00:01:00Z',
			web_url: 'https://gitlab.com/gitlab-org/gitlab/-/pipelines/91',
		})
		getPipelines.mockResolvedValue([])
		getJob.mockResolvedValue({
			id: 123,
			name: 'test',
			stage: 'verify',
			status: 'success',
			created_at: '2026-08-12T00:02:00Z',
			started_at: '2026-08-12T00:02:30Z',
			finished_at: '2026-08-12T00:03:30Z',
			duration: 60,
			queued_duration: 30,
			web_url: 'https://gitlab.com/gitlab-org/gitlab/-/jobs/123',
			commit: { id: 'a'.repeat(40) },
			pipeline: {
				id: 91,
				sha: 'a'.repeat(40),
				ref: 'master',
				status: 'success',
			},
		})
		getPipelineJobs.mockResolvedValue([])
	})

	it('links the forge mirror to its canonical repository with provider provenance', async () => {
		const snapshot = await mirrorResolver.resolve.ForgeHostOwnerRepositoryName.resolve({
			forgeHost: 'gitlab.com',
			owner: 'gitlab-org',
			repositoryName: 'gitlab',
		})

		expect(snapshot).toMatchObject({
			forgeHost: 'gitlab.com',
			owner: 'gitlab-org',
			repositoryName: 'gitlab',
			defaultBranch: 'master',
			visibility: 'public',
			htmlUrl: 'https://gitlab.com/gitlab-org/gitlab',
			providerRepositoryId: '278964',
			source: Source.Gitlab_Rest,
			$gitRepository: {
				[EntityMetaKey.Selector]: {
					canonicalRemoteUrl: project.http_url_to_repo,
				},
			},
		})
		expect(snapshot?.cloneUrls).toEqual([
			project.http_url_to_repo,
			project.ssh_url_to_repo,
		])
	})

	it('materializes lifecycle cards in the repository hierarchy without detail refetches', async () => {
		getIssues.mockResolvedValueOnce([{
			iid: 12,
			project_id: project.id,
			title: 'Preserve native repository links',
			state: 'closed',
			labels: ['architecture'],
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-02T00:00:00Z',
			closed_at: '2026-01-03T00:00:00Z',
		}])
		getMergeRequests.mockResolvedValueOnce([{
			iid: 34,
			project_id: project.id,
			title: 'Connect the repository graph',
			state: 'merged',
			target_branch: 'master',
			source_branch: 'native-repository-links',
			sha: 'c'.repeat(40),
			created_at: '2026-02-01T00:00:00Z',
			updated_at: '2026-02-02T00:00:00Z',
			merged_at: '2026-02-03T00:00:00Z',
		}])
		getReleases.mockResolvedValueOnce([{
			tag_name: 'v1.0.0',
			name: 'Version 1.0.0',
			created_at: '2026-03-01T00:00:00Z',
			released_at: '2026-03-02T00:00:00Z',
			commit: { id: 'd'.repeat(40) },
		}])

		const selector = {
			forgeHost: 'gitlab.com',
			owner: 'gitlab-org',
			repositoryName: 'gitlab',
		}
		const pageContext = {
			filters: [],
			sorts: [],
			pagination: { limit: 1 },
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const issuePage = await mirrorIssuesResolver.resolve.ForgeHostOwnerRepositoryName.resolve(selector, pageContext)
		const pullRequestPage = await mirrorPullRequestsResolver.resolve.ForgeHostOwnerRepositoryName.resolve(selector, pageContext)
		const releasePage = await mirrorReleasesResolver.resolve.ForgeHostOwnerRepositoryName.resolve(selector, pageContext)
		if (issuePage == null || pullRequestPage == null || releasePage == null)
			throw new Error('GitLab lifecycle pages must resolve')
		const issues = mirrorIssuesResolver.projections.$$issues.select(issuePage, selector, pageContext)
		const pullRequests = mirrorPullRequestsResolver.projections.$$pullRequests.select(pullRequestPage, selector, pageContext)
		const releases = mirrorReleasesResolver.projections.$$releases.select(releasePage, selector, pageContext)

		expect(issues[0]).toMatchObject({
			[EntityMetaKey.Selector]: { issueNumber: 12 },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.GitForgeIssue, [], 'state')]: 'closed',
			},
		})
		expect(pullRequests[0]).toMatchObject({
			[EntityMetaKey.Selector]: { pullRequestNumber: 34 },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.GitForgePullRequest, [], 'headObjectId')]: `0x${'c'.repeat(40)}`,
			},
		})
		expect(releases[0]).toMatchObject({
			[EntityMetaKey.Selector]: { releaseTagName: 'v1.0.0' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.GitForgeRelease, [], 'targetObjectId')]: `0x${'d'.repeat(40)}`,
				[entityFieldAddressKey(EntityType.GitForgeRelease, [], 'draft')]: false,
			},
		})
		expect(getIssues).toHaveBeenCalledWith(expect.objectContaining({ page: 1, perPage: 1 }))
		expect(getMergeRequests).toHaveBeenCalledWith(expect.objectContaining({ page: 1, perPage: 1 }))
		expect(getReleases).toHaveBeenCalledWith(expect.objectContaining({ page: 1, perPage: 1 }))
		expect(mirrorIssuesResolver.projections.$$issues.continuation?.(issuePage, selector, pageContext)).toEqual({
			operation: 'gitlab-issues',
			terminal: false,
			token: '2',
		})
		expect(mirrorPullRequestsResolver.projections.$$pullRequests.continuation?.(pullRequestPage, selector, pageContext)).toEqual({
			operation: 'gitlab-merge-requests',
			terminal: false,
			token: '2',
		})
		expect(mirrorReleasesResolver.projections.$$releases.continuation?.(releasePage, selector, pageContext)).toEqual({
			operation: 'gitlab-releases',
			terminal: false,
			token: '2',
		})
	})

	it('materializes the pipeline and job hierarchy from GitLab lifecycle authority', async () => {
		getPipelines.mockResolvedValueOnce([await getPipeline()])
		getPipelineJobs.mockResolvedValueOnce([await getJob()])
		const mirror = {
			forgeHost: 'gitlab.com',
			owner: 'gitlab-org',
			repositoryName: 'gitlab',
		}
		const context = {
			filters: [],
			sorts: [],
			pagination: { limit: 1 },
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const pipelinePage = await mirrorPipelinesResolver.resolve.ForgeHostOwnerRepositoryName.resolve(mirror, context)
		if (pipelinePage == null)
			throw new Error('GitLab pipeline page must resolve')
		const pipelineReference = mirrorPipelinesResolver.projections.$$pipelines.select(pipelinePage, mirror, context)[0]
		const pipelineSelector = {
			$forgeMirror: mirror,
			pipelineId: 91,
		}
		const pipeline = await pipelineResolver.resolve.ForgeMirrorPipelineId.resolve(pipelineSelector)
		const jobPage = await pipelineJobsResolver.resolve.ForgeMirrorPipelineId.resolve(pipelineSelector, context)
		if (jobPage == null)
			throw new Error('GitLab job page must resolve')
		const jobReference = pipelineJobsResolver.projections.$$jobs.select(jobPage, pipelineSelector, context)[0]
		const job = await jobResolver.resolve.PipelineJobId.resolve({
			$pipeline: pipelineSelector,
			jobId: 123,
		})

		expect(pipelineReference).toMatchObject({
			[EntityMetaKey.Selector]: { pipelineId: 91 },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'status')]: 'success',
				[entityFieldAddressKey(EntityType.GitForgePipeline, [], 'commitObjectId')]: `0x${'a'.repeat(40)}`,
			},
		})
		expect(pipeline).toMatchObject({
			pipelineId: 91,
			pipelineIid: 17,
			status: 'success',
		})
		expect(jobReference).toMatchObject({
			[EntityMetaKey.Selector]: { jobId: 123 },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.GitForgeJob, [], 'name')]: 'test',
				[entityFieldAddressKey(EntityType.GitForgeJob, [], 'durationSeconds')]: 60,
			},
		})
		expect(job).toMatchObject({
			jobId: 123,
			name: 'test',
			stage: 'verify',
			status: 'success',
		})
		expect(mirrorPipelinesResolver.projections.$$pipelines.continuation?.(pipelinePage, mirror, context)).toEqual({
			operation: 'gitlab-pipelines',
			terminal: false,
			token: '2',
		})
	})

	it('resolves the canonical repository into provider object format and origin remote', async () => {
		const snapshot = await repositoryResolver.resolve.CanonicalRemoteUrl.resolve({
			canonicalRemoteUrl: project.http_url_to_repo,
		})

		expect(snapshot).toMatchObject({
			repositoryId: project.http_url_to_repo,
			canonicalRemoteUrl: project.http_url_to_repo,
			objectFormat: 'sha1',
			defaultRefName: 'refs/heads/master',
		})
		if (snapshot == null)
			throw new Error('GitLab repository snapshot must resolve')
		expect(repositoryResolver.projections.$$remotes.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$repository: {
					canonicalRemoteUrl: project.http_url_to_repo,
				},
				remoteName: 'origin',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.GitRemote, [], 'url')]: project.http_url_to_repo,
				[entityFieldAddressKey(EntityType.GitRemote, [], 'transportKind')]: 'https',
				[entityFieldAddressKey(EntityType.GitRemote, [], 'hostKind')]: 'gitlab.com',
				[entityFieldAddressKey(EntityType.GitRemote, [], 'source')]: Source.Gitlab_Rest,
			},
		}])
		expect(repositoryResolver.projections.$$remotes.resolveCount(snapshot)).toBe(1)
		expect(getBranches).not.toHaveBeenCalled()
		expect(getTags).not.toHaveBeenCalled()
		expect(getCommits).not.toHaveBeenCalled()
		expect(getRepositoryTree).not.toHaveBeenCalled()
	})

	it('paginates native branch then tag refs with source-clocked protection observations', async () => {
		getBranches.mockResolvedValueOnce([
			{
				name: 'master',
				protected: true,
				developers_can_push: false,
				developers_can_merge: true,
				commit: {
					id: 'a'.repeat(40),
					committed_date: '2026-04-01T00:00:00Z',
				},
			},
			{
				name: 'stable',
				protected: false,
				commit: {
					id: 'b'.repeat(40),
					committed_date: '2026-04-02T00:00:00Z',
				},
			},
		])
		const selector = {
			canonicalRemoteUrl: project.http_url_to_repo,
		}
		const pageContext = {
			filters: [],
			sorts: [],
			pagination: { limit: 2 },
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const branchPage = await repositoryRefsResolver.resolve.CanonicalRemoteUrl.resolve(selector, pageContext)
		if (branchPage == null)
			throw new Error('GitLab branch page must resolve')
		const branches = repositoryRefsResolver.projections.$$refs.select(branchPage, selector, pageContext)
		expect(branches).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$repository: selector,
					refName: 'refs/heads/master',
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.GitRef, [], 'refKind')]: 'branch',
					[entityFieldAddressKey(EntityType.GitRef, [], 'targetObjectId')]: `0x${'a'.repeat(40)}`,
				}),
			},
			{
				[EntityMetaKey.Selector]: {
					$repository: selector,
					refName: 'refs/heads/stable',
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.GitRef, [], 'refKind')]: 'branch',
					[entityFieldAddressKey(EntityType.GitRef, [], 'targetObjectId')]: `0x${'b'.repeat(40)}`,
				}),
			},
		])
		expect(branches[0][EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.GitRef, [], '$$observations')
		][0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$ref: {
					$repository: selector,
					refName: 'refs/heads/master',
				},
				timestampMs: observationTimestampMs,
				source: Source.Gitlab_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'targetObjectId')]: `0x${'a'.repeat(40)}`,
				[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'advertised')]: true,
				[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'protection')]: {
					protected: true,
					developersCanPush: false,
					developersCanMerge: true,
				},
			},
		})
		expect(repositoryRefsResolver.projections.$$refs.continuation?.(branchPage, selector, pageContext)).toEqual({
			operation: 'gitlab-refs',
			terminal: false,
			token: 'heads:2',
		})

		getTags.mockResolvedValueOnce([{
			name: 'v1.0.0',
			target: 'e'.repeat(40),
			message: 'Version 1.0.0',
			protected: true,
			commit: {
				id: 'c'.repeat(40),
				committed_date: '2026-04-03T00:00:00Z',
			},
		}])
		const tagContext = {
			...pageContext,
			providerContinuationToken: 'tags:1',
		}
		const tagPage = await repositoryRefsResolver.resolve.CanonicalRemoteUrl.resolve(selector, tagContext)
		if (tagPage == null)
			throw new Error('GitLab tag page must resolve')
		const tags = repositoryRefsResolver.projections.$$refs.select(tagPage, selector, tagContext)
		expect(tags[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				refName: 'refs/tags/v1.0.0',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.GitRef, [], 'refKind')]: 'tag',
				[entityFieldAddressKey(EntityType.GitRef, [], 'targetObjectId')]: `0x${'e'.repeat(40)}`,
			},
		})
		expect(tags[0][EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.GitRef, [], '$$observations')
		][0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'peeledObjectId')]: `0x${'c'.repeat(40)}`,
			[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'protection')]: {
				protected: true,
			},
		})
		expect(repositoryRefsResolver.projections.$$refs.continuation?.(tagPage, selector, tagContext)).toEqual({
			operation: 'gitlab-refs',
			terminal: true,
		})
		expect(getBranches).toHaveBeenCalledWith({
			projectId: 'gitlab-org/gitlab',
			page: 1,
			perPage: 2,
		})
		expect(getTags).toHaveBeenCalledWith({
			projectId: 'gitlab-org/gitlab',
			page: 1,
			perPage: 2,
		})
	})

	it('paginates commit then tree objects without claiming a windowed total', async () => {
		const selector = {
			canonicalRemoteUrl: project.http_url_to_repo,
		}
		const pageContext = {
			filters: [],
			sorts: [],
			pagination: { limit: 1 },
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const commitPage = await repositoryObjectsResolver.resolve.CanonicalRemoteUrl.resolve(selector, pageContext)
		if (commitPage == null)
			throw new Error('GitLab commit page must resolve')
		expect(repositoryObjectsResolver.projections.$$objects.select(commitPage, selector, pageContext)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					objectId: `0x${'f'.repeat(40)}`,
					objectFormat: 'sha1',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.GitObject, [], 'objectKind')]: 'commit',
					[entityFieldAddressKey(EntityType.GitObject, [], '$repository')]: {
						[EntityMetaKey.Selector]: selector,
					},
				},
			},
		])
		expect(repositoryObjectsResolver.projections.$$objects.continuation?.(commitPage, selector, pageContext)).toEqual({
			operation: 'gitlab-objects',
			terminal: false,
			token: 'commits:2',
		})

		const treeContext = {
			...pageContext,
			providerContinuationToken: 'tree:1',
		}
		const treePage = await repositoryObjectsResolver.resolve.CanonicalRemoteUrl.resolve(selector, treeContext)
		if (treePage == null)
			throw new Error('GitLab tree page must resolve')
		expect(repositoryObjectsResolver.projections.$$objects.select(treePage, selector, treeContext)).toEqual(expect.arrayContaining([
			{
				[EntityMetaKey.Selector]: {
					objectId: `0x${'c'.repeat(40)}`,
					objectFormat: 'sha1',
				},
				[EntityMetaKey.Fields]: expect.any(Object),
			},
			{
				[EntityMetaKey.Selector]: {
					objectId: `0x${'d'.repeat(40)}`,
					objectFormat: 'sha1',
				},
				[EntityMetaKey.Fields]: expect.any(Object),
			},
		]))
		expect(getCommits).toHaveBeenCalledWith({
			projectId: 'gitlab-org/gitlab',
			page: 1,
			perPage: 1,
		})
		expect(getRepositoryTree).toHaveBeenCalledWith({
			page: 1,
			projectId: 'gitlab-org/gitlab',
			perPage: 1,
		})
		expect('resolveCount' in repositoryObjectsResolver.projections.$$objects).toBe(false)
	})

	it('does not claim non-GitLab forge or remote authority', async () => {
		await expect(mirrorResolver.resolve.ForgeHostOwnerRepositoryName.resolve({
			forgeHost: 'codeberg.org',
			owner: 'forgejo',
			repositoryName: 'forgejo',
		})).resolves.toBeUndefined()
		await expect(repositoryResolver.resolve.CanonicalRemoteUrl.resolve({
			canonicalRemoteUrl: 'https://codeberg.org/forgejo/forgejo.git',
		})).resolves.toBeUndefined()
		expect(getProject).not.toHaveBeenCalled()
	})

	it('does not collapse noncanonical GitLab transport identities into the public repository owner', async () => {
		for (const canonicalRemoteUrl of [
			'http://gitlab.com/gitlab-org/gitlab.git',
			'https://gitlab.com:8443/gitlab-org/gitlab.git',
			'https://user:password@gitlab.com/gitlab-org/gitlab.git',
			'https://gitlab.com/gitlab-org/gitlab.git?ref=main',
			'https://gitlab.com/gitlab-org/gitlab.git#readme',
		])
			await expect(repositoryResolver.resolve.CanonicalRemoteUrl.resolve({
				canonicalRemoteUrl,
			})).resolves.toBeUndefined()

		expect(getProject).not.toHaveBeenCalled()
	})

	it('resolves nested GitLab namespaces through exact path identity', async () => {
		getProject.mockResolvedValueOnce({
			...project,
			path: 'project',
			path_with_namespace: 'gitlab-org/security/project',
			http_url_to_repo: 'https://gitlab.com/gitlab-org/security/project.git',
			web_url: 'https://gitlab.com/gitlab-org/security/project',
		})
		await expect(mirrorResolver.resolve.ForgeHostOwnerRepositoryName.resolve({
			forgeHost: 'gitlab.com',
			owner: 'gitlab-org/security',
			repositoryName: 'project',
		})).resolves.toMatchObject({
			owner: 'gitlab-org/security',
			repositoryName: 'project',
			$gitRepository: {
				[EntityMetaKey.Selector]: {
					canonicalRemoteUrl: 'https://gitlab.com/gitlab-org/security/project.git',
				},
			},
		})
		expect(getProject).toHaveBeenCalledWith({ projectId: 'gitlab-org/security/project' })
	})

	it('resolves the canonical origin remote and rejects unrelated remote names', async () => {
		const $repository = {
			canonicalRemoteUrl: project.http_url_to_repo,
		}
		await expect(remoteResolver.resolve.RepositoryRemoteName.resolve({
			$repository,
			remoteName: 'origin',
		})).resolves.toMatchObject({
			remoteName: 'origin',
			url: project.http_url_to_repo,
			transportKind: 'https',
			hostKind: 'gitlab.com',
			source: Source.Gitlab_Rest,
		})
		await expect(remoteResolver.resolve.RepositoryRemoteName.resolve({
			$repository,
			remoteName: 'upstream',
		})).resolves.toBeUndefined()
	})

	it('fails closed when issue or merge-request project identity does not match the mirror', async () => {
		getIssue.mockResolvedValueOnce({
			iid: 12,
			project_id: 1,
			title: 'Foreign issue',
			state: 'opened',
			labels: [],
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-01T00:00:00Z',
			closed_at: null,
		})
		await expect(issueResolver.resolve.ForgeMirrorIssueNumber.resolve({
			$forgeMirror: {
				forgeHost: 'gitlab.com',
				owner: 'gitlab-org',
				repositoryName: 'gitlab',
			},
			issueNumber: 12,
		})).rejects.toThrow('issue identity does not match selector')
	})

	it('resolves branch and tag routes into current native ref observations', async () => {
		const $repository = {
			canonicalRemoteUrl: project.http_url_to_repo,
		}
		const branch = await refResolver.resolve.RepositoryRefName.resolve({
			$repository,
			refName: 'refs/heads/master',
		})
		const tag = await refResolver.resolve.RepositoryRefName.resolve({
			$repository,
			refName: 'refs/tags/v1.0.0',
		})

		expect(branch).toMatchObject({
			refName: 'refs/heads/master',
			refKind: 'branch',
			targetObjectId: `0x${'a'.repeat(40)}`,
		})
		expect(tag).toMatchObject({
			refName: 'refs/tags/v1.0.0',
			refKind: 'tag',
			targetObjectId: `0x${'e'.repeat(40)}`,
		})
		if (branch == null)
			throw new Error('GitLab branch must resolve')
		expect(refResolver.projections.$$observations.select(branch)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				timestampMs: observationTimestampMs,
				source: Source.Gitlab_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'protection')]: {
					protected: true,
					developersCanPush: false,
					developersCanMerge: true,
				},
			},
		})
		expect(refResolver.projections.$$observations.resolveCount(branch)).toBe(1)
	})

	it('resolves a commit path through native tree ancestry to its blob identity', async () => {
		const commitObjectId = `0x${'e'.repeat(40)}`
		const snapshot = await pathResolutionResolver.resolve.RepositoryCommitObjectIdPath.resolve({
			$repository: {
				repositoryId: project.http_url_to_repo,
			},
			commitObjectId,
			path: 'src/index.ts',
		})

		expect(getRepositoryTree).toHaveBeenNthCalledWith(1, {
			page: 1,
			projectId: 'gitlab-org/gitlab',
			perPage: 100,
			ref: 'e'.repeat(40),
			recursive: false,
		})
		expect(getRepositoryTree).toHaveBeenNthCalledWith(2, {
			page: 1,
			projectId: 'gitlab-org/gitlab',
			path: 'src',
			perPage: 100,
			ref: 'e'.repeat(40),
			recursive: false,
		})
		expect(snapshot).toMatchObject({
			commitObjectId,
			path: 'src/index.ts',
			treeObjectIds: [`0x${'c'.repeat(40)}`],
			blobObjectId: `0x${'d'.repeat(40)}`,
			status: 'resolved-blob',
		})
	})

	it('continues exact directory reads until the requested path is found', async () => {
		getRepositoryTree
			.mockResolvedValueOnce(Array.from({ length: 100 }, (_, index) => ({
				id: index.toString(16).padStart(40, '0'),
				name: `entry-${index}`,
				type: 'blob',
				path: `entry-${index}`,
				mode: '100644',
			})))
			.mockResolvedValueOnce([{
				id: 'd'.repeat(40),
				name: 'needle.ts',
				type: 'blob',
				path: 'needle.ts',
				mode: '100644',
			}])

		await expect(pathResolutionResolver.resolve.RepositoryCommitObjectIdPath.resolve({
			$repository: {
				canonicalRemoteUrl: project.http_url_to_repo,
			},
			commitObjectId: `0x${'e'.repeat(40)}`,
			path: 'needle.ts',
		})).resolves.toMatchObject({
			blobObjectId: `0x${'d'.repeat(40)}`,
			status: 'resolved-blob',
		})
		expect(getRepositoryTree).toHaveBeenNthCalledWith(2, expect.objectContaining({
			page: 2,
			perPage: 100,
			recursive: false,
		}))
	})

	it('preserves issue, merge-request, and release lifecycle clocks on their native owners', async () => {
		const $forgeMirror = {
			forgeHost: 'gitlab.com',
			owner: 'gitlab-org',
			repositoryName: 'gitlab',
		}
		await expect(issueResolver.resolve.ForgeMirrorIssueNumber.resolve({
			$forgeMirror,
			issueNumber: 12,
		})).resolves.toMatchObject({
			$forgeMirror,
			issueNumber: 12,
			state: 'closed',
			createdAt: Date.parse('2026-01-01T00:00:00Z'),
			updatedAt: Date.parse('2026-01-02T00:00:00Z'),
			closedAt: Date.parse('2026-01-03T00:00:00Z'),
			authorSelector: {
				id: 7,
				username: 'issue-author',
			},
		})
		await expect(pullRequestResolver.resolve.ForgeMirrorPullRequestNumber.resolve({
			$forgeMirror,
			pullRequestNumber: 34,
		})).resolves.toMatchObject({
			$forgeMirror,
			pullRequestNumber: 34,
			baseRef: 'master',
			headRef: 'native-repository-links',
			headObjectId: `0x${'c'.repeat(40)}`,
			mergedAt: Date.parse('2026-02-03T00:00:00Z'),
			authorSelector: {
				id: 8,
				username: 'merge-author',
			},
		})
		await expect(releaseResolver.resolve.ForgeMirrorReleaseTagName.resolve({
			$forgeMirror,
			releaseTagName: 'v1.0.0',
		})).resolves.toMatchObject({
			$forgeMirror,
			releaseTagName: 'v1.0.0',
			name: 'Version 1.0.0',
			targetObjectId: `0x${'d'.repeat(40)}`,
			draft: false,
			publishedAt: Date.parse('2026-03-02T00:00:00Z'),
			authorSelector: {
				id: 9,
				username: 'release-author',
			},
		})
	})

	it('resolves a GitLab commit signature into its native verification owner', async () => {
		getCommitSignature.mockResolvedValue({
			signature_type: 'PGP',
			verification_status: 'verified',
			gpg_key_primary_keyid: '0123456789ABCDEF',
			gpg_key_user_name: 'Example Signer',
			gpg_key_user_email: 'signer@example.com',
			x509_certificate: null,
			commit_source: 'web',
		})
		const commitSha = 'a'.repeat(40)
		const signatureId = `https://gitlab.com/gitlab-org/security/project/-/commit/${commitSha}#signature`

		await expect(signatureResolver.resolve.SignatureId.resolve({
			signatureId,
		})).resolves.toEqual({
			signatureId,
			subjectObjectId: `0x${commitSha}`,
			signatureKind: 'PGP',
			signerSelector: {
				gpgKeyPrimaryKeyId: '0123456789ABCDEF',
				gpgKeyUserName: 'Example Signer',
				gpgKeyUserEmail: 'signer@example.com',
				commitSource: 'web',
			},
			verificationStatus: 'verified',
			verifier: 'GitLab',
			evidenceUrl: `https://gitlab.com/gitlab-org/security/project/-/commit/${commitSha}`,
		})
		expect(getCommitSignature).toHaveBeenCalledWith({
			projectId: 'gitlab-org/security/project',
			commitSha,
		})
	})

	it('retains X.509 and provider commit-source evidence without inventing key identity', async () => {
		const x509Certificate = {
			id: 1,
			subject: 'CN=gitlab@example.org,OU=Example,O=World',
			subject_key_identifier: 'BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC',
			email: 'gitlab@example.org',
		}
		getCommitSignature.mockResolvedValue({
			signature_type: 'X509',
			verification_status: 'unverified',
			gpg_key_primary_keyid: null,
			gpg_key_user_name: null,
			gpg_key_user_email: null,
			x509_certificate: x509Certificate,
			commit_source: 'unknown',
		})
		const commitSha = 'b'.repeat(64)

		await expect(signatureResolver.resolve.SignatureId.resolve({
			signatureId: `https://gitlab.com/group/project/-/commit/${commitSha}#signature`,
		})).resolves.toMatchObject({
			subjectObjectId: `0x${commitSha}`,
			signatureKind: 'X509',
			signerSelector: {
				x509Certificate,
				commitSource: 'unknown',
			},
			verificationStatus: 'unverified',
		})
	})

	it('retains SSH key evidence for SSH-signed commits without inventing verification', async () => {
		const sshKey = {
			id: 11,
			title: 'Key',
			key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILZzYDq6DhLp3aX84DGIV3F6Vf+Ae4yCTTz7RnqMJOlR',
			usage_type: 'auth_and_signing',
		}
		getCommitSignature.mockResolvedValue({
			signature_type: 'SSH',
			verification_status: 'verified',
			gpg_key_primary_keyid: null,
			gpg_key_user_name: null,
			gpg_key_user_email: null,
			key: sshKey,
			commit_source: 'gitaly',
		})
		const commitSha = 'c'.repeat(40)

		await expect(signatureResolver.resolve.SignatureId.resolve({
			signatureId: `https://gitlab.com/group/project/-/commit/${commitSha}#signature`,
		})).resolves.toMatchObject({
			subjectObjectId: `0x${commitSha}`,
			signatureKind: 'SSH',
			signerSelector: {
				sshKey,
				commitSource: 'gitaly',
			},
			verificationStatus: 'verified',
		})
	})

	it('rejects non-canonical signature identities before source execution', async () => {
		await expect(signatureResolver.resolve.SignatureId.resolve({
			signatureId: 'not-a-url',
		})).resolves.toBeUndefined()
		await expect(signatureResolver.resolve.SignatureId.resolve({
			signatureId: `https://example.com/group/project/-/commit/${'a'.repeat(40)}#signature`,
		})).resolves.toBeUndefined()
		await expect(signatureResolver.resolve.SignatureId.resolve({
			signatureId: `https://gitlab.com/group/project/-/commit/${'A'.repeat(40)}#signature`,
		})).resolves.toBeUndefined()
		await expect(signatureResolver.resolve.SignatureId.resolve({
			signatureId: `https://gitlab.com/group/project/-/commit/${'a'.repeat(40)}`,
		})).resolves.toBeUndefined()
		expect(getCommitSignature).not.toHaveBeenCalled()
	})
})
