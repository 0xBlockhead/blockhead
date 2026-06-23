import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { pipedBindings } from '$/sources/Piped/bindings.ts'

export const pipedOrigins = [
	...new Map(
		pipedBindings
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
	provider: SourceProvider.Piped,
	label: 'Piped',
	sources: [
		{
			provider: SourceProvider.Piped,
			source: Source.Piped_Rest,
			label: 'Piped API REST',
		},
	],
	bindings: pipedBindings,
} satisfies SourceProviderDefinition
