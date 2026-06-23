import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	duneBindings,
	dunePublicEnv,
} from '$/sources/Dune/bindings.ts'

export const duneOrigins = [
	...new Map(
		duneBindings
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
	provider: SourceProvider.Dune,
	label: 'Dune',
	env: dunePublicEnv,
	sources: [
		{
			provider: SourceProvider.Dune,
			source: Source.Dune_Rest,
			label: 'Dune REST',
			env: dunePublicEnv,
		},
	],
	bindings: duneBindings,
} satisfies SourceProviderDefinition
