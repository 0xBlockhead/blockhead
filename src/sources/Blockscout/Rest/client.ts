/**
 * Blockscout REST v2 JSON over HTTP.
 * @see https://docs.blockscout.com/devs/apis/rest
 */

import { corsFetch, throwIfHttpNotOk } from '$/lib/http.ts'
import {
	blockscoutExplorerOrigins,
	restPath,
} from '$/sources/Blockscout/Rest/constants.ts'

const blockscoutLegacyApiUrl = ({
	explorerOrigin,
	query,
}: {
	explorerOrigin: string
	query: Record<string, string>
}) => {
	const url = new URL(explorerOrigin)
	url.pathname = `${url.pathname.replace(/\/$/, '')}/api`
	for (const [key, value] of Object.entries(query)) {
		url.searchParams.set(key, value)
	}
	return url.toString()
}

const blockscoutEthRpcUrl = (explorerOrigin: string) => {
	const url = new URL(explorerOrigin)
	url.pathname = `${url.pathname.replace(/\/$/, '')}/api/eth-rpc`
	return url.toString()
}

const blockscoutApiUrl = ({
	explorerOrigin,
	path,
	searchParams,
}: {
	explorerOrigin: string
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => {
	const url = new URL(explorerOrigin)
	url.pathname = `${url.pathname.replace(/\/$/, '')}${restPath}${path}`
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value != null) url.searchParams.set(key, String(value))
	}
	return url.toString()
}

export const getBlockscoutLegacyJson = async <T>({
	explorerOrigin,
	query,
}: {
	explorerOrigin: string
	query: Record<string, string>
}): Promise<T> => {
	const url = blockscoutLegacyApiUrl({
		explorerOrigin,
		query,
	})
	const res = await corsFetch(url, {
		origins: blockscoutExplorerOrigins,
		init: { headers: { accept: 'application/json' } },
	})
	await throwIfHttpNotOk(res, url)
	return res.json<T>()
}

export const postBlockscoutEthRpc = async <T>({
	explorerOrigin,
	method,
	params,
}: {
	explorerOrigin: string
	method: string
	params: unknown[]
}): Promise<T | null> => {
	const url = blockscoutEthRpcUrl(explorerOrigin)
	const res = await corsFetch(url, {
		origins: blockscoutExplorerOrigins,
		init: {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method,
				params,
			}),
		},
	})
	await throwIfHttpNotOk(res, url)
	const wire = await res.json() as {
		result?: T
		error?: { message?: string }
	}
	if (wire.error != null) return null
	return wire.result ?? null
}

export const getJson = async <T>({
	explorerOrigin,
	path,
	searchParams,
}: {
	explorerOrigin: string
	path: string
	searchParams?: Record<string, string | number | undefined>
}): Promise<T> => {
	const url = blockscoutApiUrl({
		explorerOrigin,
		path,
		searchParams,
	})
	const res = await corsFetch(url, {
		origins: blockscoutExplorerOrigins,
		init: { headers: { accept: 'application/json' } },
	})
	await throwIfHttpNotOk(res, url)

	return res.json<T>()
}
