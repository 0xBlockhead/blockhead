// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const xamanApiSourceDefinition = {
	provider: SourceProvider.Xaman,
	source: Source.Xaman_Api,
	label: 'Xaman API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default xamanApiSourceDefinition
