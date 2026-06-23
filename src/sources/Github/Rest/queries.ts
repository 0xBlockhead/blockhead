import { throwHttpError } from '$/lib/http.ts'
import { restHeaders } from '$/sources/Github/Rest/constants.ts'
import type { GhFile } from '$/sources/Github/Rest/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	httpUrl,
	getText,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const encodePathSegments = (path: string) => (
	path
		.split('/')
		.map((segment) => encodeURIComponent(segment))
		.join('/')
)

const githubGetJson = <_Json>(
	binding: SourceBinding,
	path: string
) => (
	sourceFetch(binding, httpUrl(binding, path), {
		headers: restHeaders,
	}).then(async (response) => {
		if (!response.ok)
			await throwHttpError(`${binding.source} ${path}`, response)

		return response.json<_Json>()
	})
)

export const getRepository = ({
	binding,
	owner,
	repo,
}: {
	binding: SourceBinding
	owner: string
	repo: string
}) => (
	githubGetJson<JsonValue>(binding, `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)
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
	githubGetJson<GhFile | GhFile[]>(
		binding,
		`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodePathSegments(path)}${ref == null ? '' : `?ref=${encodeURIComponent(ref)}`}`
	)
)

export const getRawText = ({
	binding,
	owner,
	repo,
	ref,
	path,
}: {
	binding: SourceBinding
	owner: string
	repo: string
	ref: string
	path: string
}) => (
	getText(binding, `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`)
)
