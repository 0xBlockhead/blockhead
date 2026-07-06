// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const algodRestSourceDefinition = {
	provider: SourceProvider.Algod,
	source: Source.Algod_Rest,
	label: 'Algod REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default algodRestSourceDefinition
