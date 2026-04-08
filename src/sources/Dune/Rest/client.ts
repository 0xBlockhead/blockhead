/**
 * Dune REST client — `PUBLIC_DUNE_API_KEY` → `X-DUNE-API-KEY`.
 * @see https://docs.dune.com/api-reference/overview/authentication.md
 */

import { duneApiBaseUrl } from '$/sources/Dune/Rest/constants.ts'

const duneApiKey = (): string => {
	const v = import.meta.env.PUBLIC_DUNE_API_KEY
	if (typeof v !== 'string' || !v.trim()) {
		throw new Error(
			'Missing or empty required env: PUBLIC_DUNE_API_KEY. Set it in .env.',
		)
	}
	return v.trim()
}

export const duneRequestHeaders = (): Record<string, string> => ({
	'Content-Type': 'application/json',
	Accept: 'application/json',
	'X-DUNE-API-KEY': duneApiKey(),
})

export async function duneFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const url = `${duneApiBaseUrl}${path}`
	const res = await fetch(url, {
		...init,
		headers: { ...duneRequestHeaders(), ...init?.headers },
	})
	if (!res.ok) throw new Error(`Dune API ${res.status}: ${await res.text()}`)
	return res.json() as Promise<T>
}
