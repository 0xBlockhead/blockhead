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
) => (
	assertEnvelope(
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
)

export const getEpochSlots = (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		epoch,
	}: {
		chainId: number
		epoch: number | 'latest' | 'finalized'
	}
) => (
	beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/epoch/${String(epoch)}/slots`,
			label: 'BeaconchaIn GET epoch slots',
			itemEnvelope: beaconchaInSlotEnvelope,
		}
	)
)

export const getSlot = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest' | 'head'
	}
) => (
	assertEnvelope(
		beaconchaInSlotEnvelope,
		await beaconchaInGetJson(
			publicEnv,
			{
				chainId,
				path: `/slot/${String(slot)}`,
				label: 'BeaconchaIn GET slot',
			}
		),
		'slot'
	)
)

export const getValidator = async (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		indexOrPubkey,
	}: {
		chainId: number
		indexOrPubkey: number | string
	}
) => (
	assertEnvelope(
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
)

/** @see https://docs.beaconcha.in/api-reference/validators/validator-attestations-history */
export const getValidatorAttestations = (
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
	const search = new URLSearchParams(
		Object.entries({
			...(startEpoch != null && { startEpoch: String(startEpoch) }),
			...(endEpoch != null && { endEpoch: String(endEpoch) }),
			...(slim != null && { slim: String(slim) }),
		})
	)
	return beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/validator/${encodeURIComponent(String(indexOrPubkey))}/attestations${search.size === 0 ? '' : `?${search}`}`,
			label: 'BeaconchaIn GET validator attestations',
			itemEnvelope: beaconchaInValidatorAttestationEnvelope,
		}
	)
}

export const getSlotAttestations = (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest'
	}
) => (
	beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/attestations`,
			label: 'BeaconchaIn GET slot attestations',
			itemEnvelope: beaconchaInAttestationEnvelope,
		}
	)
)

export const getSlotWithdrawals = (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest'
	}
) => (
	beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/withdrawals`,
			label: 'BeaconchaIn GET slot withdrawals',
			itemEnvelope: beaconchaInWithdrawalEnvelope,
		}
	)
)

export const getSlotAttesterSlashings = (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest'
	}
) => (
	beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/attesterslashings`,
			label: 'BeaconchaIn GET slot attester slashings',
			itemEnvelope: beaconchaInAttesterSlashingEnvelope,
		}
	)
)

export const getSlotProposerSlashings = (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest'
	}
) => (
	beaconchaInGetList(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/proposerslashings`,
			label: 'BeaconchaIn GET slot proposer slashings',
			itemEnvelope: beaconchaInProposerSlashingEnvelope,
		}
	)
)
