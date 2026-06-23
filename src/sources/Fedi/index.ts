import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	fediBindings,
	fediPublicEnv,
} from '$/sources/Fedi/bindings.ts'

export const fediOrigins = [
	...new Map(
		fediBindings
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
	provider: SourceProvider.Fedi,
	label: 'Fedi',
	env: fediPublicEnv,
	sources: [
		{
			provider: SourceProvider.Fedi,
			source: Source.Fedi_Rest,
			label: 'Fedi REST',
			env: fediPublicEnv,
		},
	],
	bindings: fediBindings,
} satisfies SourceProviderDefinition
