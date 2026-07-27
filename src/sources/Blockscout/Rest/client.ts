/**
	* Blockscout REST v2 JSON over HTTP.
	* @see https://docs.blockscout.com/devs/apis/rest
	*/

import { throwIfHttpNotOk } from '$/lib/http.ts'
import bindings from '$/sources/Blockscout/bindings.ts'
import { restPath } from '$/sources/Blockscout/Rest/constants.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceOperationGroup,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const blockscoutClient = (binding: SourceBinding) => ({
	query: <
		_Arguments extends object,
		_Result
	>(
		query: (_arguments: _Arguments & {
			binding: SourceBinding
		}) => _Result,
		arguments_: _Arguments
	) => query({
		...arguments_,
		binding,
	}),
})

const requireBlockscoutBinding = ({
	chainId,
	apiFamily,
	requiredOperationGroup,
}: {
	chainId: number
	apiFamily: ApiFamily
	requiredOperationGroup: SourceOperationGroup
}) => {
	const binding = bindings[Source.Blockscout_Rest].find((candidate) => (
		candidate.target.key === String(chainId)
		&& candidate.apiFamily === apiFamily
		&& candidate.operationGroups.includes(requiredOperationGroup)
	))
	if (binding == null)
		throw new Error(`Blockscout_Rest: no ${apiFamily} binding for chain ${chainId}`)

	return binding
}

export const blockscoutRestClient = (
	chainId: number,
	requiredOperationGroup = SourceOperationGroup.GenericRead
) => blockscoutClient(requireBlockscoutBinding({
	chainId,
	apiFamily: ApiFamily.BlockscoutRestV2,
	requiredOperationGroup,
}))

export const blockscoutAccountAbstractionClient = (
	chainId: number
) => blockscoutRestClient(
	chainId,
	SourceOperationGroup.BlockscoutAccountAbstraction
)

export const blockscoutEtherscanClient = (
	chainId: number
) => blockscoutClient(requireBlockscoutBinding({
	chainId,
	apiFamily: ApiFamily.EtherscanModuleAction,
	requiredOperationGroup: SourceOperationGroup.EtherscanAccountModule,
}))

const blockscoutLegacyApiUrl = ({
	binding,
	query,
}: {
	binding: SourceBinding
	query: Record<string, string>
}) => {
	const url = new URL(firstHttpUrlForBinding(binding))
	url.pathname = `${url.pathname.replace(/\/$/, '')}/api`
	for (const [key, value] of Object.entries(query)) {
		url.searchParams.set(key, value)
	}
	return url.toString()
}

const blockscoutEthRpcUrl = (binding: SourceBinding) => {
	const url = new URL(firstHttpUrlForBinding(binding))
	url.pathname = `${url.pathname.replace(/\/$/, '')}/api/eth-rpc`
	return url.toString()
}

const blockscoutApiUrl = ({
	binding,
	path,
	searchParams,
}: {
	binding: SourceBinding
	path: string
	searchParams?: Record<string, string | number | undefined>
}) => {
	const url = new URL(firstHttpUrlForBinding(binding))
	url.pathname = `${url.pathname.replace(/\/$/, '')}${restPath}${path}`
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value != null) url.searchParams.set(key, String(value))
	}
	return url.toString()
}

export const getBlockscoutLegacyJson = async <T>({
	binding,
	query,
}: {
	binding: SourceBinding
	query: Record<string, string>
}): Promise<T> => {
	const url = blockscoutLegacyApiUrl({
		binding,
		query,
	})
	const res = await sourceFetch(
		binding,
		url,
		{ headers: { accept: 'application/json' } }
	)
	await throwIfHttpNotOk(res, url)
	return res.json<T>()
}

export const postBlockscoutEthRpc = async <T>({
	binding,
	method,
	params,
}: {
	binding: SourceBinding
	method: string
	params: readonly JsonValue[]
}): Promise<T | null> => {
	const url = blockscoutEthRpcUrl(binding)
	const res = await sourceFetch(
		binding,
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

export const getBlockscoutJson = async <T>({
	binding,
	path,
	searchParams,
}: {
	binding: SourceBinding
	path: string
	searchParams?: Record<string, string | number | undefined>
}): Promise<T> => {
	const url = blockscoutApiUrl({
		binding,
		path,
		searchParams,
	})
	const res = await sourceFetch(
		binding,
		url,
		{ headers: { accept: 'application/json' } }
	)
	await throwIfHttpNotOk(res, url)

	return res.json<T>()
}
