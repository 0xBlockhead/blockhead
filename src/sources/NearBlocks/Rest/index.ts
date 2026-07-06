// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nearBlocksRestSourceDefinition = {
	provider: SourceProvider.NearBlocks,
	source: Source.NearBlocks_Rest,
	label: 'NearBlocks REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nearBlocksRestSourceDefinition
