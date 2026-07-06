// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const zeroGStorageScanRestSourceDefinition = {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGStorageScan_Rest,
	label: '0G StorageScan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default zeroGStorageScanRestSourceDefinition
