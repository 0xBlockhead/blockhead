import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import TronGridRest from '$/sources/TronGrid/Rest/index.ts'

export default {
	provider: SourceProvider.TronGrid,
	label: 'TronGrid',
	origins: [
		{
			origin: 'https://api.trongrid.io',
			corsEnabled: true,
		},
	],
	sources: [
		TronGridRest,
	],
} as const satisfies SourceProviderDefinition
