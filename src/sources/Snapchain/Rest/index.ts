import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/index.ts'

const SnapchainRestSource = {
	provider: SourceProvider.Snapchain,
	source: Source.Snapchain_Rest,
	label: 'Snapchain Rest',
} satisfies SourceDefinition

export default SnapchainRestSource
