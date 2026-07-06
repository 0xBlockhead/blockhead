// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const localInternalSourceDefinition = {
	provider: SourceProvider.Local,
	source: Source.Local_Internal,
	label: 'Local user state',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default localInternalSourceDefinition
