/**
 * [ethereum-lists/chains](https://github.com/ethereum-lists/chains) aggregate: `GET /chains.json`
 * on [chainid.network](https://chainid.network).
 */
import { getJson } from '$/lib/http.ts'
import EthereumLists from '$/sources/EthereumLists/index.ts'
import {
	chainsJsonPath,
	githubApiOrigin,
	origin,
} from '$/sources/EthereumLists/Rest/constants.ts'
import type { EthereumListsChainJson } from '$/sources/EthereumLists/Rest/types.ts'

type EthereumListsIconJson = {
	url?: string
}[]

type GithubTreeResponse = {
	tree?: {
		path?: string
	}[]
}

export const fetchChainsJson = async (): Promise<EthereumListsChainJson[]> => {
	const url = `${origin}${chainsJsonPath}`
	return getJson<EthereumListsChainJson[]>(url, { origins: EthereumLists.origins })
}


export const fetchIconSlugs = async (): Promise<Set<string>> => {
	const result = await getJson<GithubTreeResponse>(
		`${githubApiOrigin}/repos/ethereum-lists/chains/git/trees/master?recursive=1`,
		{ origins: EthereumLists.origins }
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
	return getJson<EthereumListsIconJson>(
		`${origin}/icons/${encodeURIComponent(trimmed)}.json`,
		{ origins: EthereumLists.origins }
	)
}
