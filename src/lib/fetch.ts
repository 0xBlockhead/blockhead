/**
 * `GET` (or custom `init`) then `Response.text()` after `res.ok`.
 */
export const getText = async (url: string, init?: RequestInit): Promise<string> => {
	const res = await fetch(url, init)
	if (!res.ok) throw new Error(`Fetch failed (${res.status} ${res.statusText}) for ${url}`)
	return res.text()
}

/**
 * `GET` (or custom `init`) then `Response.json()` after `res.ok`.
 * Pass `T` when the wire shape is known; otherwise defaults to `unknown`.
 */
export const getJson = async <T = unknown>(url: string, init?: RequestInit): Promise<T> => {
	const res = await fetch(url, init)
	if (!res.ok) throw new Error(`Fetch failed (${res.status} ${res.statusText}) for ${url}`)
	return (await res.json()) as T
}
