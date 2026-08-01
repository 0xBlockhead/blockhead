/**
 * Blockscout REST v2 JSON over HTTP.
 * @see https://docs.blockscout.com/devs/apis/rest
 */

import { throwIfHttpNotOk } from '$/lib/http.ts'
import { restPath } from '$/sources/Blockscout/Rest/constants.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

const blockscoutApiUrl = ({
	binding,
	path,
	searchParams,
}: {
	binding: SourceBinding
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => {
	const url = new URL(firstHttpUrlForBinding(binding))
	url.pathname = `${url.pathname.replace(/\/$/, '')}${restPath}${path}`
	for (const [key, value] of Object.entries(searchParams ?? {}))
		if (value != null)
			url.searchParams.set(key, String(value))

	return url.toString()
}

export const getBlockscoutResponse = ({
	binding,
	path,
	searchParams,
}: {
	binding: SourceBinding
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => sourceFetch(
	binding,
	blockscoutApiUrl({
		binding,
		path,
		searchParams,
	}),
	{
		headers: {
			accept: 'application/json',
		},
	}
)

export const getBlockscoutJson = async <_Response>(parameters: Parameters<typeof getBlockscoutResponse>[0]) => {
	const response = await getBlockscoutResponse(parameters)
	await throwIfHttpNotOk(response, response.url)

	return response.json<_Response>()
}
