import { SourceProvider, type SourceProviderDefinition } from '$/sources/$SourceProvider.ts'
import LightningMempoolSpaceRest from '$/sources/LightningMempoolSpace/Rest/index.ts'

export default {
	provider: SourceProvider.LightningMempoolSpace,
	label: 'mempool.space Lightning',
	origins: [
		{
			origin: 'https://mempool.space',
			corsEnabled: true,
		},
	],
	sources: [
		LightningMempoolSpaceRest,
	],
} as const satisfies SourceProviderDefinition
