import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { redditPublicBindings } from '$/sources/RedditPublic/bindings.ts'

export const redditPublicOrigins = [
	...new Map(
		redditPublicBindings
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
	provider: SourceProvider.RedditPublic,
	label: 'Reddit public JSON',
	sources: [
		{
			provider: SourceProvider.RedditPublic,
			source: Source.Reddit_PublicJson,
			label: 'Reddit public JSON',
		},
	],
	bindings: redditPublicBindings,
} satisfies SourceProviderDefinition
