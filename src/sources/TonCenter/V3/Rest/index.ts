// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tonCenterV3RestSourceDefinition = {
	provider: SourceProvider.TonCenter,
	source: Source.TonCenter_V3_Rest,
	label: 'TON Center v3 REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tonCenterV3RestSourceDefinition
