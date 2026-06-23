import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { l2BeatBindings } from '$/sources/L2Beat/bindings.ts'

export const l2BeatOrigins = [
	...new Map(
		l2BeatBindings
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
	provider: SourceProvider.L2Beat,
	label: 'L2Beat',
	sources: [
		{
			provider: SourceProvider.L2Beat,
			source: Source.L2Beat_Rest,
			label: 'L2Beat REST',
		},
	],
	bindings: l2BeatBindings,
} satisfies SourceProviderDefinition
