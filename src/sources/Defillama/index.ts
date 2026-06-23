import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	defillamaBindings,
	defillamaPublicEnv,
} from '$/sources/Defillama/bindings.ts'

export const defillamaOrigins = [
	...new Map(
		defillamaBindings
			.flatMap((binding) => binding.endpoints)
			.flatMap((endpoint) => (
				endpoint.origin == null ?
					[]
				:
					[[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					]]
			))
	).values(),
]

export default {
	provider: SourceProvider.Defillama,
	label: 'Defillama',
	env: defillamaPublicEnv,
	sources: [
		{
			provider: SourceProvider.Defillama,
			source: Source.Defillama_OpenApi,
			label: 'Defillama OpenAPI',
		},
		{
			provider: SourceProvider.Defillama,
			source: Source.Defillama_Rest,
			label: 'Defillama REST',
			env: defillamaPublicEnv,
		},
	],
	bindings: defillamaBindings,
} satisfies SourceProviderDefinition
