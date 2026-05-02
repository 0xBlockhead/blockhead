import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const SourcifyRestSource = {
	provider: SourceProvider.Sourcify,
	source: Source.Sourcify_Rest,
	label: 'Sourcify Rest',
} satisfies SourceDefinition

export default SourcifyRestSource
