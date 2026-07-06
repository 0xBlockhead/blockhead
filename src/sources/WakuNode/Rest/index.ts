// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const wakuNodeRestSourceDefinition = {
	provider: SourceProvider.WakuNode,
	source: Source.WakuNode_Rest,
	label: 'Waku node REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default wakuNodeRestSourceDefinition
