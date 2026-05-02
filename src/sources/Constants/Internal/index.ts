import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const ConstantsInternalSource = {
	provider: SourceProvider._Constants,
	source: Source.Constants_Internal,
	label: 'Constants Internal',
} satisfies SourceDefinition

export default ConstantsInternalSource
