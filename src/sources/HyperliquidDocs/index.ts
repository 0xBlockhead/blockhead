// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const hyperliquidDocsRestSourceDefinition = {
	provider: SourceProvider.HyperliquidDocs,
	source: Source.HyperliquidDocs_Rest,
	label: 'Hyperliquid docs REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default hyperliquidDocsRestSourceDefinition
