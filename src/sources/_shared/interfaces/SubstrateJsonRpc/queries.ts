import { substrateJsonRpc } from '$/sources/_shared/interfaces/SubstrateJsonRpc/client.ts'
import type {
	SubstrateRpcBlock,
	SubstrateRpcHeader,
	SubstrateRuntimeVersion,
	SubstrateSystemHealth,
} from '$/sources/_shared/interfaces/SubstrateJsonRpc/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

export const substrateJsonRpcQueries = (binding: SourceBinding) => ({
	getBlock: ({
		blockHash,
	}: {
		blockHash: string
	}) => (
		substrateJsonRpc<SubstrateRpcBlock>({
			binding,
			method: 'chain_getBlock',
			params: [
				blockHash,
			],
		})
	),
	getBlockHash: ({
		blockNumber,
	}: {
		blockNumber: bigint
	}) => (
		substrateJsonRpc<string>({
			binding,
			method: 'chain_getBlockHash',
			params: [
				`0x${blockNumber.toString(16)}`,
			],
		})
	),
	getFinalizedHead: () => (
		substrateJsonRpc<string>({
			binding,
			method: 'chain_getFinalizedHead',
		})
	),
	getHeader: ({
		blockHash,
	}: {
		blockHash?: string
	}) => (
		substrateJsonRpc<SubstrateRpcHeader>({
			binding,
			method: 'chain_getHeader',
			params: blockHash == null ? [] : [
				blockHash,
			],
		})
	),
	getRuntimeVersion: () => (
		substrateJsonRpc<SubstrateRuntimeVersion>({
			binding,
			method: 'state_getRuntimeVersion',
		})
	),
	getSystemHealth: () => (
		substrateJsonRpc<SubstrateSystemHealth>({
			binding,
			method: 'system_health',
		})
	),
})
