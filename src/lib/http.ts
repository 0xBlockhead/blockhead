import type { SourceOrigin } from '$/sources/SourceProvider.ts'
import { isJsonObject, jsonMessage, type JsonValue } from '$/typescript/JsonValue.ts'


export type RetryOptions = {
	/** Max retry attempts for 429 responses. Default 3. */
	maxRetries?: number
	/** Initial backoff delay in ms (doubles each retry). Default 1_000. */
	baseDelayMs?: number
	/** Max delay in ms. Default 30_000. */
	maxDelayMs?: number
}

const defaultRetry: Required<RetryOptions> = {
	maxRetries: 3,
	baseDelayMs: 1_000,
	maxDelayMs: 30_000,
}

const fetchTimeoutMs = 30_000

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const withTimeout = (init: RequestInit | undefined): RequestInit => ({
	...init,
	signal: init?.signal == null ?
		AbortSignal.timeout(fetchTimeoutMs)
	:
		AbortSignal.any([
			init.signal,
			AbortSignal.timeout(fetchTimeoutMs),
		]),
})

/** Full jitter: random delay in [0, cap]. */
const jitterBackoff = (attempt: number, baseDelayMs: number, maxDelayMs: number): number => {
	const cap = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs)
	return Math.random() * cap
}

/** Parse `Retry-After` header: seconds (number) or HTTP-date. Returns ms delay or undefined. */
const retryAfterMs = (response: Response): number | undefined => {
	const header = response.headers.get('retry-after')
	if (!header) return undefined
	const seconds = Number(header)
	if (!Number.isNaN(seconds)) return seconds * 1_000
	const parsed = Date.parse(header)
	if (!Number.isNaN(parsed)) return Math.max(0, parsed - Date.now())
	return undefined
}

export type CorsAwareFetchOptions = {
	/** Provider-scoped rows — `corsEnabled` for `url`’s origin is read from here (single definition with `hooks` allow-list). */
	origins: readonly SourceOrigin[]
	init?: RequestInit
	retry?: RetryOptions
}

const doFetch = async (
	url: string,
	options: CorsAwareFetchOptions
): Promise<Response> => {
	if (!url.startsWith('http://') && !url.startsWith('https://'))
		return fetch(url, withTimeout(options.init))

	const origin = new URL(url).origin
	const sourceOrigin = options.origins.find((entry) => entry.origin === origin)
	if (sourceOrigin == null)
		throw new Error(`Unregistered source origin for ${url}`)

	return (
		typeof window === 'undefined' ?
			fetch(url, withTimeout(options.init))
		: sourceOrigin.corsEnabled ?
			fetch(url, withTimeout(options.init))
		:
			fetch(`/api-proxy/${url}`, withTimeout(options.init))
	)
}

export const corsFetch = async (
	url: string,
	options: CorsAwareFetchOptions
): Promise<Response> => {
	const retry: Required<RetryOptions> = {
		...defaultRetry,
		...options.retry,
	}

	for (let attempt = 0; ; attempt++) {
		const response = await doFetch(url, options)

		if (response.status !== 429 || attempt >= retry.maxRetries) return response

		const delay = (
			retryAfterMs(response)
			?? jitterBackoff(attempt, retry.baseDelayMs, retry.maxDelayMs)
		)
		await sleep(delay)
	}
}


/** Pull `{ message }` / `{ error: { message } }` from JSON bodies — generic gateways often return `{ message: "Internal Error" }`. */
export const jsonErrorHintFromResponse = async (
	response: Response
): Promise<string | undefined> => {
	const ct = response.headers.get('content-type') ?? ''
	if (!ct.includes('application/json')) return undefined
	let parsed: JsonValue
	try {
		parsed = await response.clone().json()
	}
	catch {
		return undefined
	}
	const message = jsonMessage(parsed) ?? (
		isJsonObject(parsed) ?
			jsonMessage(parsed.error)
		:
			undefined
	)
	return message?.trim() === '' ? undefined : message?.trim()
}


export const fetchFailedMessage = async (
	url: string,
	response: Response
): Promise<string> => {
	const base = `Fetch failed (${response.status} ${response.statusText}) for ${url}`
	const hint = await jsonErrorHintFromResponse(response)
	return hint ? `${base}: ${hint}` : base
}


export const throwIfHttpNotOk = async (
	response: Response,
	url: string
): Promise<void> => {
	if (response.ok) return
	throw new Error(await fetchFailedMessage(url, response))
}


/** Context-labelled failures (`CoinGecko …`) merged with JSON body hints when present. */
export const throwHttpError = async (
	contextLabel: string,
	response: Response
): Promise<never> => {
	const hint = await jsonErrorHintFromResponse(response)
	throw new Error(
		hint ?
			`${contextLabel} (${response.status}): ${hint}`
		:
			`${contextLabel}: ${response.status} ${response.statusText}`
	)
}


/**
	* `GET` (or custom `init`) then `Response.text()` after `res.ok`.
	*/
export const getText = async (
	url: string,
	options: CorsAwareFetchOptions
): Promise<string> => {
	const response = await corsFetch(url, options)

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
	options: CorsAwareFetchOptions
): Promise<T> => {
	const response = await corsFetch(url, options)

	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}
