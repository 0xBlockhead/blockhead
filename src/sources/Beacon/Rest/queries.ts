/**
 * Standard Ethereum beacon node REST (`/eth/v1/...`) — @see https://github.com/ethereum/beacon-APIs
 */

import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Beacon/bindings.ts'
import type { BeaconBlockDutySummary } from '$/sources/Beacon/Rest/types.ts'
import type {
	components,
	operations,
} from '$/sources/Beacon/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'
import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'
import { type Type, type as arktype } from 'arktype'

type BeaconHeaderWire = (
	operations['getBlockHeader']['responses'][200]['content']['application/json']['data']
)
type BeaconGenesisWire = (
	operations['getGenesis']['responses'][200]['content']['application/json']['data']
)

const beaconHeaderWire = arktype({
	root: 'string',
	canonical: 'boolean',
	header: {
		message: {
			slot: 'string',
			proposer_index: 'string',
			parent_root: 'string',
			state_root: 'string',
			body_root: 'string',
		},
		signature: 'string',
	},
}) satisfies Type<BeaconHeaderWire>

const beaconGenesisWire = arktype({
	genesis_time: 'string',
	genesis_validators_root: 'string',
	genesis_fork_version: 'string',
}) satisfies Type<BeaconGenesisWire>

const isUint64Wire = (value: string) => (
	/^[0-9]+$/.test(value)
	&& BigInt(value) <= 18_446_744_073_709_551_615n
)

export const beaconRestByChainId = new Map(
	bindings[Source.Beacon_Rest].map((binding) => [
		Number(binding.target.key),
		{
			binding,
			chainId: binding.target.key,
			restBaseUrls: binding.endpoints.map((endpoint) => endpoint.locator),
		},
	] as const)
)

const beaconFetch = (
	chainId: number,
	path: `/${string}`,
	init?: RequestInit
) => {
	const beaconRest = beaconRestByChainId.get(chainId)
	if (beaconRest == null)
		throw new Error(`Beacon_Rest: no binding for chain ${String(chainId)}`)

	return sourceFetch(
		beaconRest.binding,
		`${firstHttpUrlForBinding(beaconRest.binding).replace(/\/$/, '')}${path}`,
		init
	)
}

export const getHeadSlot = async (chainId: number) => {
	const header = await getHeader(chainId, 'head')
	return header.header.message.slot
}

export const getHeaderFromWire = (
	wire: JsonValue
): BeaconHeaderWire | undefined => {
	if (!isJsonObject(wire)) return undefined
	const header = beaconHeaderWire(wire.data)
	if (
		header instanceof arktype.errors
		|| ![
			header.header.message.slot,
			header.header.message.proposer_index,
		].every(isUint64Wire)
		|| ![
			header.root,
			header.header.message.parent_root,
			header.header.message.state_root,
			header.header.message.body_root,
		].every((value) => /^0x[0-9a-fA-F]{64}$/.test(value))
		|| !/^0x[0-9a-fA-F]{192}$/.test(header.header.signature)
	) return undefined
	return header
}

