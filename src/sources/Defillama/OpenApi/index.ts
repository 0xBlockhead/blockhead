// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const defillamaOpenApiSourceDefinition = {
	provider: SourceProvider.Defillama,
	source: Source.Defillama_OpenApi,
	label: 'Defillama OpenAPI',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default defillamaOpenApiSourceDefinition
