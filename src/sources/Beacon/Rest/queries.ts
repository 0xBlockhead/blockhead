/**
 * Standard Ethereum beacon node REST (`/eth/v1/...`) — @see https://github.com/ethereum/beacon-APIs
 */

import { proxyFetch, throwHttpError } from '$/lib/http.ts'
import { with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import type { BeaconHeader, BeaconValidatorSummary } from '$/sources/Beacon/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type BeaconHeaderHeadWire = {
	data?: {
		header?: {
			message?: {
				slot?: string
			}
		}
	}
}

type BeaconHeaderWire = {
	data?: {
		root?: string
		canonical?: boolean
		header?: {
			message?: {
				slot?: string
				proposer_index?: string
				parent_root?: string
				state_root?: string
				body_root?: string
			}
		}
	}
}

export const getBeaconHeadSlot = async (beaconRestBaseUrl: string): Promise<number> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await proxyFetch(`${base}/eth/v1/beacon/headers/head`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET head', res)
	const wire = await res.json<BeaconHeaderHeadWire>()
	const data = wire.data
	if (data == null) throw new Error('Beacon: head response missing data')
	const header = data.header
	if (header == null) throw new Error('Beacon: head response missing header')
	const message = header.message
	if (message == null) throw new Error('Beacon: head response missing message')
	const slotRaw = message.slot
	if (slotRaw == null) throw new Error('Beacon: head response missing slot')
	const n = Number.parseInt(String(slotRaw), 10)
	if (!Number.isFinite(n)) throw new Error('Beacon: invalid head slot')
	return n
}

export const getBeaconHeader = async (
	beaconRestBaseUrl: string,
	blockId: string | number,
): Promise<BeaconHeader> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await proxyFetch(`${base}/eth/v1/beacon/headers/${blockId}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET header', res)
	const wire = await res.json<BeaconHeaderWire>()
	const data = wire.data
	if (data == null) throw new Error('Beacon: header response missing data')
	const root = data.root
	if (root == null) throw new Error('Beacon: header response missing root')
	const header = data.header
	if (header == null) throw new Error('Beacon: header response missing header')
	const message = header.message
	if (message == null) throw new Error('Beacon: header response missing message')
	const slotRaw = message.slot
	const proposerRaw = message.proposer_index
	if (slotRaw == null) throw new Error('Beacon: header response missing slot')
	if (proposerRaw == null) throw new Error('Beacon: header response missing proposer index')
	const slot = Number.parseInt(String(slotRaw), 10)
	const proposerIndex = Number.parseInt(String(proposerRaw), 10)
	if (!Number.isFinite(slot)) throw new Error('Beacon: header response invalid slot')
	if (!Number.isFinite(proposerIndex)) throw new Error('Beacon: header response invalid proposer index')
	const parentRoot = message.parent_root
	if (parentRoot == null) throw new Error('Beacon: header response missing parent root')
	const stateRoot = message.state_root
	if (stateRoot == null) throw new Error('Beacon: header response missing state root')
	const bodyRoot = message.body_root
	if (bodyRoot == null) throw new Error('Beacon: header response missing body root')
	return {
		bodyRoot,
		canonical: data.canonical,
		parentRoot,
		proposerIndex,
		root,
		slot,
		stateRoot,
	}
}

/**
 * Consensus proposer validator indices from the latest beacon slots (deduped, bounded).
 * Keeps `Network` validator discovery inside a small, constant-time window instead of paging the full validator set.
 */
export const getBeaconRecentProposerValidatorIndices = async ({
	beaconRestBaseUrl,
	limit,
	slotLookbackCap,
}: {
	beaconRestBaseUrl: string
	limit: number
	slotLookbackCap: number
}): Promise<number[]> => {
	const head = await getBeaconHeadSlot(beaconRestBaseUrl)
	const seen = new Map<number, true>()
	const ordered: number[] = []
	for (let slotOffset = 0;
		slotOffset < slotLookbackCap && ordered.length < limit;
		slotOffset++
	) {
		const slot = head - slotOffset
		if (slot < 0) break
		const header = await getBeaconHeader(beaconRestBaseUrl, slot)
		const index = header.proposerIndex
		if (seen.has(index)) continue
		seen.set(index, true)
		ordered.push(index)
	}
	return ordered
}

type BeaconValidatorRestWire = {
	data?: {
		balance?: string
		index?: string
		status?: string
		validator?: {
			effective_balance?: string
			pubkey?: string
			slashed?: boolean
		}
	}
}

const nonNegativeDecimalBigIntFromWire = (raw: string | undefined): bigint | undefined => (
	raw != null && /^[0-9]+$/.test(raw) ?
		BigInt(raw)
	:
		undefined
)

export const getBeaconValidatorSummaryAtHead = async (
	beaconRestBaseUrl: string,
	validatorIndex: number,
): Promise<BeaconValidatorSummary | null> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await proxyFetch(
		`${base}/eth/v1/beacon/states/head/validators/${String(validatorIndex)}`,
		{
			headers: { accept: 'application/json' },
		},
	)
	if (res.status === 404) return null
	if (!res.ok) await throwHttpError('Beacon GET validator', res)
	const wire = await res.json<BeaconValidatorRestWire>()
	const data = wire.data
	if (data == null) throw new Error('Beacon: validator response missing data')
	const validatorNested = data.validator
	const pubkeyRaw = validatorNested?.pubkey
	const pubkey = (
		typeof pubkeyRaw === 'string' && pubkeyRaw.startsWith('0x') ?
			zeroExLowerCase(with0xHex(pubkeyRaw.slice(2)))
		:
			null
	)
	const balanceGwei = nonNegativeDecimalBigIntFromWire(data.balance)
	const effectiveBalanceGwei = (
		nonNegativeDecimalBigIntFromWire(
			validatorNested?.effective_balance,
		)
		?? balanceGwei
	)
	const status = data.status
	const slashed = validatorNested?.slashed === true
	if (
		pubkey == null
		|| balanceGwei == null
		|| effectiveBalanceGwei == null
		|| typeof status !== 'string'
		|| status.length === 0
	) return null
	return {
		balanceGwei,
		effectiveBalanceGwei,
		pubkey,
		slashed,
		status,
	}
}

const beaconConsensusWireAsJsonString = (wire: JsonValue): string => (
	JSON.stringify(wire)
)

/**
 * Beacon consensus-layer fork epochs (`previous_version` / `current_version` boundaries).
 * @see https://github.com/ethereum/beacon-APIs (`GET /eth/v1/config/fork_schedule`)
 */
export const getBeaconForkScheduleJsonString = async (
	beaconRestBaseUrl: string,
): Promise<string | null> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await proxyFetch(`${base}/eth/v1/config/fork_schedule`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET fork_schedule', res)
	const wire = await res.json<JsonValue>()
	return beaconConsensusWireAsJsonString(wire)
}

/**
 * Justified / finalized checkpoint roots at beacon head state.
 * @see https://github.com/ethereum/beacon-APIs (`GET /eth/v1/beacon/states/{state_id}/finality_checkpoints`)
 */
export const getBeaconFinalityCheckpointsJsonString = async (
	beaconRestBaseUrl: string,
): Promise<string | null> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await proxyFetch(`${base}/eth/v1/beacon/states/head/finality_checkpoints`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET finality_checkpoints', res)
	const wire = await res.json<JsonValue>()
	return beaconConsensusWireAsJsonString(wire)
}
