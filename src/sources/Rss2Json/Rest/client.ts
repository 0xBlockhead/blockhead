import type { Rss2JsonResponse } from '$/sources/Rss2Json/Rest/types.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Rss2Json/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Rss2Json_Rest]

export const rss2JsonGet = (path: string) => (
	sourceGetJson<Rss2JsonResponse>(
		binding,
		`${firstHttpUrlForBinding(binding)}${path.startsWith('/') ? path : `/${path}`}`
	)
)
