// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const alliumRestSourceDefinition = {
	provider: SourceProvider.Allium,
	source: Source.Allium_Rest,
	label: 'Allium REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default alliumRestSourceDefinition
