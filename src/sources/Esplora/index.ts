import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import EsploraRest from '$/sources/Esplora/Rest/index.ts'

export default {
	provider: SourceProvider.Esplora,
	label: 'Esplora',
	origins: [
		{
			origin: 'https://blockstream.info',
			corsEnabled: true,
		},
	],
	sources: [
		EsploraRest,
	],
} as const satisfies SourceProviderDefinition
