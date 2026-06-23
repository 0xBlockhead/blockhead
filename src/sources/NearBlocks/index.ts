import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { nearBlocksBindings } from '$/sources/NearBlocks/bindings.ts'

export const nearBlocksMainnetRestEndpoints = [
	{
		url: nearBlocksBindings[0].endpoints[0].locator,
		transportType: TransportType.Http,
		providerName: 'NearBlocks',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]

export const nearBlocksOrigins = [
	...new Map(
		nearBlocksBindings
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
	provider: SourceProvider.NearBlocks,
	label: 'NearBlocks',
	sources: [
		{
			provider: SourceProvider.NearBlocks,
			source: Source.NearBlocks_Rest,
			label: 'NearBlocks REST',
		},
	],
	bindings: nearBlocksBindings,
} satisfies SourceProviderDefinition
