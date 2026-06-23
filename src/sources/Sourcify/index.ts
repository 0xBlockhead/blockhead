import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { sourcifyBindings } from '$/sources/Sourcify/bindings.ts'

export const sourcifyOrigins = [
	...new Map(
		sourcifyBindings
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
	provider: SourceProvider.Sourcify,
	label: 'Sourcify',
	sources: [
		{
			provider: SourceProvider.Sourcify,
			source: Source.Sourcify_Rest,
			label: 'Sourcify REST',
		},
	],
	bindings: sourcifyBindings,
} satisfies SourceProviderDefinition
