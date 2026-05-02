/**
 * Derive L1/L2/shard relationships from `GET https://chainid.network/chains.json`
 * ([ethereum-lists/chains](https://github.com/ethereum-lists/chains)).
 * @see https://github.com/ethereum-lists/chains
 * @see https://eips.ethereum.org/EIPS/eip-3085
 */
import type { EthereumListsChainJson } from '$/sources/EthereumLists/Rest/types.ts'
import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'

const parseEip155ChainId = (ref: string): number | undefined => {
	const m = /^eip155[:-](\d+)$/i.exec(ref.trim())
	return m != null ? Number(m[1]) : undefined
}

const parentRefMatchesChainId = (parentRef: string, chainId: number): boolean => (
	parseEip155ChainId(parentRef) === chainId
)

const childLayerChainIdsForParent = (
	allChains: EthereumListsChainJson[],
	parentChainId: number,
): number[] => {
	const out: number[] = []
	for (const c of allChains) {
		const ref = c.parent?.chain
		if (ref == null) continue
		if (!parentRefMatchesChainId(ref, parentChainId)) continue
		if (c.chainId === parentChainId) continue
		out.push(c.chainId)
	}
	return [...new Set(out)].toSorted((a, b) => a - b)
}

const siblingShardChainIds = (
	allChains: EthereumListsChainJson[],
	chain: EthereumListsChainJson,
): number[] => {
	const p = chain.parent
	if (p == null || p.chain == null) return []
	if (String(p.type ?? '').toLowerCase() !== 'shard') return []
	const ref = p.chain.trim()
	const out: number[] = []
	for (const c of allChains) {
		if (c.chainId === chain.chainId) continue
		const cp = c.parent
		if (cp == null || cp.chain?.trim() !== ref) continue
		if (String(cp.type ?? '').toLowerCase() !== 'shard') continue
		out.push(c.chainId)
	}
	return out.toSorted((a, b) => a - b)
}

export type NetworkParentLayerFields = {
	bridgeUrls: string[]
	parentChainCaip: string
	parentChainId: number
	relationshipType: string
}

const networkParentLayerFromChain = (
	chain: EthereumListsChainJson,
): NetworkParentLayerFields | undefined => {
	const raw = chain.parent
	if (raw == null || raw.chain == null) return undefined
	const parentChainId = parseEip155ChainId(raw.chain)
	if (parentChainId == null) return undefined
	const bridgeUrls = (
		(raw.bridges ?? [])
			.map((b) => b.url)
			.filter((u) => typeof u === 'string' && u.length > 0)
	)
	return {
		bridgeUrls,
		parentChainCaip: raw.chain.trim(),
		parentChainId,
		relationshipType: String(raw.type ?? 'unknown'),
	}
}

const isTestnetHeuristic = (c: EthereumListsChainJson) => {
	const t = `${c.title ?? ''} ${c.name}`
	if (/testnet/i.test(t)) return true
	return undefined
}

export const networkTopologyFieldsFromEthereumListsChain = (
	chain: EthereumListsChainJson,
	allChains: EthereumListsChainJson[],
) => {
	const isTest = isTestnetHeuristic(chain)
	return {
		childLayerChainIds: childLayerChainIdsForParent(allChains, chain.chainId),
		correspondingChainIds: [] as number[],
		...(isTest !== undefined ? {
			environment: (
				isTest ?
					NetworkEnvironment.Testnet
				:
					NetworkEnvironment.Mainnet
			),
		} : {}),
		parentLayer: networkParentLayerFromChain(chain),
		siblingShardChainIds: siblingShardChainIds(allChains, chain),
	}
}

export { childLayerChainIdsForParent, siblingShardChainIds }
