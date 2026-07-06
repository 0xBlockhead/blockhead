// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const radicleNodeControlSourceDefinition = {
	provider: SourceProvider.RadicleNode,
	source: Source.RadicleNode_Control,
	label: 'Radicle node control API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default radicleNodeControlSourceDefinition
