/**
 * Blockscout REST v2 JSON over HTTP.
 * @see https://docs.blockscout.com/devs/apis/rest
 */

import { throwIfHttpNotOk } from '$/lib/http.ts'
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
	const url = blockscoutApiUrl({
		explorerOrigin,
		path,
		searchParams,
	})
	const res = await fetch(url, { headers: { accept: 'application/json' } })
	await throwIfHttpNotOk(res, url)

	return res.json<T>()
}
