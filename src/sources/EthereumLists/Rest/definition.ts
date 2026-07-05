import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const EthereumListsRestSource = {
	provider: SourceProvider.EthereumLists,
	source: Source.EthereumLists_Rest,
	label: 'EthereumLists Rest',
} satisfies SourceDefinition

export default EthereumListsRestSource
