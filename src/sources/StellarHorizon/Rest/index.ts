// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const stellarHorizonRestSourceDefinition = {
	provider: SourceProvider.StellarHorizon,
	source: Source.StellarHorizon_Rest,
	label: 'Stellar Horizon REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default stellarHorizonRestSourceDefinition
