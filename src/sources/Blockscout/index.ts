import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { blockscoutBindings } from '$/sources/Blockscout/bindings.ts'

export const blockscoutOrigins = [
	...new Map(
		blockscoutBindings
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
	provider: SourceProvider.Blockscout,
	label: 'Blockscout',
	sources: [
		{
			provider: SourceProvider.Blockscout,
			source: Source.Blockscout_Rest,
			label: 'Blockscout REST',
		},
	],
	bindings: blockscoutBindings,
} satisfies SourceProviderDefinition
