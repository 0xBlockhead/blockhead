import { Source } from '$/sources/$Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.QuilibriumDocs,
	label: 'Quilibrium docs',
	origins: [
		{
			origin: 'https://quilibrium.com',
			corsEnabled: true,
		},
	],
	sources: [
		{
			provider: SourceProvider.QuilibriumDocs,
			source: Source.QuilibriumDocs_Rest,
			label: 'Quilibrium docs',
		},
	],
} as const satisfies SourceProviderDefinition
