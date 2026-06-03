import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { origin } from '$/sources/Dexscreener/OpenApi/constants.ts'
import DexscreenerOpenApiSource from '$/sources/Dexscreener/OpenApi/index.ts'

export default {
	provider: SourceProvider.Dexscreener,
	label: 'Dexscreener',
	origins: [
		{
			origin,
			corsEnabled: false,
		},
	],
	sources: [
		DexscreenerOpenApiSource,
	],
} satisfies SourceProviderDefinition
