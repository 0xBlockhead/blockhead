// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const fediRestSourceDefinition = {
	provider: SourceProvider.Fedi,
	source: Source.Fedi_Rest,
	label: 'Fedi REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default fediRestSourceDefinition
