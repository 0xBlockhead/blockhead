import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { openchainBindings } from '$/sources/Openchain/bindings.ts'

export const openchainOrigins = [
	...new Map(
		openchainBindings
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
	provider: SourceProvider.Openchain,
	label: 'Openchain',
	sources: [
		{
			provider: SourceProvider.Openchain,
			source: Source.Openchain_Rest,
			label: 'Openchain REST',
		},
	],
	bindings: openchainBindings,
} satisfies SourceProviderDefinition
