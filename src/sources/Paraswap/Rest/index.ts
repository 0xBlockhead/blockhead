// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const paraswapRestSourceDefinition = {
	provider: SourceProvider.Paraswap,
	source: Source.Paraswap_Rest,
	label: 'ParaSwap REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default paraswapRestSourceDefinition
