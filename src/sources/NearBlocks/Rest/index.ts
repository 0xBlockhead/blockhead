import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.NearBlocks,
	source: Source.NearBlocks_Rest,
	label: 'NearBlocks REST',
} as const
