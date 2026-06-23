import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tronScanBindings } from '$/sources/TronScan/bindings.ts'

export const tronScanRestEndpoints = [
	{
		slug: 'tronscan',
		restBaseUrl: tronScanBindings[0].endpoints[0].locator,
	},
] as const satisfies readonly {
	slug: 'tronscan'
	restBaseUrl: string
}[]

export const tronScanOrigins = [
	...new Map(
		tronScanBindings
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
	provider: SourceProvider.TronScan,
	label: 'TRONSCAN',
	sources: [
		{
			provider: SourceProvider.TronScan,
			source: Source.TronScan_Rest,
			label: 'TRONSCAN REST',
		},
	],
	bindings: tronScanBindings,
} satisfies SourceProviderDefinition
