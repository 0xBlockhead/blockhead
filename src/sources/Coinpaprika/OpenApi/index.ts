// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const coinpaprikaOpenApiSourceDefinition = {
	provider: SourceProvider.Coinpaprika,
	source: Source.Coinpaprika_OpenApi,
	label: 'Coinpaprika OpenAPI',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default coinpaprikaOpenApiSourceDefinition
