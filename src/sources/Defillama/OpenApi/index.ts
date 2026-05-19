import type { SourceDefinition } from '$/sources/$Source.ts'
import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'


const DefillamaOpenApiSource = {
	provider: SourceProvider.Defillama,
	source: Source.Defillama_OpenApi,
	label: 'Defillama OpenApi',
} satisfies SourceDefinition

export default DefillamaOpenApiSource
