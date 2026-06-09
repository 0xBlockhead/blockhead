import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CosmosSdk,
	source: Source.CosmosSdk_Rest,
	label: 'Cosmos SDK REST',
} as const
