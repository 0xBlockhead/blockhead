import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


const {
	getBranches,
	getIssue,
	getIssues,
	getMergeRequest,
	getMergeRequests,
	getProject,
	getRelease,
	getReleases,
	getRepositoryTree,
} = vi.hoisted(() => ({
	getBranches: vi.fn(),
	getIssue: vi.fn(),
	getIssues: vi.fn(),
	getMergeRequest: vi.fn(),
	getMergeRequests: vi.fn(),
	getProject: vi.fn(),
	getRelease: vi.fn(),
	getReleases: vi.fn(),
	getRepositoryTree: vi.fn(),
}))

vi.mock('$/sources/Gitlab/Rest/queries.ts', () => ({
	getBranches,
	getIssue,
	getIssues,
	getMergeRequest,
	getMergeRequests,
	getProject,
	getRelease,
	getReleases,
	getRepositoryTree,
}))

const resolverModule = (await import('$/resolvers/Gitlab-Rest.ts')).default
const mirrorResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgeMirror)
const repositoryResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitRepository)
const pathResolutionResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitTreePathResolution)
const issueResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgeIssue)
const pullRequestResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgePullRequest)
const releaseResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgeRelease)
if (
	mirrorResolver == null
	|| repositoryResolver == null
	|| pathResolutionResolver == null
	|| issueResolver == null
	|| pullRequestResolver == null
	|| releaseResolver == null
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
}

describe('GitLab repository journey', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getProject.mockResolvedValue(project)
		getBranches.mockResolvedValue([
			{
				name: 'master',
				commit: {
					id: 'a'.repeat(40),
				},
			},
			{
				name: 'stable',
				commit: {
					id: 'b'.repeat(40),
				},
			},
		])
		getRepositoryTree.mockResolvedValue([
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
		])
		getIssue.mockResolvedValue({
			iid: 12,
			title: 'Preserve native repository links',
			state: 'closed',
			labels: [
				'architecture',
			],
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-02T00:00:00Z',
			closed_at: '2026-01-03T00:00:00Z',
		})
		getIssues.mockResolvedValue([])
		getMergeRequest.mockResolvedValue({
			iid: 34,
			title: 'Connect the repository graph',
			state: 'merged',
			target_branch: 'master',
			source_branch: 'native-repository-links',
			sha: 'c'.repeat(40),
			created_at: '2026-02-01T00:00:00Z',
			updated_at: '2026-02-02T00:00:00Z',
			merged_at: '2026-02-03T00:00:00Z',
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
		})
		getReleases.mockResolvedValue([])
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

	it('resolves the canonical repository into native branch refs and targets', async () => {
		const snapshot = await repositoryResolver.resolve.CanonicalRemoteUrl.resolve({
			canonicalRemoteUrl: project.http_url_to_repo,
		})

		expect(snapshot).toMatchObject({
			repositoryId: project.http_url_to_repo,
			canonicalRemoteUrl: project.http_url_to_repo,
			objectFormat: 'sha1',
			defaultRefName: 'refs/heads/master',
		})
		expect(snapshot?.$$refs).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$repository: {
						canonicalRemoteUrl: project.http_url_to_repo,
					},
					refName: 'refs/heads/master',
				},
				refKind: 'branch',
				targetObjectId: `0x${'a'.repeat(40)}`,
			},
			{
				[EntityMetaKey.Selector]: {
					$repository: {
						canonicalRemoteUrl: project.http_url_to_repo,
					},
					refName: 'refs/heads/stable',
				},
				refKind: 'branch',
				targetObjectId: `0x${'b'.repeat(40)}`,
			},
		])
		if (snapshot == null)
			throw new Error('GitLab repository snapshot must resolve')
		expect(repositoryResolver.projections.$$refs.resolveCount(snapshot)).toBe(2)
		expect(repositoryResolver.projections.$$objects.resolveCount(snapshot)).toBe(2)
		expect(repositoryResolver.projections.$$objects.select(snapshot)).toEqual([
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
		])
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

	it('resolves a commit path through native tree ancestry to its blob identity', async () => {
		const commitObjectId = `0x${'e'.repeat(40)}`
		const snapshot = await pathResolutionResolver.resolve.RepositoryCommitObjectIdPath.resolve({
			$repository: {
				repositoryId: project.http_url_to_repo,
			},
			commitObjectId,
			path: 'src/index.ts',
		})

		expect(getRepositoryTree).toHaveBeenCalledWith({
			projectId: 'gitlab-org/gitlab',
			ref: 'e'.repeat(40),
		})
		expect(snapshot).toMatchObject({
			commitObjectId,
			path: 'src/index.ts',
			treeObjectIds: [`0x${'c'.repeat(40)}`],
			blobObjectId: `0x${'d'.repeat(40)}`,
			status: 'resolved-blob',
		})
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
		})
		await expect(releaseResolver.resolve.ForgeMirrorReleaseTagName.resolve({
			$forgeMirror,
			releaseTagName: 'v1.0.0',
		})).resolves.toMatchObject({
			$forgeMirror,
			releaseTagName: 'v1.0.0',
			name: 'Version 1.0.0',
			targetObjectId: `0x${'d'.repeat(40)}`,
			publishedAt: Date.parse('2026-03-02T00:00:00Z'),
		})
	})
})
