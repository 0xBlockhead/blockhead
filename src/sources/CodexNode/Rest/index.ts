// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const codexNodeRestSourceDefinition = {
	provider: SourceProvider.CodexNode,
	source: Source.CodexNode_Rest,
	label: 'Codex node REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default codexNodeRestSourceDefinition
