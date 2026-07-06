// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const openSeaRestSourceDefinition = {
	provider: SourceProvider.OpenSea,
	source: Source.OpenSea_Rest,
	label: 'OpenSea REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default openSeaRestSourceDefinition
