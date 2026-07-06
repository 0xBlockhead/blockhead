// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nostrBandRestSourceDefinition = {
	provider: SourceProvider.NostrBand,
	source: Source.NostrBand_Rest,
	label: 'NostrBand REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nostrBandRestSourceDefinition
