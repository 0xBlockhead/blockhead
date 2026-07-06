// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const hyperliquidRestSourceDefinition = {
	provider: SourceProvider.Hyperliquid,
	source: Source.Hyperliquid_Rest,
	label: 'Hyperliquid REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default hyperliquidRestSourceDefinition
