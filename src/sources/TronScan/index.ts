import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import TronScanRest from '$/sources/TronScan/Rest/index.ts'

export default {
	provider: SourceProvider.TronScan,
	label: 'TRONSCAN',
	origins: [
		{
			origin: 'https://apilist.tronscanapi.com',
			corsEnabled: true,
		},
	],
	sources: [
		TronScanRest,
	],
} as const satisfies SourceProviderDefinition
