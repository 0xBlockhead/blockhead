import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Gitlab/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	gitlabBranchesWire,
	gitlabBranchWire,
	gitlabCompareWire,
	gitlabCommitSignatureWire,
	gitlabCommitsWire,
	gitlabCommitWire,
	gitlabIssueWire,
	gitlabIssuesWire,
	gitlabJobsWire,
	gitlabMergeRequestWire,
	gitlabMergeRequestsWire,
	gitlabProjectWire,
	gitlabPipelinesWire,
	gitlabReleaseWire,
	gitlabReleasesWire,
	gitlabRepositoryTreeWire,
	gitlabTagsWire,
	gitlabTagWire,
} from '$/sources/Gitlab/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Gitlab_Rest][0]

const gitlabPaginationParams = (
	page: number,
	perPage: number
) => {
	if (!Number.isSafeInteger(page) || page < 1)
		throw new Error('Gitlab_Rest: invalid page')
	if (!Number.isSafeInteger(perPage) || perPage < 1 || perPage > 100)
		throw new Error('Gitlab_Rest: invalid per-page limit')

	return {
		page: String(page),
		per_page: String(perPage),
	}
}

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

export const getCommit = ({
	projectId,
	commitSha,
}: {
	projectId: string
	commitSha: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/repository/commits/${encodeURIComponent(commitSha)}`)
		.then((commit) => {
			try {
				return gitlabCommitWire.assert(commit)
			} catch {
				throw new Error('Gitlab_Rest: invalid commit response')
			}
		})
)

export const getCommits = ({
	projectId,
	ref,
	page = 1,
	perPage = 100,
}: {
	projectId: string
	ref?: string
	page?: number
	perPage?: number
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/repository/commits?${new URLSearchParams({
		...(ref != null && { ref_name: ref }),
		...gitlabPaginationParams(page, perPage),
	})}`)
		.then((commits) => {
			try {
				return gitlabCommitsWire.assert(commits)
			} catch {
				throw new Error('Gitlab_Rest: invalid commits response')
			}
		})
)

export const getCommitSignature = ({
	projectId,
	commitSha,
}: {
	projectId: string
	commitSha: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/repository/commits/${encodeURIComponent(commitSha)}/signature`)
		.then((signature) => {
			try {
				return gitlabCommitSignatureWire.assert(signature)
			} catch {
				throw new Error('Gitlab_Rest: invalid commit signature response')
			}
		})
)

export const getPipelines = ({
	projectId,
	ref,
	page = 1,
	perPage = 100,
}: {
	projectId: string
	ref?: string
	page?: number
	perPage?: number
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/pipelines?${new URLSearchParams({
		...(ref != null && { ref }),
		...gitlabPaginationParams(page, perPage),
	})}`)
		.then((pipelines) => {
			try {
				return gitlabPipelinesWire.assert(pipelines)
			} catch {
				throw new Error('Gitlab_Rest: invalid pipelines response')
			}
		})
)

export const getPipelineJobs = ({
	projectId,
	pipelineId,
	page = 1,
	perPage = 100,
}: {
	projectId: string
	pipelineId: number
	page?: number
	perPage?: number
}) => {
	if (!Number.isSafeInteger(pipelineId) || pipelineId < 0)
		throw new Error('Gitlab_Rest: invalid pipeline ID')

	return getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/pipelines/${pipelineId}/jobs?${new URLSearchParams(
		gitlabPaginationParams(page, perPage)
	)}`)
		.then((jobs) => {
			try {
				return gitlabJobsWire.assert(jobs)
			} catch {
				throw new Error('Gitlab_Rest: invalid pipeline jobs response')
			}
		})
}

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
	page = 1,
	perPage = 100,
}: {
	projectId: string
	page?: number
	perPage?: number
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/issues?${new URLSearchParams({
		scope: 'all',
		...gitlabPaginationParams(page, perPage),
	})}`)
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
	page = 1,
	perPage = 100,
}: {
	projectId: string
	page?: number
	perPage?: number
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/merge_requests?${new URLSearchParams({
		scope: 'all',
		...gitlabPaginationParams(page, perPage),
	})}`)
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
	page = 1,
	perPage = 100,
}: {
	projectId: string
	page?: number
	perPage?: number
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/releases?${new URLSearchParams({
		...gitlabPaginationParams(page, perPage),
	})}`)
		.then((releases) => {
			try {
				return gitlabReleasesWire.assert(releases)
			} catch {
				throw new Error('Gitlab_Rest: invalid releases response')
			}
		})
)

export const compareRepositoryRefs = ({
	projectId,
	from,
	to,
	straight = false,
}: {
	projectId: string
	from: string
	to: string
	straight?: boolean
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}/repository/compare?${new URLSearchParams({
		from,
		to,
		straight: String(straight),
	})}`)
		.then((comparison) => {
			try {
				return gitlabCompareWire.assert(comparison)
			} catch {
				throw new Error('Gitlab_Rest: invalid repository comparison response')
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
