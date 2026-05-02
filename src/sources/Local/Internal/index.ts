import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const LocalInternalSource = {
	provider: SourceProvider.Local,
	source: Source.Local_Internal,
	label: 'Local Internal',
} satisfies SourceDefinition

export default LocalInternalSource
