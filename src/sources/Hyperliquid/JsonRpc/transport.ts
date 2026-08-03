import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'

export const hyperliquidJsonRpcBinding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.EvmExecutionJsonRpc
)

if (hyperliquidJsonRpcBinding == null)
	throw new Error('Hyperliquid EVM binding is missing')

export const hyperliquidJsonRpcEndpoints = hyperliquidJsonRpcBinding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'Hyperliquid',
}))
