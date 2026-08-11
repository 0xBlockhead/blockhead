import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const rss2JsonGet = (binding: SourceBinding, path: string) => (
	sourceGetJson<unknown>(
		binding,
		`${firstHttpUrlForBinding(binding)}${path.startsWith('/') ? path : `/${path}`}`
	)
)
