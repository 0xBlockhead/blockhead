import Bittensor from '$/sources/Bittensor/index.ts'
import { substrateJsonRpc } from '$/sources/Substrate/JsonRpc/client.ts'
import {
	getBlock as getSubstrateBlock,
	getBlockHash as getSubstrateBlockHash,
	getFinalizedHead as getSubstrateFinalizedHead,
	getHeader as getSubstrateHeader,
	getRuntimeVersion as getSubstrateRuntimeVersion,
	getSystemHealth as getSubstrateSystemHealth,
} from '$/sources/Substrate/JsonRpc/queries.ts'

export const bittensorMainnetRpcUrl = 'https://entrypoint-finney.opentensor.ai'

const bittensorJsonRpc = {
	origins: Bittensor.origins ?? [],
	label: 'Bittensor',
} as const

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
}: {
	rpcUrl: string
}) => (
	substrateJsonRpc<number[]>({
		...bittensorJsonRpc,
		rpcUrl,
		method: 'subnetInfo_getSubnetsInfo',
		params: [],
	})
)

export const getAllDynamicInfo = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	substrateJsonRpc<number[]>({
		...bittensorJsonRpc,
		rpcUrl,
		method: 'subnetInfo_getAllDynamicInfo',
		params: [],
	})
)

export const getAllMetagraphs = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	substrateJsonRpc<number[]>({
		...bittensorJsonRpc,
		rpcUrl,
		method: 'subnetInfo_getAllMetagraphs',
		params: [],
	})
)

export const getSubnetInfo = ({
	rpcUrl,
	netuid,
}: {
	rpcUrl: string
	netuid: number
}) => (
	substrateJsonRpc<number[]>({
		...bittensorJsonRpc,
		rpcUrl,
		method: 'subnetInfo_getSubnetInfo',
		params: [netuid],
	})
)

export const getDynamicInfo = ({
	rpcUrl,
	netuid,
}: {
	rpcUrl: string
	netuid: number
}) => (
	substrateJsonRpc<number[]>({
		...bittensorJsonRpc,
		rpcUrl,
		method: 'subnetInfo_getDynamicInfo',
		params: [netuid],
	})
)

export const getMetagraph = ({
	rpcUrl,
	netuid,
}: {
	rpcUrl: string
	netuid: number
}) => (
	substrateJsonRpc<number[]>({
		...bittensorJsonRpc,
		rpcUrl,
		method: 'subnetInfo_getMetagraph',
		params: [netuid],
	})
)

export const getSubnetHyperparams = ({
	rpcUrl,
	netuid,
}: {
	rpcUrl: string
	netuid: number
}) => (
	substrateJsonRpc<number[]>({
		...bittensorJsonRpc,
		rpcUrl,
		method: 'subnetInfo_getSubnetHyperparams',
		params: [netuid],
	})
)
