import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	requiredPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import { bindingByChainId } from '$/sources/BeaconchaIn/Rest/constants.ts'
import {
	beaconchaInAttestationEnvelope,
	beaconchaInAttesterSlashingEnvelope,
	beaconchaInDepositEnvelope,
	beaconchaInEpochEnvelope,
	beaconchaInProposerSlashingEnvelope,
	beaconchaInSlotEnvelope,
	beaconchaInValidatorAttestationEnvelope,
	beaconchaInValidatorEnvelope,
	beaconchaInWithdrawalEnvelope,
	type BeaconchaInResponse,
} from '$/sources/BeaconchaIn/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => _Value
	},
	value: unknown,
	label: string
) => {
	try {
		return envelope.assert(value)
	} catch {
		throw new Error(`${Source.BeaconchaIn_Rest}: invalid ${label} response envelope`)
	}
}

const beaconchaInTimestampMs = (timestamp: string, label: string) => {
	const ms = Date.parse(timestamp)
	if (!Number.isFinite(ms) || ms < 0)
		throw new Error(`${Source.BeaconchaIn_Rest}: invalid ${label} timestamp`)

	return ms
}

const beaconchaInRequestedValidatorIndex = (indexOrPubkey: number | string) => {
	if (typeof indexOrPubkey === 'number')
		return indexOrPubkey

	const asNumber = Number(indexOrPubkey)
	if (Number.isSafeInteger(asNumber))
		return asNumber

	return undefined
}

const beaconchaInGetJson = async <_Data>(
	publicEnv: SourcePublicEnv,
	{
		chainId,
		path,
		label,
	}: {
		chainId: number
		path: `/${string}`
		label: string
	}
) => {
	const binding = bindingByChainId[String(chainId)]
	if (binding == null)
		throw new Error(`${Source.BeaconchaIn_Rest}: no binding for chain ${String(chainId)}`)

	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`,
		{
			headers: {
				apikey: requiredPublicEnvString(publicEnv, 'PUBLIC_BEACONCHAIN_API_KEY'),
			},
		}
	)
	if (!response.ok) await throwHttpError(label, response)

	const wire = await response.json<BeaconchaInResponse<_Data>>()
	if (wire.status !== 'OK')
		throw new Error(`${Source.BeaconchaIn_Rest}: ${label} failed (status ${wire.status})`)
	if (wire.data == null)
		throw new Error(`${Source.BeaconchaIn_Rest}: ${label} returned no data (status ${wire.status})`)

	return wire.data
}

const beaconchaInGetList = async <_Item>(
	publicEnv: SourcePublicEnv,
	{
		chainId,
		path,
		label,
		itemEnvelope,
	}: {
		chainId: number
		path: `/${string}`
		label: string
		itemEnvelope: {
			assert: (value: unknown) => _Item
		}
	}
) => {
	const data = await beaconchaInGetJson<unknown[]>(
		publicEnv,
		{
			chainId,
			path,
			label,
		}
	)
	if (!Array.isArray(data))
		throw new Error(`${Source.BeaconchaIn_Rest}: ${label} returned a non-list payload`)
	return data.map((item, index) => (
		assertEnvelope(itemEnvelope, item, `${label}[${String(index)}]`)
	))
}

export const getEpoch = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		epoch,
	}: {
		chainId: number
		epoch: number | 'latest' | 'finalized'
	}
) => {
	const wire = assertEnvelope(
		beaconchaInEpochEnvelope,
		await beaconchaInGetJson(
			publicEnv,
			{
				chainId,
				path: `/epoch/${String(epoch)}`,
				label: 'BeaconchaIn GET epoch',
			}
		),
		'epoch'
	)
	if (typeof epoch === 'number' && wire.epoch !== epoch)
		throw new Error(`${Source.BeaconchaIn_Rest}: epoch response does not match the requested epoch`)

	beaconchaInTimestampMs(wire.ts, 'epoch')
	return wire
}

export const getEpochSlots = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		epoch,
	}: {
		chainId: number
		epoch: number | 'latest' | 'finalized'
	}
) => {
	const requestedEpoch = typeof epoch === 'number' ? epoch : undefined
	const slots = await beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/epoch/${String(epoch)}/slots`,
			label: 'BeaconchaIn GET epoch slots',
			itemEnvelope: beaconchaInSlotEnvelope,
		}
	)
	const seen = new Set<number>()
	for (const slot of slots) {
		if (requestedEpoch != null && slot.epoch !== requestedEpoch)
			throw new Error(`${Source.BeaconchaIn_Rest}: epoch slot does not match the requested epoch`)
		if (seen.has(slot.slot))
			throw new Error(`${Source.BeaconchaIn_Rest}: epoch slots contain duplicate identities`)

		seen.add(slot.slot)
	}

	return slots
}

