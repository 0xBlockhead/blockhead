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

const dedupeSortPrecompiles = (
	list: readonly PrecompileEntry[],
): PrecompileEntry[] => {
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


/** Precompiles per chain (synced schedule or standard set). */
export const precompilesByChainId = Object.fromEntries(
	[...syncedChainIds].map((chainId) => [
		chainId,
		dedupeSortPrecompiles(
			syncedPrecompilesByChainId.get(chainId)
			?? standardPrecompiles,
		),
	]),
)
