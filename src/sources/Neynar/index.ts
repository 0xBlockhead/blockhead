import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	neynarBindings,
	neynarPublicEnv,
} from '$/sources/Neynar/bindings.ts'

export const neynarOrigins = [
	...new Map(
		neynarBindings
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
	provider: SourceProvider.Neynar,
	label: 'Neynar',
	env: neynarPublicEnv,
	sources: [
		{
			provider: SourceProvider.Neynar,
			source: Source.Neynar_Rest,
			label: 'Neynar REST',
			env: neynarPublicEnv,
		},
	],
	bindings: neynarBindings,
} satisfies SourceProviderDefinition
