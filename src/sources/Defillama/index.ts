
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	coinsOrigin,
	proOrigin,
} from '$/sources/Defillama/Rest/constants.ts'
import DefillamaOpenApiSource from '$/sources/Defillama/OpenApi/index.ts'
import DefillamaRestSource from '$/sources/Defillama/Rest/index.ts'

export default {
	provider: SourceProvider.Defillama,
	label: 'Defillama',
	origins: [
		{
			origin: coinsOrigin,
			corsEnabled: false,
		},
		{
			origin: proOrigin,
			corsEnabled: false,
		},
	],
	sources: [
		DefillamaOpenApiSource,
		DefillamaRestSource,
	],
} satisfies SourceProviderDefinition
