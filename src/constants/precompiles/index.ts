import type { PrecompileEntry } from '$/constants/precompiles/types.ts'
import { standardPrecompiles } from '$/constants/precompiles/standard.ts'
import eip15510x1Json from '$/data/precompiles/eip155-1-0x1.json'
import eip15510x2Json from '$/data/precompiles/eip155-1-0x2.json'
import eip15510x3Json from '$/data/precompiles/eip155-1-0x3.json'
import eip15510x4Json from '$/data/precompiles/eip155-1-0x4.json'
import eip15510x5Json from '$/data/precompiles/eip155-1-0x5.json'
import eip15510x6Json from '$/data/precompiles/eip155-1-0x6.json'
import eip15510x7Json from '$/data/precompiles/eip155-1-0x7.json'
import eip15510x8Json from '$/data/precompiles/eip155-1-0x8.json'
import eip15510x9Json from '$/data/precompiles/eip155-1-0x9.json'
import eip1551ScheduleJson from '$/data/precompiles/eip155-1-schedule.json'
import eip1553ScheduleJson from '$/data/precompiles/eip155-3-schedule.json'
import eip1554ScheduleJson from '$/data/precompiles/eip155-4-schedule.json'
import eip155421610x64Json from '$/data/precompiles/eip155-42161-0x64.json'
import eip15542161ScheduleJson from '$/data/precompiles/eip155-42161-schedule.json'
import eip155421611ScheduleJson from '$/data/precompiles/eip155-421611-schedule.json'
import eip155422200xe1Json from '$/data/precompiles/eip155-42220-0xe1.json'
import eip155422200xe2Json from '$/data/precompiles/eip155-42220-0xe2.json'
import eip155422200xe3Json from '$/data/precompiles/eip155-42220-0xe3.json'
import eip155422200xe4Json from '$/data/precompiles/eip155-42220-0xe4.json'
import eip155422200xe5Json from '$/data/precompiles/eip155-42220-0xe5.json'
import eip155422200xe6Json from '$/data/precompiles/eip155-42220-0xe6.json'
import eip155422200xe7Json from '$/data/precompiles/eip155-42220-0xe7.json'
import eip155422200xe8Json from '$/data/precompiles/eip155-42220-0xe8.json'
import eip155422200xe9Json from '$/data/precompiles/eip155-42220-0xe9.json'
import eip155422200xeaJson from '$/data/precompiles/eip155-42220-0xea.json'
import eip155422200xebJson from '$/data/precompiles/eip155-42220-0xeb.json'
import eip155422200xecJson from '$/data/precompiles/eip155-42220-0xec.json'
import eip155422200xedJson from '$/data/precompiles/eip155-42220-0xed.json'
import eip155422200xeeJson from '$/data/precompiles/eip155-42220-0xee.json'
import eip155422200xefJson from '$/data/precompiles/eip155-42220-0xef.json'
import eip155422200xf0Json from '$/data/precompiles/eip155-42220-0xf0.json'
import eip155422200xf1Json from '$/data/precompiles/eip155-42220-0xf1.json'
import eip155422200xf2Json from '$/data/precompiles/eip155-42220-0xf2.json'
import eip155422200xf3Json from '$/data/precompiles/eip155-42220-0xf3.json'
import eip155422200xf4Json from '$/data/precompiles/eip155-42220-0xf4.json'
import eip155422200xf5Json from '$/data/precompiles/eip155-42220-0xf5.json'
import eip155422200xf6Json from '$/data/precompiles/eip155-42220-0xf6.json'
import eip155422200xf7Json from '$/data/precompiles/eip155-42220-0xf7.json'
import eip155422200xf8Json from '$/data/precompiles/eip155-42220-0xf8.json'
import eip155422200xf9Json from '$/data/precompiles/eip155-42220-0xf9.json'
import eip155422200xfaJson from '$/data/precompiles/eip155-42220-0xfa.json'
import eip155422200xfbJson from '$/data/precompiles/eip155-42220-0xfb.json'
import eip155422200xfcJson from '$/data/precompiles/eip155-42220-0xfc.json'
import eip155422200xfdJson from '$/data/precompiles/eip155-42220-0xfd.json'
import eip15542220ScheduleJson from '$/data/precompiles/eip155-42220-schedule.json'
import eip15544787ScheduleJson from '$/data/precompiles/eip155-44787-schedule.json'
import eip1555ScheduleJson from '$/data/precompiles/eip155-5-schedule.json'
import eip15562320ScheduleJson from '$/data/precompiles/eip155-62320-schedule.json'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'


