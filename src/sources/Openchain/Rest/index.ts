import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const OpenchainRestSource = {
	provider: SourceProvider.Openchain,
	source: Source.Openchain_Rest,
	label: 'Openchain Rest',
} satisfies SourceDefinition

export default OpenchainRestSource
