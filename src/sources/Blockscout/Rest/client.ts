/**
	* Blockscout REST v2 JSON over HTTP.
	* @see https://docs.blockscout.com/devs/apis/rest
	*/

import { throwIfHttpNotOk } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { restPath } from '$/sources/Blockscout/Rest/constants.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { ApiFamily, SourceEndpointKind } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const blockscoutRestBindingByOrigin = Object.fromEntries(
	sourceProviderDefinitions
		.flatMap((provider) => provider.bindings)
		.filter((binding) => (
			binding.source === Source.Blockscout_Rest
			&& binding.apiFamily === ApiFamily.BlockscoutRestV2
		))
		.flatMap((binding) => binding.endpoints.flatMap((endpoint) => (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl ?
				[[endpoint.origin, binding] as const]
			:
				[]
		)))
)

const blockscoutRestBindingForExplorerOrigin = (explorerOrigin: string) => {
	const binding = blockscoutRestBindingByOrigin[new URL(explorerOrigin).origin]
	if (binding == null)
		throw new Error(`Blockscout_Rest: no REST v2 binding for ${explorerOrigin}`)

	return binding
}

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
	const res = await sourceFetch(
		blockscoutRestBindingForExplorerOrigin(explorerOrigin),
		url,
		{ headers: { accept: 'application/json' } }
	)
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
	params: readonly JsonValue[]
}): Promise<T | null> => {
	const url = blockscoutEthRpcUrl(explorerOrigin)
	const res = await sourceFetch(
		blockscoutRestBindingForExplorerOrigin(explorerOrigin),
		url,
		{
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
		}
	)
	await throwIfHttpNotOk(res, url)
	const wire: {
		result?: T
		error?: { message?: string }
	} = await res.json()
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
	const res = await sourceFetch(
		blockscoutRestBindingForExplorerOrigin(explorerOrigin),
		url,
		{ headers: { accept: 'application/json' } }
	)
	await throwIfHttpNotOk(res, url)

	return res.json<T>()
}
