import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const DefillamaRestSource = {
	provider: SourceProvider.Defillama,
	source: Source.Defillama_Rest,
	label: 'Defillama Rest',
} satisfies SourceDefinition

export default DefillamaRestSource
