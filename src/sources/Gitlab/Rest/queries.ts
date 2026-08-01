import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Gitlab/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Gitlab_Rest]

export const getProject = ({
	projectId,
}: {
	projectId: string
}) => (
	getJson<JsonValue>(binding, `/api/v4/projects/${encodeURIComponent(projectId)}`)
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
