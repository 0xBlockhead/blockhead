// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cardanoNodeLocalStateQuerySourceDefinition = {
	provider: SourceProvider.CardanoNode,
	source: Source.CardanoNode_LocalStateQuery,
	label: 'Cardano node local-state query',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cardanoNodeLocalStateQuerySourceDefinition
