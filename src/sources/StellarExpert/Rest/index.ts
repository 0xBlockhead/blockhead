// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const stellarExpertRestSourceDefinition = {
	provider: SourceProvider.StellarExpert,
	source: Source.StellarExpert_Rest,
	label: 'StellarExpert REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default stellarExpertRestSourceDefinition
