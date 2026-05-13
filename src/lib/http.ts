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


/** Pull `{ message }` / `{ error: { message } }` from JSON bodies — generic gateways often return `{ message: "Internal Error" }`. */
export const jsonErrorHintFromResponse = async (
	response: Response,
): Promise<string | undefined> => {
	const ct = response.headers.get('content-type') ?? ''
	if (!ct.includes('application/json')) return undefined
	let parsed: unknown
	try {
		parsed = await response.clone().json()
	}
	catch {
		return undefined
	}
	if (
		parsed != null
		&& typeof parsed === 'object'
		&& !Array.isArray(parsed)
		&& 'message' in parsed
		&& typeof (parsed as { message: unknown }).message === 'string'
	) {
		const trimmed = (parsed as { message: string }).message.trim()
		return trimmed === '' ? undefined : trimmed
	}
	if (
		parsed != null
		&& typeof parsed === 'object'
		&& !Array.isArray(parsed)
		&& 'error' in parsed
	) {
		const inner = (parsed as { error: unknown }).error
		if (
			inner != null
			&& typeof inner === 'object'
			&& !Array.isArray(inner)
			&& 'message' in inner
			&& typeof (inner as { message: unknown }).message === 'string'
		) {
			const trimmed = (inner as { message: string }).message.trim()
			return trimmed === '' ? undefined : trimmed
		}
	}
	return undefined
}


export const fetchFailedMessage = async (
	url: string,
	response: Response,
): Promise<string> => {
	const base = `Fetch failed (${response.status} ${response.statusText}) for ${url}`
	const hint = await jsonErrorHintFromResponse(response)
	return hint ? `${base}: ${hint}` : base
}


export const throwIfHttpNotOk = async (
	response: Response,
	url: string,
): Promise<void> => {
	if (response.ok) return
	throw new Error(await fetchFailedMessage(url, response))
}


/** Context-labelled failures (`CoinGecko …`) merged with JSON body hints when present. */
export const throwHttpError = async (
	contextLabel: string,
	response: Response,
): Promise<never> => {
	const hint = await jsonErrorHintFromResponse(response)
	throw new Error(
		hint ?
			`${contextLabel} (${response.status}): ${hint}`
		:
			`${contextLabel}: ${response.status} ${response.statusText}`,
	)
}


/**
 * `GET` (or custom `init`) then `Response.text()` after `res.ok`.
 */
export const getText = async (
	url: string,
	options: CorsAwareFetchOptions,
): Promise<string> => {
	const response = await httpFetch(url, options)

	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

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
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}
