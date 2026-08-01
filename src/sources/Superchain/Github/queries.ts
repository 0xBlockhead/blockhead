import bindings from '$/sources/Superchain/bindings.ts'
import {
	githubRepositoryTargetFromKey,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import type { SuperchainChainListEntry } from '$/sources/Superchain/Github/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Superchain_Github]

export const getChainList = async () => {
	const chains = await sourceGetJson<SuperchainChainListEntry[]>(
		binding,
		githubRawUrl(githubRepositoryTargetFromKey(binding.target.key))
	)
	if (
		new Set(chains.map((chain) => chain.chainId)).size !== chains.length
		|| new Set(chains.map((chain) => chain.identifier)).size !== chains.length
		|| chains.some((chain) => (
			chain.name.length === 0
			|| !/^[^/]+\/[^/]+$/.test(chain.identifier)
			|| !Number.isSafeInteger(chain.chainId)
			|| chain.chainId <= 0
			|| chain.parent?.chain === ''
		))
	)
		throw new Error('Superchain_Github: malformed chain list')

	return chains
}
