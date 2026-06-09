import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const BlockchairRestSource = {
	provider: SourceProvider.Blockchair,
	source: Source.Blockchair_Rest,
	label: 'Blockchair REST',
} satisfies SourceDefinition

export default BlockchairRestSource
