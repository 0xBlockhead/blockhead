import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { chainlistBindings } from '$/sources/Chainlist/bindings.ts'

export const chainlistOrigins = [
	...new Map(
		chainlistBindings
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
	provider: SourceProvider.Chainlist,
	label: 'Chainlist',
	sources: [
		{
			provider: SourceProvider.Chainlist,
			source: Source.Chainlist_Rest,
			label: 'Chainlist REST',
		},
	],
	bindings: chainlistBindings,
} satisfies SourceProviderDefinition
