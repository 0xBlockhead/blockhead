// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cardanoscanRestSourceDefinition = {
	provider: SourceProvider.Cardanoscan,
	source: Source.Cardanoscan_Rest,
	label: 'Cardanoscan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cardanoscanRestSourceDefinition
