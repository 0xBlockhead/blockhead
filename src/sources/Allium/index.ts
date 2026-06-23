import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	alliumBindings,
	alliumPublicEnv,
} from '$/sources/Allium/bindings.ts'

export const alliumOrigins = [
	...new Map(
		alliumBindings
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
	provider: SourceProvider.Allium,
	label: 'Allium',
	env: alliumPublicEnv,
	sources: [
		{
			provider: SourceProvider.Allium,
			source: Source.Allium_Rest,
			label: 'Allium REST',
			env: alliumPublicEnv,
		},
	],
	bindings: alliumBindings,
} satisfies SourceProviderDefinition
