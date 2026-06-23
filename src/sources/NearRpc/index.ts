import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { nearRpcBindings } from '$/sources/NearRpc/bindings.ts'

export const nearMainnetRpcEndpoints = [
	{
		url: nearRpcBindings[0].endpoints[0].locator,
		transportType: TransportType.Http,
		providerName: 'NEAR',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]

export const nearRpcOrigins = [
	...new Map(
		nearRpcBindings
			.flatMap((binding) => binding.endpoints)
			.map((endpoint) => [
				endpoint.origin,
				{
					origin: endpoint.origin,
					corsEnabled: endpoint.corsEnabled,
				},
			])
	).values(),
]

export default {
	provider: SourceProvider.NearRpc,
	label: 'NEAR RPC',
	sources: [
		{
			provider: SourceProvider.NearRpc,
			source: Source.NearRpc_JsonRpc,
			label: 'NEAR JSON-RPC',
		},
	],
	bindings: nearRpcBindings,
} satisfies SourceProviderDefinition
