import { substrateJsonRpc } from '$/sources/Substrate/JsonRpc/client.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'
import type {
	SubstrateRpcBlock,
	SubstrateRpcHeader,
	SubstrateRuntimeVersion,
	SubstrateSystemHealth,
} from '$/sources/Substrate/JsonRpc/types.ts'

type SubstrateJsonRpcQuery = {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	label: string
}

export const getBlockHash = ({
	rpcUrl,
	blockNumber,
	origins,
	label,
}: SubstrateJsonRpcQuery & {
	blockNumber: bigint
}) => (
	substrateJsonRpc<string>({
		rpcUrl,
		method: 'chain_getBlockHash',
		params: [
			`0x${blockNumber.toString(16)}`,
		],
		origins,
		label,
	})
)

export const getFinalizedHead = ({
	rpcUrl,
	origins,
	label,
}: SubstrateJsonRpcQuery) => (
	substrateJsonRpc<string>({
		rpcUrl,
		method: 'chain_getFinalizedHead',
		params: [],
		origins,
		label,
	})
)

export const getHeader = ({
	rpcUrl,
	blockHash,
	origins,
	label,
}: SubstrateJsonRpcQuery & {
	blockHash?: string
}) => (
	substrateJsonRpc<SubstrateRpcHeader>({
		rpcUrl,
		method: 'chain_getHeader',
		params: blockHash == null ? [] : [blockHash],
		origins,
		label,
	})
)

export const getBlock = ({
	rpcUrl,
	blockHash,
	origins,
	label,
}: SubstrateJsonRpcQuery & {
	blockHash: string
}) => (
	substrateJsonRpc<SubstrateRpcBlock>({
		rpcUrl,
		method: 'chain_getBlock',
		params: [blockHash],
		origins,
		label,
	})
)

export const getRuntimeVersion = ({
	rpcUrl,
	origins,
	label,
}: SubstrateJsonRpcQuery) => (
	substrateJsonRpc<SubstrateRuntimeVersion>({
		rpcUrl,
		method: 'chain_getRuntimeVersion',
		params: [],
		origins,
		label,
	})
)

export const getSystemHealth = ({
	rpcUrl,
	origins,
	label,
}: SubstrateJsonRpcQuery) => (
	substrateJsonRpc<SubstrateSystemHealth>({
		rpcUrl,
		method: 'system_health',
		params: [],
		origins,
		label,
	})
)
