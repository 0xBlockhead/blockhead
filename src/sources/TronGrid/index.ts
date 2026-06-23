import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tronGridBindings } from '$/sources/TronGrid/bindings.ts'

export const tronGridRestEndpoints = [
	{
		slug: 'trongrid',
		restBaseUrl: tronGridBindings[0].endpoints[0].locator,
	},
] as const satisfies readonly {
	slug: 'trongrid'
	restBaseUrl: string
}[]

export const tronGridOrigins = [
	...new Map(
		tronGridBindings
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
	provider: SourceProvider.TronGrid,
	label: 'TronGrid',
	sources: [
		{
			provider: SourceProvider.TronGrid,
			source: Source.TronGrid_Rest,
			label: 'TronGrid REST',
		},
	],
	bindings: tronGridBindings,
} satisfies SourceProviderDefinition
