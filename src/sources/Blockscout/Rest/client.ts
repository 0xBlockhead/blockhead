/**
 * Blockscout REST v2 JSON over HTTP.
 * @see https://docs.blockscout.com/devs/apis/rest
 */

import { restPath } from '$/sources/Blockscout/Rest/constants.ts'

const blockscoutApiUrl = ({
	explorerOrigin,
	path,
	searchParams,
}: {
	explorerOrigin: string
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => {
	const url = new URL(explorerOrigin)
	url.pathname = `${url.pathname.replace(/\/$/, '')}${restPath}${path}`
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value != null) url.searchParams.set(key, String(value))
	}
	return url.toString()
}

export const getJson = async <T>({
	explorerOrigin,
	path,
	searchParams,
}: {
	explorerOrigin: string
	path: string
	searchParams?: Record<string, string | number | undefined>
}): Promise<T> => {
	const res = await fetch(
		blockscoutApiUrl({
			explorerOrigin,
			path,
			searchParams,
		}),
		{ headers: { accept: 'application/json' } },
	)
	if (!res.ok) throw new Error(`Blockscout GET ${res.status} ${res.statusText}`)

	return (await res.json()) as T
}
