// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const koiosRestSourceDefinition = {
	provider: SourceProvider.Koios,
	source: Source.Koios_Rest,
	label: 'Koios REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default koiosRestSourceDefinition
