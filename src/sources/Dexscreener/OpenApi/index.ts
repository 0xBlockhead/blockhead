// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const dexscreenerOpenApiSourceDefinition = {
	provider: SourceProvider.Dexscreener,
	source: Source.Dexscreener_OpenApi,
	label: 'Dexscreener OpenAPI',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default dexscreenerOpenApiSourceDefinition
