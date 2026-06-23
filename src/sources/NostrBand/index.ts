import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { nostrBandBindings } from '$/sources/NostrBand/bindings.ts'

export const nostrBandOrigins = [
	...new Map(
		nostrBandBindings
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
	provider: SourceProvider.NostrBand,
	label: 'NostrBand',
	sources: [
		{
			provider: SourceProvider.NostrBand,
			source: Source.NostrBand_Rest,
			label: 'NostrBand REST',
		},
	],
	bindings: nostrBandBindings,
} satisfies SourceProviderDefinition
