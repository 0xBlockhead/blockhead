import { getJson } from '$/lib/http.ts'
import { atprotoAppViewBySlug } from '$/constants/AtprotoAppView.ts'
import AtprotoBsky from '$/sources/AtprotoBsky/index.ts'

const toQuery = (params: Record<string, string | number | undefined>) => {
	const sp = new URLSearchParams()
	for (const [k, v] of Object.entries(params)) {
		if (v == null) continue
		sp.set(k, String(v))
	}
	const s = sp.toString()
	return s ? `?${s}` : ''
}

export const bskyPublicXrpcGet = async <T>(
	path: `/${string}`,
	params: Record<string, string | number | undefined>
): Promise<T> => (
	getJson<T>(
		`${atprotoAppViewBySlug.bsky_public.origin}${atprotoAppViewBySlug.bsky_public.xrpcPath}${path}${toQuery(params)}`,
		{ origins: AtprotoBsky.origins  }
	)
)
