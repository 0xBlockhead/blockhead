import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	youtubeBindings,
	youtubePublicEnv,
} from '$/sources/Youtube/bindings.ts'

export const youtubeOrigins = [
	...new Map(
		youtubeBindings
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
	provider: SourceProvider.Youtube,
	label: 'YouTube',
	env: youtubePublicEnv,
	sources: [
		{
			provider: SourceProvider.Youtube,
			source: Source.Youtube_Rest,
			label: 'YouTube Data API v3',
			env: youtubePublicEnv,
		},
	],
	bindings: youtubeBindings,
} satisfies SourceProviderDefinition
