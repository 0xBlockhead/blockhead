import { getJson } from '$/lib/http.ts'
import Primal from '$/sources/Primal/index.ts'
import { primalApiBaseUrl } from '$/sources/Primal/Rest/constants.ts'

const primalUrl = (path: string) => (
	`${primalApiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
)

export const primalGet = async <T>(path: string) => (
	getJson<T>(primalUrl(path), {
		origins: Primal.origins,
	})
)

export const primalPost = async <T>(path: string, body: unknown) => (
	getJson<T>(primalUrl(path), {
		origins: Primal.origins,
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
