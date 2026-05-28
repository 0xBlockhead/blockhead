import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

export default {
	provider: SourceProvider.LightningMempoolSpace,
	source: Source.LightningMempoolSpace_Rest,
	label: 'mempool.space Lightning REST',
} satisfies SourceDefinition
