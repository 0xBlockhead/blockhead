import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { cashuBindings } from '$/sources/Cashu/bindings.ts'

export const cashuOrigins = [
	...new Map(
		cashuBindings
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
	provider: SourceProvider.Cashu,
	label: 'Cashu',
	sources: [
		{
			provider: SourceProvider.Cashu,
			source: Source.CashuMint_Rest,
			label: 'Cashu mint REST',
		},
	],
	bindings: cashuBindings,
} satisfies SourceProviderDefinition
