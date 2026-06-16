/**
 * Load precompiles from synced shemnon/precompiles JSON (src/data/precompiles/*.json).
 * Used by src/constants/precompiles/index.ts. Run pnpm run sources:precompiles:sync to populate data.
 */

import type { PrecompileEntry } from '$/constants/precompiles/types.ts'
import { standardPrecompiles } from '$/constants/precompiles/standard.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'

type ShemnonSchedule = {
	name?: string
} & Record<`${number}`, string[]>

type ShemnonPrecompile = {
	name: string
	address?: { full?: string; hex?: string }
}

const numericScheduleKey = (
	key: string
): key is `${number}` => /^\d+$/.test(key)

const glob = import.meta.glob<{ default: ShemnonSchedule | ShemnonPrecompile }>(
	'/src/data/precompiles/*.json',
	{ eager: true }
)
const entries = Object.entries(glob).map(([path, mod]) => ({
	path,
	data: mod.default,
}))

const scheduleRe = /eip155-(\d+)-schedule\.json$/
const precompileRe = /eip155-(\d+)-0x([0-9a-fA-F]+)\.json$/

function parseAddress(raw: ShemnonPrecompile['address']): `0x${string}` {
	if (!raw) return '0x0000000000000000000000000000000000000000'
	const full = raw.full
	if (full && full.length === 66) {
		return ZeroExHex.assert(full)
	}
	const hex = (raw.hex ?? '').replace(/^0x/, '')
	return ZeroExHex.assert(`0x${hex.padStart(40, '0')}`)
}

const precompileDefs = new Map<string, PrecompileEntry>()
const chainIdsFromSchedules = new Set<number>()

for (const { path, data } of entries) {
	if (path.includes('manifest')) continue
	const scheduleMatch = path.match(scheduleRe)
	if (scheduleMatch) {
		chainIdsFromSchedules.add(Number(scheduleMatch[1]))
		continue
	}
	const precompileMatch = path.match(precompileRe)
	if (precompileMatch && 'address' in data) {
		const id = path.slice(path.lastIndexOf('/') + 1).replace('.json', '')
		precompileDefs.set(id, {
			address: parseAddress(data.address),
			name: data.name,
		})
	}
}

function precompileIdsFromSchedule(schedule: ShemnonSchedule): string[] {
	const ids = new Set<string>()
	for (const key of Object.keys(schedule)) {
		if (!numericScheduleKey(key)) continue
		for (const id of schedule[key]) ids.add(id)
	}
	return [...ids]
}

/** Block number (string key) → precompile ids introduced at that block. Excludes non-numeric keys (e.g. "name"). */
export const syncedScheduleByChainId = new Map<
	number,
	Record<string, string[]>
>()

const precompilesByChainId = new Map<number, PrecompileEntry[]>()

function resolvePrecompileIds(ids: string[]): PrecompileEntry[] {
	const seen = new Set<string>()
	const list: PrecompileEntry[] = []
	for (const id of ids) {
		let def = precompileDefs.get(id)
		if (!def && id.startsWith('eip155-4220-'))
			def = precompileDefs.get(id.replace('eip155-4220-', 'eip155-42220-'))
		if (!def) continue
		const key = def.address.toLowerCase()
		if (seen.has(key)) continue
		seen.add(key)
		list.push(def)
	}
	return list.sort((a, b) => (BigInt(a.address) < BigInt(b.address) ? -1 : 1))
}

for (const { path, data } of entries) {
	if (path.includes('manifest')) continue
	const scheduleMatch = path.match(scheduleRe)
	if (!scheduleMatch) continue
	const chainId = Number(scheduleMatch[1])
	if (!('name' in data)) continue
	const schedule: ShemnonSchedule = data
	const byBlock: Record<string, string[]> = {}
	for (const key of Object.keys(schedule)) {
		if (!numericScheduleKey(key)) continue
		byBlock[key] = schedule[key]
	}
	syncedScheduleByChainId.set(chainId, byBlock)
	const ids = precompileIdsFromSchedule(schedule)
	precompilesByChainId.set(chainId, resolvePrecompileIds(ids))
}

/** Chain IDs that have a schedule in the synced shemnon data. */
export const syncedChainIds = new Set(chainIdsFromSchedules)

/** Precompiles per chain from shemnon data end-state. Empty if sync never run. */
export const syncedPrecompilesByChainId = precompilesByChainId

/** Precompiles active at or before blockNumber; end-state when blockNumber is undefined. */
export const getPrecompilesActiveAtBlock = (
	chainId: number,
	blockNumber: number | undefined
): PrecompileEntry[] => {
	const schedule = syncedScheduleByChainId.get(chainId)
	if (schedule == null) {
		return [...standardPrecompiles]
	}
	if (blockNumber == null) {
		return precompilesByChainId.get(chainId) ?? [...standardPrecompiles]
	}
	const ids = new Set<string>()
	for (const [blockKey, precompileIds] of Object.entries(schedule)) {
		if (!/^\d+$/.test(blockKey)) continue
		if (BigInt(blockKey) > BigInt(blockNumber)) continue
		for (const id of precompileIds) ids.add(id)
	}
	return resolvePrecompileIds([...ids])
}

/** Precompiles introduced at the given block (from schedule). Returns [] if no schedule or no entry for that block. */
export function getPrecompilesIntroducedAtBlock(
	chainId: number,
	blockNumber: number
): PrecompileEntry[] {
	const schedule = syncedScheduleByChainId.get(chainId)
	if (!schedule) return []
	const ids = schedule[String(blockNumber)]
	if (!ids.length) return []
	return resolvePrecompileIds(ids)
}
