// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const zeroExSwapRestSourceDefinition = {
	provider: SourceProvider.ZeroExSwap,
	source: Source.ZeroExSwap_Rest,
	label: '0x Swap REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default zeroExSwapRestSourceDefinition
