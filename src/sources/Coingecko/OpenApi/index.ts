// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const coingeckoOpenApiSourceDefinition = {
	provider: SourceProvider.Coingecko,
	source: Source.Coingecko_OpenApi,
	label: 'Coingecko OpenAPI',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default coingeckoOpenApiSourceDefinition