export const getHeader = async (
	chainId: number,
	blockId: string | number
) => {
	const res = await beaconFetch(chainId, `/eth/v1/beacon/headers/${blockId}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET header', res)
	const wire = await res.json<JsonValue>()
	const header = getHeaderFromWire(wire)
	if (header == null) throw new Error('Beacon: invalid header response')
	return header
}

/**
 * Consensus proposer validator indices from the latest beacon slots (deduped, bounded).
 * Keeps `Network` validator discovery inside a small, constant-time window instead of paging the full validator set.
 */
export const getRecentProposerValidatorIndices = async ({
	chainId,
	limit,
	slotLookbackCap,
}: {
	chainId: number
	limit: number
	slotLookbackCap: number
}) => {
	const head = Number(await getHeadSlot(chainId))
	if (!Number.isSafeInteger(head))
		throw new Error('Beacon: head slot must be a safe integer for recent proposer discovery')
	const seen = new Set<string>()
	const ordered: string[] = []
	for (let slotOffset = 0;
		slotOffset < slotLookbackCap && ordered.length < limit;
		slotOffset++
	) {
		const slot = head - slotOffset
		if (slot < 0) break
		const header = await getHeader(chainId, slot)
		const index = header.header.message.proposer_index
		if (seen.has(index)) continue
		seen.add(index)
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

const beaconValidatorWire = arktype({
	index: 'string',
	balance: 'string',
	status: "'pending_initialized' | 'pending_queued' | 'active_ongoing' | 'active_exiting' | 'active_slashed' | 'exited_unslashed' | 'exited_slashed' | 'withdrawal_possible' | 'withdrawal_done'",
	validator: {
		pubkey: 'string',
		withdrawal_credentials: 'string',
		effective_balance: 'string',
		slashed: 'boolean',
		activation_eligibility_epoch: 'string',
		activation_epoch: 'string',
		exit_epoch: 'string',
		withdrawable_epoch: 'string',
	},
}) satisfies Type<components['schemas']['ValidatorResponse']>

export const getValidatorFromWire = (
	wire: JsonValue
): components['schemas']['ValidatorResponse'] | undefined => {
	if (!isJsonObject(wire)) return undefined
	const validator = beaconValidatorWire(wire.data)
	if (
		validator instanceof arktype.errors
		|| ![
			validator.index,
			validator.balance,
			validator.validator.effective_balance,
			validator.validator.activation_eligibility_epoch,
			validator.validator.activation_epoch,
			validator.validator.exit_epoch,
			validator.validator.withdrawable_epoch,
		].every(isUint64Wire)
		|| !/^0x[0-9a-fA-F]{96}$/.test(validator.validator.pubkey)
		|| !/^0x[0-9a-fA-F]{64}$/.test(validator.validator.withdrawal_credentials)
	) return undefined
	return validator
}

export const getValidatorAtHead = async (
	chainId: number,
	validatorIndex: number
) => {
	if (!Number.isSafeInteger(validatorIndex) || validatorIndex < 0)
		throw new Error('Beacon: validator index must be a non-negative safe integer')
	const res = await beaconFetch(
		chainId,
		`/eth/v1/beacon/states/head/validators/${String(validatorIndex)}`,
		{
			headers: { accept: 'application/json' },
		}
	)
	if (res.status === 404) return null
	if (!res.ok) await throwHttpError('Beacon GET validator', res)
	const validator = getValidatorFromWire(await res.json<JsonValue>())
	if (validator == null)
		throw new Error('Beacon: invalid validator response')
	if (BigInt(validator.index) !== BigInt(validatorIndex))
		throw new Error('Beacon: validator response does not match the subject')
	return validator
}

type BeaconFinalityCheckpointsWire = (
	operations['getStateFinalityCheckpoints']['responses'][200]['content']['application/json']['data']
)

const beaconCheckpointWire = arktype({
	epoch: 'string',
	root: 'string',
}) satisfies Type<components['schemas']['Checkpoint']>

const beaconFinalityCheckpointsWire = arktype({
	previous_justified: beaconCheckpointWire,
	current_justified: beaconCheckpointWire,
	finalized: beaconCheckpointWire,
}) satisfies Type<BeaconFinalityCheckpointsWire>

const beaconForkScheduleEntryWire = arktype({
	epoch: 'string',
	previous_version: 'string',
	current_version: 'string',
}) satisfies Type<components['schemas']['Fork']>

const beaconCommitteeWire = arktype({
	index: 'string',
	slot: 'string',
	validators: 'string[]',
}) satisfies Type<components['schemas']['Committee']>

const beaconSyncCommitteeWire = arktype({
	validators: 'string[]',
	validator_aggregates: 'string[][]',
}) satisfies Type<components['schemas']['SyncCommitteeByValidatorIndices']>

const isNonNegativeSafeIntegerWire = (value: string) => (
	/^[0-9]+$/.test(value)
	&& Number.isSafeInteger(Number(value))
)

export const getFinalityCheckpointsFromWire = (
	wire: JsonValue
): BeaconFinalityCheckpointsWire | undefined => {
	if (!isJsonObject(wire)) return undefined
	const checkpoints = beaconFinalityCheckpointsWire(wire.data)
	if (
		checkpoints instanceof arktype.errors
		|| Object.values(checkpoints).some((checkpoint) => (
			!checkpoint.root.startsWith('0x')
			|| !/^[0-9]+$/.test(checkpoint.epoch)
		))
	) return undefined
	return checkpoints
}

export const getFinalityCheckpoints = async (
	chainId: number
) => {
	const res = await beaconFetch(chainId, '/eth/v1/beacon/states/head/finality_checkpoints', {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET finality_checkpoints', res)
	const wire = await res.json<JsonValue>()
	return getFinalityCheckpointsFromWire(wire)
}

export const getForkScheduleFromWire = (
	wire: JsonValue
): components['schemas']['Fork'][] => {
	if (!isJsonObject(wire)) return []
	const data = wire.data
	if (!Array.isArray(data)) return []
	return (
		data.flatMap((entryWire) => {
			const entry = beaconForkScheduleEntryWire(entryWire)
			if (
				entry instanceof arktype.errors
				|| !/^[0-9]+$/.test(entry.epoch)
				|| !entry.previous_version.startsWith('0x')
				|| !entry.current_version.startsWith('0x')
			) return []
			return [entry]
		})
	)
}

export const getForkSchedule = async (
	chainId: number
) => {
	const res = await beaconFetch(chainId, '/eth/v1/config/fork_schedule', {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET fork_schedule', res)
	const wire = await res.json<JsonValue>()
	return getForkScheduleFromWire(wire)
}

export const getGenesisTimeSeconds = async (
	chainId: number
) => {
	const res = await beaconFetch(chainId, '/eth/v1/beacon/genesis', {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET genesis', res)
	const wire = await res.json<JsonValue>()
	if (!isJsonObject(wire)) return undefined
	const genesis = beaconGenesisWire(wire.data)
	if (
		genesis instanceof arktype.errors
		|| !isUint64Wire(genesis.genesis_time)
		|| !/^0x[0-9a-fA-F]{64}$/.test(genesis.genesis_validators_root)
		|| !/^0x[0-9a-fA-F]{8}$/.test(genesis.genesis_fork_version)
	) return undefined
	return genesis.genesis_time
}

export const getCommitteesFromWire = (
	wire: JsonValue
): components['schemas']['Committee'][] => {
	if (!isJsonObject(wire)) return []
	const data = wire.data
	if (!Array.isArray(data)) return []
	return (
		data.flatMap((committeeWire) => {
			const committee = beaconCommitteeWire(committeeWire)
			if (
				committee instanceof arktype.errors
				|| !isNonNegativeSafeIntegerWire(committee.slot)
				|| !isNonNegativeSafeIntegerWire(committee.index)
				|| !committee.validators.every(isNonNegativeSafeIntegerWire)
			) return []
			return [committee]
		})
	)
}

export const getCommittees = async (
	chainId: number,
	stateId = 'head'
) => {
	const res = await beaconFetch(chainId, `/eth/v1/beacon/states/${stateId}/committees`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET committees', res)
	return getCommitteesFromWire(await res.json<JsonValue>())
}

export const getSyncCommitteeFromWire = (
	wire: JsonValue
): components['schemas']['SyncCommitteeByValidatorIndices'] | undefined => {
	if (!isJsonObject(wire)) return undefined
	const committee = beaconSyncCommitteeWire(wire.data)
	if (
		committee instanceof arktype.errors
		|| !committee.validators.every(isNonNegativeSafeIntegerWire)
		|| !committee.validator_aggregates.every((validators) => (
			validators.every(isNonNegativeSafeIntegerWire)
		))
	) return undefined
	return committee
}

export const getSyncCommittee = async (
	chainId: number,
	stateId = 'head'
) => {
	const res = await beaconFetch(chainId, `/eth/v1/beacon/states/${stateId}/sync_committees`, {
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
	}
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
							withdrawalWire.amount == null ? undefined : String(withdrawalWire.amount)
						),
					},
				]
			})
		:
			[]
	)
	const proposerSlashings = (
		Array.isArray(body.proposer_slashings) ?
			body.proposer_slashings.map<BeaconBlockDutySummary['slashings'][number]>((_slashing, index) => ({
				index,
				kind: 'proposer',
			}))
		:
			[]
	)
	const attesterSlashings = (
		Array.isArray(body.attester_slashings) ?
			body.attester_slashings.map<BeaconBlockDutySummary['slashings'][number]>((_slashing, index) => ({
				index,
				kind: 'attester',
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
	chainId: number,
	blockId: string | number
) => {
	const res = await beaconFetch(chainId, `/eth/v2/beacon/blocks/${blockId}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET block', res)
	return getBlockDutySummaryFromWire(await res.json<JsonValue>())
}
