import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { hyperliquidBindings } from '$/sources/Hyperliquid/bindings.ts'

export const hyperliquidOrigins = [
	...new Map(
		hyperliquidBindings
			.flatMap((binding) => binding.endpoints)
			.flatMap((endpoint) => (
				endpoint.origin == null ?
					[]
				:
					[[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					]]
			))
	).values(),
]

export const hyperliquidMainnetRestEndpoints = hyperliquidBindings
	.slice(0, 1)
	.flatMap((binding) => binding.endpoints)
	.flatMap((endpoint) => (
		endpoint.origin == null ?
			[]
		:
			[{
				restBaseUrl: endpoint.origin,
				url: endpoint.locator,
				transportType: TransportType.Http,
				providerName: 'Hyperliquid info API',
			}]
	))

export const hyperliquidMainnetRpcEndpoints = hyperliquidBindings
	.slice(1, 2)
	.flatMap((binding) => binding.endpoints)
	.map((endpoint) => ({
		url: endpoint.locator,
		transportType: TransportType.Http,
		providerName: 'Hyperliquid HyperEVM JSON-RPC',
	}))

export default {
	provider: SourceProvider.Hyperliquid,
	label: 'Hyperliquid',
	sources: [
		{
			provider: SourceProvider.Hyperliquid,
			source: Source.Hyperliquid_Rest,
			label: 'Hyperliquid REST',
		},
		{
			provider: SourceProvider.Hyperliquid,
			source: Source.Hyperliquid_JsonRpc,
			label: 'HyperEVM JSON-RPC',
		},
	],
	bindings: hyperliquidBindings,
} satisfies SourceProviderDefinition
