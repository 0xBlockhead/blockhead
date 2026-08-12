import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Gitlab/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	gitlabBranchesWire,
	gitlabBranchWire,
	gitlabIssueWire,
	gitlabIssuesWire,
	gitlabMergeRequestWire,
	gitlabMergeRequestsWire,
	gitlabProjectWire,
	gitlabReleaseWire,
	gitlabReleasesWire,
	gitlabRepositoryTreeWire,
	gitlabTagsWire,
	gitlabTagWire,
} from '$/sources/Gitlab/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Gitlab_Rest][0]

export const getProject = ({
	projectId,
}: {
	projectId: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}`)
		.then((project) => {
			try {
				return gitlabProjectWire.assert(project)
			} catch {
				throw new Error('Gitlab_Rest: invalid project response')
			}
		})
)

export const getBranches = ({
	projectId,
}: {
	projectId: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/repository/branches?per_page=100`)
		.then((branches) => {
			try {
				return gitlabBranchesWire.assert(branches)
			} catch {
				throw new Error('Gitlab_Rest: invalid branches response')
			}
		})
)

export const getBranch = ({
	projectId,
	branchName,
}: {
	projectId: string
	branchName: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/repository/branches/${encodeURIComponent(branchName)}`)
		.then((branch) => {
			try {
				return gitlabBranchWire.assert(branch)
			} catch {
				throw new Error('Gitlab_Rest: invalid branch response')
			}
		})
)

export const getTags = ({
	projectId,
}: {
	projectId: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/repository/tags?per_page=100`)
		.then((tags) => {
			try {
				return gitlabTagsWire.assert(tags)
			} catch {
				throw new Error('Gitlab_Rest: invalid tags response')
			}
		})
)

export const getTag = ({
	projectId,
	tagName,
}: {
	projectId: string
	tagName: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/repository/tags/${encodeURIComponent(tagName)}`)
		.then((tag) => {
			try {
				return gitlabTagWire.assert(tag)
			} catch {
				throw new Error('Gitlab_Rest: invalid tag response')
			}
		})
)

export const getIssue = ({
	projectId,
	issueNumber,
}: {
	projectId: string
	issueNumber: number
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/issues/${issueNumber}`)
		.then((issue) => {
			try {
				return gitlabIssueWire.assert(issue)
			} catch {
				throw new Error('Gitlab_Rest: invalid issue response')
			}
		})
)

export const getIssues = ({
	projectId,
}: {
	projectId: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/issues?scope=all&per_page=100`)
		.then((issues) => {
			try {
				return gitlabIssuesWire.assert(issues)
			} catch {
				throw new Error('Gitlab_Rest: invalid issues response')
			}
		})
)

export const getMergeRequest = ({
	projectId,
	pullRequestNumber,
}: {
	projectId: string
	pullRequestNumber: number
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/merge_requests/${pullRequestNumber}`)
		.then((mergeRequest) => {
			try {
				return gitlabMergeRequestWire.assert(mergeRequest)
			} catch {
				throw new Error('Gitlab_Rest: invalid merge request response')
			}
		})
)

export const getMergeRequests = ({
	projectId,
}: {
	projectId: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/merge_requests?scope=all&per_page=100`)
		.then((mergeRequests) => {
			try {
				return gitlabMergeRequestsWire.assert(mergeRequests)
			} catch {
				throw new Error('Gitlab_Rest: invalid merge requests response')
			}
		})
)

export const getRelease = ({
	projectId,
	releaseTagName,
}: {
	projectId: string
	releaseTagName: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/releases/${encodeURIComponent(releaseTagName)}`)
		.then((release) => {
			try {
				return gitlabReleaseWire.assert(release)
			} catch {
				throw new Error('Gitlab_Rest: invalid release response')
			}
		})
)

export const getReleases = ({
	projectId,
}: {
	projectId: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/releases?per_page=100`)
		.then((releases) => {
			try {
				return gitlabReleasesWire.assert(releases)
			} catch {
				throw new Error('Gitlab_Rest: invalid releases response')
			}
		})
)

export const getRepositoryTree = ({
	projectId,
	path,
	ref,
	recursive = true,
}: {
	projectId: string
	path?: string
	ref?: string
	recursive?: boolean
}) => (
	getJson<JsonValue>(
		binding,
		`/api/v4/projects/${encodeURIComponent(projectId)}/repository/tree?${
			new URLSearchParams({
				...(path != null && { path }),
				...(ref != null && { ref }),
				recursive: String(recursive),
				per_page: '100',
			})
		}`
	).then((tree) => {
		try {
			return gitlabRepositoryTreeWire.assert(tree)
		} catch {
			throw new Error('Gitlab_Rest: invalid repository tree response')
		}
	})
)