const normalizeAddress = (address: `0x${string}`): string => (
	address.slice(2).toLowerCase().padStart(40, '0')
)

type ShemnonSchedule = {
	name?: string
} & Record<`${number}`, string[]>

type ShemnonPrecompile = {
	name: string
	address?: {
		full?: string
		hex?: string
	}
}

const syncedPrecompileEntries = [
	{ path: 'eip155-1-0x1.json', data: eip15510x1Json },
	{ path: 'eip155-1-0x2.json', data: eip15510x2Json },
	{ path: 'eip155-1-0x3.json', data: eip15510x3Json },
	{ path: 'eip155-1-0x4.json', data: eip15510x4Json },
	{ path: 'eip155-1-0x5.json', data: eip15510x5Json },
	{ path: 'eip155-1-0x6.json', data: eip15510x6Json },
	{ path: 'eip155-1-0x7.json', data: eip15510x7Json },
	{ path: 'eip155-1-0x8.json', data: eip15510x8Json },
	{ path: 'eip155-1-0x9.json', data: eip15510x9Json },
	{ path: 'eip155-1-schedule.json', data: eip1551ScheduleJson },
	{ path: 'eip155-3-schedule.json', data: eip1553ScheduleJson },
	{ path: 'eip155-4-schedule.json', data: eip1554ScheduleJson },
	{ path: 'eip155-42161-0x64.json', data: eip155421610x64Json },
	{ path: 'eip155-42161-schedule.json', data: eip15542161ScheduleJson },
	{ path: 'eip155-421611-schedule.json', data: eip155421611ScheduleJson },
	{ path: 'eip155-42220-0xe1.json', data: eip155422200xe1Json },
	{ path: 'eip155-42220-0xe2.json', data: eip155422200xe2Json },
	{ path: 'eip155-42220-0xe3.json', data: eip155422200xe3Json },
	{ path: 'eip155-42220-0xe4.json', data: eip155422200xe4Json },
	{ path: 'eip155-42220-0xe5.json', data: eip155422200xe5Json },
	{ path: 'eip155-42220-0xe6.json', data: eip155422200xe6Json },
	{ path: 'eip155-42220-0xe7.json', data: eip155422200xe7Json },
	{ path: 'eip155-42220-0xe8.json', data: eip155422200xe8Json },
	{ path: 'eip155-42220-0xe9.json', data: eip155422200xe9Json },
	{ path: 'eip155-42220-0xea.json', data: eip155422200xeaJson },
	{ path: 'eip155-42220-0xeb.json', data: eip155422200xebJson },
	{ path: 'eip155-42220-0xec.json', data: eip155422200xecJson },
	{ path: 'eip155-42220-0xed.json', data: eip155422200xedJson },
	{ path: 'eip155-42220-0xee.json', data: eip155422200xeeJson },
	{ path: 'eip155-42220-0xef.json', data: eip155422200xefJson },
	{ path: 'eip155-42220-0xf0.json', data: eip155422200xf0Json },
	{ path: 'eip155-42220-0xf1.json', data: eip155422200xf1Json },
	{ path: 'eip155-42220-0xf2.json', data: eip155422200xf2Json },
	{ path: 'eip155-42220-0xf3.json', data: eip155422200xf3Json },
	{ path: 'eip155-42220-0xf4.json', data: eip155422200xf4Json },
	{ path: 'eip155-42220-0xf5.json', data: eip155422200xf5Json },
	{ path: 'eip155-42220-0xf6.json', data: eip155422200xf6Json },
	{ path: 'eip155-42220-0xf7.json', data: eip155422200xf7Json },
	{ path: 'eip155-42220-0xf8.json', data: eip155422200xf8Json },
	{ path: 'eip155-42220-0xf9.json', data: eip155422200xf9Json },
	{ path: 'eip155-42220-0xfa.json', data: eip155422200xfaJson },
	{ path: 'eip155-42220-0xfb.json', data: eip155422200xfbJson },
	{ path: 'eip155-42220-0xfc.json', data: eip155422200xfcJson },
	{ path: 'eip155-42220-0xfd.json', data: eip155422200xfdJson },
	{ path: 'eip155-42220-schedule.json', data: eip15542220ScheduleJson },
	{ path: 'eip155-44787-schedule.json', data: eip15544787ScheduleJson },
	{ path: 'eip155-5-schedule.json', data: eip1555ScheduleJson },
	{ path: 'eip155-62320-schedule.json', data: eip15562320ScheduleJson },
] as const satisfies readonly {
	path: string
	data: ShemnonSchedule | ShemnonPrecompile
}[]
const syncedPrecompileSchedulePattern = /eip155-(\d+)-schedule\.json$/
const syncedPrecompileDefinitionPattern = /eip155-(\d+)-0x([0-9a-fA-F]+)\.json$/

