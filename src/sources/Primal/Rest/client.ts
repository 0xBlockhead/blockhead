import { getJson } from '$/lib/http.ts'
import { primalOrigins } from '$/sources/Primal/index.ts'
import { primalApiBaseUrl } from '$/sources/Primal/Rest/constants.ts'
import type { PrimalPostBody } from '$/sources/Primal/Rest/types.ts'

const primalUrl = (path: string) => (
	`${primalApiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
)

export const primalGet = async <T>(path: string) => (
	getJson<T>(primalUrl(path), {
		origins: primalOrigins,
	})
)

export const primalPost = async <T>(path: string, body: PrimalPostBody) => (
	getJson<T>(primalUrl(path), {
		origins: primalOrigins,
		init: {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	})
)
