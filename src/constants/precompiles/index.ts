/**
 * Per-chain EVM precompiles. Data from shemnon/precompiles (sync into src/data/precompiles).
 * Chains without a schedule in synced data get the standard set.
 */

import type { PrecompileEntry } from '$/constants/precompiles/types.ts'
import { standardPrecompiles } from '$/constants/precompiles/standard.ts'
import {
	syncedChainIds,
	syncedPrecompilesByChainId,
} from '$/data/precompiles/load.ts'


const normalizeAddress = (address: `0x${string}`): string => (
	address.slice(2).toLowerCase().padStart(40, '0')
)


/** Precompiles for a chain: from synced shemnon data or standard set. Deduped and sorted by address. */
export const getPrecompilesForChain = (chainId: number): PrecompileEntry[] => {
	const list = (
		syncedPrecompilesByChainId.get(chainId)
		?? [...standardPrecompiles]
	)
	const seen = new Set<string>()
	const out: PrecompileEntry[] = []
	for (const precompile of list) {
		const key = normalizeAddress(precompile.address)
		if (seen.has(key)) continue
		seen.add(key)
		out.push(precompile)
	}
	return out.sort((left, right) => (
		BigInt(left.address) < BigInt(right.address) ?
			-1
		:
			1
	))
}


/** Chain IDs that have a precompile schedule in synced shemnon data. */
export const precompileChainIds = syncedChainIds


/** Address → name map for a chain's precompiles. */
export const getPrecompileAddressToName = (
	chainId: number,
): Record<string, string> => (
	Object.fromEntries(
		getPrecompilesForChain(chainId).map((precompile) => [
			normalizeAddress(precompile.address),
			precompile.name,
		]),
	)
)


/** Catalog precompile name for this contract address on the chain, if any. */
export const getPrecompileNameForAddress = (
	chainId: number,
	address: `0x${string}`,
): string | undefined => (
	getPrecompileAddressToName(chainId)[normalizeAddress(address)]
)
