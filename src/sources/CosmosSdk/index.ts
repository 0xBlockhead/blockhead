import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import CosmosSdkRest from '$/sources/CosmosSdk/Rest/index.ts'

export default {
	provider: SourceProvider.CosmosSdk,
	label: 'Cosmos SDK',
	origins: [
		{
			origin: 'https://cosmos-rest.publicnode.com',
			corsEnabled: true,
		},
	],
	sources: [
		CosmosSdkRest,
	],
} as const satisfies SourceProviderDefinition
