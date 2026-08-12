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
const mirrorPullRequestsResolver = resolverModule.resolvers.find((resolver) => '$$pullRequests' in resolver.projections)
const mirrorReleasesResolver = resolverModule.resolvers.find((resolver) => '$$releases' in resolver.projections)
const repositoryResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitRepository)
const refResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitRef)
const pathResolutionResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitTreePathResolution)
const issueResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgeIssue)
const pullRequestResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgePullRequest)
const releaseResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitForgeRelease)
const signatureResolver = resolverModule.resolvers.find((resolver) => resolver.entityType === EntityType.GitSignature)
if (
	mirrorResolver == null
	|| repositoryResolver == null
	|| mirrorIssuesResolver == null
	|| mirrorPullRequestsResolver == null
	|| mirrorReleasesResolver == null
	|| refResolver == null
	|| pathResolutionResolver == null
	|| issueResolver == null
	|| pullRequestResolver == null
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
			},
		})
		getTag.mockResolvedValue({
			name: 'v1.0.0',
			target: 'e'.repeat(40),
			message: 'Version 1.0.0',
			protected: false,
			commit: {
				id: 'e'.repeat(40),
			},
		})
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
			title: 'Preserve native repository links',
			state: 'closed',
			labels: ['architecture'],
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-02T00:00:00Z',
			closed_at: '2026-01-03T00:00:00Z',
		}])
		getMergeRequests.mockResolvedValueOnce([{
			iid: 34,
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
			{
				[EntityMetaKey.Selector]: {
					$repository: {
						canonicalRemoteUrl: project.http_url_to_repo,
					},
					refName: 'refs/tags/v1.0.0',
				},
				refKind: 'tag',
				targetObjectId: `0x${'e'.repeat(40)}`,
			},
		])
		if (snapshot == null)
			throw new Error('GitLab repository snapshot must resolve')
		expect(repositoryResolver.projections.$$refs.resolveCount(snapshot)).toBe(3)
		expect(repositoryResolver.projections.$$objects.resolveCount(snapshot)).toBe(6)
		expect(repositoryResolver.projections.$$objects.select(snapshot)).toEqual(expect.arrayContaining([
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
	})

	it('includes ref commit targets in the native repository object graph', async () => {
		const snapshot = await repositoryResolver.resolve.CanonicalRemoteUrl.resolve({
			canonicalRemoteUrl: project.http_url_to_repo,
		})

		expect(snapshot?.$$objects).toEqual(expect.arrayContaining([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					objectId: `0x${'a'.repeat(40)}`,
					objectFormat: 'sha1',
				},
				objectKind: 'commit',
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					objectId: `0x${'f'.repeat(40)}`,
					objectFormat: 'sha1',
				},
				objectKind: 'commit',
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					objectId: `0x${'d'.repeat(40)}`,
					objectFormat: 'sha1',
				},
				objectKind: 'blob',
			}),
		]))
		expect(getCommits).toHaveBeenCalledWith({
			projectId: 'gitlab-org/gitlab',
		})
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
		expect(refResolver.projections.$$observations(branch)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.GitRefObservation_Timestamp, [], 'protection')]: {
				protected: true,
				developersCanPush: false,
				developersCanMerge: true,
			},
		})
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
		getCommitSignature.mockResolvedValue({
			signature_type: 'X509',
			verification_status: 'unverified',
			gpg_key_primary_keyid: null,
			gpg_key_user_name: null,
			gpg_key_user_email: null,
			x509_certificate: '-----BEGIN CERTIFICATE-----fixture',
			commit_source: 'unknown',
		})
		const commitSha = 'b'.repeat(64)

		await expect(signatureResolver.resolve.SignatureId.resolve({
			signatureId: `https://gitlab.com/group/project/-/commit/${commitSha}#signature`,
		})).resolves.toMatchObject({
			subjectObjectId: `0x${commitSha}`,
			signatureKind: 'X509',
			signerSelector: {
				x509Certificate: '-----BEGIN CERTIFICATE-----fixture',
				commitSource: 'unknown',
			},
			verificationStatus: 'unverified',
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
