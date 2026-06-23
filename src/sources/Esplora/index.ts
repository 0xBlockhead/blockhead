import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	esploraBindings,
	esploraRestBaseUrlByNetworkKey,
	liquidMainnetEsploraRestEndpoints,
} from '$/sources/Esplora/bindings.ts'

export {
	esploraRestBaseUrlByNetworkKey,
	liquidMainnetEsploraRestEndpoints,
}

export const esploraOrigins = [
	...new Map(
		esploraBindings
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
	provider: SourceProvider.Esplora,
	label: 'Esplora',
	sources: [
		{
			provider: SourceProvider.Esplora,
			source: Source.Esplora_Rest,
			label: 'Esplora REST',
		},
	],
	bindings: esploraBindings,
} satisfies SourceProviderDefinition
