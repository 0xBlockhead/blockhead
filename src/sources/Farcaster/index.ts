import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { farcasterBindings } from '$/sources/Farcaster/bindings.ts'

export const farcasterOrigins = [
	...new Map(
		farcasterBindings
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
	provider: SourceProvider.Farcaster,
	label: 'Farcaster',
	sources: [
		{
			provider: SourceProvider.Farcaster,
			source: Source.Farcaster_Rest,
			label: 'Farcaster REST',
		},
	],
	bindings: farcasterBindings,
} satisfies SourceProviderDefinition
