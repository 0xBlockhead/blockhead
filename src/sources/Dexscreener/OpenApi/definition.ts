import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$sources.ts'

const DexscreenerOpenApiSource = {
	provider: SourceProvider.Dexscreener,
	source: Source.Dexscreener_OpenApi,
	label: 'Dexscreener OpenApi',
} satisfies SourceDefinition

export default DexscreenerOpenApiSource
