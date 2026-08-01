
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/AtprotoBskySocial/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Atproto_BskySocial_Xrpc]

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

export const bskySocialXrpcGet = <T>(
	path: `/${string}`,
	params: Record<string, string | number | readonly string[] | undefined>
) => (
	sourceGetJson<T>(
		binding,
		`${firstHttpUrlForBinding(binding)}/xrpc${path}${toQuery(params)}`
	)
)
