// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const blockchairRestSourceDefinition = {
	provider: SourceProvider.Blockchair,
	source: Source.Blockchair_Rest,
	label: 'Blockchair REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default blockchairRestSourceDefinition
