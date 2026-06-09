import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { blockchairOrigins } from '$/sources/Blockchair/Rest/constants.ts'
import BlockchairRestSource from '$/sources/Blockchair/Rest/index.ts'

export default {
	provider: SourceProvider.Blockchair,
	label: 'Blockchair',
	origins: blockchairOrigins,
	sources: [
		BlockchairRestSource,
	],
} as const satisfies SourceProviderDefinition
