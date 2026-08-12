import { beforeEach, describe, expect, it, vi } from 'vitest'


const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://gitlab.com',
	sourceGetJson,
}))

const {
	getBranches,
	getBranch,
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
} = await import('$/sources/Gitlab/Rest/queries.ts')

describe('GitLab REST wires', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('accepts the native repository journey payloads', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				id: 278964,
				path: 'gitlab',
				path_with_namespace: 'gitlab-org/gitlab',
				default_branch: 'master',
				visibility: 'public',
				http_url_to_repo: 'https://gitlab.com/gitlab-org/gitlab.git',
				ssh_url_to_repo: 'git@gitlab.com:gitlab-org/gitlab.git',
				web_url: 'https://gitlab.com/gitlab-org/gitlab',
			})
			.mockResolvedValueOnce([
				{
					name: 'master',
					commit: {
						id: 'a'.repeat(40),
					},
				},
			])
			.mockResolvedValueOnce({
				iid: 12,
				title: 'Issue',
				state: 'opened',
				labels: [],
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
				closed_at: null,
				author: {
					id: 7,
					username: 'issue-author',
					name: 'Issue Author',
					web_url: 'https://gitlab.com/issue-author',
				},
			})
			.mockResolvedValueOnce({
				iid: 34,
				title: 'Merge request',
				state: 'opened',
				target_branch: 'master',
				source_branch: 'feature',
				sha: 'b'.repeat(40),
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
				merged_at: null,
				author: {
					id: 8,
					username: 'merge-author',
					name: 'Merge Author',
					web_url: 'https://gitlab.com/merge-author',
				},
			})
			.mockResolvedValueOnce({
				tag_name: 'v1',
				name: null,
				created_at: '2026-01-01T00:00:00Z',
				released_at: '2026-01-02T00:00:00Z',
				commit: {
					id: 'c'.repeat(40),
				},
				author: {
					id: 9,
					username: 'release-author',
					name: 'Release Author',
					web_url: 'https://gitlab.com/release-author',
				},
			})
			.mockResolvedValueOnce([
				{
					name: 'v1',
					target: 'c'.repeat(40),
					message: 'Version 1',
					commit: {
						id: 'c'.repeat(40),
					},
				},
			])
			.mockResolvedValueOnce([
				{
					id: 'd'.repeat(40),
					name: 'index.ts',
					type: 'blob',
					path: 'src/index.ts',
					mode: '100644',
				},
			])

		await expect(getProject({ projectId: 'gitlab-org/gitlab' })).resolves.toMatchObject({ id: 278964 })
		await expect(getBranches({ projectId: 'gitlab-org/gitlab' })).resolves.toHaveLength(1)
		await expect(getIssue({ projectId: 'gitlab-org/gitlab', issueNumber: 12 })).resolves.toMatchObject({ iid: 12 })
		await expect(getMergeRequest({ projectId: 'gitlab-org/gitlab', pullRequestNumber: 34 })).resolves.toMatchObject({ iid: 34 })
		await expect(getRelease({ projectId: 'gitlab-org/gitlab', releaseTagName: 'v1' })).resolves.toMatchObject({ tag_name: 'v1' })
		await expect(getTags({ projectId: 'gitlab-org/gitlab' })).resolves.toEqual([
			expect.objectContaining({
				name: 'v1',
				target: 'c'.repeat(40),
			}),
		])
		await expect(getRepositoryTree({ projectId: 'gitlab-org/gitlab' })).resolves.toEqual([
			expect.objectContaining({
				path: 'src/index.ts',
				type: 'blob',
			}),
		])
	})

	it('rejects incomplete lifecycle payloads', async () => {
		sourceGetJson.mockResolvedValue({
			iid: 12,
			title: 'Issue without a lifecycle clock',
			state: 'opened',
			labels: [],
		})

		await expect(getIssue({
			projectId: 'gitlab-org/gitlab',
			issueNumber: 12,
		})).rejects.toThrow('Gitlab_Rest: invalid issue response')
	})

	it('accepts exact branch and tag observations with protection state', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				name: 'master',
				protected: true,
				developers_can_push: false,
				developers_can_merge: true,
				commit: {
					id: 'a'.repeat(40),
				},
			})
			.mockResolvedValueOnce({
				name: 'v1',
				target: 'b'.repeat(40),
				message: null,
				protected: false,
				commit: {
					id: 'b'.repeat(40),
				},
			})

		await expect(getBranch({
			projectId: 'gitlab-org/gitlab',
			branchName: 'master',
		})).resolves.toMatchObject({
			name: 'master',
			protected: true,
		})
		await expect(getTag({
			projectId: 'gitlab-org/gitlab',
			tagName: 'v1',
		})).resolves.toMatchObject({
			name: 'v1',
			protected: false,
		})
	})

	it('accepts bounded native lifecycle indexes', async () => {
		sourceGetJson
			.mockResolvedValueOnce([{
				iid: 12,
				title: 'Issue',
				state: 'opened',
				labels: [],
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
				closed_at: null,
			}])
			.mockResolvedValueOnce([{
				iid: 34,
				title: 'Merge request',
				state: 'opened',
				target_branch: 'master',
				source_branch: 'feature',
				sha: 'b'.repeat(40),
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
				merged_at: null,
			}])
			.mockResolvedValueOnce([{
				tag_name: 'v1',
				name: null,
				created_at: '2026-01-01T00:00:00Z',
				released_at: '2026-01-02T00:00:00Z',
				commit: { id: 'c'.repeat(40) },
			}])

		await expect(getIssues({ projectId: 'gitlab-org/gitlab' })).resolves.toHaveLength(1)
		await expect(getMergeRequests({ projectId: 'gitlab-org/gitlab' })).resolves.toHaveLength(1)
		await expect(getReleases({ projectId: 'gitlab-org/gitlab' })).resolves.toHaveLength(1)
		expect(sourceGetJson.mock.calls.map(([, path]) => path)).toEqual([
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/issues?scope=all&per_page=100',
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/merge_requests?scope=all&per_page=100',
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/releases?per_page=100',
		])
	})
})
