// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ethereumListsRestSourceDefinition = {
	provider: SourceProvider.EthereumLists,
	source: Source.EthereumLists_Rest,
	label: 'Ethereum Lists REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ethereumListsRestSourceDefinition
