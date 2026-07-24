import { substrateJsonRpc } from '$/sources/Substrate/JsonRpc/client.ts'
import type { BittensorScaleBytes } from '$/sources/Bittensor/JsonRpc/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'
import {
	getBlock as getSubstrateBlock,
	getBlockHash as getSubstrateBlockHash,
	getFinalizedHead as getSubstrateFinalizedHead,
	getHeader as getSubstrateHeader,
	getRuntimeVersion as getSubstrateRuntimeVersion,
	getSystemHealth as getSubstrateSystemHealth,
} from '$/sources/Substrate/JsonRpc/queries.ts'

const bittensorJsonRpc = (binding: SourceBinding) => ({
	binding,
	label: 'Bittensor',
} as const)

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
	binding,
	method,
	params,
	maxBytes,
}: {
	binding: SourceBinding
	method: string
	params: readonly unknown[]
	maxBytes: number
}): Promise<BittensorScaleBytes> => {
	const bytes = scaleBytes.assert(await substrateJsonRpc<unknown>({
		...bittensorJsonRpc(binding),
		method,
		params,
	}))
	if (bytes.length > maxBytes)
		throw new Error(`Bittensor_JsonRpc: ${method} exceeds ${maxBytes} byte response limit`)
	return bytes
}

const getNetworkScaleBytes = ({
	binding,
	method,
	blockHash,
}: {
	binding: SourceBinding
	method: string
	blockHash?: string
}) => {
	assertBlockHash(blockHash)
	return getScaleBytes({
		binding,
		method,
		params: blockHash == null ? [] : [blockHash],
		maxBytes: 16_777_216,
	})
}

const getSubnetScaleBytes = async ({
	binding,
	method,
	netuid,
	blockHash,
}: {
	binding: SourceBinding
	method: string
	netuid: number
	blockHash?: string
}) => {
	assertNetuid(netuid)
	assertBlockHash(blockHash)
	return await getScaleBytes({
		binding,
		method,
		params: blockHash == null ? [netuid] : [netuid, blockHash],
		maxBytes: 4_194_304,
	})
}

export const getFinalizedHead = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	getSubstrateFinalizedHead({
		...bittensorJsonRpc(binding),
	})
)

export const getBlockHash = ({
	binding,
	blockNumber,
}: {
	binding: SourceBinding
	blockNumber: bigint
}) => (
	getSubstrateBlockHash({
		...bittensorJsonRpc(binding),
		blockNumber,
	})
)

export const getHeader = ({
	binding,
	blockHash,
}: {
	binding: SourceBinding
	blockHash?: string
}) => (
	getSubstrateHeader({
		...bittensorJsonRpc(binding),
		blockHash,
	})
)

export const getBlock = ({
	binding,
	blockHash,
}: {
	binding: SourceBinding
	blockHash: string
}) => (
	getSubstrateBlock({
		...bittensorJsonRpc(binding),
		blockHash,
	})
)

export const getRuntimeVersion = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	getSubstrateRuntimeVersion({
		...bittensorJsonRpc(binding),
	})
)

export const getSystemHealth = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	getSubstrateSystemHealth({
		...bittensorJsonRpc(binding),
	})
)

export const getSubnetsInfo = ({
	binding,
	blockHash,
}: {
	binding: SourceBinding
	blockHash?: string
}) => getNetworkScaleBytes({
	binding,
	method: 'subnetInfo_getSubnetsInfo',
	blockHash,
})

export const getAllDynamicInfo = ({
	binding,
	blockHash,
}: {
	binding: SourceBinding
	blockHash?: string
}) => getNetworkScaleBytes({
	binding,
	method: 'subnetInfo_getAllDynamicInfo',
	blockHash,
})

export const getAllMetagraphs = ({
	binding,
	blockHash,
}: {
	binding: SourceBinding
	blockHash?: string
}) => getNetworkScaleBytes({
	binding,
	method: 'subnetInfo_getAllMetagraphs',
	blockHash,
})

export const getSubnetInfo = ({
	binding,
	netuid,
	blockHash,
}: {
	binding: SourceBinding
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	binding,
	method: 'subnetInfo_getSubnetInfo',
	netuid,
	blockHash,
})

export const getDynamicInfo = ({
	binding,
	netuid,
	blockHash,
}: {
	binding: SourceBinding
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	binding,
	method: 'subnetInfo_getDynamicInfo',
	netuid,
	blockHash,
})

export const getMetagraph = ({
	binding,
	netuid,
	blockHash,
}: {
	binding: SourceBinding
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	binding,
	method: 'subnetInfo_getMetagraph',
	netuid,
	blockHash,
})

export const getSubnetHyperparams = ({
	binding,
	netuid,
	blockHash,
}: {
	binding: SourceBinding
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	binding,
	method: 'subnetInfo_getSubnetHyperparams',
	netuid,
	blockHash,
})

export const getNeuronsLite = ({
	binding,
	netuid,
	blockHash,
}: {
	binding: SourceBinding
	netuid: number
	blockHash?: string
}) => getSubnetScaleBytes({
	binding,
	method: 'neuronInfo_getNeuronsLite',
	netuid,
	blockHash,
})

export const getNeuronLite = async ({
	binding,
	netuid,
	uid,
	blockHash,
}: {
	binding: SourceBinding
	netuid: number
	uid: number
	blockHash?: string
}) => {
	assertNetuid(netuid)
	assertBlockHash(blockHash)
	if (!Number.isSafeInteger(uid) || uid < 0 || uid > 65_535)
		throw new Error('Bittensor_JsonRpc: uid must be an unsigned 16-bit integer')
	return await getScaleBytes({
		binding,
		method: 'neuronInfo_getNeuronLite',
		params: blockHash == null ? [netuid, uid] : [netuid, uid, blockHash],
		maxBytes: 65_536,
	})
}
