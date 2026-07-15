import { TransportType } from '$/constants/TransportType.ts'
import {
	getBlock as getSubstrateBlock,
	getBlockHash as getSubstrateBlockHash,
	getFinalizedHead as getSubstrateFinalizedHead,
	getHeader as getSubstrateHeader,
	getRuntimeVersion as getSubstrateRuntimeVersion,
	getSystemHealth as getSubstrateSystemHealth,
} from '$/sources/Substrate/JsonRpc/queries.ts'

export const polkadotMainnetRpcEndpoints = [
	{
		url: 'https://rpc.polkadot.io',
		transportType: TransportType.Http,
		providerName: 'Parity',
	},
] as const

export const polkadotOrigins = [
	{
		origin: 'https://rpc.polkadot.io',
		corsEnabled: true,
	},
] as const

const polkadotJsonRpc = {
	origins: polkadotOrigins,
	label: 'Polkadot',
} as const

export const getBlockHash = ({
	rpcUrl,
	blockNumber,
}: {
	rpcUrl: string
	blockNumber: bigint
}) => (
	getSubstrateBlockHash({
		...polkadotJsonRpc,
		rpcUrl,
		blockNumber,
	})
)

export const getFinalizedHead = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	getSubstrateFinalizedHead({
		...polkadotJsonRpc,
		rpcUrl,
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
		...polkadotJsonRpc,
		rpcUrl,
		blockHash,
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
		...polkadotJsonRpc,
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
		...polkadotJsonRpc,
		rpcUrl,
	})
)

export const getSystemHealth = ({
	rpcUrl,
}: {
	rpcUrl: string
}) => (
	getSubstrateSystemHealth({
		...polkadotJsonRpc,
		rpcUrl,
	})
)
