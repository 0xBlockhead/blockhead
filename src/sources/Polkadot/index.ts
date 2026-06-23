import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { polkadotBindings } from '$/sources/Polkadot/bindings.ts'

export const polkadotMainnetRpcEndpoints = [
	{
		url: polkadotBindings[0].endpoints[0].locator,
		transportType: TransportType.Http,
		providerName: 'Parity',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]

export const polkadotOrigins = [
	...new Map(
		polkadotBindings
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
	provider: SourceProvider.Polkadot,
	label: 'Polkadot',
	sources: [
		{
			provider: SourceProvider.Polkadot,
			source: Source.Polkadot_JsonRpc,
			label: 'Polkadot JSON-RPC',
		},
	],
	bindings: polkadotBindings,
} satisfies SourceProviderDefinition
