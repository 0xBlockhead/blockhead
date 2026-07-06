// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const starkscanRestSourceDefinition = {
	provider: SourceProvider.Starkscan,
	source: Source.Starkscan_Rest,
	label: 'Starkscan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default starkscanRestSourceDefinition
