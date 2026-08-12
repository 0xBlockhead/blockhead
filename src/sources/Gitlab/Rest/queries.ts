import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Gitlab/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	gitlabBranchesWire,
	gitlabIssueWire,
	gitlabMergeRequestWire,
	gitlabProjectWire,
	gitlabReleaseWire,
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

export const getRepositoryTree = ({
	projectId,
	path,
	ref,
}: {
	projectId: string
	path?: string
	ref?: string
}) => (
	getJson<JsonValue>(
		binding,
		`/api/v4/projects/${encodeURIComponent(projectId)}/repository/tree?${
			new URLSearchParams({
				...(path != null && { path }),
				...(ref != null && { ref }),
			})
		}`
	)
)
