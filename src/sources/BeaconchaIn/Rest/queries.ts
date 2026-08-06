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
import type {
	BeaconchaInAttestation,
	BeaconchaInAttesterSlashing,
	BeaconchaInEpoch,
	BeaconchaInProposerSlashing,
	BeaconchaInResponse,
	BeaconchaInSlot,
	BeaconchaInValidator,
	BeaconchaInValidatorAttestation,
	BeaconchaInWithdrawal,
} from '$/sources/BeaconchaIn/Rest/types.ts'

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
		throw new Error(`BeaconchaIn_Rest: no binding for chain ${String(chainId)}`)

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
		throw new Error(`BeaconchaIn_Rest: ${label} failed (status ${wire.status})`)
	if (wire.data == null)
		throw new Error(`BeaconchaIn_Rest: ${label} returned no data (status ${wire.status})`)

	return wire.data
}

const beaconchaInGetList = async <_Item>(
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
	const data = await beaconchaInGetJson<_Item[]>(
		publicEnv,
		{
			chainId,
			path,
			label,
		}
	)
	if (!Array.isArray(data))
		throw new Error(`BeaconchaIn_Rest: ${label} returned a non-list payload`)
	return data
}

export const getEpoch = (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		epoch,
	}: {
		chainId: number
		epoch: number | 'latest' | 'finalized'
	}
) => (
	beaconchaInGetJson<BeaconchaInEpoch>(
		publicEnv,
		{
			chainId,
			path: `/epoch/${String(epoch)}`,
			label: 'BeaconchaIn GET epoch',
		}
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
	beaconchaInGetList<BeaconchaInSlot>(
		publicEnv,
		{
			chainId,
			path: `/epoch/${String(epoch)}/slots`,
			label: 'BeaconchaIn GET epoch slots',
		}
	)
)

export const getSlot = (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		slot,
	}: {
		chainId: number
		slot: number | 'latest' | 'head'
	}
) => (
	beaconchaInGetJson<BeaconchaInSlot>(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}`,
			label: 'BeaconchaIn GET slot',
		}
	)
)

export const getValidator = (
	publicEnv: SourcePublicEnv,
	{
		chainId,
		indexOrPubkey,
	}: {
		chainId: number
		indexOrPubkey: number | string
	}
) => (
	beaconchaInGetJson<BeaconchaInValidator>(
		publicEnv,
		{
			chainId,
			path: `/validator/${encodeURIComponent(String(indexOrPubkey))}`,
			label: 'BeaconchaIn GET validator',
		}
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
	return beaconchaInGetList<BeaconchaInValidatorAttestation>(
		publicEnv,
		{
			chainId,
			path: `/validator/${encodeURIComponent(String(indexOrPubkey))}/attestations${search.size === 0 ? '' : `?${search}`}`,
			label: 'BeaconchaIn GET validator attestations',
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
	beaconchaInGetList<BeaconchaInAttestation>(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/attestations`,
			label: 'BeaconchaIn GET slot attestations',
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
	beaconchaInGetList<BeaconchaInWithdrawal>(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/withdrawals`,
			label: 'BeaconchaIn GET slot withdrawals',
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
	beaconchaInGetList<BeaconchaInAttesterSlashing>(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/attesterslashings`,
			label: 'BeaconchaIn GET slot attester slashings',
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
	beaconchaInGetList<BeaconchaInProposerSlashing>(
		publicEnv,
		{
			chainId,
			path: `/slot/${String(slot)}/proposerslashings`,
			label: 'BeaconchaIn GET slot proposer slashings',
		}
	)
)
