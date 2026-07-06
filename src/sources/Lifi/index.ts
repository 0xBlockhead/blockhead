// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const lifiStatusRestSourceDefinition = {
	provider: SourceProvider.Lifi,
	source: Source.LifiStatus_Rest,
	label: 'LI.FI status REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default lifiStatusRestSourceDefinition
