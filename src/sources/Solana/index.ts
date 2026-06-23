import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { SourceEndpointKind } from '$/sources/SourceBinding.ts'
import { solanaBindings } from '$/sources/Solana/bindings.ts'

export const solanaOrigins = [
	...new Map(
		solanaBindings
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

export const solanaMainnetRpcEndpoints = solanaBindings
	.flatMap((binding) => binding.endpoints)
	.map((endpoint) => ({
		url: endpoint.locator,
		transportType: (
			endpoint.endpointKind === SourceEndpointKind.WebSocketUrl ?
				TransportType.WebSocket
			:
				TransportType.Http
		),
		providerName: 'Solana Labs',
	}))

export default {
	provider: SourceProvider.Solana,
	label: 'Solana',
	sources: [
		{
			provider: SourceProvider.Solana,
			source: Source.Solana_JsonRpc,
			label: 'Solana JSON-RPC',
		},
	],
	bindings: solanaBindings,
} satisfies SourceProviderDefinition
