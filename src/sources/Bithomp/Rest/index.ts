// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bithompRestSourceDefinition = {
	provider: SourceProvider.Bithomp,
	source: Source.Bithomp_Rest,
	label: 'Bithomp REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bithompRestSourceDefinition
