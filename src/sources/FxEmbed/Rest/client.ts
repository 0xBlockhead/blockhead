import { getJson } from '$/lib/http.ts'
import FxEmbed from '$/sources/FxEmbed/index.ts'
import { fxEmbedApiV2Base } from '$/sources/FxEmbed/Rest/constants.ts'

const toQuery = (params: Record<string, string | number | undefined>) => {
	const searchParams = new URLSearchParams()
	for (const [key, value] of Object.entries(params)) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}
	const query = searchParams.toString()
	return query ? `?${query}` : ''
}

export const fxEmbedGet = async <T>(
	path: `/${string}`,
	params?: Record<string, string | number | undefined>,
): Promise<T> => (
	getJson<T>(
		`${fxEmbedApiV2Base}${path}${toQuery(params ?? {})}`,
		{ origins: FxEmbed.origins  },
	)
)
