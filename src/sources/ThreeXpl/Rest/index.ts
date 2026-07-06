// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const threeXplRestSourceDefinition = {
	provider: SourceProvider.ThreeXpl,
	source: Source.ThreeXpl_Rest,
	label: '3xpl REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default threeXplRestSourceDefinition
