import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import NearBlocksRest from '$/sources/NearBlocks/Rest/index.ts'

export default {
	provider: SourceProvider.NearBlocks,
	label: 'NearBlocks',
	origins: [
		{
			origin: 'https://api.nearblocks.io',
			corsEnabled: true,
		},
		{
			origin: 'https://api-testnet.nearblocks.io',
			corsEnabled: true,
		},
	],
	sources: [
		NearBlocksRest,
	],
} as const satisfies SourceProviderDefinition
