import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { filfoxBindings } from '$/sources/Filfox/bindings.ts'

export const filfoxOrigins = [
	...new Map(
		filfoxBindings
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
	provider: SourceProvider.Filfox,
	label: 'Filfox',
	sources: [
		{
			provider: SourceProvider.Filfox,
			source: Source.Filfox_Rest,
			label: 'Filfox REST',
		},
	],
	bindings: filfoxBindings,
} satisfies SourceProviderDefinition
