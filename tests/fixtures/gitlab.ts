export const gitlabProject = () => ({
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

export const gitlabMergeRequestDiffNote = () => ({
	id: 404,
	body: 'Review the native graph',
	created_at: '2026-02-04T00:00:00Z',
	updated_at: '2026-02-04T00:00:00Z',
	system: false,
	noteable_iid: 34,
	noteable_type: 'MergeRequest',
	type: 'DiffNote',
	discussion_id: 'abcd1234',
	position: {
		old_path: 'src/index.ts',
		new_path: 'src/index.ts',
		old_line: null,
		new_line: 12,
	},
})
