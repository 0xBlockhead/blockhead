// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const logosBlockchainNodeRestSourceDefinition = {
	provider: SourceProvider.LogosBlockchainNode,
	source: Source.LogosBlockchainNode_Rest,
	label: 'Logos blockchain node REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default logosBlockchainNodeRestSourceDefinition
