// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const xRestSourceDefinition = {
	provider: SourceProvider.X,
	source: Source.X_Rest,
	label: 'X REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default xRestSourceDefinition
