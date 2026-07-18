import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'

const bskySocialBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find(({ source }) => source === Source.Atproto_BskySocial_Xrpc)

if (bskySocialBinding == null)
	throw new Error('Atproto_BskySocial_Xrpc: source binding is missing')

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

export const bskySocialXrpcGet = async <T>(
	path: `/${string}`,
	params: Record<string, string | number | readonly string[] | undefined>
): Promise<T> => (
	sourceGetJson<T>(
		bskySocialBinding,
		`${firstHttpUrlForBinding(bskySocialBinding)}/xrpc${path}${toQuery(params)}`
	)
)
