import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { ForgejoJson } from '$/sources/Forgejo/Rest/types.ts'

export const getRepository = ({
	binding,
	owner,
	repo,
}: {
	binding: SourceBinding
	owner: string
	repo: string
}) => (
	getJson<ForgejoJson>(binding, `/repos/${owner}/${repo}`)
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
	getJson<ForgejoJson>(
		binding,
		`/repos/${owner}/${repo}/contents/${path}${ref == null ? '' : `?ref=${encodeURIComponent(ref)}`}`
	)
)
