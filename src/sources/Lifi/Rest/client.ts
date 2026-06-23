import { corsFetch } from '$/lib/http.ts'
import { lifiOrigins } from '$/sources/Lifi/index.ts'
import { baseUrl } from '$/sources/Lifi/Rest/constants.ts'


export const lifiRestFetch = (
	path: string,
	init?: RequestInit,
	options?: { baseUrl?: string }
): Promise<Response> => {
	const root = options?.baseUrl ?? baseUrl
	const url = path.startsWith('http') ? path : `${root}${path}`
	return corsFetch(url, {
		origins: lifiOrigins,
		init: {
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
		},
	})
}
