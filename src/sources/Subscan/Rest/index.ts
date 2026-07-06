// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const subscanRestSourceDefinition = {
	provider: SourceProvider.Subscan,
	source: Source.Subscan_Rest,
	label: 'Subscan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default subscanRestSourceDefinition
