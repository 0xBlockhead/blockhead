import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	redditBindings,
	redditPublicEnv,
} from '$/sources/Reddit/bindings.ts'

export const redditOrigins = [
	...new Map(
		redditBindings
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
	provider: SourceProvider.Reddit,
	label: 'Reddit',
	env: redditPublicEnv,
	sources: [
		{
			provider: SourceProvider.Reddit,
			source: Source.Reddit_Rest,
			label: 'Reddit OAuth REST',
			env: redditPublicEnv,
		},
	],
	bindings: redditBindings,
} satisfies SourceProviderDefinition
