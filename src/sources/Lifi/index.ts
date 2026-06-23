import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { lifiBindings } from '$/sources/Lifi/bindings.ts'

export const lifiOrigins = [
	...new Map(
		lifiBindings
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
	provider: SourceProvider.Lifi,
	label: 'LI.FI',
	sources: [
		{
			provider: SourceProvider.Lifi,
			source: Source.LifiStatus_Rest,
			label: 'LI.FI status REST',
		},
		{
			provider: SourceProvider.Lifi,
			source: Source.Lifi_Rest,
			label: 'LI.FI REST',
		},
	],
	bindings: lifiBindings,
} satisfies SourceProviderDefinition
