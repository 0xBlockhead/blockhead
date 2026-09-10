import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'

export const httpUrl = (
	binding: SourceBinding,
	path = '',
	query?: Record<string, string | number | boolean | undefined>
) => {
	const baseUrl = new URL(firstHttpUrlForBinding(binding))
	if (path !== '' && !path.startsWith('?') && !path.startsWith('#') && !baseUrl.pathname.endsWith('/'))
		baseUrl.pathname += '/'
	const url = new URL(path, baseUrl)
	for (const [key, value] of Object.entries(query ?? {}))
		if (value != null)
			url.searchParams.set(key, String(value))

	return url.toString()
}

export const getJson = <_Json>(
	binding: SourceBinding,
	path = ''
) => (
	sourceGetJson<_Json>(binding, httpUrl(binding, path))
)

export const getText = (
	binding: SourceBinding,
	path = ''
) => (
	sourceGetText(binding, httpUrl(binding, path))
)

export const postJson = <_Json>({
	binding,
	path = '',
	body,
}: {
	binding: SourceBinding
	path?: string
	body: unknown
}) => (
	sourceFetch(binding, httpUrl(binding, path), {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(body),
	}).then(async (response) => {
		if (!response.ok)
			await throwHttpError(`${binding.source} ${path}`, response)

		return response.json<_Json>()
	})
)
