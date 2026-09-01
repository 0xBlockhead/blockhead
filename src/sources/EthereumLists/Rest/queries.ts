/**
 * [ethereum-lists/chains](https://github.com/ethereum-lists/chains) aggregate: `GET /chains.json`
 * on [chainid.network](https://chainid.network).
 */
import { throwHttpError } from '$/lib/http.ts'
import type { EthereumListsChainJson } from '$/sources/EthereumLists/Rest/types.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/EthereumLists/bindings.ts'
import { Source } from '$/sources/Source.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.EthereumLists_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)
const chainsBinding = bindingByTargetKey['chains-json']
const githubTreeBinding = bindingByTargetKey['github-tree']

type EthereumListsIconJson = {
	url?: string
}[]

type GithubTreeResponse = {
	tree?: {
		path?: string
	}[]
}

export const fetchChainsJson = async () => {
	const url = new URL('/chains.json', firstHttpUrlForBinding(chainsBinding)).toString()
	const response = await sourceFetch(chainsBinding, url, {
		cache: 'no-store',
	})
	if (!response.ok) await throwHttpError('EthereumLists chains.json', response)
	return response.json<EthereumListsChainJson[]>()
}

export const fetchIconSlugs = async () => {
	const result = await sourceGetJson<GithubTreeResponse>(
		githubTreeBinding,
		new URL(
			'/repos/ethereum-lists/chains/git/trees/master?recursive=1',
			firstHttpUrlForBinding(githubTreeBinding)
		).toString()
	)
	return new Set(
		(result.tree ?? [])
			.flatMap((row) => {
				const slug = row.path?.startsWith('_data/icons/') && row.path.endsWith('.json') ?
					row.path.slice('_data/icons/'.length, -'.json'.length)
				:
					undefined
				return slug == null || slug.length === 0 ? [] : [slug]
			})
	)
}

export const fetchIconJsonBySlug = async (
	slug: string
) => {
	const trimmed = slug.trim()
	if (trimmed.length === 0) return undefined
	if (!(await fetchIconSlugs()).has(trimmed)) return undefined
	return sourceGetJson<EthereumListsIconJson>(
		chainsBinding,
		new URL(
			`/icons/${encodeURIComponent(trimmed)}.json`,
			firstHttpUrlForBinding(chainsBinding)
		).toString()
	)
}
