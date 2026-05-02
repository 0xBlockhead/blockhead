/**
 * Chainlist `rpcs.json` wire → Network entity field bag, including L1/L2/shard topology
 * (`parent` follows EIP-3085) and public-list metadata.
 * @see https://github.com/DefiLlama/chainlist
 * @see https://eips.ethereum.org/EIPS/eip-3085
 */
import type { ChainId } from '$/constants/ChainId.ts'
import { NetworkEnvironment } from '$/constants/NetworkEnvironment.ts'
import { ExecutionRpcProvider } from '$/constants/ExecutionRpcProvider.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { chainPrimaryExplorerUrl, isPublicRpcUrl } from '$/sources/Chainlist/Rest/queries.ts'
import { findChainByChainId, rpcUrlsWithoutHeavyTracking } from '$/sources/Chainlist/Rest/rpcsJsonWire.ts'
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'

export const chainlistListMetadataFromChain = (chain: ChainlistRpcsJsonChain) => {
	const out: {
		chainIcon?: string
		faucets?: string[]
		registryNetworkId?: number
		registryStatus?: string
		shortName?: string
		slip44?: number
	} = {}
	if (chain.shortName != null && String(chain.shortName).length) {
		out.shortName = String(chain.shortName)
	}
	if (chain.status != null && String(chain.status).length) {
		out.registryStatus = String(chain.status)
	}
	if (chain.networkId != null) {
		out.registryNetworkId = chain.networkId
	}
	if (chain.slip44 != null) {
		out.slip44 = chain.slip44
	}
	const iconFromIcons = chain.icons?.find((i) => i?.url != null && String(i.url).length)
	const icon = chain.icon ?? iconFromIcons?.url
	if (icon != null && String(icon).length) {
		out.chainIcon = String(icon)
	}
	const fa = chain.faucets?.filter((u) => typeof u === 'string' && u.length)
	if (fa != null && fa.length) {
		out.faucets = fa
	}
	return out
}

const parseEip155ChainId = (ref: string): number | undefined => {
	const m = /^eip155[:-](\d+)$/i.exec(ref.trim())
	return m != null ? Number(m[1]) : undefined
}

const parentRefMatchesChainId = (parentRef: string, chainId: number): boolean => (
	parseEip155ChainId(parentRef) === chainId
)

export const childLayerChainIdsForParent = (
	allChains: ChainlistRpcsJsonChain[],
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
	allChains: ChainlistRpcsJsonChain[],
	chain: ChainlistRpcsJsonChain,
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
	chain: ChainlistRpcsJsonChain,
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

const networkTopologyFieldsFromChain = (
	chain: ChainlistRpcsJsonChain,
	allChains: ChainlistRpcsJsonChain[],
) => ({
	childLayerChainIds: childLayerChainIdsForParent(allChains, chain.chainId),
	correspondingChainIds: [] as number[],
	environment: (
		chain.isTestnet === true ?
			NetworkEnvironment.Testnet
		:
			NetworkEnvironment.Mainnet
	),
	parentLayer: networkParentLayerFromChain(chain),
	siblingShardChainIds: siblingShardChainIds(allChains, chain),
})

export const networkFieldBagFromChain = (
	chain: ChainlistRpcsJsonChain,
	chains: ChainlistRpcsJsonChain[],
) => {
	const publicRpcUrl = rpcUrlsWithoutHeavyTracking(chain).find(isPublicRpcUrl)
	const primaryExplorerUrl = chainPrimaryExplorerUrl(chain)
	const explorers: string[] = []
	const pushUniqueExplorer = (value: string) => {
		const t = value.trim()
		if (t.length && !explorers.includes(t)) explorers.push(t)
	}
	for (const e of chain.explorers ?? []) {
		if (e?.url) pushUniqueExplorer(e.url)
	}
	if (chain.infoURL) pushUniqueExplorer(chain.infoURL)
	const chainId = chain.chainId as ChainId
	return {
		[EntityMetaKey.Id]: { chainId: chain.chainId },
		name: chain.title ?? chain.name,
		...(chain.nativeCurrency.symbol !== '' ?
			{ nativeSymbol: chain.nativeCurrency.symbol }
		:
			{}),
		...(primaryExplorerUrl != null ? { explorerOrigin: primaryExplorerUrl } : {}),
		...(publicRpcUrl != null ? { rpcUrl: publicRpcUrl } : {}),
		explorers,
		executionEndpoints: (
			rpcUrlsWithoutHeavyTracking(chain).map((url) => (
				{
					chainId,
					url,
					serviceProvider: ExecutionRpcProvider.Unknown,
					transportType: (
						url.toLowerCase().startsWith('ws') ?
							TransportType.WebSocket
						:
							TransportType.Http
					),
				}
			))
		),
		...chainlistListMetadataFromChain(chain),
		...networkTopologyFieldsFromChain(chain, chains),
	}
}
