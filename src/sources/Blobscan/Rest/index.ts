// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const blobscanRestSourceDefinition = {
	provider: SourceProvider.Blobscan,
	source: Source.Blobscan_Rest,
	label: 'Blobscan REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default blobscanRestSourceDefinition