const beaconchaInSlotRoot = (value: string) => (
	(
		value.startsWith('0x') || value.startsWith('0X') ?
			value
		:
			`0x${value}`
	).toLowerCase()
)

export const getSlot = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest' | 'head' | `0x${string}`
	}
) => {
	const wire = assertEnvelope(
		beaconchaInSlotEnvelope,
		await beaconchaInGetJson(
			publicEnv,
			{
				chainId,
				path: `/slot/${encodeURIComponent(String(slot))}`,
				label: 'BeaconchaIn GET slot',
			}
		),
		'slot'
	)
	if (typeof slot === 'number' && wire.slot !== slot)
		throw new Error(`${Source.BeaconchaIn_Rest}: slot response does not match the requested slot`)
	if (typeof slot === 'string' && slot !== 'latest' && slot !== 'head' && beaconchaInSlotRoot(wire.blockroot) !== beaconchaInSlotRoot(slot))
		throw new Error(`${Source.BeaconchaIn_Rest}: slot response does not match the requested block root`)

	return wire
}

export const getValidator = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		indexOrPubkey,
	}: {
		chainId: number
		indexOrPubkey: number | string
	}
) => {
	const wire = assertEnvelope(
		beaconchaInValidatorEnvelope,
		await beaconchaInGetJson(
			publicEnv,
			{
				chainId,
				path: `/validator/${encodeURIComponent(String(indexOrPubkey))}`,
				label: 'BeaconchaIn GET validator',
			}
		),
		'validator'
	)
	const requestedIndex = beaconchaInRequestedValidatorIndex(indexOrPubkey)
	if (requestedIndex != null) {
		if (wire.validator_index !== requestedIndex)
			throw new Error(`${Source.BeaconchaIn_Rest}: validator response does not match the requested validator index`)
	} else if (/^0x[0-9a-fA-F]{96}$/.test(String(indexOrPubkey))) {
		if (wire.pubkey.toLowerCase() !== String(indexOrPubkey).toLowerCase())
			throw new Error(`${Source.BeaconchaIn_Rest}: validator response does not match the requested validator pubkey`)
	}

	return wire
}

/** @see https://docs.beaconcha.in/api-reference/validators/validator-attestations-history */
export const getValidatorAttestations = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		indexOrPubkey,
		startEpoch,
		endEpoch,
		slim,
	}: {
		chainId: number
		indexOrPubkey: number | string
		startEpoch?: number
		endEpoch?: number
		slim?: boolean
	}
) => {
	const requestedValidatorIndex = beaconchaInRequestedValidatorIndex(indexOrPubkey)
	const search = new URLSearchParams(
		Object.entries({
			...(startEpoch != null && { startEpoch: String(startEpoch) }),
			...(endEpoch != null && { endEpoch: String(endEpoch) }),
			...(slim != null && { slim: String(slim) }),
		})
	)
	const attestations = await beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/validator/${encodeURIComponent(String(indexOrPubkey))}/attestations${search.size === 0 ? '' : `?${search}`}`,
			label: 'BeaconchaIn GET validator attestations',
			itemEnvelope: beaconchaInValidatorAttestationEnvelope,
		}
	)
	const seen = new Set<number>()
	for (const attestation of attestations) {
		if (requestedValidatorIndex != null && attestation.validatorindex !== requestedValidatorIndex)
			throw new Error(`${Source.BeaconchaIn_Rest}: validator attestation does not match the requested validator`)
		if (seen.has(attestation.attesterslot))
			throw new Error(`${Source.BeaconchaIn_Rest}: validator attestations contain duplicate identities`)

		seen.add(attestation.attesterslot)
		if (attestation.week_start != null)
			beaconchaInTimestampMs(attestation.week_start, 'validator attestation week_start')
		if (attestation.week_end != null)
			beaconchaInTimestampMs(attestation.week_end, 'validator attestation week_end')
	}

	return attestations
}

export const getSlotAttestations = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest'
	}
) => {
	const requestedSlot = typeof slot === 'number' ? slot : undefined
	const attestations = await beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/attestations`,
			label: 'BeaconchaIn GET slot attestations',
			itemEnvelope: beaconchaInAttestationEnvelope,
		}
	)
	const seen = new Set<number>()
	for (const attestation of attestations) {
		if (requestedSlot != null && attestation.block_slot !== requestedSlot)
			throw new Error(`${Source.BeaconchaIn_Rest}: slot attestation does not match the requested slot`)
		if (seen.has(attestation.block_index))
			throw new Error(`${Source.BeaconchaIn_Rest}: slot attestations contain duplicate identities`)

		seen.add(attestation.block_index)
	}

	return attestations
}