const precompileAddress = (address: ShemnonPrecompile['address']) => {
	if (address == null)
		throw new Error('Precompile definition missing address')

	const sourceHex = (
		address.full?.length === 66 ?
			address.full.slice(2)
	:
			address.hex
	)
	if (sourceHex == null || sourceHex === '')
		throw new Error('Precompile definition missing address hex')

	const hex = sourceHex.replace(/^0x/, '')
	return ZeroExHex.assert(`0x${hex.padStart(40, '0')}`)
}

const dedupeSortPrecompiles = (
	list: readonly PrecompileEntry[]
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

const syncedPrecompileById = new Map<string, PrecompileEntry>()
const syncedPrecompilesByChainId = new Map<number, PrecompileEntry[]>()

for (const { path, data } of syncedPrecompileEntries) {
	if (path.includes('manifest')) continue
	const match = path.match(syncedPrecompileDefinitionPattern)

	if (match == null) {
		if (syncedPrecompileSchedulePattern.test(path)) continue
		throw new Error(`Unrecognized precompile data file ${path}`)
	}
	if (!('address' in data))
		throw new Error(`Precompile definition missing address in ${path}`)

	syncedPrecompileById.set(path.slice(path.lastIndexOf('/') + 1).replace('.json', ''), {
		address: precompileAddress(data.address),
		name: data.name,
	})
}

for (const { path, data } of syncedPrecompileEntries) {
	if (path.includes('manifest')) continue
	const match = path.match(syncedPrecompileSchedulePattern)

	if (match == null) {
		if (syncedPrecompileDefinitionPattern.test(path)) continue
		throw new Error(`Unrecognized precompile data file ${path}`)
	}
	if (!('name' in data))
		throw new Error(`Precompile schedule missing name in ${path}`)

	const precompiles = new Set<PrecompileEntry>()

	for (const key of Object.keys(data)) {
		if (!/^\d+$/.test(key)) continue
		const ids = data[key]

		for (const id of ids) {
			const precompile = syncedPrecompileById.get(id)

			if (precompile == null)
				throw new Error(`Precompile schedule ${path} references unknown definition ${id}`)

			precompiles.add(precompile)
		}
	}

	syncedPrecompilesByChainId.set(Number(match[1]), dedupeSortPrecompiles([...precompiles]))
}


/** Precompiles per chain (synced schedule or standard set). */
export const precompilesByChainId = Object.fromEntries(
	[...syncedPrecompilesByChainId.keys()].map((chainId) => [
		chainId,
		dedupeSortPrecompiles(
			syncedPrecompilesByChainId.get(chainId)
			?? standardPrecompiles
		),
	])
)
