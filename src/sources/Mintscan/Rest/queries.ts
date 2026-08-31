import { throwHttpError } from '$/lib/http.ts'
import {
	requiredPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Mintscan/bindings.ts'
import {
	mintscanAccountResponseWire,
	mintscanBlockResponseWire,
	mintscanNodeInfoResponseWire,
	mintscanSyncingResponseWire,
	mintscanTxResponseWire,
} from '$/sources/Mintscan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Mintscan][0]

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, entry]: [string, unknown]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(omitUndefinedJson(response))
	} catch {
		throw new Error(`Mintscan: invalid ${label} response envelope`)
	}
}

const mintscanGetJson = async (
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

	return response.json()
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

export const getAccount = async (
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
	return assertEnvelope(
		'account',
		mintscanAccountResponseWire,
		await mintscanGetJson(
			publicEnv,
			`/${encodeURIComponent(network)}/lcd/cosmos/auth/v1beta1/accounts/${encodeURIComponent(address)}`
		)
	)
}

export const getLatestBlock = async (
	publicEnv: SourcePublicEnv,
	{
		network,
	}: {
		network: string
	}
) => {
	assertNetwork(network)
	return assertEnvelope(
		'latest block',
		mintscanBlockResponseWire,
		await mintscanGetJson(
			publicEnv,
			`/${encodeURIComponent(network)}/lcd/cosmos/base/tendermint/v1beta1/blocks/latest`
		)
	)
}

export const getBlock = async (
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
	return assertEnvelope(
		'block',
		mintscanBlockResponseWire,
		await mintscanGetJson(
			publicEnv,
			`/${encodeURIComponent(network)}/lcd/cosmos/base/tendermint/v1beta1/blocks/${height.toString()}`
		)
	)
}

export const getNodeInfo = async (
	publicEnv: SourcePublicEnv,
	{
		network,
	}: {
		network: string
	}
) => {
	assertNetwork(network)
	return assertEnvelope(
		'node info',
		mintscanNodeInfoResponseWire,
		await mintscanGetJson(
			publicEnv,
			`/${encodeURIComponent(network)}/lcd/cosmos/base/tendermint/v1beta1/node_info`
		)
	)
}

export const getSyncing = async (
	publicEnv: SourcePublicEnv,
	{
		network,
	}: {
		network: string
	}
) => {
	assertNetwork(network)
	return assertEnvelope(
		'syncing',
		mintscanSyncingResponseWire,
		await mintscanGetJson(
			publicEnv,
			`/${encodeURIComponent(network)}/lcd/cosmos/base/tendermint/v1beta1/syncing`
		)
	)
}

export const getTx = async (
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
	return assertEnvelope(
		'tx',
		mintscanTxResponseWire,
		await mintscanGetJson(
			publicEnv,
			`/${encodeURIComponent(network)}/lcd/cosmos/tx/v1beta1/txs/${encodeURIComponent(txHash)}`
		)
	)
}
