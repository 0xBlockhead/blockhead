import { substrateJsonRpc } from '$/sources/Substrate/JsonRpc/client.ts'
import type { BittensorScaleBytes } from '$/sources/Bittensor/JsonRpc/types.ts'
import { type as arktype } from 'arktype'
import {
	getBlock as getSubstrateBlock,
	getBlockHash as getSubstrateBlockHash,
	getFinalizedHead as getSubstrateFinalizedHead,
	getHeader as getSubstrateHeader,
	getRuntimeVersion as getSubstrateRuntimeVersion,
	getSystemHealth as getSubstrateSystemHealth,
} from '$/sources/Substrate/JsonRpc/queries.ts'

export const getMainnetRpcUrl = 'https://entrypoint-finney.opentensor.ai'

const bittensorOrigins = [
	{
		origin: getMainnetRpcUrl,
		corsEnabled: false,
	},
	{
		origin: 'https://lite.chain.opentensor.ai',
		corsEnabled: false,
	},
] as const

const bittensorJsonRpc = {
	origins: bittensorOrigins,
	label: 'Bittensor',
} as const

const scaleBytes = arktype('(number.integer >= 0 <= 255)[]')

const assertRpcUrl = (rpcUrl: string) => {
	if (!bittensorOrigins.some((origin) => origin.origin === rpcUrl))
		throw new Error('Bittensor_JsonRpc: expected canonical mainnet RPC endpoint')
}

const assertNetuid = (netuid: number) => {
	if (!Number.isSafeInteger(netuid) || netuid < 0 || netuid > 65_535)
		throw new Error('Bittensor_JsonRpc: netuid must be an unsigned 16-bit integer')
}

const assertBlockHash = (blockHash: string | undefined) => {
	if (blockHash != null && !/^0x[0-9a-fA-F]{64}$/.test(blockHash))
		throw new Error('Bittensor_JsonRpc: invalid observation block hash')
}

const getScaleBytes = async ({
	rpcUrl,
	method,
	params,
	maxBytes,
}: {
	rpcUrl: string
	method: string
	params: readonly unknown[]
	maxBytes: number
}): Promise<BittensorScaleBytes> => {
	assertRpcUrl(rpcUrl)
	const bytes = scaleBytes.assert(await substrateJsonRpc<unknown>({
		...bittensorJsonRpc,
		rpcUrl,
		method,
		params,
	}))
	if (bytes.length > maxBytes)
		throw new Error(`Bittensor_JsonRpc: ${method} exceeds ${maxBytes} byte response limit`)
	return bytes
}

const getNetworkScaleBytes = ({
	rpcUrl,
	method,
	blockHash,
}: {
	rpcUrl: string
	method: string
	blockHash?: string
}) => {
	assertBlockHash(blockHash)
	return getScaleBytes({
		rpcUrl,
		method,
		params: blockHash == null ? [] : [blockHash],
		maxBytes: 16_777_216,
	})
}

const getSubnetScaleBytes = async ({
	rpcUrl,
	method,
	netuid,
	blockHash,
}: {
	rpcUrl: string
	method: string
	netuid: number
	blockHash?: string
}) => {
	assertNetuid(netuid)
	assertBlockHash(blockHash)
	return await getScaleBytes({
		rpcUrl,
		method,
		params: blockHash == null ? [netuid] : [netuid, blockHash],
		maxBytes: 4_194_304,
	})
}

export const getFinalizedHead = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	getSubstrateFinalizedHead({
		...bittensorJsonRpc,
		rpcUrl,
	})
)

export const getBlockHash = ({
	rpcUrl,
	blockNumber,
}: {
	rpcUrl: string
	blockNumber: bigint
}) => (
	getSubstrateBlockHash({
		...bittensorJsonRpc,
		rpcUrl,
		blockNumber,
	})
)

export const getHeader = ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash?: string
}) => (
	getSubstrateHeader({
		...bittensorJsonRpc,
		rpcUrl,
		blockHash,
	})
)

export const getBlock = ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash: string
}) => (
	getSubstrateBlock({
		...bittensorJsonRpc,
		rpcUrl,
		blockHash,
	})
)

export const getRuntimeVersion = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	getSubstrateRuntimeVersion({
		...bittensorJsonRpc,
		rpcUrl,
	})
)

export const getSystemHealth = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	getSubstrateSystemHealth({
		...bittensorJsonRpc,
		rpcUrl,
	})
)

export const getSubnetsInfo = ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash?: string
}) => getNetworkScaleBytes({
	rpcUrl,
	method: 'subnetInfo_getSubnetsInfo',
	blockHash,
})

export const getAllDynamicInfo = ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash?: string
}) => getNetworkScaleBytes({
	rpcUrl,
	method: 'subnetInfo_getAllDynamicInfo',
	blockHash,
})

export const getAllMetagraphs = ({
	rpcUrl,
	blockHash,
}: {
	rpcUrl: string
	blockHash?: string
}) => getNetworkScaleBytes({
	rpcUrl,
	method: 'subnetInfo_getAllMetagraphs',
	blockHash,
})

export const getSubnetInfo = ({
	rpcUrl,
	netuid,
	blockHash,
}: {
	rpcUrl: string
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	rpcUrl,
	method: 'subnetInfo_getSubnetInfo',
	netuid,
	blockHash,
})

export const getDynamicInfo = ({
	rpcUrl,
	netuid,
	blockHash,
}: {
	rpcUrl: string
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	rpcUrl,
	method: 'subnetInfo_getDynamicInfo',
	netuid,
	blockHash,
})

export const getMetagraph = ({
	rpcUrl,
	netuid,
	blockHash,
}: {
	rpcUrl: string
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	rpcUrl,
	method: 'subnetInfo_getMetagraph',
	netuid,
	blockHash,
})

export const getSubnetHyperparams = ({
	rpcUrl,
	netuid,
	blockHash,
}: {
	rpcUrl: string
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	rpcUrl,
	method: 'subnetInfo_getSubnetHyperparams',
	netuid,
	blockHash,
})

export const getNeuronsLite = ({
	rpcUrl,
	netuid,
	blockHash,
}: {
	rpcUrl: string
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	rpcUrl,
	method: 'neuronInfo_getNeuronsLite',
	netuid,
	blockHash,
})

export const getNeuronLite = async ({
	rpcUrl,
	netuid,
	uid,
	blockHash,
}: {
	rpcUrl: string
	netuid: number
	uid: number
	blockHash?: string
}) => {
	assertNetuid(netuid)
	assertBlockHash(blockHash)
	if (!Number.isSafeInteger(uid) || uid < 0 || uid > 65_535)
		throw new Error('Bittensor_JsonRpc: uid must be an unsigned 16-bit integer')
	return await getScaleBytes({
		rpcUrl,
		method: 'neuronInfo_getNeuronLite',
		params: blockHash == null ? [netuid, uid] : [netuid, uid, blockHash],
		maxBytes: 65_536,
	})
}
