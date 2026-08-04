import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	requiredPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import bindings from '$/sources/BeaconchaIn/bindings.ts'
import type {
	BeaconchaInEpoch,
	BeaconchaInResponse,
	BeaconchaInSlot,
	BeaconchaInValidator,
} from '$/sources/BeaconchaIn/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

export const bindingByChainId = Object.fromEntries(
	bindings[Source.BeaconchaIn_Rest].map((binding) => [binding.target.key, binding])
)

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
	if (wire.status !== 'OK' || wire.data == null)
		throw new Error(`BeaconchaIn_Rest: ${label} returned no data (status ${wire.status})`)

	return wire.data
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
	beaconchaInGetJson<BeaconchaInSlot[]>(
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
