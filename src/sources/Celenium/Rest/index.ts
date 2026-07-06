// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const celeniumRestSourceDefinition = {
	provider: SourceProvider.Celenium,
	source: Source.Celenium_Rest,
	label: 'Celenium REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default celeniumRestSourceDefinition
