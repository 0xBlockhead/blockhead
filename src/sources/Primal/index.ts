import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { primalBindings } from '$/sources/Primal/bindings.ts'

export const primalOrigins = [
	...new Map(
		primalBindings
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
	provider: SourceProvider.Primal,
	label: 'Primal',
	sources: [
		{
			provider: SourceProvider.Primal,
			source: Source.Primal_Rest,
			label: 'Primal REST',
		},
	],
	bindings: primalBindings,
} satisfies SourceProviderDefinition
