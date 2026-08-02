import { throwHttpError } from '$/lib/http.ts'
import {
	requiredPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	CosmosSdkAccountResponse,
	CosmosSdkBlockResponse,
} from '$/sources/CosmosSdk/Rest/types.ts'
import bindings from '$/sources/Mintscan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Mintscan][0]

const mintscanGet = async <_Response>(
	publicEnv: SourcePublicEnv,
	path: string
) => {
	const url = new URL(path, firstHttpUrlForBinding(binding)).toString()
	const response = await sourceFetch(binding, url, {
		headers: {
			Authorization: `Bearer ${requiredPublicEnvString(publicEnv, 'PUBLIC_MINTSCAN_API_KEY')}`,
		},
	})
	if (!response.ok)
		await throwHttpError(`Mintscan GET ${url}`, response)

	return response.json<_Response>()
}

export const getAccount = (
	publicEnv: SourcePublicEnv,
	{
		network,
		address,
	}: {
		network: string
		address: string
	}
) => (
	mintscanGet<CosmosSdkAccountResponse>(
		publicEnv,
		`/${encodeURIComponent(network)}/lcd/cosmos/auth/v1beta1/accounts/${encodeURIComponent(address)}`
	)
)

export const getLatestBlock = (
	publicEnv: SourcePublicEnv,
	{
		network,
	}: {
		network: string
	}
) => (
	mintscanGet<CosmosSdkBlockResponse>(
		publicEnv,
		`/${encodeURIComponent(network)}/lcd/cosmos/base/tendermint/v1beta1/blocks/latest`
	)
)
