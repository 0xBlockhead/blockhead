import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	xBindings,
	xPublicEnv,
} from '$/sources/X/bindings.ts'

export const xOrigins = [
	...new Map(
		xBindings
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
	provider: SourceProvider.X,
	label: 'X',
	env: xPublicEnv,
	sources: [
		{
			provider: SourceProvider.X,
			source: Source.X_Rest,
			label: 'X API v2',
			env: xPublicEnv,
		},
	],
	bindings: xBindings,
} satisfies SourceProviderDefinition
