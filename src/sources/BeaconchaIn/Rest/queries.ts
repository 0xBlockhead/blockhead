import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/BeaconchaIn/bindings.ts'
import type {
	BeaconchaInEpoch,
	BeaconchaInResponse,
} from '$/sources/BeaconchaIn/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const bindingByChainId = Object.fromEntries(
	bindings[Source.BeaconchaIn_Rest].map((binding) => [binding.target.key, binding])
)

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
	const binding = bindingByChainId[String(chainId)]
	if (binding == null)
		throw new Error(`BeaconchaIn_Rest: no binding for chain ${String(chainId)}`)

	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/epoch/${String(epoch)}`,
		{
			headers: {
				Authorization: `Bearer ${publicEnv.PUBLIC_BEACONCHAIN_API_KEY}`,
			},
		}
	)
	if (!response.ok) await throwHttpError('BeaconchaIn GET epoch', response)
	const wire = await response.json<BeaconchaInResponse<BeaconchaInEpoch>>()
	return wire.data
}
