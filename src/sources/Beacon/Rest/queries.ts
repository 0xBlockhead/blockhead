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
	BeaconBlockDutySummary,
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
	const withdrawals = (executionPayload?.withdrawals ?? []).map((withdrawalWire) => {
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
			validatorIndex,
			address: withdrawalWire.address,
			amountGwei,
		}
	})
	const proposerSlashings = body.proposer_slashings.map<BeaconBlockDutySummary['slashings'][number]>((_slashing, index) => ({
		index,
		kind: 'proposer',
	}))
	const attesterSlashings = body.attester_slashings.map<BeaconBlockDutySummary['slashings'][number]>((_slashing, index) => ({
		index,
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
