import { getJson } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import Superchain from '$/sources/Superchain/index.ts'
import {
	chainListPath,
	networkChainIdBySuperchainIdentifier,
	origin,
} from '$/sources/Superchain/Github/constants.ts'
import type { SuperchainChainListEntry } from '$/sources/Superchain/Github/types.ts'

export type SuperchainNetwork = {
	chainId: number
	name: string
	identifier: string
	namespace: string
	slug: string
	parentChainId?: number
	parentType?: string
}

const splitIdentifier = (identifier: string): {
	namespace: string
	slug: string
} => {
	const [namespace, slug] = identifier.split('/')
	return {
		namespace,
		slug: slug ?? '',
	}
}

const fetchSuperchainChainListOnce = async (): Promise<SuperchainChainListEntry[]> => (
	getJson<SuperchainChainListEntry[]>(
		`${origin}${chainListPath}`,
		{ origins: Superchain.origins },
	)
)

const resolveParentChainId = (
	chain: SuperchainChainListEntry,
	chainByIdentifier: Map<string, SuperchainChainListEntry>,
): number | undefined => {
	const parentChain = chain.parent?.chain
	if (parentChain == null || parentChain.length === 0) return undefined
	const fromNamedNetwork = networkChainIdBySuperchainIdentifier[parentChain]
	if (fromNamedNetwork != null) return fromNamedNetwork
	const parentChainAsNumber = Number(parentChain)
	if (Number.isFinite(parentChainAsNumber) && parentChainAsNumber > 0) return parentChainAsNumber
	const { namespace } = splitIdentifier(chain.identifier)
	const bySameNamespace = chainByIdentifier.get(`${namespace}/${parentChain}`)?.chainId
	if (bySameNamespace != null) return bySameNamespace
	const byMainnetNamespace = chainByIdentifier.get(`mainnet/${parentChain}`)?.chainId
	if (byMainnetNamespace != null) return byMainnetNamespace
	const bySepoliaNamespace = chainByIdentifier.get(`sepolia/${parentChain}`)?.chainId
	return bySepoliaNamespace
}

const toSuperchainNetwork = (
	chain: SuperchainChainListEntry,
	chainByIdentifier: Map<string, SuperchainChainListEntry>,
): SuperchainNetwork => {
	const { namespace, slug } = splitIdentifier(chain.identifier)
	return {
		chainId: chain.chainId,
		name: chain.name,
		identifier: chain.identifier,
		namespace,
		slug,
		...(chain.parent != null ? { parentType: chain.parent.type } : {}),
		...((parentChainId) => parentChainId == null ? {} : { parentChainId })(
			resolveParentChainId(chain, chainByIdentifier),
		),
	}
}

const fetchSuperchainNetworksOnce = async (): Promise<SuperchainNetwork[]> => {
	const chainList = await fetchSuperchainChainListOnce()
	const chainByIdentifier = new Map(
		chainList.map((chain) => [
			chain.identifier,
			chain,
		]),
	)
	return chainList
		.map((chain) => toSuperchainNetwork(chain, chainByIdentifier))
		.toSorted((leftChain, rightChain) => leftChain.chainId - rightChain.chainId)
}

export const fetchSuperchainNetworks = singleFlight(fetchSuperchainNetworksOnce)
