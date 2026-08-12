import { type } from 'arktype'


export const gitlabProjectWire = type({
	id: 'number.integer >= 0',
	path: 'string > 0',
	path_with_namespace: 'string > 0',
	default_branch: 'string | null',
	visibility: 'string > 0',
	http_url_to_repo: 'string.url',
	ssh_url_to_repo: 'string > 0',
	web_url: 'string.url',
})

export type GitlabProject = typeof gitlabProjectWire.infer

export const gitlabBranchWire = type({
	name: 'string > 0',
	commit: {
		id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	},
})

export type GitlabBranch = typeof gitlabBranchWire.infer

export const gitlabBranchesWire = gitlabBranchWire.array()

export const gitlabRepositoryTreeEntryWire = type({
	id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	name: 'string > 0',
	type: "'blob' | 'tree' | 'commit'",
	path: 'string > 0',
	mode: '/^[0-7]{6}$/',
})

export const gitlabRepositoryTreeWire = gitlabRepositoryTreeEntryWire.array()

export const gitlabIssueWire = type({
	iid: 'number.integer >= 0',
	title: 'string',
	state: 'string > 0',
	labels: 'string[]',
	created_at: 'string > 0',
	updated_at: 'string > 0',
	closed_at: 'string | null',
})

export const gitlabIssuesWire = gitlabIssueWire.array()

export const gitlabMergeRequestWire = type({
	iid: 'number.integer >= 0',
	title: 'string',
	state: 'string > 0',
	target_branch: 'string > 0',
	source_branch: 'string > 0',
	sha: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	created_at: 'string > 0',
	updated_at: 'string > 0',
	merged_at: 'string | null',
})

export const gitlabMergeRequestsWire = gitlabMergeRequestWire.array()

export const gitlabReleaseWire = type({
	tag_name: 'string > 0',
	'name?': 'string | null',
	created_at: 'string > 0',
	released_at: 'string > 0',
	commit: {
		id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	},
})

export const gitlabReleasesWire = gitlabReleaseWire.array()
