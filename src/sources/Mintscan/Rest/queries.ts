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
	CosmosSdkNodeInfoResponse,
	CosmosSdkTxResponse,
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

const assertNetwork = (network: string) => {
	if (network.length === 0)
		throw new Error('Mintscan: network is empty')
}

const assertAddress = (address: string) => {
	if (address.length === 0)
		throw new Error('Mintscan: address is empty')
}

const assertHeight = (height: bigint) => {
	if (height < 0n)
		throw new Error(`Mintscan: invalid block height ${height}`)
}

const assertTxHash = (txHash: string) => {
	if (txHash.length === 0)
		throw new Error('Mintscan: transaction hash is empty')
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
) => {
	assertNetwork(network)
	assertAddress(address)
	return mintscanGet<CosmosSdkAccountResponse>(
		publicEnv,
		`/${encodeURIComponent(network)}/lcd/cosmos/auth/v1beta1/accounts/${encodeURIComponent(address)}`
	)
}

export const getLatestBlock = (
	publicEnv: SourcePublicEnv,
	{
		network,
	}: {
		network: string
	}
) => {
	assertNetwork(network)
	return mintscanGet<CosmosSdkBlockResponse>(
		publicEnv,
		`/${encodeURIComponent(network)}/lcd/cosmos/base/tendermint/v1beta1/blocks/latest`
	)
}

export const getBlock = (
	publicEnv: SourcePublicEnv,
	{
		network,
		height,
	}: {
		network: string
		height: bigint
	}
) => {
	assertNetwork(network)
	assertHeight(height)
	return mintscanGet<CosmosSdkBlockResponse>(
		publicEnv,
		`/${encodeURIComponent(network)}/lcd/cosmos/base/tendermint/v1beta1/blocks/${height.toString()}`
	)
}

export const getNodeInfo = (
	publicEnv: SourcePublicEnv,
	{
		network,
	}: {
		network: string
	}
) => {
	assertNetwork(network)
	return mintscanGet<CosmosSdkNodeInfoResponse>(
		publicEnv,
		`/${encodeURIComponent(network)}/lcd/cosmos/base/tendermint/v1beta1/node_info`
	)
}

export const getTx = (
	publicEnv: SourcePublicEnv,
	{
		network,
		txHash,
	}: {
		network: string
		txHash: string
	}
) => {
	assertNetwork(network)
	assertTxHash(txHash)
	return mintscanGet<CosmosSdkTxResponse>(
		publicEnv,
		`/${encodeURIComponent(network)}/lcd/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`
	)
}
