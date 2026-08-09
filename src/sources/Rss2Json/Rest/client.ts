import type { Rss2JsonResponse } from '$/sources/Rss2Json/Rest/types.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const rss2JsonGet = (binding: SourceBinding, path: string) => (
	sourceGetJson<Rss2JsonResponse>(
		binding,
		`${firstHttpUrlForBinding(binding)}${path.startsWith('/') ? path : `/${path}`}`
	)
)
