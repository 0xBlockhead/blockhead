import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { firstHttpUrlForBinding, sourceGetJson } from '$/sources/_runtime/http.ts'
import { atprotoAppViewBySlug } from '$/constants/AtprotoAppView.ts'
import { Source } from '$/sources/Source.ts'

const atprotoBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find(({ source }) => source === Source.Atproto_Xrpc)
if (atprotoBinding == null)
	throw new Error('Atproto_Xrpc: source binding is missing')

const toQuery = (params: Record<string, string | number | readonly string[] | undefined>) => {
	const sp = new URLSearchParams()
	for (const [k, v] of Object.entries(params)) {
		if (v == null) continue
		if (v instanceof Array)
			for (const item of v)
				sp.append(k, item)
		else
			sp.set(k, String(v))
	}
	const s = sp.toString()
	return s ? `?${s}` : ''
}

export const bskyPublicXrpcGet = async <T>(
	path: `/${string}`,
	params: Record<string, string | number | readonly string[] | undefined>
): Promise<T> => (
	sourceGetJson<T>(
		atprotoBinding,
		`${firstHttpUrlForBinding(atprotoBinding)}${atprotoAppViewBySlug.bsky_public.xrpcPath}${path}${toQuery(params)}`
	)
)
