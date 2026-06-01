/**
 * Standard Ethereum beacon node REST (`/eth/v1/...`) — @see https://github.com/ethereum/beacon-APIs
 */

import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import Beacon from '$/sources/Beacon/index.ts'
import type {
	BeaconFinalityCheckpoints,
	BeaconForkScheduleEntry,
	BeaconBlockDutySummary,
	BeaconCommittee,
	BeaconHeader,
	BeaconHeaderHeadResponse,
	BeaconHeaderResponse,
	BeaconSyncCommittee,
	BeaconValidatorResponse,
	BeaconValidatorSummary,
} from '$/sources/Beacon/Rest/types.ts'
import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

const beaconFetch = (
	url: string,
	init?: RequestInit,
) => (
	corsFetch(url, {
		origins: Beacon.origins ?? [],
		init,
	})
)

export const getHeadSlot = async (beaconRestBaseUrl: string): Promise<number> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await beaconFetch(`${base}/eth/v1/beacon/headers/head`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET head', res)
	const wire = await res.json<BeaconHeaderHeadResponse>()
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

export const getHeader = async (
	beaconRestBaseUrl: string,
	blockId: string | number,
): Promise<BeaconHeader> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await beaconFetch(`${base}/eth/v1/beacon/headers/${blockId}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET header', res)
	const wire = await res.json<BeaconHeaderResponse>()
	const data = wire.data
	if (data == null) throw new Error('Beacon: header response missing data')
	const root = data.root
	if (root == null) throw new Error('Beacon: header response missing root')
	const header = data.header
	if (header == null) throw new Error('Beacon: header response missing header')
	const signature = header.signature
	if (signature == null) throw new Error('Beacon: header response missing signature')
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
		signature,
		slot,
		stateRoot,
	}
}

/**
 * Consensus proposer validator indices from the latest beacon slots (deduped, bounded).
 * Keeps `Network` validator discovery inside a small, constant-time window instead of paging the full validator set.
 */
export const getRecentProposerValidatorIndices = async ({
	beaconRestBaseUrl,
	limit,
	slotLookbackCap,
}: {
	beaconRestBaseUrl: string
	limit: number
	slotLookbackCap: number
}): Promise<number[]> => {
	const head = await getHeadSlot(beaconRestBaseUrl)
	const seen = new Map<number, true>()
	const ordered: number[] = []
	for (let slotOffset = 0;
		slotOffset < slotLookbackCap && ordered.length < limit;
		slotOffset++
	) {
		const slot = head - slotOffset
		if (slot < 0) break
		const header = await getHeader(beaconRestBaseUrl, slot)
		const index = header.proposerIndex
		if (seen.has(index)) continue
		seen.set(index, true)
		ordered.push(index)
	}
	return ordered
}

const nonNegativeDecimalBigIntFromWire = (raw: string | undefined): bigint | undefined => (
	raw != null && /^[0-9]+$/.test(raw) ?
		BigInt(raw)
	:
		undefined
)

export const getValidatorSummaryAtHead = async (
	beaconRestBaseUrl: string,
	validatorIndex: number,
): Promise<BeaconValidatorSummary | null> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await beaconFetch(
		`${base}/eth/v1/beacon/states/head/validators/${String(validatorIndex)}`,
		{
			headers: { accept: 'application/json' },
		},
	)
	if (res.status === 404) return null
	if (!res.ok) await throwHttpError('Beacon GET validator', res)
	const wire = await res.json<BeaconValidatorResponse>()
	const data = wire.data
	if (data == null) throw new Error('Beacon: validator response missing data')
	const validatorNested = data.validator
	const pubkeyRaw = validatorNested?.pubkey
	const pubkey = (
		pubkeyRaw?.startsWith('0x') ?
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
		|| status == null
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

const checkpointFromWire = (
	checkpointWire: JsonValue | undefined,
): BeaconFinalityCheckpoints['finalized'] | undefined => {
	if (checkpointWire == null) return undefined
	if (!isJsonObject(checkpointWire)) return undefined
	const epochRaw = checkpointWire.epoch
	const rootRaw = checkpointWire.root
	if (epochRaw == null || rootRaw == null) return undefined
	const epoch = Number.parseInt(String(epochRaw), 10)
	if (!Number.isFinite(epoch)) return undefined
	const root = String(rootRaw)
	if (!root.startsWith('0x')) return undefined
	return {
		epoch,
		root: with0xHex(root.slice(2)),
	}
}

export const getFinalityCheckpointsFromWire = (
	wire: JsonValue,
): BeaconFinalityCheckpoints | undefined => {
	if (!isJsonObject(wire)) return undefined
	const data = wire.data
	if (!isJsonObject(data)) return undefined
	const previousJustified = checkpointFromWire(data.previous_justified)
	const currentJustified = checkpointFromWire(data.current_justified)
	const finalized = checkpointFromWire(data.finalized)
	if (
		previousJustified == null
		|| currentJustified == null
		|| finalized == null
	) return undefined
	return {
		previousJustified,
		currentJustified,
		finalized,
	}
}

export const getFinalityCheckpoints = async (
	beaconRestBaseUrl: string,
): Promise<BeaconFinalityCheckpoints | undefined> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await beaconFetch(`${base}/eth/v1/beacon/states/head/finality_checkpoints`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET finality_checkpoints', res)
	const wire = await res.json<JsonValue>()
	return getFinalityCheckpointsFromWire(wire)
}

export const getForkScheduleFromWire = (
	wire: JsonValue,
): BeaconForkScheduleEntry[] => {
	if (!isJsonObject(wire)) return []
	const data = wire.data
	if (!Array.isArray(data)) return []
	return (
		data.flatMap((entryWire) => {
			if (!isJsonObject(entryWire)) return []
			const epochRaw = entryWire.epoch
			const previousVersionRaw = (
				entryWire.previousVersion
				?? entryWire.previous_version
			)
			const currentVersionRaw = (
				entryWire.currentVersion
				?? entryWire.current_version
			)
			if (
				epochRaw == null
				|| previousVersionRaw == null
				|| currentVersionRaw == null
			) return []
			const epoch = Number.parseInt(String(epochRaw), 10)
			if (!Number.isFinite(epoch)) return []
			const previousVersion = String(previousVersionRaw)
			const currentVersion = String(currentVersionRaw)
			if (
				!previousVersion.startsWith('0x')
				|| !currentVersion.startsWith('0x')
			) return []
			return [
				{
					epoch,
					previousVersion: previousVersion as `0x${string}`,
					currentVersion: currentVersion as `0x${string}`,
				},
			]
		})
	)
}

export const getForkSchedule = async (
	beaconRestBaseUrl: string,
): Promise<BeaconForkScheduleEntry[]> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await beaconFetch(`${base}/eth/v1/config/fork_schedule`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET fork_schedule', res)
	const wire = await res.json<JsonValue>()
	return getForkScheduleFromWire(wire)
}

export const getGenesisTimeSeconds = async (
	beaconRestBaseUrl: string,
): Promise<number | undefined> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await beaconFetch(`${base}/eth/v1/beacon/genesis`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET genesis', res)
	const wire = await res.json<import('$/sources/Beacon/Rest/types.ts').BeaconGenesisResponse>()
	const genesisTimeRaw = wire.data?.genesis_time
	if (genesisTimeRaw == null) return undefined
	const genesisTimeSeconds = Number.parseInt(String(genesisTimeRaw), 10)
	return (
		Number.isFinite(genesisTimeSeconds) ?
			genesisTimeSeconds
		:
			undefined
	)
}

export const getCommitteesFromWire = (wire: JsonValue): BeaconCommittee[] => {
	if (!isJsonObject(wire)) return []
	const data = wire.data
	if (!Array.isArray(data)) return []
	return (
		data.flatMap((committeeWire) => {
			if (!isJsonObject(committeeWire)) return []
			const slot = Number.parseInt(String(committeeWire.slot), 10)
			const index = Number.parseInt(String(committeeWire.index), 10)
			const validators = committeeWire.validators
			if (
				!Number.isFinite(slot)
				|| !Number.isFinite(index)
				|| !Array.isArray(validators)
			) return []
			return [
				{
					slot,
					index,
					validatorIndices: validators.flatMap((validator) => {
						const validatorIndex = Number.parseInt(String(validator), 10)
						return Number.isFinite(validatorIndex) ? [validatorIndex] : []
					}),
				},
			]
		})
	)
}

export const getCommittees = async (
	beaconRestBaseUrl: string,
	stateId = 'head',
): Promise<BeaconCommittee[]> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await beaconFetch(`${base}/eth/v1/beacon/states/${stateId}/committees`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET committees', res)
	return getCommitteesFromWire(await res.json<JsonValue>())
}

export const getSyncCommitteeFromWire = (wire: JsonValue): BeaconSyncCommittee | undefined => {
	if (!isJsonObject(wire)) return undefined
	const data = wire.data
	if (!isJsonObject(data)) return undefined
	const validators = data.validators
	if (!Array.isArray(validators)) return undefined
	return {
		validatorIndices: validators.flatMap((validator) => {
			const validatorIndex = Number.parseInt(String(validator), 10)
			return Number.isFinite(validatorIndex) ? [validatorIndex] : []
		}),
	}
}

export const getSyncCommittee = async (
	beaconRestBaseUrl: string,
	stateId = 'head',
): Promise<BeaconSyncCommittee | undefined> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await beaconFetch(`${base}/eth/v1/beacon/states/${stateId}/sync_committees`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET sync_committees', res)
	return getSyncCommitteeFromWire(await res.json<JsonValue>())
}

export const getBlockDutySummaryFromWire = (wire: JsonValue): BeaconBlockDutySummary => {
	const empty = {
		attestations: [],
		withdrawals: [],
		slashings: [],
	} satisfies BeaconBlockDutySummary
	if (!isJsonObject(wire)) return empty
	const data = wire.data
	if (!isJsonObject(data)) return empty
	const message = data.message
	if (!isJsonObject(message)) return empty
	const body = message.body
	if (!isJsonObject(body)) return empty
	const attestations = (
		Array.isArray(body.attestations) ?
			body.attestations.flatMap((attestationWire, index) => {
				if (!isJsonObject(attestationWire)) return []
				const attestationData = attestationWire.data
				const committeeIndex = (
					isJsonObject(attestationData) ?
						Number.parseInt(String(attestationData.index), 10)
					:
						Number.NaN
				)
				return [
					{
						index,
						committeeIndex: Number.isFinite(committeeIndex) ? committeeIndex : undefined,
						aggregationBits: (
							attestationWire.aggregation_bits == null ?
								undefined
							:
								String(attestationWire.aggregation_bits)
						),
					},
				]
			})
		:
			[]
	)
	const executionPayload = body.execution_payload
	const withdrawals = (
		isJsonObject(executionPayload) && Array.isArray(executionPayload.withdrawals) ?
			executionPayload.withdrawals.flatMap((withdrawalWire) => {
				if (!isJsonObject(withdrawalWire)) return []
				const index = Number.parseInt(String(withdrawalWire.index), 10)
				const validatorIndex = Number.parseInt(String(withdrawalWire.validator_index), 10)
				if (!Number.isFinite(index)) return []
				return [
					{
						index,
						validatorIndex: Number.isFinite(validatorIndex) ? validatorIndex : undefined,
						address: withdrawalWire.address == null ? undefined : String(withdrawalWire.address),
						amountGwei: nonNegativeDecimalBigIntFromWire(
							withdrawalWire.amount == null ? undefined : String(withdrawalWire.amount),
						),
					},
				]
			})
		:
			[]
	)
	const proposerSlashings = (
		Array.isArray(body.proposer_slashings) ?
			body.proposer_slashings.map((_slashing, index) => ({
				index,
				kind: 'proposer' as const,
			}))
		:
			[]
	)
	const attesterSlashings = (
		Array.isArray(body.attester_slashings) ?
			body.attester_slashings.map((_slashing, index) => ({
				index,
				kind: 'attester' as const,
			}))
		:
			[]
	)
	return {
		attestations,
		withdrawals,
		slashings: [
			...proposerSlashings,
			...attesterSlashings,
		],
	}
}

export const getBlockDutySummary = async (
	beaconRestBaseUrl: string,
	blockId: string | number,
): Promise<BeaconBlockDutySummary> => {
	const base = beaconRestBaseUrl.replace(/\/$/, '')
	const res = await beaconFetch(`${base}/eth/v2/beacon/blocks/${blockId}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET block', res)
	return getBlockDutySummaryFromWire(await res.json<JsonValue>())
}
