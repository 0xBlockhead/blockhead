import { substrateJsonRpc } from '$/sources/_shared/interfaces/SubstrateJsonRpc/client.ts'
import bindings from '$/sources/Bittensor/bindings.ts'
import { type as arktype } from 'arktype'
import {
	getBlock as getSubstrateBlock,
	getBlockHash as getSubstrateBlockHash,
	getFinalizedHead as getSubstrateFinalizedHead,
	getHeader as getSubstrateHeader,
	getRuntimeVersion as getSubstrateRuntimeVersion,
	getSystemHealth as getSubstrateSystemHealth,
} from '$/sources/_shared/interfaces/SubstrateJsonRpc/queries.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Bittensor_JsonRpc]
const bittensorJsonRpc = {
	binding,
	label: 'Bittensor',
}

const scaleBytes = arktype('(number.integer >= 0 <= 255)[]')

const assertNetuid = (netuid: number) => {
	if (!Number.isSafeInteger(netuid) || netuid < 0 || netuid > 65_535)
		throw new Error('Bittensor_JsonRpc: netuid must be an unsigned 16-bit integer')
}

const assertBlockHash = (blockHash: string | undefined) => {
	if (blockHash != null && !/^0x[0-9a-fA-F]{64}$/.test(blockHash))
		throw new Error('Bittensor_JsonRpc: invalid observation block hash')
}

const getScaleBytes = async ({
	method,
	params,
	maxBytes,
}: {
	method: string
	params: readonly unknown[]
	maxBytes: number
}) => {
	const bytes = scaleBytes.assert(await substrateJsonRpc<unknown>({
		...bittensorJsonRpc,
		method,
		params,
	}))
	if (bytes.length > maxBytes)
		throw new Error(`Bittensor_JsonRpc: ${method} exceeds ${maxBytes} byte response limit`)
	return bytes
}

const getNetworkScaleBytes = ({
	method,
	blockHash,
}: {
	method: string
	blockHash?: string
}) => {
	assertBlockHash(blockHash)
	return getScaleBytes({
		method,
		params: blockHash == null ? [] : [blockHash],
		maxBytes: 16_777_216,
	})
}

const getSubnetScaleBytes = async ({
	method,
	netuid,
	blockHash,
}: {
	method: string
	netuid: number
	blockHash?: string
}) => {
	assertNetuid(netuid)
	assertBlockHash(blockHash)
	return getScaleBytes({
		method,
		params: blockHash == null ? [netuid] : [netuid, blockHash],
		maxBytes: 4_194_304,
	})
}

export const getFinalizedHead = () => (
	getSubstrateFinalizedHead({
		...bittensorJsonRpc,
	})
)

export const getBlockHash = ({
	blockNumber,
}: {
	blockNumber: bigint
}) => (
	getSubstrateBlockHash({
		...bittensorJsonRpc,
		blockNumber,
	})
)

export const getHeader = ({
	blockHash,
}: {
	blockHash?: string
}) => (
	getSubstrateHeader({
		...bittensorJsonRpc,
		blockHash,
	})
)

export const getBlock = ({
	blockHash,
}: {
	blockHash: string
}) => (
	getSubstrateBlock({
		...bittensorJsonRpc,
		blockHash,
	})
)

export const getRuntimeVersion = () => (
	getSubstrateRuntimeVersion({
		...bittensorJsonRpc,
	})
)

export const getSystemHealth = () => (
	getSubstrateSystemHealth({
		...bittensorJsonRpc,
	})
)

export const getSubnetsInfo = ({
	blockHash,
}: {
	blockHash?: string
}) => getNetworkScaleBytes({
	method: 'subnetInfo_getSubnetsInfo',
	blockHash,
})

export const getAllDynamicInfo = ({
	blockHash,
}: {
	blockHash?: string
} = {}) => getNetworkScaleBytes({
	method: 'subnetInfo_getAllDynamicInfo',
	blockHash,
})

export const getAllMetagraphs = ({
	blockHash,
}: {
	blockHash?: string
}) => getNetworkScaleBytes({
	method: 'subnetInfo_getAllMetagraphs',
	blockHash,
})

export const getSubnetInfo = ({
	netuid,
	blockHash,
}: {
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	method: 'subnetInfo_getSubnetInfo',
	netuid,
	blockHash,
})

export const getDynamicInfo = ({
	netuid,
	blockHash,
}: {
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	method: 'subnetInfo_getDynamicInfo',
	netuid,
	blockHash,
})

export const getMetagraph = ({
	netuid,
	blockHash,
}: {
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	method: 'subnetInfo_getMetagraph',
	netuid,
	blockHash,
})

export const getSubnetHyperparams = ({
	netuid,
	blockHash,
}: {
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	method: 'subnetInfo_getSubnetHyperparams',
	netuid,
	blockHash,
})

export const getNeuronsLite = ({
	netuid,
	blockHash,
}: {
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	method: 'neuronInfo_getNeuronsLite',
	netuid,
	blockHash,
})

export const getNeuronLite = async ({
	netuid,
	uid,
	blockHash,
}: {
	netuid: number
	uid: number
	blockHash?: string
}) => {
	assertNetuid(netuid)
	assertBlockHash(blockHash)
	if (!Number.isSafeInteger(uid) || uid < 0 || uid > 65_535)
		throw new Error('Bittensor_JsonRpc: uid must be an unsigned 16-bit integer')
	return getScaleBytes({
		method: 'neuronInfo_getNeuronLite',
		params: blockHash == null ? [netuid, uid] : [netuid, uid, blockHash],
		maxBytes: 65_536,
	})
}
