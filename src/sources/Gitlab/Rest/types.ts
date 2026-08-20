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
	repository_object_format: "'sha1' | 'sha256' | null",
})

export type GitlabProject = typeof gitlabProjectWire.infer

const gitlabRefCommitWire = type({
	id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	committed_date: 'string > 0',
})

export const gitlabBranchWire = type({
	name: 'string > 0',
	'protected?': 'boolean',
	'developers_can_push?': 'boolean',
	'developers_can_merge?': 'boolean',
	commit: gitlabRefCommitWire,
})

export type GitlabBranch = typeof gitlabBranchWire.infer

export const gitlabBranchesWire = gitlabBranchWire.array()

export const gitlabTagWire = type({
	name: 'string > 0',
	target: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	message: 'string | null',
	commit: gitlabRefCommitWire,
	'protected?': 'boolean',
})

export type GitlabTag = typeof gitlabTagWire.infer

export const gitlabTagsWire = gitlabTagWire.array()

const gitlabProtectedRefAccessWire = type({
	id: 'number.integer >= 0',
	access_level: 'number.integer >= 0 | null',
	access_level_description: 'string > 0',
	'deploy_key_id?': 'number.integer >= 0 | null',
	'user_id?': 'number.integer >= 0 | null',
	'group_id?': 'number.integer >= 0 | null',
	'member_role_id?': 'number.integer >= 0 | null',
})

export const gitlabProtectedBranchWire = type({
	id: 'number.integer >= 0',
	name: 'string > 0',
	push_access_levels: gitlabProtectedRefAccessWire.array(),
	merge_access_levels: gitlabProtectedRefAccessWire.array(),
	allow_force_push: 'boolean',
	code_owner_approval_required: 'boolean',
	'unprotect_access_levels?': gitlabProtectedRefAccessWire.array(),
	'inherited?': 'boolean',
})

export type GitlabProtectedBranch = typeof gitlabProtectedBranchWire.infer

export const gitlabProtectedBranchesWire = gitlabProtectedBranchWire.array()

export const gitlabRepositoryTreeEntryWire = type({
	id: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
	name: 'string > 0',
	type: "'blob' | 'tree' | 'commit'",
	path: 'string > 0',
	mode: '/^[0-7]{6}$/',
})

export const gitlabRepositoryTreeWire = gitlabRepositoryTreeEntryWire.array()

export const gitlabRepositoryBlobWire = type({
	size: 'number.integer >= 0',
	encoding: "'base64'",
	content: 'string',
	sha: '/^[0-9a-fA-F]{40}$|^[0-9a-fA-F]{64}$/',
})

export type GitlabRepositoryBlob = typeof gitlabRepositoryBlobWire.infer

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

const gitlabCommitSignatureSshKeyWire = type({
	id: 'number.integer >= 0',
	title: 'string > 0',
	key: 'string > 0',
	'usage_type?': 'string | null',
})

const gitlabCommitSignatureX509IssuerWire = type({
	id: 'number.integer >= 0',
	subject: 'string > 0',
	subject_key_identifier: 'string > 0',
})

const gitlabCommitSignatureX509CertificateWire = type({
	id: 'number.integer >= 0',
	subject: 'string > 0',
	subject_key_identifier: 'string > 0',
	'email?': 'string | null',
	'x509_issuer?': gitlabCommitSignatureX509IssuerWire,
})

export const gitlabCommitSignatureWire = type({
	signature_type: 'string > 0',
	verification_status: 'string > 0',
	'gpg_key_primary_keyid?': 'string | null',
	'gpg_key_user_name?': 'string | null',
	'gpg_key_user_email?': 'string | null',
	'key?': gitlabCommitSignatureSshKeyWire.or('null'),
	'x509_certificate?': gitlabCommitSignatureX509CertificateWire.or('null'),
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
	project_id: 'number.integer >= 0',
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

const gitlabNoteAuthorWire = type({
	id: 'number.integer >= 0',
	username: 'string > 0',
	name: 'string',
	web_url: 'string.url',
})

const gitlabNotePositionWire = type({
	old_path: 'string',
	new_path: 'string',
	'old_line?': 'number.integer | null',
	'new_line?': 'number.integer | null',
	'position_type?': 'string',
})

export const gitlabNoteWire = type({
	id: 'number.integer >= 0',
	body: 'string',
	created_at: 'string > 0',
	updated_at: 'string > 0',
	system: 'boolean',
	noteable_iid: 'number.integer >= 0',
	noteable_type: 'string > 0',
	'type?': 'string | null',
	'author?': gitlabNoteAuthorWire,
	'resolvable?': 'boolean',
	'resolved?': 'boolean',
	'discussion_id?': 'string > 0',
	'position?': gitlabNotePositionWire,
})

export type GitlabNote = typeof gitlabNoteWire.infer

export const gitlabNotesWire = gitlabNoteWire.array()

export const gitlabMergeRequestWire = type({
	iid: 'number.integer >= 0',
	project_id: 'number.integer >= 0',
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

export const gitlabReleaseAssetLinkWire = type({
	id: 'number.integer >= 0',
	name: 'string > 0',
	url: 'string.url',
	'link_type?': 'string > 0',
	'direct_asset_url?': 'string.url',
})

export type GitlabReleaseAssetLink = typeof gitlabReleaseAssetLinkWire.infer

export const gitlabReleaseAssetLinksWire = gitlabReleaseAssetLinkWire.array()

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
	'assets?': {
		'count?': 'number.integer >= 0',
		'links?': gitlabReleaseAssetLinkWire.array(),
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
