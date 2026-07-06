// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const mevRelayRestSourceDefinition = {
	provider: SourceProvider.MevRelay,
	source: Source.MevRelay_Rest,
	label: 'MEV relay REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default mevRelayRestSourceDefinition