export const getSlotWithdrawals = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest'
	}
) => {
	const requestedSlot = typeof slot === 'number' ? slot : undefined
	const withdrawals = await beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/withdrawals`,
			label: 'BeaconchaIn GET slot withdrawals',
			itemEnvelope: beaconchaInWithdrawalEnvelope,
		}
	)
	const seen = new Set<number>()
	for (const withdrawal of withdrawals) {
		if (requestedSlot != null && withdrawal.block_slot !== requestedSlot)
			throw new Error(`${Source.BeaconchaIn_Rest}: slot withdrawal does not match the requested slot`)
		if (seen.has(withdrawal.withdrawalindex))
			throw new Error(`${Source.BeaconchaIn_Rest}: slot withdrawals contain duplicate identities`)

		seen.add(withdrawal.withdrawalindex)
	}

	return withdrawals
}

/** @see https://docs.beaconcha.in/api-reference/slots/deposits-for-a-slot */
export const getSlotDeposits = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest'
	}
) => {
	const requestedSlot = typeof slot === 'number' ? slot : undefined
	const deposits: (typeof beaconchaInDepositEnvelope.infer)[] = []
	const seen = new Set<number>()
	for (let offset = 0; offset <= 1_000_000; offset += 100) {
		const page = await beaconchaInGetList(
			publicEnv,
			{
				chainId,
				path: `/slot/${encodeURIComponent(String(slot))}/deposits?offset=${String(offset)}&limit=100`,
				label: 'BeaconchaIn GET slot deposits',
				itemEnvelope: beaconchaInDepositEnvelope,
			}
		)
		for (const deposit of page) {
			if (requestedSlot != null && deposit.block_slot !== requestedSlot)
				throw new Error(`${Source.BeaconchaIn_Rest}: slot deposit does not match the requested slot`)
			if (seen.has(deposit.block_index))
				throw new Error(`${Source.BeaconchaIn_Rest}: slot deposits contain duplicate identities`)

			seen.add(deposit.block_index)
			deposits.push(deposit)
		}
		if (page.length < 100)
			return deposits
	}

	throw new Error(`${Source.BeaconchaIn_Rest}: slot deposits did not complete`)
}

export const getSlotAttesterSlashings = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest'
	}
) => {
	const requestedSlot = typeof slot === 'number' ? slot : undefined
	const slashings = await beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/attesterslashings`,
			label: 'BeaconchaIn GET slot attester slashings',
			itemEnvelope: beaconchaInAttesterSlashingEnvelope,
		}
	)
	const seen = new Set<number>()
	for (const slashing of slashings) {
		if (requestedSlot != null && slashing.block_slot !== requestedSlot)
			throw new Error(`${Source.BeaconchaIn_Rest}: slot attester slashing does not match the requested slot`)
		if (seen.has(slashing.block_index))
			throw new Error(`${Source.BeaconchaIn_Rest}: slot attester slashings contain duplicate identities`)

		seen.add(slashing.block_index)
	}

	return slashings
}

export const getSlotProposerSlashings = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest'
	}
) => {
	const requestedSlot = typeof slot === 'number' ? slot : undefined
	const slashings = await beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/proposerslashings`,
			label: 'BeaconchaIn GET slot proposer slashings',
			itemEnvelope: beaconchaInProposerSlashingEnvelope,
		}
	)
	const seen = new Set<number>()
	for (const slashing of slashings) {
		if (requestedSlot != null && slashing.block_slot !== requestedSlot)
			throw new Error(`${Source.BeaconchaIn_Rest}: slot proposer slashing does not match the requested slot`)
		if (seen.has(slashing.block_index))
			throw new Error(`${Source.BeaconchaIn_Rest}: slot proposer slashings contain duplicate identities`)

		seen.add(slashing.block_index)
	}

	return slashings
}
