import { getJson as fetchGetJson } from '$/lib/fetch.ts'

import { blockscoutRestApiV2Path } from '$/sources/Blockscout/Rest/constants.ts'

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
	url.pathname = `${url.pathname.replace(/\/$/, '')}${blockscoutRestApiV2Path}${path}`
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value != null) url.searchParams.set(key, String(value))
	}
	return url.toString()
}

export const getJson = <T>({
	explorerOrigin,
	path,
	searchParams,
}: {
	explorerOrigin: string
	path: string
	searchParams?: Record<string, string | number | undefined>
}): Promise<T> => (
	fetchGetJson<T>(blockscoutApiUrl({
		explorerOrigin,
		path,
		searchParams,
	}))
)
