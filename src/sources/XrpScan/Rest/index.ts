// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const xrpScanRestSourceDefinition = {
	provider: SourceProvider.XrpScan,
	source: Source.XrpScan_Rest,
	label: 'XRPScan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default xrpScanRestSourceDefinition
