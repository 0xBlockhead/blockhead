/**
 * [ethereum-lists/chains](https://github.com/ethereum-lists/chains) aggregate: `GET /chains.json`
 * on [chainid.network](https://chainid.network).
 */
import { throwHttpError } from '$/lib/http.ts'
import type { EthereumListsChainJson } from '$/sources/EthereumLists/Rest/types.ts'
import {
	sourceFetch,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/EthereumLists/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.EthereumLists_Rest]

type EthereumListsIconJson = {
	url?: string
}[]

type GithubTreeResponse = {
	tree?: {
		path?: string
	}[]
}

const httpUrlForBindingAtIndex = (
	endpointIndex: 0 | 1
) => {
	const endpoint = binding.endpoints[endpointIndex]
	return endpoint.locator
}

export const fetchChainsJson = async (): Promise<EthereumListsChainJson[]> => {
	const url = new URL('/chains.json', httpUrlForBindingAtIndex(0)).toString()
	const response = await sourceFetch(binding, url, {
		cache: 'no-store',
	})
	if (!response.ok) await throwHttpError('EthereumLists chains.json', response)
	return response.json()
}

export const fetchIconSlugs = async (): Promise<Set<string>> => {
	const result = await sourceGetJson<GithubTreeResponse>(
		binding,
		new URL(
			'/repos/ethereum-lists/chains/git/trees/master?recursive=1',
			httpUrlForBindingAtIndex(1)
		).toString()
	)
	return new Set(
		(result.tree ?? [])
			.flatMap((row) => (
				row.path?.startsWith('_data/icons/') && row.path.endsWith('.json') ?
					[row.path.slice('_data/icons/'.length, -'.json'.length)]
				:
					[]
			))
	)
}

export const fetchIconJsonBySlug = async (
	slug: string
): Promise<EthereumListsIconJson | undefined> => {
	const trimmed = slug.trim()
	if (trimmed.length === 0) return undefined
	if (!(await fetchIconSlugs()).has(trimmed)) return undefined
	return sourceGetJson<EthereumListsIconJson>(
		binding,
		new URL(
			`/icons/${encodeURIComponent(trimmed)}.json`,
			httpUrlForBindingAtIndex(0)
		).toString()
	)
}
