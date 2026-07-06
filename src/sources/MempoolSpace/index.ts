// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const mempoolSpaceRestSourceDefinition = {
	provider: SourceProvider.MempoolSpace,
	source: Source.MempoolSpace_Rest,
	label: 'mempool.space REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default mempoolSpaceRestSourceDefinition
