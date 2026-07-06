// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const mintscanRestSourceDefinition = {
	provider: SourceProvider.Mintscan,
	source: Source.Mintscan_Rest,
	label: 'Mintscan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default mintscanRestSourceDefinition
