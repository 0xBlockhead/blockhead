import type { SourceOrigin } from '$/sources/$SourceProvider.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

/** Client-side fetch via shared api-proxy (`hooks.server.ts`). Pass absolute `http(s):` URL; origin must be allow-listed. Browser uses `/api-proxy`; SSR uses direct `fetch`. */
export const proxyFetch: typeof fetch = async (input, init) => {
	const href = (
		typeof input === 'string' ?
			input
		: input instanceof URL ?
			input.href
		:	'url' in input && typeof input.url === 'string' ?
			input.url
		:	''
	)
	if (!href.startsWith('http://') && !href.startsWith('https://')) return fetch(input, init)
	return (
		typeof window !== 'undefined' ?
			fetch(`/api-proxy/${href}`, init)
		:	fetch(input, init)
	)
}

export type CorsAwareFetchOptions =
	| {
		/** Provider-scoped rows — `corsEnabled` for `url`’s origin is read from here (single definition with `hooks` allow-list). */
		origins: readonly SourceOrigin[]
		init?: RequestInit
	}
	| {
		/** Escape hatch when the URL is not listed on a provider (ad-hoc RPC, arbitrary Blockscout host, …). */
		corsEnabled: boolean
		init?: RequestInit
	}

const resolveCorsEnabled = (url: string, options: CorsAwareFetchOptions): boolean => (
	'corsEnabled' in options ?
		options.corsEnabled
	:	(
			options.origins.find((entry) => entry.origin === new URL(url).origin)?.corsEnabled ??
			false
		)
)

const httpFetch = async (
	url: string,
	options: CorsAwareFetchOptions,
): Promise<Response> => (
	!url.startsWith('http://') && !url.startsWith('https://') ?
		fetch(url, options.init)
	: typeof window === 'undefined' ?
		fetch(url, options.init)
	: !resolveCorsEnabled(url, options) ?
		proxyFetch(url, options.init)
	:	fetch(url, options.init)
)

/**
 * `GET` (or custom `init`) then `Response.text()` after `res.ok`.
 */
export const getText = async (
	url: string,
	options: CorsAwareFetchOptions,
): Promise<string> => {
	const response = await httpFetch(url, options)

	if (!response.ok)
		throw new Error(`Fetch failed (${response.status} ${response.statusText}) for ${url}`)

	return response.text()
}

/**
 * `GET` (or custom `init`) then `Response.json()` after `res.ok`.
 * Pass `T` when the wire shape is known; otherwise defaults to `JsonValue`.
 */
export const getJson = async <T = JsonValue>(
	url: string,
	options: CorsAwareFetchOptions,
): Promise<T> => {
	const response = await httpFetch(url, options)

	if (!response.ok)
		throw new Error(`Fetch failed (${response.status} ${response.statusText}) for ${url}`)

	return response.json<T>()
}
