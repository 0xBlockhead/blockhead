import { substrateJsonRpc } from '$/sources/_shared/interfaces/SubstrateJsonRpc/client.ts'
import { substrateJsonRpcQueries } from '$/sources/_shared/interfaces/SubstrateJsonRpc/queries.ts'
import bindings from '$/sources/Bittensor/bindings.ts'
import {
	bittensorBlockHashWire,
	bittensorNetuidWire,
	bittensorScaleBytesWire,
	bittensorUidWire,
	type BittensorScaleBytes,
} from '$/sources/Bittensor/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Bittensor_JsonRpc][0]

export const {
	getBlock,
	getBlockHash,
	getFinalizedHead,
	getHeader,
	getRuntimeVersion,
	getSystemHealth,
} = substrateJsonRpcQueries(binding)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	value: unknown
) => {
	try {
		return wire.assert(value)
	} catch {
		throw new Error(`Bittensor_JsonRpc: invalid ${label}`)
	}
}

const assertNetuid = (netuid: number) => (
	assertEnvelope(
		'netuid (unsigned 16-bit integer)',
		bittensorNetuidWire,
		netuid
	)
)

const assertUid = (uid: number) => (
	assertEnvelope(
		'uid (unsigned 16-bit integer)',
		bittensorUidWire,
		uid
	)
)

const assertBlockHash = (blockHash: string | undefined) => {
	if (blockHash == null)
		return
	assertEnvelope(
		'observation block hash',
		bittensorBlockHashWire,
		blockHash
	)
}

const getScaleBytes = async ({
	method,
	params,
	maxBytes,
}: {
	method: string
	params: readonly unknown[]
	maxBytes: number
}): Promise<BittensorScaleBytes> => {
	const bytes = assertEnvelope(
		`${method} SCALE byte array`,
		bittensorScaleBytesWire,
		await substrateJsonRpc<unknown>({
			binding,
			method,
			params,
		})
	)
	if (bytes.length > maxBytes)
		throw new Error(`Bittensor_JsonRpc: ${method} exceeds ${maxBytes} byte response limit`)
	return bytes
}

const getNetworkScaleBytes = async ({
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

export const getSubnetsInfo = ({
	blockHash,
}: {
	blockHash?: string
} = {}) => getNetworkScaleBytes({
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
} = {}) => getNetworkScaleBytes({
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
	assertUid(uid)
	assertBlockHash(blockHash)
	return getScaleBytes({
		method: 'neuronInfo_getNeuronLite',
		params: blockHash == null ? [netuid, uid] : [netuid, uid, blockHash],
		maxBytes: 65_536,
	})
}
