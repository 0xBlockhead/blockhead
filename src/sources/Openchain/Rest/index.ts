// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const openchainRestSourceDefinition = {
	provider: SourceProvider.Openchain,
	source: Source.Openchain_Rest,
	label: 'Openchain REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default openchainRestSourceDefinition
