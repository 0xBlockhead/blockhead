import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { threeXplBindings } from '$/sources/ThreeXpl/bindings.ts'

export const threeXplOrigins = [
	...new Map(
		threeXplBindings
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
	provider: SourceProvider.ThreeXpl,
	label: '3xpl',
	sources: [
		{
			provider: SourceProvider.ThreeXpl,
			source: Source.ThreeXpl_Rest,
			label: '3xpl REST',
		},
	],
	bindings: threeXplBindings,
} satisfies SourceProviderDefinition
