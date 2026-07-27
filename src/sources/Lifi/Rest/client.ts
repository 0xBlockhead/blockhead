import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Lifi/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Lifi_Rest]

export const lifiRestFetch = (
	path: string,
	init?: RequestInit
): Promise<Response> => {
	return sourceFetch(
		binding,
		new URL(path, firstHttpUrlForBinding(binding)).toString(),
		{
			...init,
			headers: {
				Accept: 'application/json',
				...(
					init?.headers != null ?
						Object.fromEntries(new Headers(init.headers).entries())
					:
						{}
				),
			},
		}
	)
}
