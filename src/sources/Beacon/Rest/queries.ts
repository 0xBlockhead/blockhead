/**
 * Standard Ethereum beacon node REST (`/eth/v1/...`) — @see https://github.com/ethereum/beacon-APIs
 */

import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Beacon/bindings.ts'
import type {
	BeaconBlockSnapshot,
	BeaconBlockDutySummary,
	BeaconDataColumnSidecars,
	BeaconExecutionPayloadBid,
	BeaconExecutionPayloadEnvelope,
	BeaconExecutionRequests,
	BeaconValidatorAttestationReward,
	BeaconValidatorSyncCommitteeReward,
} from '$/sources/Beacon/Rest/types.ts'
import type {
	components,
	operations,
} from '$/sources/Beacon/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'
import { isJsonArray, isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'
import { type Type, type as arktype } from 'arktype'

type BeaconHeaderWire = (
	operations['getBlockHeader']['responses'][200]['content']['application/json']['data']
)
type BeaconGenesisWire = (
	operations['getGenesis']['responses'][200]['content']['application/json']['data']
)
type BeaconPeerCountWire = (
	operations['getPeerCount']['responses'][200]['content']['application/json']['data']
)
type BeaconNetworkIdentityWire = (
	operations['getNetworkIdentity']['responses'][200]['content']['application/json']['data']
)
type BeaconNodeVersionWire = (
	operations['getNodeVersion']['responses'][200]['content']['application/json']['data']
)
type BeaconSyncingWire = (
	operations['getSyncingStatus']['responses'][200]['content']['application/json']['data']
)
type BeaconProposerDutyWire = (
	operations['getProposerDuties']['responses'][200]['content']['application/json']['data'][number]
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

const beaconPeerCountWire = arktype({
	disconnected: 'string',
	connecting: 'string',
	connected: 'string',
	disconnecting: 'string',
}) satisfies Type<BeaconPeerCountWire>

const beaconNetworkIdentityWire = arktype({
	peer_id: 'string',
	enr: 'string',
	p2p_addresses: 'string[]',
	discovery_addresses: 'string[]',
	metadata: {
		seq_number: 'string',
		attnets: 'string',
		'syncnets?': 'string',
		'custody_group_count?': 'string',
	},
}) satisfies Type<BeaconNetworkIdentityWire>

const beaconNodeVersionWire = arktype({
	version: 'string',
}) satisfies Type<BeaconNodeVersionWire>

const beaconSyncingWire = arktype({
	head_slot: 'string',
	sync_distance: 'string',
	is_syncing: 'boolean',
	is_optimistic: 'boolean',
	el_offline: 'boolean',
}) satisfies Type<BeaconSyncingWire>

const beaconProposerDutyWire = arktype({
	pubkey: 'string',
	validator_index: 'string',
	slot: 'string',
}) satisfies Type<BeaconProposerDutyWire>

const isUint64Wire = (value: string) => (
	/^[0-9]+$/.test(value)
	&& BigInt(value) <= 18_446_744_073_709_551_615n
)

const signedDecimalBigIntFromWire = (value: JsonValue | undefined) => (
	typeof value === 'string' && /^-?[0-9]+$/.test(value) ? BigInt(value) : undefined
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
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`Beacon_Rest: invalid chain ${String(chainId)}`)
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

export const getNodePeerCountFromWire = (
	wire: JsonValue
) => {
	if (!isJsonObject(wire)) return undefined
	const peerCount = beaconPeerCountWire(wire.data)
	if (
		peerCount instanceof arktype.errors
		|| !Object.values(peerCount).every(isUint64Wire)
	) return undefined
	return peerCount
}

export const getNodePeerCountObservation = async (chainId: number) => {
	const endpointUrl = beaconRestByChainId.get(chainId)?.restBaseUrls[0]
	if (endpointUrl == null)
		throw new Error(`Beacon_Rest: no binding for chain ${String(chainId)}`)

	const response = await beaconFetch(chainId, '/eth/v1/node/peer_count', {
		headers: { accept: 'application/json' },
	})
	if (!response.ok) await throwHttpError('Beacon GET node peer_count', response)
	const peerCount = getNodePeerCountFromWire(await response.json<JsonValue>())
	if (peerCount == null)
		throw new Error('Beacon: invalid node peer_count response')

	return {
		...peerCount,
		endpointUrl,
		fetchedAtMs: Date.now(),
	}
}

export const getNodeIdentityFromWire = (
	wire: JsonValue
) => {
	if (!isJsonObject(wire)) return undefined
	const identity = beaconNetworkIdentityWire(wire.data)
	if (
		identity instanceof arktype.errors
		|| !isUint64Wire(identity.metadata.seq_number)
		|| !/^0x[0-9a-fA-F]{2,}$/.test(identity.metadata.attnets)
		|| (
			identity.metadata.syncnets != null
			&& !/^0x[0-9a-fA-F]{2,}$/.test(identity.metadata.syncnets)
		)
		|| (
			identity.metadata.custody_group_count != null
			&& !isUint64Wire(identity.metadata.custody_group_count)
		)
	) return undefined
	return identity
}

export const getNodeIdentityObservation = async (chainId: number) => {
	const endpointUrl = beaconRestByChainId.get(chainId)?.restBaseUrls[0]
	if (endpointUrl == null)
		throw new Error(`Beacon_Rest: no binding for chain ${String(chainId)}`)

	const response = await beaconFetch(chainId, '/eth/v1/node/identity', {
		headers: { accept: 'application/json' },
	})
	if (!response.ok) await throwHttpError('Beacon GET node identity', response)
	const identity = getNodeIdentityFromWire(await response.json<JsonValue>())
	if (identity == null)
		throw new Error('Beacon: invalid node identity response')

	return {
		...identity,
		endpointUrl,
		fetchedAtMs: Date.now(),
	}
}

export const getNodeHealthObservation = async (chainId: number) => {
	const endpointUrl = beaconRestByChainId.get(chainId)?.restBaseUrls[0]
	if (endpointUrl == null)
		throw new Error(`Beacon_Rest: no binding for chain ${String(chainId)}`)

	const response = await beaconFetch(chainId, '/eth/v1/node/health', {
		headers: { accept: 'application/json' },
	})
	if (
		response.status !== 200
		&& response.status !== 206
		&& response.status !== 503
	) await throwHttpError('Beacon GET node health', response)

	return {
		statusCode: (
			response.status === 200 ?
				200
			:
				response.status === 206 ?
					206
				:
					503
		),
		endpointUrl,
		fetchedAtMs: Date.now(),
	}
}

export const getNodeVersionObservation = async (chainId: number) => {
	const endpointUrl = beaconRestByChainId.get(chainId)?.restBaseUrls[0]
	if (endpointUrl == null)
		throw new Error(`Beacon_Rest: no binding for chain ${String(chainId)}`)

	const response = await beaconFetch(chainId, '/eth/v1/node/version', {
		headers: { accept: 'application/json' },
	})
	if (!response.ok) await throwHttpError('Beacon GET node version', response)
	const wire = await response.json<JsonValue>()
	const version = isJsonObject(wire) ? beaconNodeVersionWire(wire.data) : undefined
	if (
		version == null
		|| version instanceof arktype.errors
		|| version.version.length === 0
	) throw new Error('Beacon: invalid node version response')

	return {
		...version,
		endpointUrl,
		fetchedAtMs: Date.now(),
	}
}

export const getNodeSyncingFromWire = (
	wire: JsonValue
) => {
	if (!isJsonObject(wire)) return undefined
	const syncing = beaconSyncingWire(wire.data)
	if (
		syncing instanceof arktype.errors
		|| ![
			syncing.head_slot,
			syncing.sync_distance,
		].every(isUint64Wire)
	) return undefined
	return syncing
}

export const getNodeSyncingObservation = async (chainId: number) => {
	const endpointUrl = beaconRestByChainId.get(chainId)?.restBaseUrls[0]
	if (endpointUrl == null)
		throw new Error(`Beacon_Rest: no binding for chain ${String(chainId)}`)

	const response = await beaconFetch(chainId, '/eth/v1/node/syncing', {
		headers: { accept: 'application/json' },
	})
	if (!response.ok) await throwHttpError('Beacon GET node syncing', response)
	const syncing = getNodeSyncingFromWire(await response.json<JsonValue>())
	if (syncing == null)
		throw new Error('Beacon: invalid node syncing response')

	return {
		...syncing,
		endpointUrl,
		fetchedAtMs: Date.now(),
	}
}

export const getHeaderFromWire = (
	wire: JsonValue
) => {
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

const normalizeBeaconStateOrBlockId = (
	stateOrBlockId: string | number
) => {
	if (typeof stateOrBlockId === 'number') {
		if (!Number.isSafeInteger(stateOrBlockId) || stateOrBlockId < 0)
			throw new Error('Beacon: state or block slot must be a non-negative safe integer')
		return String(stateOrBlockId)
	}
	if (/^(head|genesis|finalized|justified|0|[1-9][0-9]*)$/.test(stateOrBlockId))
		return stateOrBlockId
	if (/^0x[0-9a-fA-F]{64}$/.test(stateOrBlockId))
		return stateOrBlockId.toLowerCase()
	throw new Error('Beacon: state or block id must be a named state, slot, or 32-byte root')
}

export const getHeader = async (
	chainId: number,
	blockId: string | number
) => {
	const normalizedBlockId = normalizeBeaconStateOrBlockId(blockId)
	const res = await beaconFetch(chainId, `/eth/v1/beacon/headers/${normalizedBlockId}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET header', res)
	const wire = await res.json<JsonValue>()
	const header = getHeaderFromWire(wire)
	if (header == null) throw new Error('Beacon: invalid header response')
	return header
}

export const getHeadersAtSlot = async (
	chainId: number,
	slot: number
) => {
	const normalizedSlot = normalizeBeaconStateOrBlockId(slot)
	const res = await beaconFetch(chainId, `/eth/v1/beacon/headers?slot=${normalizedSlot}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET headers', res)
	const wire = await res.json<JsonValue>()
	if (!isJsonObject(wire) || !isJsonArray(wire.data))
		throw new Error('Beacon: invalid headers response')

	return wire.data.map((headerWire) => {
		const header = getHeaderFromWire({ data: headerWire })
		if (header == null)
			throw new Error('Beacon: invalid header in headers response')
		return header
	})
}

/**
 * Consensus proposer validator indices from the latest beacon slots (deduped, bounded).
 * Keeps `Network` validator discovery inside a small, constant-time window instead of paging the full validator set.
 */
export const getRecentProposerValidatorIndices = async ({
	chainId,
	headSlot,
	limit,
	slotLookbackCap,
}: {
	chainId: number
	headSlot?: number
	limit: number
	slotLookbackCap: number
}) => {
	if (!Number.isSafeInteger(limit) || limit < 0)
		throw new Error(`Beacon: invalid proposer validator limit ${limit}`)
	if (!Number.isSafeInteger(slotLookbackCap) || slotLookbackCap < 0)
		throw new Error(`Beacon: invalid proposer validator lookback ${slotLookbackCap}`)
	const head = headSlot ?? Number(await getHeadSlot(chainId))
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

const nonNegativeDecimalBigIntFromWire = (raw: string | undefined) => (
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
) => {
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

export const getValidatorEnvelopeFromWire = (
	wire: JsonValue
) => {
	if (!isJsonObject(wire)) return undefined
	if (
		typeof wire.execution_optimistic !== 'boolean'
		|| typeof wire.finalized !== 'boolean'
	) return undefined
	const validator = getValidatorFromWire(wire)
	if (validator == null) return undefined
	return {
		validator,
		executionOptimistic: wire.execution_optimistic,
		finalized: wire.finalized,
	}
}

export const getValidatorsEnvelopeFromWire = (
	wire: JsonValue
) => {
	if (
		!isJsonObject(wire)
		|| !isJsonArray(wire.data)
		|| typeof wire.execution_optimistic !== 'boolean'
		|| typeof wire.finalized !== 'boolean'
	) return undefined

	const validators = wire.data.flatMap((validator) => {
		const parsed = getValidatorFromWire({
			data: validator,
		})
		return parsed == null ? [] : [parsed]
	})
	if (validators.length !== wire.data.length)
		return undefined

	return {
		validators,
		executionOptimistic: wire.execution_optimistic,
		finalized: wire.finalized,
	}
}

const normalizeBeaconValidatorId = (
	validatorId: number | string
) => {
	if (typeof validatorId === 'number') {
		if (!Number.isSafeInteger(validatorId) || validatorId < 0)
			throw new Error('Beacon: validator index must be a non-negative safe integer')
		return String(validatorId)
	}
	if (!/^0x[0-9a-fA-F]{96}$/.test(validatorId))
		throw new Error('Beacon: validator pubkey must be a 48-byte 0x-hex string')
	return validatorId.toLowerCase()
}

/**
 * `GET /eth/v1/beacon/states/{state_id}/validators/{validator_id}` —
 * `validator_id` is a validator index or 48-byte pubkey; `state_id` may be head or a historical slot/root.
 */
export const getValidator = async (
	chainId: number,
	validatorId: number | string,
	stateId: string | number = 'head'
) => {
	const normalizedId = normalizeBeaconValidatorId(validatorId)
	const normalizedStateId = normalizeBeaconStateOrBlockId(stateId)
	const res = await beaconFetch(
		chainId,
		`/eth/v1/beacon/states/${normalizedStateId}/validators/${normalizedId}`,
		{
			headers: { accept: 'application/json' },
		}
	)
	if (res.status === 404) return null
	if (!res.ok) await throwHttpError('Beacon GET validator', res)
	const envelope = getValidatorEnvelopeFromWire(await res.json<JsonValue>())
	if (envelope == null)
		throw new Error('Beacon: invalid validator response')
	if (typeof validatorId === 'number') {
		if (BigInt(envelope.validator.index) !== BigInt(validatorId))
			throw new Error('Beacon: validator response does not match the subject')
	} else if (envelope.validator.validator.pubkey.toLowerCase() !== normalizedId) {
		throw new Error('Beacon: validator response does not match the subject')
	}
	return envelope
}

export const getValidators = async (
	chainId: number,
	validatorIds: (number | string)[],
	stateId: string | number = 'head'
) => {
	if (validatorIds.length === 0)
		return {
			validators: [],
			executionOptimistic: false,
			finalized: false,
		}

	const normalizedStateId = normalizeBeaconStateOrBlockId(stateId)
	const searchParams = new URLSearchParams()
	for (const validatorId of validatorIds)
		searchParams.append('id', normalizeBeaconValidatorId(validatorId))

	const res = await beaconFetch(
		chainId,
		`/eth/v1/beacon/states/${normalizedStateId}/validators?${searchParams.toString()}`,
		{
			headers: { accept: 'application/json' },
		}
	)
	if (!res.ok) await throwHttpError('Beacon GET validators', res)
	const envelope = getValidatorsEnvelopeFromWire(await res.json<JsonValue>())
	if (envelope == null)
		throw new Error('Beacon: invalid validators response')

	const requestedIds = new Set(validatorIds.map(normalizeBeaconValidatorId))
	for (const validator of envelope.validators)
		if (
			!requestedIds.has(validator.index)
			&& !requestedIds.has(validator.validator.pubkey.toLowerCase())
		)
			throw new Error('Beacon: validators response contains an unrequested subject')

	return envelope
}

export const getValidatorAtHead = (
	chainId: number,
	validatorIndex: number
) => (
	getValidator(
		chainId,
		validatorIndex,
		'head'
	)
)

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
) => {
	if (!isJsonObject(wire)) return undefined
	const checkpoints = beaconFinalityCheckpointsWire(wire.data)
	if (
		checkpoints instanceof arktype.errors
		|| Object.values(checkpoints).some((checkpoint) => (
			!/^0x[0-9a-fA-F]{64}$/.test(checkpoint.root)
			|| !isNonNegativeSafeIntegerWire(checkpoint.epoch)
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
) => {
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

export const getSecondsPerSlot = async (
	chainId: number
) => {
	const res = await beaconFetch(chainId, '/eth/v1/config/spec', {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET config spec', res)
	const wire = await res.json<JsonValue>()
	if (!isJsonObject(wire) || !isJsonObject(wire.data)) return undefined
	const value = wire.data['SECONDS_PER_SLOT']
	if (typeof value !== 'string' || !isUint64Wire(value)) return undefined
	const seconds = Number(value)
	if (!Number.isSafeInteger(seconds) || seconds < 1) return undefined
	return seconds
}

export const getCommitteesFromWire = (
	wire: JsonValue
) => {
	if (!isJsonObject(wire)) return []
	const data = wire.data
	if (!Array.isArray(data)) return []
	const committees = data.flatMap((committeeWire) => {
			const committee = beaconCommitteeWire(committeeWire)
			if (
				committee instanceof arktype.errors
				|| !isNonNegativeSafeIntegerWire(committee.slot)
				|| !isNonNegativeSafeIntegerWire(committee.index)
				|| !committee.validators.every(isNonNegativeSafeIntegerWire)
			) return []
			return [committee]
		})
	return committees.length === data.length ? committees : []
}

export const getCommittees = async (
	chainId: number,
	stateId = 'head'
) => {
	const normalizedStateId = normalizeBeaconStateOrBlockId(stateId)
	const res = await beaconFetch(chainId, `/eth/v1/beacon/states/${normalizedStateId}/committees`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET committees', res)
	return getCommitteesFromWire(await res.json<JsonValue>())
}

export const getProposerDutiesFromWire = (
	wire: JsonValue
) => {
	if (!isJsonObject(wire) || !Array.isArray(wire.data)) return []
	const duties = wire.data.flatMap((dutyWire) => {
		const duty = beaconProposerDutyWire(dutyWire)
		if (
			duty instanceof arktype.errors
			|| !/^0x[0-9a-fA-F]{96}$/.test(duty.pubkey)
			|| !isNonNegativeSafeIntegerWire(duty.validator_index)
			|| !isNonNegativeSafeIntegerWire(duty.slot)
		) return []
		return [duty]
	})
	if (
		duties.length !== wire.data.length
		|| new Set(duties.map((duty) => duty.slot)).size !== duties.length
	) return []
	return duties
}

export const getProposerDuties = async (
	chainId: number,
	epoch: number
) => {
	if (!Number.isSafeInteger(epoch) || epoch < 0)
		throw new Error(`Beacon_Rest: invalid proposer duty epoch ${String(epoch)}`)
	const res = await beaconFetch(chainId, `/eth/v1/validator/duties/proposer/${String(epoch)}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET proposer duties', res)
	return getProposerDutiesFromWire(await res.json<JsonValue>())
}

export const getSyncCommitteeFromWire = (
	wire: JsonValue
) => {
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
	stateId: string | number = 'head',
	epoch?: number
) => {
	const normalizedStateId = normalizeBeaconStateOrBlockId(stateId)
	if (epoch != null && (!Number.isSafeInteger(epoch) || epoch < 0))
		throw new Error('Beacon: sync committee epoch must be a non-negative safe integer')
	const res = await beaconFetch(
		chainId,
		(
			epoch == null ?
				`/eth/v1/beacon/states/${normalizedStateId}/sync_committees`
			:
				`/eth/v1/beacon/states/${normalizedStateId}/sync_committees?epoch=${String(epoch)}`
		),
		{
			headers: { accept: 'application/json' },
		}
	)
	if (!res.ok) await throwHttpError('Beacon GET sync_committees', res)
	return getSyncCommitteeFromWire(await res.json<JsonValue>())
}

const requiredUint64BigInt = (
	value: JsonValue | undefined,
	description: string
) => {
	if (typeof value !== 'string' || !isUint64Wire(value))
		throw new Error(`Beacon: invalid ${description}`)
	return BigInt(value)
}

const requiredNonNegativeBigInt = (
	value: JsonValue | undefined,
	description: string
) => {
	if (typeof value !== 'string' || !/^[0-9]+$/.test(value))
		throw new Error(`Beacon: invalid ${description}`)
	return BigInt(value)
}

const requiredUint64SafeInteger = (
	value: JsonValue | undefined,
	description: string
) => {
	const number = Number(requiredUint64BigInt(value, description))
	if (!Number.isSafeInteger(number))
		throw new Error(`Beacon: unsafe ${description}`)
	return number
}

const requiredHex = (
	value: JsonValue | undefined,
	byteSize: number,
	description: string
) => {
	if (
		typeof value !== 'string'
		|| !new RegExp(`^0x[0-9a-fA-F]{${String(byteSize * 2)}}$`).test(value)
	) throw new Error(`Beacon: invalid ${description}`)
	return value
}

const beaconExecutionPayloadBidFromWire = (
	wire: JsonValue
): BeaconExecutionPayloadBid => {
	if (!isJsonObject(wire) || !isJsonObject(wire.message))
		throw new Error('Beacon: invalid signed execution payload bid')
	if (!Array.isArray(wire.message.blob_kzg_commitments))
		throw new Error('Beacon: invalid execution payload bid commitments')
	return {
		builderIndex: requiredUint64SafeInteger(wire.message.builder_index, 'execution payload bid builder index'),
		slot: requiredUint64SafeInteger(wire.message.slot, 'execution payload bid slot'),
		parentExecutionBlockHash: requiredHex(wire.message.parent_block_hash, 32, 'execution payload bid parent block hash'),
		parentBeaconBlockRoot: requiredHex(wire.message.parent_block_root, 32, 'execution payload bid parent beacon block root'),
		executionBlockHash: requiredHex(wire.message.block_hash, 32, 'execution payload bid block hash'),
		prevRandao: requiredHex(wire.message.prev_randao, 32, 'execution payload bid prev_randao'),
		feeRecipient: requiredHex(wire.message.fee_recipient, 20, 'execution payload bid fee recipient'),
		gasLimit: requiredUint64BigInt(wire.message.gas_limit, 'execution payload bid gas limit'),
		valueGwei: requiredUint64BigInt(wire.message.value, 'execution payload bid value'),
		executionPaymentGwei: requiredUint64BigInt(wire.message.execution_payment, 'execution payload bid payment'),
		blobKzgCommitments: wire.message.blob_kzg_commitments.map((commitment) => (
			requiredHex(commitment, 48, 'execution payload bid blob KZG commitment')
		)),
		executionRequestsRoot: requiredHex(wire.message.execution_requests_root, 32, 'execution payload bid execution requests root'),
		signature: requiredHex(wire.signature, 96, 'execution payload bid signature'),
	}
}

const beaconExecutionRequestsFromWire = (
	wire: JsonValue
): BeaconExecutionRequests => {
	if (
		!isJsonObject(wire)
		|| !Array.isArray(wire.deposits)
		|| !Array.isArray(wire.withdrawals)
		|| !Array.isArray(wire.consolidations)
	) throw new Error('Beacon: invalid execution requests')
	return {
		deposits: wire.deposits.map((request) => {
			if (!isJsonObject(request))
				throw new Error('Beacon: invalid deposit execution request')
			return {
				pubkey: requiredHex(request.pubkey, 48, 'deposit request pubkey'),
				withdrawalCredentials: requiredHex(request.withdrawal_credentials, 32, 'deposit request withdrawal credentials'),
				amountGwei: requiredUint64BigInt(request.amount, 'deposit request amount'),
				signature: requiredHex(request.signature, 96, 'deposit request signature'),
				requestIndex: requiredUint64BigInt(request.index, 'deposit request index'),
			}
		}),
		withdrawals: wire.withdrawals.map((request) => {
			if (!isJsonObject(request))
				throw new Error('Beacon: invalid withdrawal execution request')
			return {
				sourceAddress: requiredHex(request.source_address, 20, 'withdrawal request source address'),
				validatorPubkey: requiredHex(request.validator_pubkey, 48, 'withdrawal request validator pubkey'),
				amountGwei: requiredUint64BigInt(request.amount, 'withdrawal request amount'),
			}
		}),
		consolidations: wire.consolidations.map((request) => {
			if (!isJsonObject(request))
				throw new Error('Beacon: invalid consolidation execution request')
			return {
				sourceAddress: requiredHex(request.source_address, 20, 'consolidation request source address'),
				sourcePubkey: requiredHex(request.source_pubkey, 48, 'consolidation request source pubkey'),
				targetPubkey: requiredHex(request.target_pubkey, 48, 'consolidation request target pubkey'),
			}
		}),
	}
}

export const getBlockDutySummaryFromWire = (wire: JsonValue): BeaconBlockDutySummary => {
	if (!isJsonObject(wire))
		throw new Error('Beacon: invalid block duty summary response')
	const data = wire.data
	if (!isJsonObject(data))
		throw new Error('Beacon: invalid block duty summary response')
	const message = data.message
	if (!isJsonObject(message))
		throw new Error('Beacon: invalid block duty summary response')
	const body = message.body
	if (!isJsonObject(body))
		throw new Error('Beacon: invalid block duty summary response')
	if (
		!Array.isArray(body.attestations)
		|| !Array.isArray(body.deposits)
		|| !Array.isArray(body.proposer_slashings)
		|| !Array.isArray(body.attester_slashings)
	) throw new Error('Beacon: invalid block duty summary response')
	const attestations = body.attestations.map((attestationWire, index) => {
		if (!isJsonObject(attestationWire))
			throw new Error('Beacon: invalid block duty summary attestation')
		const attestationData = attestationWire.data
		if (!isJsonObject(attestationData))
			throw new Error('Beacon: invalid block duty summary attestation')
		const committeeIndex = Number(attestationData.index)
		if (!Number.isSafeInteger(committeeIndex) || committeeIndex < 0)
			throw new Error('Beacon: invalid block duty summary attestation committee index')
		if (
			attestationWire.aggregation_bits != null
			&& typeof attestationWire.aggregation_bits !== 'string'
		) throw new Error('Beacon: invalid block duty summary attestation aggregation bits')
		return {
			index,
			indexInBlock: index,
			committeeIndex,
			...(attestationWire.aggregation_bits != null && {
				aggregationBits: attestationWire.aggregation_bits,
			}),
		}
	})
	const deposits = body.deposits.map((depositWire, index) => {
		if (!isJsonObject(depositWire) || !Array.isArray(depositWire.proof) || !isJsonObject(depositWire.data))
			throw new Error('Beacon: invalid block duty summary deposit')
		if (!depositWire.proof.every((proof) => typeof proof === 'string'))
			throw new Error('Beacon: invalid block duty summary deposit proof')
		if (
			typeof depositWire.data.pubkey !== 'string'
			|| typeof depositWire.data.withdrawal_credentials !== 'string'
			|| typeof depositWire.data.signature !== 'string'
		)
			throw new Error('Beacon: invalid block duty summary deposit data')
		const amountGwei = nonNegativeDecimalBigIntFromWire(
			typeof depositWire.data.amount === 'string' ? depositWire.data.amount : undefined
		)
		if (amountGwei == null)
			throw new Error('Beacon: invalid block duty summary deposit amount')
		return {
			index,
			indexInBlock: index,
			pubkey: depositWire.data.pubkey,
			withdrawalCredentials: depositWire.data.withdrawal_credentials,
			amountGwei,
			signature: depositWire.data.signature,
			proof: [...depositWire.proof],
		}
	})
	const executionPayload = body.execution_payload
	if (executionPayload != null && !isJsonObject(executionPayload))
		throw new Error('Beacon: invalid block duty summary execution payload')
	if (executionPayload?.withdrawals != null && !Array.isArray(executionPayload.withdrawals))
		throw new Error('Beacon: invalid block duty summary withdrawals')
	const withdrawals = (executionPayload?.withdrawals ?? []).map((withdrawalWire, indexInBlock) => {
		if (!isJsonObject(withdrawalWire))
			throw new Error('Beacon: invalid block duty summary withdrawal')
		const index = Number(withdrawalWire.index)
		if (!Number.isSafeInteger(index) || index < 0)
			throw new Error('Beacon: invalid block duty summary withdrawal index')
		const validatorIndex = Number(withdrawalWire.validator_index)
		if (!Number.isSafeInteger(validatorIndex) || validatorIndex < 0)
			throw new Error('Beacon: invalid block duty summary withdrawal validator index')
		if (typeof withdrawalWire.address !== 'string')
			throw new Error('Beacon: invalid block duty summary withdrawal address')
		const amountGwei = nonNegativeDecimalBigIntFromWire(
			typeof withdrawalWire.amount === 'string' ? withdrawalWire.amount : undefined
		)
		if (amountGwei == null)
			throw new Error('Beacon: invalid block duty summary withdrawal amount')
		return {
			index,
			withdrawalIndex: index,
			indexInBlock,
			validatorIndex,
			address: withdrawalWire.address,
			amountGwei,
		}
	})
	const proposerSlashings = body.proposer_slashings.map<BeaconBlockDutySummary['slashings'][number]>((_slashing, index) => ({
		index,
		indexInKind: index,
		kind: 'proposer',
	}))
	const attesterSlashings = body.attester_slashings.map<BeaconBlockDutySummary['slashings'][number]>((_slashing, index) => ({
		index,
		indexInKind: index,
		kind: 'attester',
	}))
	return {
		deposits,
		attestations,
		withdrawals,
		slashings: [
			...proposerSlashings,
			...attesterSlashings,
		],
	}
}

export const getBeaconBlockSnapshotFromWire = (
	wire: JsonValue,
	headerWire: BeaconHeaderWire
): BeaconBlockSnapshot => {
	const header = getHeaderFromWire({ data: headerWire })
	if (header == null || !isJsonObject(wire))
		throw new Error('Beacon: invalid block snapshot response')
	if (
		typeof wire.version !== 'string'
		|| wire.version.length === 0
		|| typeof wire.execution_optimistic !== 'boolean'
		|| typeof wire.finalized !== 'boolean'
	) throw new Error('Beacon: invalid block snapshot response')
	const data = wire.data
	if (!isJsonObject(data))
		throw new Error('Beacon: invalid block snapshot response')
	const message = data.message
	if (!isJsonObject(message))
		throw new Error('Beacon: invalid block snapshot response')
	const body = message.body
	if (!isJsonObject(body))
		throw new Error('Beacon: invalid block snapshot response')
	const slot = requiredUint64SafeInteger(message.slot, 'block slot')
	const proposerIndex = requiredUint64SafeInteger(message.proposer_index, 'block proposer index')
	const parentRoot = requiredHex(message.parent_root, 32, 'block parent root')
	const stateRoot = requiredHex(message.state_root, 32, 'block state root')
	const signature = requiredHex(data.signature, 96, 'block signature')
	if (
		String(slot) !== header.header.message.slot
		|| String(proposerIndex) !== header.header.message.proposer_index
		|| parentRoot.toLowerCase() !== header.header.message.parent_root.toLowerCase()
		|| stateRoot.toLowerCase() !== header.header.message.state_root.toLowerCase()
		|| signature.toLowerCase() !== header.header.signature.toLowerCase()
	) throw new Error('Beacon: block body does not match exact header')

	const executionPayload = body.execution_payload
	if (executionPayload != null && !isJsonObject(executionPayload))
		throw new Error('Beacon: invalid block execution payload')
	const executionBlockHash = (
		executionPayload == null ?
			undefined
		:
			requiredHex(executionPayload.block_hash, 32, 'execution payload block hash')
	)
	const executionPayloadBid = (
		body.signed_execution_payload_bid == null ?
			undefined
		:
			beaconExecutionPayloadBidFromWire(body.signed_execution_payload_bid)
	)
	if (
		executionPayloadBid != null
		&& (
			wire.version !== 'gloas'
			|| executionPayloadBid.slot !== slot
			|| executionPayloadBid.parentBeaconBlockRoot.toLowerCase() !== parentRoot.toLowerCase()
		)
	) throw new Error('Beacon: execution payload bid does not match beacon block')

	return {
		...getBlockDutySummaryFromWire(wire),
		version: wire.version,
		root: header.root,
		slot,
		proposerIndex,
		parentRoot,
		stateRoot,
		bodyRoot: header.header.message.body_root,
		signature,
		canonical: header.canonical,
		executionOptimistic: wire.execution_optimistic,
		finalized: wire.finalized,
		...(executionBlockHash != null && { executionBlockHash }),
		...(executionPayloadBid != null && { executionPayloadBid }),
	}
}

export const getBeaconBlockSnapshot = async (
	chainId: number,
	blockId: string | number
) => {
	const normalizedBlockId = normalizeBeaconStateOrBlockId(blockId)
	const header = await getHeader(chainId, normalizedBlockId)
	if (
		normalizedBlockId.startsWith('0x')
		&& header.root.toLowerCase() !== normalizedBlockId
	) throw new Error('Beacon: header does not match requested block root')
	const response = await beaconFetch(chainId, `/eth/v2/beacon/blocks/${header.root.toLowerCase()}`, {
		headers: { accept: 'application/json' },
	})
	if (!response.ok) await throwHttpError('Beacon GET exact block', response)
	return getBeaconBlockSnapshotFromWire(
		await response.json<JsonValue>(),
		header
	)
}

export const getExecutionPayloadEnvelopeFromWire = (
	wire: JsonValue
): BeaconExecutionPayloadEnvelope => {
	if (
		!isJsonObject(wire)
		|| wire.version !== 'gloas'
		|| typeof wire.execution_optimistic !== 'boolean'
		|| typeof wire.finalized !== 'boolean'
	) throw new Error('Beacon: invalid execution payload envelope response')
	const data = wire.data
	if (!isJsonObject(data))
		throw new Error('Beacon: invalid execution payload envelope response')
	const message = data.message
	if (!isJsonObject(message))
		throw new Error('Beacon: invalid execution payload envelope response')
	const payload = message.payload
	if (!isJsonObject(payload))
		throw new Error('Beacon: invalid execution payload envelope response')
	if (
		!Array.isArray(payload.transactions)
		|| !payload.transactions.every((transaction) => (
			typeof transaction === 'string'
			&& /^0x(?:[0-9a-fA-F]{2})*$/.test(transaction)
		))
		|| !Array.isArray(payload.withdrawals)
		|| typeof payload.block_access_list !== 'string'
		|| !/^0x(?:[0-9a-fA-F]{2})*$/.test(payload.block_access_list)
	) throw new Error('Beacon: invalid execution payload envelope payload')

	return {
		version: 'gloas',
		executionOptimistic: wire.execution_optimistic,
		finalized: wire.finalized,
		beaconBlockRoot: requiredHex(message.beacon_block_root, 32, 'execution payload envelope beacon block root'),
		parentBeaconBlockRoot: requiredHex(message.parent_beacon_block_root, 32, 'execution payload envelope parent beacon block root'),
		builderIndex: requiredUint64SafeInteger(message.builder_index, 'execution payload envelope builder index'),
		signature: requiredHex(data.signature, 96, 'execution payload envelope signature'),
		executionBlockHash: requiredHex(payload.block_hash, 32, 'execution payload envelope block hash'),
		parentExecutionBlockHash: requiredHex(payload.parent_hash, 32, 'execution payload envelope parent block hash'),
		blockNumber: requiredUint64BigInt(payload.block_number, 'execution payload envelope block number'),
		feeRecipient: requiredHex(payload.fee_recipient, 20, 'execution payload envelope fee recipient'),
		gasLimit: requiredUint64BigInt(payload.gas_limit, 'execution payload envelope gas limit'),
		gasUsed: requiredUint64BigInt(payload.gas_used, 'execution payload envelope gas used'),
		timestampSeconds: requiredUint64BigInt(payload.timestamp, 'execution payload envelope timestamp'),
		slotNumber: requiredUint64SafeInteger(payload.slot_number, 'execution payload envelope slot number'),
		baseFeePerGas: requiredNonNegativeBigInt(payload.base_fee_per_gas, 'execution payload envelope base fee'),
		blobGasUsed: requiredUint64BigInt(payload.blob_gas_used, 'execution payload envelope blob gas used'),
		excessBlobGas: requiredUint64BigInt(payload.excess_blob_gas, 'execution payload envelope excess blob gas'),
		blockAccessList: payload.block_access_list,
		transactionCount: payload.transactions.length,
		executionRequests: beaconExecutionRequestsFromWire(message.execution_requests),
	}
}

export const getExecutionPayloadEnvelope = async (
	chainId: number,
	beaconBlockRoot: string
) => {
	if (!/^0x[0-9a-fA-F]{64}$/.test(beaconBlockRoot))
		throw new Error('Beacon: execution payload envelope requires an exact block root')
	const normalizedRoot = beaconBlockRoot.toLowerCase()
	const response = await beaconFetch(
		chainId,
		`/eth/v1/beacon/execution_payload_envelopes/${normalizedRoot}`,
		{
			headers: { accept: 'application/json' },
		}
	)
	if (response.status === 404) return null
	if (!response.ok) await throwHttpError('Beacon GET execution payload envelope', response)
	const envelope = getExecutionPayloadEnvelopeFromWire(await response.json<JsonValue>())
	if (envelope.beaconBlockRoot.toLowerCase() !== normalizedRoot)
		throw new Error('Beacon: execution payload envelope does not match requested block root')
	return envelope
}

export const getBlockDutySummary = async (
	chainId: number,
	blockId: string | number
) => {
	const normalizedBlockId = normalizeBeaconStateOrBlockId(blockId)
	const res = await beaconFetch(chainId, `/eth/v2/beacon/blocks/${normalizedBlockId}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET block', res)
	return getBlockDutySummaryFromWire(await res.json<JsonValue>())
}

export const getBlockRewardsFromWire = (wire: JsonValue) => {
	if (!isJsonObject(wire) || !isJsonObject(wire.data))
		throw new Error('Beacon: invalid block rewards response')
	if (typeof wire.execution_optimistic !== 'boolean' || typeof wire.finalized !== 'boolean')
		throw new Error('Beacon: invalid block rewards status')
	const proposerIndex = Number(wire.data.proposer_index)
	if (!Number.isSafeInteger(proposerIndex) || proposerIndex < 0)
		throw new Error('Beacon: invalid block rewards proposer index')
	const totalGwei = nonNegativeDecimalBigIntFromWire(typeof wire.data.total === 'string' ? wire.data.total : undefined)
	const attestationsGwei = nonNegativeDecimalBigIntFromWire(typeof wire.data.attestations === 'string' ? wire.data.attestations : undefined)
	const syncAggregateGwei = nonNegativeDecimalBigIntFromWire(typeof wire.data.sync_aggregate === 'string' ? wire.data.sync_aggregate : undefined)
	const proposerSlashingsGwei = nonNegativeDecimalBigIntFromWire(typeof wire.data.proposer_slashings === 'string' ? wire.data.proposer_slashings : undefined)
	const attesterSlashingsGwei = nonNegativeDecimalBigIntFromWire(typeof wire.data.attester_slashings === 'string' ? wire.data.attester_slashings : undefined)
	if (
		totalGwei == null
		|| attestationsGwei == null
		|| syncAggregateGwei == null
		|| proposerSlashingsGwei == null
		|| attesterSlashingsGwei == null
	)
		throw new Error('Beacon: invalid block rewards amount')
	return {
		proposerIndex,
		totalGwei,
		attestationsGwei,
		syncAggregateGwei,
		proposerSlashingsGwei,
		attesterSlashingsGwei,
		executionOptimistic: wire.execution_optimistic,
		finalized: wire.finalized,
	}
}

export const getBlockRewards = async (
	chainId: number,
	blockId: string | number
) => {
	const normalizedBlockId = normalizeBeaconStateOrBlockId(blockId)
	const res = await beaconFetch(chainId, `/eth/v1/beacon/rewards/blocks/${normalizedBlockId}`, {
		headers: { accept: 'application/json' },
	})
	if (!res.ok) await throwHttpError('Beacon GET block rewards', res)
	return getBlockRewardsFromWire(await res.json<JsonValue>())
}

export const getAttestationRewardsFromWire = (wire: JsonValue) => {
	if (
		!isJsonObject(wire)
		|| typeof wire.execution_optimistic !== 'boolean'
		|| typeof wire.finalized !== 'boolean'
		|| !isJsonObject(wire.data)
		|| !Array.isArray(wire.data.total_rewards)
	)
		throw new Error('Beacon: invalid attestation rewards response')
	return {
		executionOptimistic: wire.execution_optimistic,
		finalized: wire.finalized,
		rewards: wire.data.total_rewards.map<BeaconValidatorAttestationReward>((rewardWire) => {
			if (!isJsonObject(rewardWire))
				throw new Error('Beacon: invalid attestation reward')
			const validatorIndex = Number(rewardWire.validator_index)
			const headGwei = signedDecimalBigIntFromWire(rewardWire.head)
			const targetGwei = signedDecimalBigIntFromWire(rewardWire.target)
			const sourceGwei = signedDecimalBigIntFromWire(rewardWire.source)
			const inclusionDelayGwei = signedDecimalBigIntFromWire(rewardWire.inclusion_delay)
			const inactivityGwei = signedDecimalBigIntFromWire(rewardWire.inactivity)
			if (
				!Number.isSafeInteger(validatorIndex)
				|| validatorIndex < 0
				|| headGwei == null
				|| targetGwei == null
				|| sourceGwei == null
				|| inactivityGwei == null
			)
				throw new Error('Beacon: invalid attestation reward')
			return {
				validatorIndex,
				headGwei,
				targetGwei,
				sourceGwei,
				inclusionDelayGwei,
				inactivityGwei,
			}
		}),
	}
}

export const getAttestationRewards = async (
	chainId: number,
	epoch: number,
	validatorIds: (number | string)[]
) => {
	if (!Number.isSafeInteger(epoch) || epoch < 0)
		throw new Error('Beacon: attestation reward epoch must be a non-negative safe integer')
	const res = await beaconFetch(chainId, `/eth/v1/beacon/rewards/attestations/${String(epoch)}`, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
		},
		body: JSON.stringify(validatorIds.map(String)),
	})
	if (!res.ok) await throwHttpError('Beacon POST attestation rewards', res)
	return getAttestationRewardsFromWire(await res.json<JsonValue>())
}

export const getSyncCommitteeRewardsFromWire = (wire: JsonValue) => {
	if (
		!isJsonObject(wire)
		|| typeof wire.execution_optimistic !== 'boolean'
		|| typeof wire.finalized !== 'boolean'
		|| !Array.isArray(wire.data)
	)
		throw new Error('Beacon: invalid sync committee rewards response')
	return {
		executionOptimistic: wire.execution_optimistic,
		finalized: wire.finalized,
		rewards: wire.data.map<BeaconValidatorSyncCommitteeReward>((rewardWire) => {
			if (!isJsonObject(rewardWire))
				throw new Error('Beacon: invalid sync committee reward')
			const validatorIndex = Number(rewardWire.validator_index)
			const rewardGwei = signedDecimalBigIntFromWire(rewardWire.reward)
			if (!Number.isSafeInteger(validatorIndex) || validatorIndex < 0 || rewardGwei == null)
				throw new Error('Beacon: invalid sync committee reward')
			return {
				validatorIndex,
				rewardGwei,
			}
		}),
	}
}

export const getSyncCommitteeRewards = async (
	chainId: number,
	blockId: string | number,
	validatorIds: (number | string)[]
) => {
	const normalizedBlockId = normalizeBeaconStateOrBlockId(blockId)
	const res = await beaconFetch(chainId, `/eth/v1/beacon/rewards/sync_committee/${normalizedBlockId}`, {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
		},
		body: JSON.stringify(validatorIds.map(String)),
	})
	if (!res.ok) await throwHttpError('Beacon POST sync committee rewards', res)
	return getSyncCommitteeRewardsFromWire(await res.json<JsonValue>())
}

export const getDataColumnSidecarsFromWire = (
	wire: JsonValue
): BeaconDataColumnSidecars => {
	if (
		!isJsonObject(wire)
		|| (wire.version !== 'fulu' && wire.version !== 'gloas')
		|| typeof wire.execution_optimistic !== 'boolean'
		|| typeof wire.finalized !== 'boolean'
		|| !isJsonArray(wire.data)
	)
		throw new Error('Beacon: invalid data column sidecars response')

	const version = wire.version
	const seenIndices = new Set<number>()
	return {
		version,
		executionOptimistic: wire.execution_optimistic,
		finalized: wire.finalized,
		sidecars: wire.data.map((sidecarWire) => {
			if (
				!isJsonObject(sidecarWire)
				|| typeof sidecarWire.index !== 'string'
				|| !isUint64Wire(sidecarWire.index)
				|| !isJsonArray(sidecarWire.column)
				|| !isJsonArray(sidecarWire.kzg_proofs)
			)
				throw new Error('Beacon: invalid data column sidecar')

			const index = Number(sidecarWire.index)
			if (!Number.isSafeInteger(index) || seenIndices.has(index))
				throw new Error('Beacon: duplicate or unsafe data column sidecar index')

			seenIndices.add(index)
			const columns = sidecarWire.column.map((column) => {
				if (typeof column !== 'string' || !/^0x[0-9a-fA-F]{4096}$/.test(column))
					throw new Error('Beacon: invalid data column bytes')

				return column.toLowerCase()
			})
			const kzgProofs = sidecarWire.kzg_proofs.map((proof) => {
				if (typeof proof !== 'string' || !/^0x[0-9a-fA-F]{96}$/.test(proof))
					throw new Error('Beacon: invalid data column KZG proof')

				return proof.toLowerCase()
			})
			if (columns.length !== kzgProofs.length)
				throw new Error('Beacon: data column proof count does not match column count')

			if (version === 'gloas') {
				if (
					typeof sidecarWire.slot !== 'string'
					|| !isUint64Wire(sidecarWire.slot)
					|| typeof sidecarWire.beacon_block_root !== 'string'
					|| !/^0x[0-9a-fA-F]{64}$/.test(sidecarWire.beacon_block_root)
				)
					throw new Error('Beacon: invalid Gloas data column identity')

				const slot = Number(sidecarWire.slot)
				if (!Number.isSafeInteger(slot))
					throw new Error('Beacon: unsafe Gloas data column slot')

				return {
					index,
					columns,
					kzgProofs,
					kzgCommitments: [],
					beaconBlockRoot: sidecarWire.beacon_block_root.toLowerCase(),
					slot,
				}
			}

			if (
				!isJsonArray(sidecarWire.kzg_commitments)
				|| !isJsonObject(sidecarWire.signed_block_header)
				|| !isJsonObject(sidecarWire.signed_block_header.message)
				|| typeof sidecarWire.signed_block_header.message.slot !== 'string'
				|| !isUint64Wire(sidecarWire.signed_block_header.message.slot)
			)
				throw new Error('Beacon: invalid Fulu data column identity')

			const slot = Number(sidecarWire.signed_block_header.message.slot)
			if (!Number.isSafeInteger(slot))
				throw new Error('Beacon: unsafe Fulu data column slot')

			const kzgCommitments = sidecarWire.kzg_commitments.map((commitment) => {
				if (typeof commitment !== 'string' || !/^0x[0-9a-fA-F]{96}$/.test(commitment))
					throw new Error('Beacon: invalid data column KZG commitment')

				return commitment.toLowerCase()
			})
			if (columns.length !== kzgCommitments.length)
				throw new Error('Beacon: data column commitment count does not match column count')

			return {
				index,
				columns,
				kzgProofs,
				kzgCommitments,
				beaconBlockRoot: undefined,
				slot,
			}
		}),
	}
}

export const getDataColumnSidecars = async (
	chainId: number,
	blockId: string | number,
	indices?: number[]
) => {
	const normalizedBlockId = normalizeBeaconStateOrBlockId(blockId)
	if (indices?.some((index) => !Number.isSafeInteger(index) || index < 0))
		throw new Error('Beacon: invalid data column index')

	const searchParams = new URLSearchParams()
	for (const index of indices ?? [])
		searchParams.append('indices', String(index))

	const res = await beaconFetch(
		chainId,
		`/eth/v1/debug/beacon/data_column_sidecars/${normalizedBlockId}${searchParams.size === 0 ? '' : `?${searchParams}`}`,
		{
			headers: {
				accept: 'application/json',
			},
		}
	)
	if (!res.ok) await throwHttpError('Beacon GET data column sidecars', res)
	const beaconRest = beaconRestByChainId.get(chainId)
	if (beaconRest == null)
		throw new Error(`Beacon_Rest: no binding for chain ${String(chainId)}`)

	return {
		...getDataColumnSidecarsFromWire(await res.json<JsonValue>()),
		endpointUrl: firstHttpUrlForBinding(beaconRest.binding),
	}
}
