// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const beaconRestSourceDefinition = {
	provider: SourceProvider.Beacon,
	source: Source.Beacon_Rest,
	label: 'Beacon (consensus) REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default beaconRestSourceDefinition
