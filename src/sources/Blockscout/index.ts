
import { type SourceProviderDefinition, SourceProvider } from '$/sources/$SourceProvider.ts'
import BlockscoutRestSource from '$/sources/Blockscout/Rest/index.ts'

export default {
	provider: SourceProvider.Blockscout,
	label: 'Blockscout',
	sources: [
		BlockscoutRestSource,
	],
} satisfies SourceProviderDefinition
