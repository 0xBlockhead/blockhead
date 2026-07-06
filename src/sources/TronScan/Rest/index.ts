// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tronScanRestSourceDefinition = {
	provider: SourceProvider.TronScan,
	source: Source.TronScan_Rest,
	label: 'TronScan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tronScanRestSourceDefinition
