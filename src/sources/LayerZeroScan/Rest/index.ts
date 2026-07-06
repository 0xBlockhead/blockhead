// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const layerZeroScanRestSourceDefinition = {
	provider: SourceProvider.LayerZeroScan,
	source: Source.LayerZeroScan_Rest,
	label: 'LayerZero Scan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default layerZeroScanRestSourceDefinition
