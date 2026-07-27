import { TransportType } from '$/constants/TransportType.ts'
import bindings from '$/sources/Polkadot/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getBlock as getSubstrateBlock,
	getBlockHash as getSubstrateBlockHash,
	getFinalizedHead as getSubstrateFinalizedHead,
	getHeader as getSubstrateHeader,
	getRuntimeVersion as getSubstrateRuntimeVersion,
	getSystemHealth as getSubstrateSystemHealth,
} from '$/sources/_shared/interfaces/SubstrateJsonRpc/queries.ts'

const binding = bindings[Source.Polkadot_JsonRpc]

const polkadotJsonRpc = () => ({
	binding,
	label: 'Polkadot',
})

export const getRpcEndpoints = () => binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'Parity',
}))

export const getBlockHash = ({
	blockNumber,
}: {
	blockNumber: bigint
}) => (
	getSubstrateBlockHash({
		...polkadotJsonRpc(),
		blockNumber,
	})
)

export const getFinalizedHead = () => (
	getSubstrateFinalizedHead({
		...polkadotJsonRpc(),
	})
)

export const getBlock = ({
	blockHash,
}: {
	blockHash: string
}) => (
	getSubstrateBlock({
		...polkadotJsonRpc(),
		blockHash,
	})
)

export const getHeader = ({
	blockHash,
}: {
	blockHash?: string
}) => (
	getSubstrateHeader({
		...polkadotJsonRpc(),
		blockHash,
	})
)

export const getRuntimeVersion = () => (
	getSubstrateRuntimeVersion({
		...polkadotJsonRpc(),
	})
)

export const getSystemHealth = () => (
	getSubstrateSystemHealth({
		...polkadotJsonRpc(),
	})
)
