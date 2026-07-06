// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const lightningLndRestSourceDefinition = {
	provider: SourceProvider.LightningLnd,
	source: Source.LightningLnd_Rest,
	label: 'LND REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default lightningLndRestSourceDefinition
