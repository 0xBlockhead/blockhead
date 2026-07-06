// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const primalRestSourceDefinition = {
	provider: SourceProvider.Primal,
	source: Source.Primal_Rest,
	label: 'Primal REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default primalRestSourceDefinition
