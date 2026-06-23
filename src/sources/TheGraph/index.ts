import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { theGraphBindings } from '$/sources/TheGraph/bindings.ts'

export const theGraphOrigins = [
	...new Map(
		theGraphBindings
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
	provider: SourceProvider.TheGraph,
	label: 'The Graph',
	sources: [
		{
			provider: SourceProvider.TheGraph,
			source: Source.TheGraph_Graphql,
			label: 'The Graph GraphQL',
		},
	],
	bindings: theGraphBindings,
} satisfies SourceProviderDefinition
