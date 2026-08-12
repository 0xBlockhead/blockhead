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
	'protected?': 'boolean',
	'developers_can_push?': 'boolean',
	'developers_can_merge?': 'boolean',
	commit: {
		id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	},
})

export type GitlabBranch = typeof gitlabBranchWire.infer

export const gitlabBranchesWire = gitlabBranchWire.array()

export const gitlabTagWire = type({
	name: 'string > 0',
	target: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	message: 'string | null',
	commit: {
		id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	},
	'protected?': 'boolean',
})

export type GitlabTag = typeof gitlabTagWire.infer

export const gitlabTagsWire = gitlabTagWire.array()

export const gitlabRepositoryTreeEntryWire = type({
	id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	name: 'string > 0',
	type: "'blob' | 'tree' | 'commit'",
	path: 'string > 0',
	mode: '/^[0-7]{6}$/',
})

export const gitlabRepositoryTreeWire = gitlabRepositoryTreeEntryWire.array()

export const gitlabCommitWire = type({
	id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	short_id: 'string > 0',
	title: 'string',
	message: 'string',
	parent_ids: '(/^([0-9a-fA-F]{40}|[0-9a-fA-F]{64})$/)[]',
	author_name: 'string',
	author_email: 'string',
	authored_date: 'string > 0',
	committer_name: 'string',
	committer_email: 'string',
	committed_date: 'string > 0',
	web_url: 'string.url',
})

export const gitlabCommitsWire = gitlabCommitWire.array()

export const gitlabCommitSignatureWire = type({
	signature_type: 'string > 0',
	verification_status: 'string > 0',
	'gpg_key_primary_keyid?': 'string | null',
	'gpg_key_user_name?': 'string | null',
	'gpg_key_user_email?': 'string | null',
	'x509_certificate?': 'string | null',
	'commit_source?': 'string | null',
})

export const gitlabPipelineWire = type({
	id: 'number.integer >= 0',
	iid: 'number.integer >= 0',
	project_id: 'number.integer >= 0',
	sha: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	ref: 'string > 0',
	status: 'string > 0',
	source: 'string > 0',
	created_at: 'string > 0',
	updated_at: 'string > 0',
	web_url: 'string.url',
})

export const gitlabPipelinesWire = gitlabPipelineWire.array()

export const gitlabJobWire = type({
	id: 'number.integer >= 0',
	name: 'string > 0',
	stage: 'string > 0',
	status: 'string > 0',
	created_at: 'string > 0',
	started_at: 'string | null',
	finished_at: 'string | null',
	duration: 'number | null',
	queued_duration: 'number | null',
	web_url: 'string.url',
	commit: {
		id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	},
	pipeline: {
		id: 'number.integer >= 0',
		sha: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
		ref: 'string > 0',
		status: 'string > 0',
	},
})

export const gitlabJobsWire = gitlabJobWire.array()

export const gitlabIssueWire = type({
	iid: 'number.integer >= 0',
	title: 'string',
	state: 'string > 0',
	labels: 'string[]',
	created_at: 'string > 0',
	updated_at: 'string > 0',
	closed_at: 'string | null',
	'author?': {
		id: 'number.integer >= 0',
		username: 'string > 0',
		name: 'string',
		web_url: 'string.url',
	},
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
	'author?': {
		id: 'number.integer >= 0',
		username: 'string > 0',
		name: 'string',
		web_url: 'string.url',
	},
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
	'author?': {
		id: 'number.integer >= 0',
		username: 'string > 0',
		name: 'string',
		web_url: 'string.url',
	},
})

export const gitlabReleasesWire = gitlabReleaseWire.array()

const gitlabCompareCommitWire = type({
	id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	parent_ids: '(/^([0-9a-fA-F]{40}|[0-9a-fA-F]{64})$/)[]',
	title: 'string',
	message: 'string',
	author_name: 'string',
	author_email: 'string',
	authored_date: 'string > 0',
	committer_name: 'string',
	committer_email: 'string',
	committed_date: 'string > 0',
})

const gitlabCompareDiffWire = type({
	old_path: 'string',
	new_path: 'string',
	a_mode: 'string',
	b_mode: 'string',
	new_file: 'boolean',
	renamed_file: 'boolean',
	deleted_file: 'boolean',
	diff: 'string',
	'generated_file?': 'boolean',
	'collapsed?': 'boolean',
	'too_large?': 'boolean',
})

export const gitlabCompareWire = type({
	commit: {
		id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	},
	commits: gitlabCompareCommitWire.array(),
	diffs: gitlabCompareDiffWire.array(),
	compare_timeout: 'boolean',
	compare_same_ref: 'boolean',
})

export type GitlabCompare = typeof gitlabCompareWire.infer
