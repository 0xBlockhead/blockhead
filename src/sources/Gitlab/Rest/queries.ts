import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { GitlabJson } from '$/sources/Gitlab/Rest/types.ts'

export const getProject = ({
	binding,
	projectId,
}: {
	binding: SourceBinding
	projectId: string
}) => (
	getJson<GitlabJson>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}`)
)

export const getRepositoryTree = ({
	binding,
	projectId,
	path,
	ref,
}: {
	binding: SourceBinding
	projectId: string
	path?: string
	ref?: string
}) => (
	getJson<GitlabJson>(
		binding,
		`/api/v4/projects/${encodeURIComponent(projectId)}/repository/tree?${
			new URLSearchParams({
				...(path != null && { path }),
				...(ref != null && { ref }),
			})
		}`
	)
)
