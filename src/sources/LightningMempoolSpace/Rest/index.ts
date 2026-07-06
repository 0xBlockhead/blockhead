// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const lightningMempoolSpaceRestSourceDefinition = {
	provider: SourceProvider.LightningMempoolSpace,
	source: Source.LightningMempoolSpace_Rest,
	label: 'mempool.space Lightning REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default lightningMempoolSpaceRestSourceDefinition
