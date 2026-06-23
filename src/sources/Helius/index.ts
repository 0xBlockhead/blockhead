import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	heliusBindings,
	heliusPublicEnv,
} from '$/sources/Helius/bindings.ts'

export const heliusOrigins = [
	...new Map(
		heliusBindings
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
	provider: SourceProvider.Helius,
	label: 'Helius',
	env: heliusPublicEnv,
	sources: [
		{
			provider: SourceProvider.Helius,
			source: Source.Helius_Rest,
			label: 'Helius REST',
			env: heliusPublicEnv,
		},
	],
	bindings: heliusBindings,
} satisfies SourceProviderDefinition
