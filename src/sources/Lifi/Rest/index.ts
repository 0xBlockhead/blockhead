// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const lifiRestSourceDefinition = {
	provider: SourceProvider.Lifi,
	source: Source.Lifi_Rest,
	label: 'LI.FI REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default lifiRestSourceDefinition
