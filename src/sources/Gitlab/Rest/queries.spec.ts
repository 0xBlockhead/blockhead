import { beforeEach, describe, expect, it, vi } from 'vitest'


const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://gitlab.com',
	sourceGetJson,
}))

const {
	compareRepositoryRefs,
	getBranches,
	getBranch,
	getCommit,
	getCommits,
	getCommitSignature,
	getIssue,
	getIssues,
	getMergeRequest,
	getMergeRequests,
	getJob,
	getPipeline,
	getPipelineJobs,
	getPipelines,
	getProject,
	getProtectedBranch,
	getRelease,
	getReleases,
	getRepositoryBlob,
	getRepositoryTree,
	getTag,
	getTags,
	listProtectedBranches,
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
				repository_object_format: 'sha1',
			})
			.mockResolvedValueOnce([
				{
					name: 'master',
					commit: {
						id: 'a'.repeat(40),
						committed_date: '2026-04-01T00:00:00Z',
					},
				},
			])
			.mockResolvedValueOnce({
				iid: 12,
				project_id: 278964,
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
				project_id: 278964,
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
						committed_date: '2026-04-02T00:00:00Z',
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
			project_id: 278964,
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
					committed_date: '2026-04-01T00:00:00Z',
				},
			})
			.mockResolvedValueOnce({
				name: 'v1',
				target: 'b'.repeat(40),
				message: null,
				protected: false,
				commit: {
					id: 'b'.repeat(40),
					committed_date: '2026-04-02T00:00:00Z',
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

	it('reads exact branch and tag pages and rejects invalid pagination before transport', async () => {
		sourceGetJson
			.mockResolvedValueOnce([{
				name: 'master',
				commit: {
					id: 'a'.repeat(40),
					committed_date: '2026-04-01T00:00:00Z',
				},
			}])
			.mockResolvedValueOnce([{
				name: 'v1',
				target: 'b'.repeat(40),
				message: null,
				commit: {
					id: 'b'.repeat(40),
					committed_date: '2026-04-02T00:00:00Z',
				},
			}])

		await expect(getBranches({
			projectId: 'gitlab-org/gitlab',
			page: 2,
			perPage: 50,
		})).resolves.toHaveLength(1)
		await expect(getTags({
			projectId: 'gitlab-org/gitlab',
			page: 3,
			perPage: 25,
		})).resolves.toHaveLength(1)
		expect(sourceGetJson.mock.calls.map(([, url]) => url)).toEqual([
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/repository/branches?page=2&per_page=50',
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/repository/tags?page=3&per_page=25',
		])
		expect(() => getBranches({
			projectId: 'gitlab-org/gitlab',
			page: 0,
		})).toThrow('invalid page')
		expect(() => getTags({
			projectId: 'gitlab-org/gitlab',
			perPage: 101,
		})).toThrow('invalid per-page limit')
	})

	it('accepts bounded native lifecycle indexes', async () => {
		sourceGetJson
			.mockResolvedValueOnce([{
				iid: 12,
				project_id: 278964,
				title: 'Issue',
				state: 'opened',
				labels: [],
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-01T00:00:00Z',
				closed_at: null,
			}])
			.mockResolvedValueOnce([{
				iid: 34,
				project_id: 278964,
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
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/issues?scope=all&page=1&per_page=100',
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/merge_requests?scope=all&page=1&per_page=100',
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/releases?page=1&per_page=100',
		])
	})

	it('rejects invalid lifecycle pagination before transport', async () => {
		expect(() => getIssues({
			projectId: 'gitlab-org/gitlab',
			page: 0,
		})).toThrow('invalid page')
		expect(() => getMergeRequests({
			projectId: 'gitlab-org/gitlab',
			perPage: 101,
		})).toThrow('invalid per-page limit')
		expect(() => getReleases({
			projectId: 'gitlab-org/gitlab',
			page: 1.5,
		})).toThrow('invalid page')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('retains native commit ancestry and file diffs for repository comparisons', async () => {
		sourceGetJson.mockResolvedValue({
			commit: {
				id: 'c'.repeat(40),
			},
			commits: [{
				id: 'b'.repeat(40),
				parent_ids: ['a'.repeat(40)],
				title: 'Add comparison support',
				message: 'Add comparison support\n',
				author_name: 'Author',
				author_email: 'author@example.com',
				authored_date: '2026-04-01T00:00:00Z',
				committer_name: 'Committer',
				committer_email: 'committer@example.com',
				committed_date: '2026-04-01T00:01:00Z',
			}],
			diffs: [{
				old_path: 'src/old.ts',
				new_path: 'src/new.ts',
				a_mode: '100644',
				b_mode: '100644',
				new_file: false,
				renamed_file: true,
				deleted_file: false,
				diff: '@@ -1 +1 @@',
				generated_file: false,
				collapsed: false,
				too_large: false,
			}],
			compare_timeout: false,
			compare_same_ref: false,
		})

		await expect(compareRepositoryRefs({
			projectId: 'gitlab-org/gitlab',
			from: 'main',
			to: 'feature/native objects',
			straight: true,
		})).resolves.toMatchObject({
			commits: [{
				parent_ids: ['a'.repeat(40)],
			}],
			diffs: [{
				renamed_file: true,
			}],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			expect.anything(),
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/repository/compare?from=main&to=feature%2Fnative+objects&straight=true'
		)
	})

	it('fails closed when a repository comparison omits provider completion state', async () => {
		sourceGetJson.mockResolvedValue({
			commit: { id: 'c'.repeat(40) },
			commits: [],
			diffs: [],
		})

		await expect(compareRepositoryRefs({
			projectId: 'gitlab-org/gitlab',
			from: 'main',
			to: 'feature',
		})).rejects.toThrow('Gitlab_Rest: invalid repository comparison response')
	})

	it('retains commit ancestry, signature verification and CI job lifecycles', async () => {
		const commit = {
			id: 'a'.repeat(40),
			short_id: 'a'.repeat(8),
			title: 'Ship source authority',
			message: 'Ship source authority\n',
			parent_ids: ['b'.repeat(40)],
			author_name: 'Author',
			author_email: 'author@example.com',
			authored_date: '2026-08-12T00:00:00Z',
			committer_name: 'Committer',
			committer_email: 'committer@example.com',
			committed_date: '2026-08-12T00:01:00Z',
			web_url: `https://gitlab.com/group/project/-/commit/${'a'.repeat(40)}`,
		}
		sourceGetJson
			.mockResolvedValueOnce(commit)
			.mockResolvedValueOnce([commit])
			.mockResolvedValueOnce({
				signature_type: 'PGP',
				verification_status: 'verified',
				gpg_key_primary_keyid: 'A1B2C3D4',
				gpg_key_user_name: 'Author',
				gpg_key_user_email: 'author@example.com',
			})
			.mockResolvedValueOnce([{
				id: 91,
				iid: 7,
				project_id: 42,
				sha: commit.id,
				ref: 'main',
				status: 'success',
				source: 'push',
				created_at: '2026-08-12T00:02:00Z',
				updated_at: '2026-08-12T00:04:00Z',
				web_url: 'https://gitlab.com/group/project/-/pipelines/91',
			}])
			.mockResolvedValueOnce([{
				id: 123,
				name: 'test',
				stage: 'verify',
				status: 'success',
				created_at: '2026-08-12T00:02:00Z',
				started_at: '2026-08-12T00:02:30Z',
				finished_at: '2026-08-12T00:03:30Z',
				duration: 60,
				queued_duration: 30,
				web_url: 'https://gitlab.com/group/project/-/jobs/123',
				commit: { id: commit.id },
				pipeline: {
					id: 91,
					sha: commit.id,
					ref: 'main',
					status: 'success',
				},
			}])

		await expect(getCommit({
			projectId: 'group/project',
			commitSha: commit.id,
		})).resolves.toMatchObject({ parent_ids: [commit.parent_ids[0]] })
		await expect(getCommits({
			projectId: 'group/project',
			ref: 'release/next',
		})).resolves.toHaveLength(1)
		await expect(getCommitSignature({
			projectId: 'group/project',
			commitSha: commit.id,
		})).resolves.toMatchObject({ verification_status: 'verified' })
		await expect(getPipelines({
			projectId: 'group/project',
			ref: 'release/next',
		})).resolves.toEqual([
			expect.objectContaining({ status: 'success' }),
		])
		await expect(getPipelineJobs({
			projectId: 'group/project',
			pipelineId: 91,
		})).resolves.toEqual([
			expect.objectContaining({
				name: 'test',
				duration: 60,
			}),
		])
		expect(sourceGetJson.mock.calls.map(([, path]) => path)).toEqual([
			`https://gitlab.com/api/v4/projects/group%2Fproject/repository/commits/${commit.id}`,
			'https://gitlab.com/api/v4/projects/group%2Fproject/repository/commits?ref_name=release%2Fnext&page=1&per_page=100',
			`https://gitlab.com/api/v4/projects/group%2Fproject/repository/commits/${commit.id}/signature`,
			'https://gitlab.com/api/v4/projects/group%2Fproject/pipelines?ref=release%2Fnext&page=1&per_page=100',
			'https://gitlab.com/api/v4/projects/group%2Fproject/pipelines/91/jobs?page=1&per_page=100',
		])
	})

	it('accepts native SSH and X.509 commit signature evidence objects', async () => {
		const commitSha = 'e'.repeat(40)
		sourceGetJson
			.mockResolvedValueOnce({
				signature_type: 'SSH',
				verification_status: 'verified',
				key: {
					id: 11,
					title: 'Key',
					key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILZzYDq6DhLp3aX84DGIV3F6Vf+Ae4yCTTz7RnqMJOlR',
					usage_type: 'auth_and_signing',
				},
				commit_source: 'gitaly',
			})
			.mockResolvedValueOnce({
				signature_type: 'X509',
				verification_status: 'unverified',
				x509_certificate: {
					id: 1,
					subject: 'CN=gitlab@example.org,OU=Example,O=World',
					subject_key_identifier: 'BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC',
					email: 'gitlab@example.org',
					x509_issuer: {
						id: 1,
						subject: 'CN=PKI,OU=Example,O=World',
						subject_key_identifier: 'AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB:AB',
					},
				},
				commit_source: 'gitaly',
			})

		await expect(getCommitSignature({
			projectId: 'group/project',
			commitSha,
		})).resolves.toMatchObject({
			signature_type: 'SSH',
			key: { id: 11 },
		})
		await expect(getCommitSignature({
			projectId: 'group/project',
			commitSha,
		})).resolves.toMatchObject({
			signature_type: 'X509',
			x509_certificate: { subject: 'CN=gitlab@example.org,OU=Example,O=World' },
		})
	})

	it('fails closed on incomplete commit and CI payloads and invalid pipeline identity', async () => {
		sourceGetJson
			.mockResolvedValueOnce({ id: 'a'.repeat(40) })
			.mockResolvedValueOnce({ signature_type: 'PGP' })
			.mockResolvedValueOnce([{ id: 91, status: 'success' }])

		await expect(getCommit({
			projectId: 'group/project',
			commitSha: 'a'.repeat(40),
		})).rejects.toThrow('invalid commit response')
		await expect(getCommitSignature({
			projectId: 'group/project',
			commitSha: 'a'.repeat(40),
		})).rejects.toThrow('invalid commit signature response')
		await expect(getPipelines({
			projectId: 'group/project',
		})).rejects.toThrow('invalid pipelines response')
		expect(() => getPipelineJobs({
			projectId: 'group/project',
			pipelineId: -1,
		})).toThrow('invalid pipeline ID')
	})

	it('accepts native protected-branch policy payloads from list and get', async () => {
		sourceGetJson
			.mockResolvedValueOnce([
				{
					id: 100,
					name: 'main',
					push_access_levels: [{
						id: 1001,
						access_level: 40,
						access_level_description: 'Maintainers',
					}],
					merge_access_levels: [{
						id: 2001,
						access_level: 40,
						access_level_description: 'Maintainers',
					}],
					allow_force_push: false,
					code_owner_approval_required: false,
				},
				{
					id: 101,
					name: 'release/*',
					push_access_levels: [{
						id: 1003,
						access_level: 40,
						access_level_description: 'Maintainers',
					}],
					merge_access_levels: [{
						id: 2002,
						access_level: 40,
						access_level_description: 'Maintainers',
					}],
					allow_force_push: false,
					code_owner_approval_required: false,
				},
			])
			.mockResolvedValueOnce({
				id: 109607,
				name: 'master',
				push_access_levels: [{
					id: 7058263,
					access_level: 40,
					access_level_description: 'GitLab Bot',
					deploy_key_id: null,
					user_id: 1786152,
					group_id: null,
					member_role_id: null,
				}],
				merge_access_levels: [{
					id: 33863457,
					access_level: 40,
					access_level_description: 'managers',
					user_id: null,
					group_id: 2584649,
					member_role_id: null,
				}],
				allow_force_push: false,
				unprotect_access_levels: [],
				code_owner_approval_required: true,
				inherited: false,
			})

		await expect(listProtectedBranches({
			projectId: 'gitlab-org/gitlab',
		})).resolves.toEqual([
			expect.objectContaining({
				id: 100,
				name: 'main',
				allow_force_push: false,
			}),
			expect.objectContaining({
				name: 'release/*',
			}),
		])
		await expect(getProtectedBranch({
			projectId: 'gitlab-org/gitlab',
			branchName: 'master',
		})).resolves.toMatchObject({
			id: 109607,
			name: 'master',
			code_owner_approval_required: true,
			inherited: false,
			push_access_levels: [{
				access_level: 40,
				user_id: 1786152,
			}],
			merge_access_levels: [{
				group_id: 2584649,
			}],
		})
		expect(sourceGetJson.mock.calls.map(([, url]) => url)).toEqual([
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/protected_branches?page=1&per_page=100',
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/protected_branches/master',
		])
	})

	it('reads protected-branch pages, search, and wildcard names and rejects invalid pagination before transport', async () => {
		sourceGetJson
			.mockResolvedValueOnce([{
				id: 100,
				name: 'master',
				push_access_levels: [{
					id: 1001,
					access_level: 40,
					access_level_description: 'Maintainers',
				}],
				merge_access_levels: [{
					id: 2001,
					access_level: 40,
					access_level_description: 'Maintainers',
				}],
				allow_force_push: false,
				code_owner_approval_required: false,
			}])
			.mockResolvedValueOnce({
				id: 101,
				name: 'release/*',
				push_access_levels: [{
					id: 1003,
					access_level: 0,
					access_level_description: 'No one',
				}],
				merge_access_levels: [{
					id: 2002,
					access_level: 40,
					access_level_description: 'Maintainers',
				}],
				allow_force_push: false,
				code_owner_approval_required: true,
			})

		await expect(listProtectedBranches({
			projectId: 'gitlab-org/gitlab',
			search: 'master',
			page: 2,
			perPage: 5,
		})).resolves.toHaveLength(1)
		await expect(getProtectedBranch({
			projectId: 'gitlab-org/gitlab',
			branchName: 'release/*',
		})).resolves.toMatchObject({
			name: 'release/*',
			push_access_levels: [{
				access_level: 0,
			}],
		})
		expect(sourceGetJson.mock.calls.map(([, url]) => url)).toEqual([
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/protected_branches?search=master&page=2&per_page=5',
			'https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/protected_branches/release%2F*',
		])
		expect(() => listProtectedBranches({
			projectId: 'gitlab-org/gitlab',
			page: 0,
		})).toThrow('invalid page')
		expect(() => listProtectedBranches({
			projectId: 'gitlab-org/gitlab',
			perPage: 101,
		})).toThrow('invalid per-page limit')
	})

	it('fails closed when a protected-branch policy omits access levels', async () => {
		sourceGetJson.mockResolvedValue({
			id: 100,
			name: 'main',
			allow_force_push: false,
			code_owner_approval_required: false,
		})

		await expect(getProtectedBranch({
			projectId: 'gitlab-org/gitlab',
			branchName: 'main',
		})).rejects.toThrow('Gitlab_Rest: invalid protected branch response')
		await expect(listProtectedBranches({
			projectId: 'gitlab-org/gitlab',
		})).rejects.toThrow('Gitlab_Rest: invalid protected branches response')
	})

	it('reads exact pipeline and job identities from their native endpoints', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				id: 91,
				iid: 7,
				project_id: 42,
				sha: 'a'.repeat(40),
				ref: 'main',
				status: 'success',
				source: 'push',
				created_at: '2026-08-12T00:02:00Z',
				updated_at: '2026-08-12T00:04:00Z',
				web_url: 'https://gitlab.com/group/project/-/pipelines/91',
			})
			.mockResolvedValueOnce({
				id: 123,
				name: 'test',
				stage: 'verify',
				status: 'success',
				created_at: '2026-08-12T00:02:00Z',
				started_at: null,
				finished_at: null,
				duration: null,
				queued_duration: null,
				web_url: 'https://gitlab.com/group/project/-/jobs/123',
				commit: { id: 'a'.repeat(40) },
				pipeline: {
					id: 91,
					sha: 'a'.repeat(40),
					ref: 'main',
					status: 'success',
				},
			})

		await expect(getPipeline({
			projectId: 'group/project',
			pipelineId: 91,
		})).resolves.toMatchObject({ id: 91 })
		await expect(getJob({
			projectId: 'group/project',
			jobId: 123,
		})).resolves.toMatchObject({ id: 123 })
		expect(sourceGetJson.mock.calls.map(([, path]) => path)).toEqual([
			'https://gitlab.com/api/v4/projects/group%2Fproject/pipelines/91',
			'https://gitlab.com/api/v4/projects/group%2Fproject/jobs/123',
		])
	})

	it('reads a content-addressed repository blob by SHA', async () => {
		const blobSha = '79f7bbd25901e8334750839545a9bd021f0e4c83'
		sourceGetJson
			.mockResolvedValueOnce({
				size: 1476,
				encoding: 'base64',
				content: 'VGhpcyBpcyBhIGJpbmFyeSBmaWxl',
				sha: blobSha,
			})
			.mockResolvedValueOnce({
				size: 0,
				encoding: 'base64',
				content: '',
				sha: 'f'.repeat(64),
			})

		await expect(getRepositoryBlob({
			projectId: 'gitlab-org/gitlab',
			blobSha,
		})).resolves.toEqual({
			size: 1476,
			encoding: 'base64',
			content: 'VGhpcyBpcyBhIGJpbmFyeSBmaWxl',
			sha: blobSha,
		})
		await expect(getRepositoryBlob({
			projectId: 'group/project',
			blobSha: 'f'.repeat(64),
		})).resolves.toMatchObject({
			size: 0,
			sha: 'f'.repeat(64),
		})
		expect(sourceGetJson.mock.calls.map(([, url]) => url)).toEqual([
			`https://gitlab.com/api/v4/projects/gitlab-org%2Fgitlab/repository/blobs/${blobSha}`,
			`https://gitlab.com/api/v4/projects/group%2Fproject/repository/blobs/${'f'.repeat(64)}`,
		])
	})

	it('fails closed when a repository blob omits content-addressed fields', async () => {
		sourceGetJson.mockResolvedValue({
			size: 1476,
			encoding: 'base64',
			content: 'VGhpcyBpcyBhIGJpbmFyeSBmaWxl',
		})

		await expect(getRepositoryBlob({
			projectId: 'gitlab-org/gitlab',
			blobSha: '79f7bbd25901e8334750839545a9bd021f0e4c83',
		})).rejects.toThrow('Gitlab_Rest: invalid repository blob response')
	})
})
