import { substrateJsonRpc } from '$/sources/Substrate/JsonRpc/client.ts'
import type {
	SubstrateRpcBlock,
	SubstrateRpcHeader,
	SubstrateRuntimeVersion,
	SubstrateSystemHealth,
} from '$/sources/Substrate/JsonRpc/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

type SubstrateJsonRpcRequest = {
	binding: SourceBinding
	label: string
}

export const getBlockHash = ({
	blockNumber,
	...request
}: SubstrateJsonRpcRequest & {
	blockNumber: bigint
}) => (
	substrateJsonRpc<string>({
		...request,
		method: 'chain_getBlockHash',
		params: [
			`0x${blockNumber.toString(16)}`,
		],
	})
)

export const getFinalizedHead = (
	request: SubstrateJsonRpcRequest
) => (
	substrateJsonRpc<string>({
		...request,
		method: 'chain_getFinalizedHead',
	})
)

export const getBlock = ({
	blockHash,
	...request
}: SubstrateJsonRpcRequest & {
	blockHash: string
}) => (
	substrateJsonRpc<SubstrateRpcBlock>({
		...request,
		method: 'chain_getBlock',
		params: [
			blockHash,
		],
	})
)

export const getHeader = ({
	blockHash,
	...request
}: SubstrateJsonRpcRequest & {
	blockHash?: string
}) => (
	substrateJsonRpc<SubstrateRpcHeader>({
		...request,
		method: 'chain_getHeader',
		params: blockHash == null ? [] : [
			blockHash,
		],
	})
)

export const getRuntimeVersion = (
	request: SubstrateJsonRpcRequest
) => (
	substrateJsonRpc<SubstrateRuntimeVersion>({
		...request,
		method: 'state_getRuntimeVersion',
	})
)

export const getSystemHealth = (
	request: SubstrateJsonRpcRequest
) => (
	substrateJsonRpc<SubstrateSystemHealth>({
		...request,
		method: 'system_health',
	})
)
