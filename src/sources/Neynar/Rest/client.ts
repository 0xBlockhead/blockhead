/**
 * Neynar REST client — `PUBLIC_NEYNAR_API_KEY` → `x-api-key`.
 * Missing or invalid keys resolve to `undefined` so Farcaster pages can degrade gracefully.
 * @see https://docs.neynar.com/reference
 */

import { neynarApiBaseUrl } from '$/sources/Neynar/Rest/constants.ts'

const neynarApiKey = () => {
	const v = import.meta.env.PUBLIC_NEYNAR_API_KEY
	return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined
}

export const neynarRequestHeaders = (): Record<string, string> | undefined => {
	const apiKey = neynarApiKey()
	return apiKey == null ?
		undefined
	:	{
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		}
}

export async function neynarFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<T | undefined> {
	const headers = neynarRequestHeaders()
	if (headers == null) return undefined
	const res = await fetch(`${neynarApiBaseUrl}${path}`, {
		...init,
		headers: { ...headers, ...init?.headers },
	})
	if (res.status === 401 || res.status === 403) return undefined
	if (!res.ok) throw new Error(`Neynar API ${res.status}: ${await res.text()}`)
	return res.json() as Promise<T>
}
