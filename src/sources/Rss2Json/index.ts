import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { rss2JsonBindings } from '$/sources/Rss2Json/bindings.ts'

export const rss2JsonOrigins = [
	...new Map(
		rss2JsonBindings
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
	provider: SourceProvider.Rss2Json,
	label: 'RSS2JSON',
	sources: [
		{
			provider: SourceProvider.Rss2Json,
			source: Source.Rss2Json_Rest,
			label: 'RSS2JSON API',
		},
	],
	bindings: rss2JsonBindings,
} satisfies SourceProviderDefinition
