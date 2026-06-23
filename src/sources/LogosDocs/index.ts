import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { logosDocsBindings } from '$/sources/LogosDocs/bindings.ts'

export const logosDocsOrigins = [
	...new Map(
		logosDocsBindings
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
	provider: SourceProvider.LogosDocs,
	label: 'Logos docs',
	sources: [
		{
			provider: SourceProvider.LogosDocs,
			source: Source.LogosDocs_Rest,
			label: 'Logos docs',
		},
	],
	bindings: logosDocsBindings,
} satisfies SourceProviderDefinition
