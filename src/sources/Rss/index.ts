import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { rssBindings } from '$/sources/Rss/bindings.ts'

export const rssOrigins = [
	...new Map(
		rssBindings
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
	provider: SourceProvider.Rss,
	label: 'RSS / Atom',
	sources: [
		{
			provider: SourceProvider.Rss,
			source: Source.Rss_Rest,
			label: 'RSS / Atom direct fetch',
		},
	],
	bindings: rssBindings,
} satisfies SourceProviderDefinition
