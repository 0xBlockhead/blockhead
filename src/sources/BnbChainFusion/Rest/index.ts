// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bnbChainFusionRestSourceDefinition = {
	provider: SourceProvider.BnbChainFusion,
	source: Source.BnbChainFusion_Rest,
	label: 'BNB Chain Fusion REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bnbChainFusionRestSourceDefinition
