import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	coinpaprikaBindings,
	coinpaprikaPublicEnv,
} from '$/sources/Coinpaprika/bindings.ts'

export const coinpaprikaOrigins = [
	...new Map(
		coinpaprikaBindings
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
	provider: SourceProvider.Coinpaprika,
	label: 'Coinpaprika',
	env: coinpaprikaPublicEnv,
	sources: [
		{
			provider: SourceProvider.Coinpaprika,
			source: Source.Coinpaprika_OpenApi,
			label: 'Coinpaprika OpenAPI',
		},
	],
	bindings: coinpaprikaBindings,
} satisfies SourceProviderDefinition
