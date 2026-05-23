import { getJson } from '$/lib/http.ts'
import NostrBand from '$/sources/NostrBand/index.ts'
import { nostrBandApiBaseUrl } from '$/sources/NostrBand/Rest/constants.ts'

const toQuery = (params: Record<string, string | number | undefined>) => {
	const searchParams = new URLSearchParams()
	for (const [key, value] of Object.entries(params)) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}
	const query = searchParams.toString()
	return query ? `?${query}` : ''
}

export const nostrBandGet = async <T>(
	path: string,
	params?: Record<string, string | number | undefined>,
): Promise<T> => (
	getJson<T>(
		`${nostrBandApiBaseUrl}${path.startsWith('/') ? path : `/${path}`}${toQuery(params ?? {})}`,
		{ origins: NostrBand.origins ?? [] },
	)
)
