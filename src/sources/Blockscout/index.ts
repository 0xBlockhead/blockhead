
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import { blockscoutExplorerOrigins } from '$/sources/Blockscout/Rest/constants.ts'
import BlockscoutRestSource from '$/sources/Blockscout/Rest/index.ts'

export default {
	provider: SourceProvider.Blockscout,
	label: 'Blockscout',
	origins: blockscoutExplorerOrigins,
	sources: [
		BlockscoutRestSource,
	],
} satisfies SourceProviderDefinition
