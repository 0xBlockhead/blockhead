import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	getBlock as getSubstrateBlock,
	getBlockHash as getSubstrateBlockHash,
	getFinalizedHead as getSubstrateFinalizedHead,
	getHeader as getSubstrateHeader,
	getRuntimeVersion as getSubstrateRuntimeVersion,
	getSystemHealth as getSubstrateSystemHealth,
} from '$/sources/Substrate/JsonRpc/queries.ts'

const polkadotJsonRpc = (binding: SourceBinding) => ({
	binding,
	label: 'Polkadot',
} as const)

export const getBlockHash = ({
	binding,
	blockNumber,
}: {
	binding: SourceBinding
	blockNumber: bigint
}) => (
	getSubstrateBlockHash({
		...polkadotJsonRpc(binding),
		blockNumber,
	})
)

export const getFinalizedHead = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	getSubstrateFinalizedHead({
		...polkadotJsonRpc(binding),
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
		...polkadotJsonRpc(binding),
		blockHash,
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
		...polkadotJsonRpc(binding),
		blockHash,
	})
)

export const getRuntimeVersion = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	getSubstrateRuntimeVersion({
		...polkadotJsonRpc(binding),
	})
)

export const getSystemHealth = ({
	binding,
}: {
	binding: SourceBinding
}) => (
	getSubstrateSystemHealth({
		...polkadotJsonRpc(binding),
	})
)
