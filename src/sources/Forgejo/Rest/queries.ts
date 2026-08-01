import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const getRepository = ({
	binding,
	owner,
	repo,
}: {
	binding: SourceBinding
	owner: string
	repo: string
}) => (
	getJson<JsonValue>(binding, `/repos/${owner}/${repo}`)
)

export const getContents = ({
	binding,
	owner,
	repo,
	path,
	ref,
}: {
	binding: SourceBinding
	owner: string
	repo: string
	path: string
	ref?: string
}) => (
	getJson<JsonValue>(
		binding,
		`/repos/${owner}/${repo}/contents/${path}${ref == null ? '' : `?ref=${encodeURIComponent(ref)}`}`
	)
)
