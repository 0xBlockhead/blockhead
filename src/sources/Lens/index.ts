import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { lensBindings } from '$/sources/Lens/bindings.ts'

export const lensOrigins = [
	...new Map(
		lensBindings
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
	provider: SourceProvider.Lens,
	label: 'Lens Protocol',
	sources: [
		{
			provider: SourceProvider.Lens,
			source: Source.Lens_Graphql,
			label: 'Lens Protocol GraphQL',
		},
	],
	bindings: lensBindings,
} satisfies SourceProviderDefinition
