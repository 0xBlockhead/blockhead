import { TransportType } from '$/constants/TransportType.ts'
import bindings from '$/sources/Polkadot/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { substrateJsonRpcQueries } from '$/sources/_shared/interfaces/SubstrateJsonRpc/queries.ts'

const binding = bindings[Source.Polkadot_JsonRpc].at(0)!

export const {
	getBlock,
	getBlockHash,
	getFinalizedHead,
	getHeader,
	getRuntimeVersion,
	getSystemHealth,
} = substrateJsonRpcQueries(binding)

export const rpcEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'Parity',
}))
